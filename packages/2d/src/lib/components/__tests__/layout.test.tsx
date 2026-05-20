import {Vector2, waitFor} from '@canvas-commons/core';
import {describe, expect, it} from 'vitest';
import {Layout} from '../Layout';
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
});
