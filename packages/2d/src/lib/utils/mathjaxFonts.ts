import type {SvgFontDataClass} from '@mathjax/src/js/output/svg/FontData.js';

export interface MathJaxFont {
  /**
   * Loads the font data. Without it, the font is the one MathJax renders with
   * by default, which it bundles itself.
   */
  load?: () => Promise<SvgFontDataClass>;
  /**
   * Loaders for the glyph files the font fetches while rendering, keyed by the
   * specifier MathJax requests. A bundler only follows imports it can read, so
   * each file is listed.
   */
  dynamicFiles: Map<string, () => Promise<unknown>>;
}

export const NewcmFont: MathJaxFont = {
  dynamicFiles: new Map([
    [
      '@mathjax/mathjax-newcm-font/js/svg/dynamic/PUA.js',
      () => import('@mathjax/mathjax-newcm-font/js/svg/dynamic/PUA.js'),
    ],
    [
      '@mathjax/mathjax-newcm-font/js/svg/dynamic/accents-b-i.js',
      () => import('@mathjax/mathjax-newcm-font/js/svg/dynamic/accents-b-i.js'),
    ],
    [
      '@mathjax/mathjax-newcm-font/js/svg/dynamic/accents.js',
      () => import('@mathjax/mathjax-newcm-font/js/svg/dynamic/accents.js'),
    ],
    [
      '@mathjax/mathjax-newcm-font/js/svg/dynamic/arabic.js',
      () => import('@mathjax/mathjax-newcm-font/js/svg/dynamic/arabic.js'),
    ],
    [
      '@mathjax/mathjax-newcm-font/js/svg/dynamic/arrows.js',
      () => import('@mathjax/mathjax-newcm-font/js/svg/dynamic/arrows.js'),
    ],
    [
      '@mathjax/mathjax-newcm-font/js/svg/dynamic/braille-d.js',
      () => import('@mathjax/mathjax-newcm-font/js/svg/dynamic/braille-d.js'),
    ],
    [
      '@mathjax/mathjax-newcm-font/js/svg/dynamic/braille.js',
      () => import('@mathjax/mathjax-newcm-font/js/svg/dynamic/braille.js'),
    ],
    [
      '@mathjax/mathjax-newcm-font/js/svg/dynamic/calligraphic.js',
      () =>
        import('@mathjax/mathjax-newcm-font/js/svg/dynamic/calligraphic.js'),
    ],
    [
      '@mathjax/mathjax-newcm-font/js/svg/dynamic/cherokee.js',
      () => import('@mathjax/mathjax-newcm-font/js/svg/dynamic/cherokee.js'),
    ],
    [
      '@mathjax/mathjax-newcm-font/js/svg/dynamic/cyrillic-ss.js',
      () => import('@mathjax/mathjax-newcm-font/js/svg/dynamic/cyrillic-ss.js'),
    ],
    [
      '@mathjax/mathjax-newcm-font/js/svg/dynamic/cyrillic.js',
      () => import('@mathjax/mathjax-newcm-font/js/svg/dynamic/cyrillic.js'),
    ],
    [
      '@mathjax/mathjax-newcm-font/js/svg/dynamic/devanagari.js',
      () => import('@mathjax/mathjax-newcm-font/js/svg/dynamic/devanagari.js'),
    ],
    [
      '@mathjax/mathjax-newcm-font/js/svg/dynamic/double-struck.js',
      () =>
        import('@mathjax/mathjax-newcm-font/js/svg/dynamic/double-struck.js'),
    ],
    [
      '@mathjax/mathjax-newcm-font/js/svg/dynamic/fraktur.js',
      () => import('@mathjax/mathjax-newcm-font/js/svg/dynamic/fraktur.js'),
    ],
    [
      '@mathjax/mathjax-newcm-font/js/svg/dynamic/greek-ss.js',
      () => import('@mathjax/mathjax-newcm-font/js/svg/dynamic/greek-ss.js'),
    ],
    [
      '@mathjax/mathjax-newcm-font/js/svg/dynamic/greek.js',
      () => import('@mathjax/mathjax-newcm-font/js/svg/dynamic/greek.js'),
    ],
    [
      '@mathjax/mathjax-newcm-font/js/svg/dynamic/hebrew.js',
      () => import('@mathjax/mathjax-newcm-font/js/svg/dynamic/hebrew.js'),
    ],
    [
      '@mathjax/mathjax-newcm-font/js/svg/dynamic/latin-b.js',
      () => import('@mathjax/mathjax-newcm-font/js/svg/dynamic/latin-b.js'),
    ],
    [
      '@mathjax/mathjax-newcm-font/js/svg/dynamic/latin-bi.js',
      () => import('@mathjax/mathjax-newcm-font/js/svg/dynamic/latin-bi.js'),
    ],
    [
      '@mathjax/mathjax-newcm-font/js/svg/dynamic/latin-i.js',
      () => import('@mathjax/mathjax-newcm-font/js/svg/dynamic/latin-i.js'),
    ],
    [
      '@mathjax/mathjax-newcm-font/js/svg/dynamic/latin.js',
      () => import('@mathjax/mathjax-newcm-font/js/svg/dynamic/latin.js'),
    ],
    [
      '@mathjax/mathjax-newcm-font/js/svg/dynamic/marrows.js',
      () => import('@mathjax/mathjax-newcm-font/js/svg/dynamic/marrows.js'),
    ],
    [
      '@mathjax/mathjax-newcm-font/js/svg/dynamic/math.js',
      () => import('@mathjax/mathjax-newcm-font/js/svg/dynamic/math.js'),
    ],
    [
      '@mathjax/mathjax-newcm-font/js/svg/dynamic/monospace-ex.js',
      () =>
        import('@mathjax/mathjax-newcm-font/js/svg/dynamic/monospace-ex.js'),
    ],
    [
      '@mathjax/mathjax-newcm-font/js/svg/dynamic/monospace-l.js',
      () => import('@mathjax/mathjax-newcm-font/js/svg/dynamic/monospace-l.js'),
    ],
    [
      '@mathjax/mathjax-newcm-font/js/svg/dynamic/monospace.js',
      () => import('@mathjax/mathjax-newcm-font/js/svg/dynamic/monospace.js'),
    ],
    [
      '@mathjax/mathjax-newcm-font/js/svg/dynamic/mshapes.js',
      () => import('@mathjax/mathjax-newcm-font/js/svg/dynamic/mshapes.js'),
    ],
    [
      '@mathjax/mathjax-newcm-font/js/svg/dynamic/phonetics-ss.js',
      () =>
        import('@mathjax/mathjax-newcm-font/js/svg/dynamic/phonetics-ss.js'),
    ],
    [
      '@mathjax/mathjax-newcm-font/js/svg/dynamic/phonetics.js',
      () => import('@mathjax/mathjax-newcm-font/js/svg/dynamic/phonetics.js'),
    ],
    [
      '@mathjax/mathjax-newcm-font/js/svg/dynamic/sans-serif-b.js',
      () =>
        import('@mathjax/mathjax-newcm-font/js/svg/dynamic/sans-serif-b.js'),
    ],
    [
      '@mathjax/mathjax-newcm-font/js/svg/dynamic/sans-serif-bi.js',
      () =>
        import('@mathjax/mathjax-newcm-font/js/svg/dynamic/sans-serif-bi.js'),
    ],
    [
      '@mathjax/mathjax-newcm-font/js/svg/dynamic/sans-serif-ex.js',
      () =>
        import('@mathjax/mathjax-newcm-font/js/svg/dynamic/sans-serif-ex.js'),
    ],
    [
      '@mathjax/mathjax-newcm-font/js/svg/dynamic/sans-serif-i.js',
      () =>
        import('@mathjax/mathjax-newcm-font/js/svg/dynamic/sans-serif-i.js'),
    ],
    [
      '@mathjax/mathjax-newcm-font/js/svg/dynamic/sans-serif-r.js',
      () =>
        import('@mathjax/mathjax-newcm-font/js/svg/dynamic/sans-serif-r.js'),
    ],
    [
      '@mathjax/mathjax-newcm-font/js/svg/dynamic/sans-serif.js',
      () => import('@mathjax/mathjax-newcm-font/js/svg/dynamic/sans-serif.js'),
    ],
    [
      '@mathjax/mathjax-newcm-font/js/svg/dynamic/script.js',
      () => import('@mathjax/mathjax-newcm-font/js/svg/dynamic/script.js'),
    ],
    [
      '@mathjax/mathjax-newcm-font/js/svg/dynamic/shapes.js',
      () => import('@mathjax/mathjax-newcm-font/js/svg/dynamic/shapes.js'),
    ],
    [
      '@mathjax/mathjax-newcm-font/js/svg/dynamic/symbols-b-i.js',
      () => import('@mathjax/mathjax-newcm-font/js/svg/dynamic/symbols-b-i.js'),
    ],
    [
      '@mathjax/mathjax-newcm-font/js/svg/dynamic/symbols.js',
      () => import('@mathjax/mathjax-newcm-font/js/svg/dynamic/symbols.js'),
    ],
    [
      '@mathjax/mathjax-newcm-font/js/svg/dynamic/variants.js',
      () => import('@mathjax/mathjax-newcm-font/js/svg/dynamic/variants.js'),
    ],
  ]),
};

