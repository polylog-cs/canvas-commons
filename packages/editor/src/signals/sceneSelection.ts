import {signal} from '@preact/signals';

/**
 * Names of the scenes the editor is restricted to, or `null` for all scenes.
 */
export const sceneSelectionSignal = signal<string[] | null>(null);

export function parseSceneSelection(value: unknown): string[] | null {
  return Array.isArray(value) &&
    value.length > 0 &&
    value.every(name => typeof name === 'string')
    ? value
    : null;
}
