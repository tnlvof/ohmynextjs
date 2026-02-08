import type { SubagentPreset } from '../types';
import { defaultPresets } from '../presets';

export function getSubagentPreset(name: string): SubagentPreset {
  const preset = defaultPresets.find((p) => p.name === name);
  if (!preset) {
    throw new Error(`Unknown preset: ${name}`);
  }
  return preset;
}
