import {describe, expect, test} from 'vitest';
import {ValueDispatcher} from '../events';
import {
  FullSceneDescription,
  GeneratorScene,
  ReadOnlyTimeEvents,
  ThreadGeneratorFactory,
  Variables,
  createSceneMetadata,
} from '../scenes';
import {Vector2} from '../types';
import {Logger} from './Logger';
import {PlaybackManager} from './PlaybackManager';
import {PlaybackStatus} from './PlaybackStatus';
import {SharedWebGLContext} from './SharedWebGLContext';

class TestScene extends GeneratorScene<void> {
  public getView() {}
  protected draw() {}
}

function setup(lengths: Record<string, number>) {
  const playback = new PlaybackManager();
  const status = new PlaybackStatus(playback);
  const logger = new Logger();
  const runs: string[] = [];
  const scenes = Object.entries(lengths).map(([name, frames]) => {
    const config: ThreadGeneratorFactory<void> = function* () {
      runs.push(name);
      for (let i = 0; i < frames; i++) {
        yield;
      }
    };
    const description: FullSceneDescription<typeof config> = {
      klass: TestScene,
      config,
      name,
      size: new Vector2(1920, 1080),
      resolutionScale: 1,
      playback: status,
      logger,
      timeEventsClass: ReadOnlyTimeEvents,
      sharedWebGLContext: new SharedWebGLContext(logger),
      meta: createSceneMetadata(),
      get variables(): Variables {
        throw new Error('Not used by GeneratorScene.');
      },
      get onReplaced(): ValueDispatcher<FullSceneDescription<typeof config>> {
        throw new Error('Not used by GeneratorScene.');
      },
    };
    return new TestScene(description);
  });
  playback.setup(scenes);
  return {playback, runs};
}

function names(playback: PlaybackManager) {
  return playback.onScenesRecalculated.current.map(scene => scene.name);
}

describe('PlaybackManager.selectScenes()', () => {
  test('Only selected scenes are recalculated', async () => {
    const {playback, runs} = setup({a: 10, b: 20, c: 30});
    playback.selectScenes(['b', 'c']);
    await playback.recalculate();

    expect(runs).toEqual(['b', 'c']);
    expect(names(playback)).toEqual(['b', 'c']);
    expect(playback.duration).toBe(50);
    expect(playback.allScenes.map(scene => scene.name)).toEqual([
      'a',
      'b',
      'c',
    ]);
  });

  test('Selected scenes start at the beginning of the timeline', async () => {
    const {playback} = setup({a: 10, b: 20});
    await playback.recalculate();
    playback.selectScenes(['b']);
    await playback.recalculate();

    const [b] = playback.onScenesRecalculated.current;
    expect(b.firstFrame).toBe(0);
    expect(b.lastFrame).toBe(20);
  });

  test('Playback stays within the selection', async () => {
    const {playback, runs} = setup({a: 10, b: 20, c: 30});
    playback.selectScenes(['b']);
    await playback.recalculate();
    runs.length = 0;

    await playback.reset();
    expect(playback.currentScene.name).toBe('b');
    await playback.seek(5);
    expect(playback.currentScene.name).toBe('b');
    while (!(await playback.progress()));
    expect(runs).toEqual(['b']);
  });

  test('Clearing the selection restores all scenes', async () => {
    const {playback, runs} = setup({a: 10, b: 20});
    playback.selectScenes(['b']);
    await playback.recalculate();
    playback.selectScenes(null);
    await playback.recalculate();

    expect(runs).toEqual(['b', 'a']);
    expect(names(playback)).toEqual(['a', 'b']);
    expect(playback.duration).toBe(30);
  });

  test('Unknown names fall back to all scenes', async () => {
    const {playback} = setup({a: 10, b: 20});
    playback.selectScenes(['missing']);
    await playback.recalculate();

    expect(names(playback)).toEqual(['a', 'b']);
  });
});
