import {Vector2, createRef, waitFor} from '@canvas-commons/core';
import {describe, expect, it} from 'vitest';
import {useScene2D} from '../../scenes';
import {Layout} from '../Layout';
import {Rect} from '../Rect';
import {generatorTest} from './generatorTest';
import {mockScene2D} from './mockScene2D';

interface LayoutInternals {
  layoutLockCounter(): number;
}

function lockCounter(layout: Layout): number {
  return (layout as unknown as LayoutInternals).layoutLockCounter();
}

describe('Layout', () => {
  mockScene2D();

  describe('translate', () => {
    it('defaults to zero', () => {
      const layout = (<Layout />) as Layout;
      expect(layout.translate().equals(Vector2.zero)).toBe(true);
    });

    it('reads x and y from props', () => {
      const layout = (<Layout translateX={20} translateY={-15} />) as Layout;
      expect(layout.translate().x).toBe(20);
      expect(layout.translate().y).toBe(-15);
    });

    it('reads a compound translate prop', () => {
      const layout = (<Layout translate={[10, 30]} />) as Layout;
      expect(layout.translate().x).toBe(10);
      expect(layout.translate().y).toBe(30);
    });

    it('is independently tweenable from position', () => {
      const layout = (<Layout x={10} translate={[40, 50]} />) as Layout;
      expect(layout.position.x()).toBe(10);
      expect(layout.translate().x).toBe(40);

      layout.translate([0, 0]);
      expect(layout.translate().x).toBe(0);
      expect(layout.position.x()).toBe(10);
    });
  });

  describe('layoutSelf / layoutChildren split', () => {
    it('defaults both to null so the legacy `layout` is the source of truth', () => {
      const layout = (<Layout layout />) as Layout;
      expect(layout.layoutSelf()).toBe(null);
      expect(layout.layoutChildren()).toBe(null);
      expect(layout.layoutEnabled()).toBe(true);
      expect(layout.canLayoutChildren()).toBe(true);
    });

    it('falls back to `layout` when the new signals are null', () => {
      const off = (<Layout layout={false} />) as Layout;
      expect(off.layoutEnabled()).toBe(false);
      expect(off.canLayoutChildren()).toBe(false);

      const on = (<Layout layout />) as Layout;
      expect(on.layoutEnabled()).toBe(true);
      expect(on.canLayoutChildren()).toBe(true);
    });

    it('`layoutSelf` overrides `layout` for the self axis only', () => {
      const layout = (<Layout layout={false} layoutSelf />) as Layout;
      expect(layout.layoutEnabled()).toBe(true);
      expect(layout.canLayoutChildren()).toBe(false);
    });

    it('`layoutChildren` overrides `layout` for the children axis only', () => {
      const layout = (<Layout layout layoutChildren={false} />) as Layout;
      expect(layout.layoutEnabled()).toBe(true);
      expect(layout.canLayoutChildren()).toBe(false);
    });

    it('a parent with `layoutChildren=false` stops a layoutSelf=true child from being laid out', () => {
      const view = useScene2D().getView();
      const parent = createRef<Layout>();
      const child = createRef<Layout>();
      view.add(
        <Layout ref={parent} layout layoutChildren={false}>
          <Layout ref={child} layoutSelf />
        </Layout>,
      );

      expect(parent().canLayoutChildren()).toBe(false);
      expect(child().layoutEnabled()).toBe(true);
      expect(child().isLayoutRoot()).toBe(true);
    });
  });

  describe('layout lock', () => {
    it('lockLayout increments and releaseLayout decrements the counter', () => {
      const layout = (<Layout />) as Layout;
      expect(lockCounter(layout)).toBe(0);

      layout.lockLayout();
      expect(lockCounter(layout)).toBe(1);
      layout.lockLayout();
      expect(lockCounter(layout)).toBe(2);

      layout.releaseLayout();
      expect(lockCounter(layout)).toBe(1);
      layout.releaseLayout();
      expect(lockCounter(layout)).toBe(0);
    });

    it('lockSize and releaseSize still work as deprecated aliases', () => {
      const layout = (<Layout />) as Layout;
      layout.lockSize();
      expect(lockCounter(layout)).toBe(1);
      layout.releaseSize();
      expect(lockCounter(layout)).toBe(0);
    });

    it(
      'padding tween acquires the layout lock for its full duration',
      generatorTest(function* () {
        const layout = (<Layout padding={0} />) as Layout;
        expect(lockCounter(layout)).toBe(0);

        const task = yield layout.padding(20, 1);

        yield* waitFor(0.5);
        expect(lockCounter(layout)).toBeGreaterThan(0);

        yield* task;
        expect(lockCounter(layout)).toBe(0);
      }),
    );

    it(
      'margin tween acquires the layout lock for its full duration',
      generatorTest(function* () {
        const layout = (<Layout margin={0} />) as Layout;
        const task = yield layout.margin(20, 1);

        yield* waitFor(0.5);
        expect(lockCounter(layout)).toBeGreaterThan(0);

        yield* task;
        expect(lockCounter(layout)).toBe(0);
      }),
    );

    it(
      'gap tween acquires the layout lock for its full duration',
      generatorTest(function* () {
        const layout = (<Layout gap={0} />) as Layout;
        const task = yield layout.gap(20, 1);

        yield* waitFor(0.5);
        expect(lockCounter(layout)).toBeGreaterThan(0);

        yield* task;
        expect(lockCounter(layout)).toBe(0);
      }),
    );

    it(
      'concurrent size + padding tweens compose their locks',
      generatorTest(function* () {
        const layout = (<Layout size={100} padding={0} />) as Layout;
        const task = yield layout.padding(20, 1);
        const sizeTask = yield layout.size(200, 0.5);

        yield* waitFor(0.25);
        expect(lockCounter(layout)).toBeGreaterThanOrEqual(2);

        yield* sizeTask;
        expect(lockCounter(layout)).toBeGreaterThan(0);

        yield* task;
        expect(lockCounter(layout)).toBe(0);
      }),
    );
  });

  describe('animated insert', () => {
    it(
      "doesn't mutate the user node's scale signal during the tween",
      generatorTest(function* () {
        const stack = createRef<Layout>();
        const view = useScene2D().getView();
        view.add(
          <Layout ref={stack} layout direction="row" gap={20}>
            <Rect width={100} height={100} />
            <Rect width={100} height={100} />
          </Layout>,
        );

        const newItem = (<Rect width={100} height={100} />) as Rect;
        const task = yield stack().insert(newItem, 1, 1);

        // The animation tweens a wrapper's scale, not the user node's.
        yield* waitFor(0.5);
        expect(newItem.scale.x()).toBe(1);
        expect(newItem.scale.y()).toBe(1);

        yield* task;
        expect(newItem.scale.x()).toBe(1);
        expect(newItem.scale.y()).toBe(1);
      }),
    );

    it(
      'inserts the node at the requested index after the tween',
      generatorTest(function* () {
        const stack = createRef<Layout>();
        const view = useScene2D().getView();
        view.add(
          <Layout ref={stack} layout direction="row" gap={20}>
            <Rect width={100} height={100} />
            <Rect width={100} height={100} />
          </Layout>,
        );

        const newItem = (<Rect width={120} height={80} />) as Rect;
        yield* stack().insert(newItem, 1, 0.5);

        expect(stack().children()[1]).toBe(newItem);
      }),
    );
  });
});
