import {describe, expect, test, vi} from 'vitest';

async function importFresh() {
  vi.resetModules();
  const core = await import('@canvas-commons/core');
  return {
    hasPromises: () => core.DependencyContext.hasPromises(),
    consumePromises: () => core.DependencyContext.consumePromises(),
    ...(await import('./mathjax')),
  };
}

function glyphIds(svg: string): string[] {
  return [...svg.matchAll(/<path[^>]* id="([^"]+)"/g)].map(match => match[1]);
}

describe('texToSvg', () => {
  test('typesets with the default font right away', async () => {
    const {hasPromises, texToSvg} = await importFresh();

    const svg = texToSvg('x^2', {}, 'mathjax-newcm');

    expect(hasPromises()).toBe(false);
    expect(glyphIds(svg ?? '')).toEqual([
      expect.stringMatching(/-1D465$/),
      expect.stringMatching(/-32$/),
    ]);
  });

  test('sizes the root in em of the font', async () => {
    const {texToSvg} = await importFresh();

    const svg = texToSvg('x', {}, 'mathjax-newcm') ?? '';
    const root = svg.slice(0, svg.indexOf('>'));

    expect(root).toMatch(/width="[\d.]+em"/);
    expect(root).not.toMatch(/\dex"/);
  });

  test('makes the scene wait for a font that is not loaded', async () => {
    const {hasPromises, consumePromises, texToSvg} = await importFresh();

    expect(texToSvg('x', {}, 'mathjax-schola')).toBeNull();
    expect(hasPromises()).toBe(true);

    await consumePromises();
    expect(texToSvg('x', {}, 'mathjax-schola')).toContain('-1D465');
  });

  test('makes the scene wait for a glyph outside the core set', async () => {
    const {hasPromises, consumePromises, texToSvg} = await importFresh();

    expect(texToSvg('\\mathbb{R}', {}, 'mathjax-newcm')).toBeNull();
    expect(hasPromises()).toBe(true);

    await consumePromises();
    expect(texToSvg('\\mathbb{R}', {}, 'mathjax-newcm')).toContain('-211D');
  });

  test('renders every glyph of a preloaded font right away', async () => {
    const {hasPromises, loadLatexFont, texToSvg} = await importFresh();

    await loadLatexFont('mathjax-schola');

    expect(
      texToSvg('\\mathbb{R} \\mathcal{O}', {}, 'mathjax-schola'),
    ).toContain('-211D');
    expect(hasPromises()).toBe(false);
  });
});
