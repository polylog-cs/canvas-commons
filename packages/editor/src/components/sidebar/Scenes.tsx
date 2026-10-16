import styles from './Sidebar.module.scss';

import type {Scene} from '@canvas-commons/core';
import clsx from 'clsx';
import type {ComponentChildren, JSX} from 'preact';
import {useApplication} from '../../contexts';
import {useSubscribableValue} from '../../hooks';
import {sceneSelectionSignal} from '../../signals';
import {Pane} from '../tabs';

export function Scenes() {
  const {player, renderer} = useApplication();
  const scenes = player.playback.allScenes;
  const selection = new Set(
    (sceneSelectionSignal.value ?? []).filter(name =>
      scenes.some(scene => scene.name === name),
    ),
  );

  const select = (names: string[] | null) => {
    player.selectScenes(names);
    renderer.selectScenes(names);
    sceneSelectionSignal.value = names;
  };

  const handleClick = (
    scene: Scene,
    event: JSX.TargetedMouseEvent<Element>,
  ) => {
    if (!event.ctrlKey && !event.metaKey && !event.shiftKey) {
      select([scene.name]);
      return;
    }

    const names = new Set(selection);
    if (names.has(scene.name)) {
      names.delete(scene.name);
    } else {
      names.add(scene.name);
    }
    select(
      names.size > 0
        ? scenes.map(scene => scene.name).filter(name => names.has(name))
        : null,
    );
  };

  return (
    <Pane title="Scenes" id="scenes-pane">
      <div className={styles.sceneList}>
        <SceneButton
          selected={selection.size === 0}
          title="Show all scenes on the timeline"
          onClick={() => select(null)}
        >
          All scenes
        </SceneButton>
        <div className={styles.sceneSeparator} />
        {scenes.map(scene => (
          <SceneItem
            scene={scene}
            selected={selection.has(scene.name)}
            onClick={event => handleClick(scene, event)}
          />
        ))}
      </div>
    </Pane>
  );
}

interface SceneItemProps {
  scene: Scene;
  selected: boolean;
  onClick: (event: JSX.TargetedMouseEvent<Element>) => void;
}

function SceneItem({scene, selected, onClick}: SceneItemProps) {
  const {player} = useApplication();
  const {duration} = useSubscribableValue(scene.onCacheChanged);
  const known = duration > 0 || scene.isCached();

  return (
    <SceneButton selected={selected} title={scene.name} onClick={onClick}>
      <span className={styles.sceneName}>{scene.name}</span>
      {known && (
        <span className={styles.sceneDuration}>
          {player.status.framesToSeconds(duration).toFixed(1)}s
        </span>
      )}
    </SceneButton>
  );
}

interface SceneButtonProps {
  selected: boolean;
  title: string;
  onClick: (event: JSX.TargetedMouseEvent<Element>) => void;
  children: ComponentChildren;
}

function SceneButton({selected, title, onClick, children}: SceneButtonProps) {
  return (
    <button
      type="button"
      title={title}
      className={clsx(styles.scene, selected && styles.selected)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
