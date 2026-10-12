import {DependencyContext, createSignal} from '@canvas-commons/core';
import {liteAdaptor} from '@mathjax/src/js/adaptors/liteAdaptor.js';
import {RegisterHTMLHandler} from '@mathjax/src/js/handlers/html.js';
import {TeX} from '@mathjax/src/js/input/tex.js';
import {mathjax} from '@mathjax/src/js/mathjax.js';
import {SVG} from '@mathjax/src/js/output/svg.js';
import type {SvgFontDataClass} from '@mathjax/src/js/output/svg/FontData.js';
import type {OptionList} from '@mathjax/src/js/util/Options.js';
import type {MathJaxFont} from './mathjaxFonts';
import {NewcmFont, ScholaFont} from './mathjaxFonts';
import {TexPackages} from './mathjaxPackages';

/**
 * A font MathJax can typeset with.
 *
 * @remarks
 * `mathjax-newcm` is New Computer Modern, the font of the LaTeX default.
 * `mathjax-schola` is TeX Gyre Schola, based on Century Schoolbook.
 */
export type LatexFont = 'mathjax-newcm' | 'mathjax-schola';

const Fonts: Record<LatexFont, MathJaxFont> = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'mathjax-newcm': NewcmFont,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'mathjax-schola': ScholaFont,
};

const Adaptor = liteAdaptor();
RegisterHTMLHandler(Adaptor);

const DynamicFiles = new Map(
  Object.values(Fonts).flatMap(font => [...font.dynamicFiles]),
);

mathjax.asyncLoad = (file: string) => {
  const load = DynamicFiles.get(file);
  return load
    ? load()
    : Promise.reject(new Error(`MathJax requested an unknown file: ${file}`));
};

interface Typesetter {
  document: ReturnType<typeof mathjax.document>;
  exToEm: number;
  loadGlyphs(): Promise<unknown>;
}

const Typesetters = new Map<LatexFont, Typesetter>();
const LoadingTypesetters = new Map<LatexFont, Promise<Typesetter>>();

// Bumped whenever font data arrives, so a formula that rendered without it is
// rendered again.
const MathJaxVersion = createSignal(0);

function invalidate() {
  MathJaxVersion(MathJaxVersion() + 1);
}

function createTypesetter(font: LatexFont, fontData?: SvgFontDataClass) {
  const output = new SVG({fontData, fontCache: 'local'});
  const typesetter: Typesetter = {
    document: mathjax.document('', {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      InputJax: new TeX({packages: TexPackages}),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      OutputJax: output,
    }),
    exToEm: output.font.params.x_height,
    loadGlyphs: () => output.font.loadDynamicFiles(),
  };
  Typesetters.set(font, typesetter);
  return typesetter;
}

function loadTypesetter(font: LatexFont): Promise<Typesetter> {
  const typesetter = Typesetters.get(font);
  if (typesetter) {
    return Promise.resolve(typesetter);
  }

  let loading = LoadingTypesetters.get(font);
  if (!loading) {
    const load = Fonts[font].load;
    loading = (load ? load() : Promise.resolve(undefined)).then(fontData => {
      const created = createTypesetter(font, fontData);
      invalidate();
      return created;
    });
    LoadingTypesetters.set(font, loading);
  }
  return loading;
}

function getTypesetter(font: LatexFont): Typesetter | null {
  const typesetter = Typesetters.get(font);
  if (typesetter) {
    return typesetter;
  }
  if (!Fonts[font].load) {
    return createTypesetter(font);
  }

  DependencyContext.collectPromise(loadTypesetter(font));
  return null;
}

/**
 * Load a font with all of its glyphs, so that formulas using it never wait.
 *
 * @remarks
 * A font loads the first time a formula uses it, and so do glyphs outside its
 * core set, such as those of `\mathbb` or `\mathcal`. A formula waiting for
 * either makes the scene wait too, which is reported as an error unless the
 * node is yielded first. Awaiting this at the top of a module avoids both.
 *
 * @example
 * ```ts
 * await loadLatexFont('mathjax-schola');
 * ```
 *
 * @param font - The font to load.
 */
export async function loadLatexFont(font: LatexFont): Promise<void> {
  const typesetter = await loadTypesetter(font);
  await typesetter.loadGlyphs();
  invalidate();
}

function isRetryError(error: unknown): error is {retry: Promise<unknown>} {
  return (
    typeof error === 'object' &&
    error !== null &&
    'retry' in error &&
    error.retry instanceof Promise
  );
}

// MathJax sizes the root <svg> in `ex` of its own font. A browser resolves `ex`
// from the x-height of the container font, which differs between platforms.
function rootExToEm(svg: string, exToEm: number): string {
  const rootTagEnd = svg.indexOf('>') + 1;
  const rootTag = svg
    .slice(0, rootTagEnd)
    .replace(
      /(-?[\d.]+)ex/g,
      (_, value: string) => `${Number(value) * exToEm}em`,
    );
  return rootTag + svg.slice(rootTagEnd);
}

/**
 * Typeset TeX as an SVG string.
 *
 * @remarks
 * Returns `null` while the font or one of its glyph files is still loading.
 * The load is collected like any other asynchronous resource, and a computed
 * that called this runs again once it lands.
 *
 * @param tex - The TeX to typeset.
 * @param options - Options passed to MathJax's `convert`.
 * @param font - The font to typeset with.
 */
export function texToSvg(
  tex: string,
  options: OptionList,
  font: LatexFont,
): string | null {
  MathJaxVersion();
  const typesetter = getTypesetter(font);
  if (!typesetter) {
    return null;
  }

  try {
    return rootExToEm(
      Adaptor.innerHTML(typesetter.document.convert(tex, options)),
      typesetter.exToEm,
    );
  } catch (error) {
    if (!isRetryError(error)) {
      throw error;
    }
    DependencyContext.collectPromise(error.retry.then(invalidate));
    return null;
  }
}