export const ScholaFont: MathJaxFont = {
  load: async () =>
    (await import('@mathjax/mathjax-schola-font/js/svg.js')).MathJaxScholaFont,
  dynamicFiles: new Map([
    [
      '@mathjax/mathjax-schola-font/js/svg/dynamic/PUA.js',
      () => import('@mathjax/mathjax-schola-font/js/svg/dynamic/PUA.js'),
    ],
    [
      '@mathjax/mathjax-schola-font/js/svg/dynamic/accents-b-i.js',
      () =>
        import('@mathjax/mathjax-schola-font/js/svg/dynamic/accents-b-i.js'),
    ],
    [
      '@mathjax/mathjax-schola-font/js/svg/dynamic/accents.js',
      () => import('@mathjax/mathjax-schola-font/js/svg/dynamic/accents.js'),
    ],
    [
      '@mathjax/mathjax-schola-font/js/svg/dynamic/arrows.js',
      () => import('@mathjax/mathjax-schola-font/js/svg/dynamic/arrows.js'),
    ],
    [
      '@mathjax/mathjax-schola-font/js/svg/dynamic/calligraphic.js',
      () =>
        import('@mathjax/mathjax-schola-font/js/svg/dynamic/calligraphic.js'),
    ],
    [
      '@mathjax/mathjax-schola-font/js/svg/dynamic/double-struck.js',
      () =>
        import('@mathjax/mathjax-schola-font/js/svg/dynamic/double-struck.js'),
    ],
    [
      '@mathjax/mathjax-schola-font/js/svg/dynamic/fraktur.js',
      () => import('@mathjax/mathjax-schola-font/js/svg/dynamic/fraktur.js'),
    ],
    [
      '@mathjax/mathjax-schola-font/js/svg/dynamic/latin-b.js',
      () => import('@mathjax/mathjax-schola-font/js/svg/dynamic/latin-b.js'),
    ],
    [
      '@mathjax/mathjax-schola-font/js/svg/dynamic/latin-bi.js',
      () => import('@mathjax/mathjax-schola-font/js/svg/dynamic/latin-bi.js'),
    ],
    [
      '@mathjax/mathjax-schola-font/js/svg/dynamic/latin-i.js',
      () => import('@mathjax/mathjax-schola-font/js/svg/dynamic/latin-i.js'),
    ],
    [
      '@mathjax/mathjax-schola-font/js/svg/dynamic/latin.js',
      () => import('@mathjax/mathjax-schola-font/js/svg/dynamic/latin.js'),
    ],
    [
      '@mathjax/mathjax-schola-font/js/svg/dynamic/monospace.js',
      () => import('@mathjax/mathjax-schola-font/js/svg/dynamic/monospace.js'),
    ],
    [
      '@mathjax/mathjax-schola-font/js/svg/dynamic/sans-serif.js',
      () => import('@mathjax/mathjax-schola-font/js/svg/dynamic/sans-serif.js'),
    ],
    [
      '@mathjax/mathjax-schola-font/js/svg/dynamic/script.js',
      () => import('@mathjax/mathjax-schola-font/js/svg/dynamic/script.js'),
    ],
    [
      '@mathjax/mathjax-schola-font/js/svg/dynamic/shapes.js',
      () => import('@mathjax/mathjax-schola-font/js/svg/dynamic/shapes.js'),
    ],
    [
      '@mathjax/mathjax-schola-font/js/svg/dynamic/stretchy.js',
      () => import('@mathjax/mathjax-schola-font/js/svg/dynamic/stretchy.js'),
    ],
    [
      '@mathjax/mathjax-schola-font/js/svg/dynamic/symbols-b-i.js',
      () =>
        import('@mathjax/mathjax-schola-font/js/svg/dynamic/symbols-b-i.js'),
    ],
    [
      '@mathjax/mathjax-schola-font/js/svg/dynamic/symbols.js',
      () => import('@mathjax/mathjax-schola-font/js/svg/dynamic/symbols.js'),
    ],
    [
      '@mathjax/mathjax-schola-font/js/svg/dynamic/variants.js',
      () => import('@mathjax/mathjax-schola-font/js/svg/dynamic/variants.js'),
    ],
  ]),
};
