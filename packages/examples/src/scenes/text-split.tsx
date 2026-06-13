import {Node, Txt, makeScene2D} from '@canvas-commons/2d';
import {sequence, waitFor} from '@canvas-commons/core';

/**
 * Regression scene for {@link Txt.split}. Frame 0 is the source, the mid frame
 * is the exploded copy (`source.split(...)` pieces mounted at the source's
 * transform), and the last frame is a whole-string clone — a control whose
 * diff is pipeline non-determinism, not a split-math error.
 * packages/e2e/src/text-split.test.ts compares them.
 */

function wrap(source: Txt, children: Txt[]): Node {
  return new Node({
    position: source.position(),
    rotation: source.rotation(),
    scale: source.scale(),
    opacity: 0,
    children,
  });
}

function cloneWhole(source: Txt): Node {
  return wrap(source, [
    new Txt({
      fontFamily: source.fontFamily(),
      fontSize: source.fontSize(),
      fontStyle: source.fontStyle(),
      fontWeight: source.fontWeight(),
      letterSpacing: source.letterSpacing(),
      fill: source.fill(),
      textAlign: source.textAlign(),
      textWrap: source.textWrap(),
      width: source.width.context.getter() ?? undefined,
      lineHeight: source.lineHeight(),
      text: source.text(),
    }),
  ]);
}

export default makeScene2D(function* (view) {
  view.fill('#0d1117');

  // Kerning-heavy headline, wrapped — exercises grapheme explosion across
  // kern pairs and multiple lines.
  const headline = new Txt({
    fontFamily: 'sans-serif',
    fontSize: 140,
    fontWeight: 700,
    fill: '#f5f5f5',
    width: 700,
    textAlign: 'left',
    text: 'AVATAR To Walk Away.',
    position: [0, -260],
  });

  // Multi-line paragraph — exercises word explosion across wrapped lines.
  const paragraph = new Txt({
    fontFamily: 'sans-serif',
    fontSize: 56,
    fill: '#9ad1ff',
    width: 900,
    textAlign: 'left',
    text: 'Optimal line breaking distributes the remaining space evenly across every gap on the line.',
    position: [0, 160],
  });

  view.add(headline);
  view.add(paragraph);

  const sources = [headline, paragraph];
  const exploded = [
    wrap(headline, headline.split('grapheme')),
    wrap(paragraph, paragraph.split('grapheme')),
  ];
  const whole = [cloneWhole(headline), cloneWhole(paragraph)];
  exploded.forEach(n => view.add(n));
  whole.forEach(n => view.add(n));

  yield* waitFor(0.2);
  sources.forEach(n => n.opacity(0));
  exploded.forEach(n => n.opacity(1));
  yield* waitFor(0.2);

  yield* sequence(0.2, ...exploded[0].children().map(n => n.rotation(360, 1)));
  yield* waitFor(1);

  exploded.forEach(n => n.opacity(0));
  whole.forEach(n => n.opacity(1));
  yield* waitFor(0.2);
});
