export type PresetValue = string | number | boolean;
export type PresetValues = Record<string, PresetValue>;

export interface ToolPreset {
  name: string;
  values: PresetValues;
}

export type PresetFields<T> = readonly (keyof T & string)[] | false;

const storagePrefix = 'omni-tools:presets:';
export const maxPresetNameLength = 80;

export function getToolPresetsKey(toolPath: string): string {
  return storagePrefix + toolPath.replace(/^\/+|\/+$/g, '');
}

function isPresetValue(value: unknown): value is PresetValue {
  return (
    typeof value === 'string' ||
    typeof value === 'boolean' ||
    (typeof value === 'number' && Number.isFinite(value))
  );
}

export function pickPresetValues<T extends Record<string, unknown>>(
  defaults: T,
  values: Record<string, unknown>,
  fields?: PresetFields<T>
): PresetValues {
  if (fields === false) return {};

  return Object.fromEntries(
    Object.entries(defaults)
      .filter(
        ([key, defaultValue]) =>
          (!fields || fields.includes(key)) &&
          !['__proto__', 'constructor', 'prototype'].includes(key) &&
          !/password/i.test(key) &&
          isPresetValue(defaultValue) &&
          Object.hasOwn(values, key) &&
          isPresetValue(values[key]) &&
          typeof values[key] === typeof defaultValue
      )
      .map(([key]) => [key, values[key]])
  ) as PresetValues;
}

export function readToolPresets(toolPath: string): ToolPreset[] {
  const raw = localStorage.getItem(getToolPresetsKey(toolPath));
  if (!raw) return [];

  let stored;
  try {
    stored = JSON.parse(raw);
  } catch {
    return [];
  }

  if (stored?.version !== 1 || !Array.isArray(stored.presets)) return [];

  const presets: ToolPreset[] = [];
  const names = new Set<string>();
  for (const entry of stored.presets) {
    if (
      !entry ||
      typeof entry.name !== 'string' ||
      !entry.name.trim() ||
      entry.name.length > maxPresetNameLength ||
      !entry.values ||
      typeof entry.values !== 'object' ||
      Array.isArray(entry.values)
    ) {
      continue;
    }

    const name = entry.name.trim();
    const normalizedName = name.toLowerCase();
    if (names.has(normalizedName)) continue;
    names.add(normalizedName);
    presets.push({
      name,
      values: Object.fromEntries(
        Object.entries(entry.values).filter(([, value]) => isPresetValue(value))
      ) as PresetValues
    });
  }
  return presets;
}

export function saveToolPreset(
  toolPath: string,
  name: string,
  values: PresetValues
): ToolPreset[] {
  const trimmedName = name.trim();
  if (!trimmedName || trimmedName.length > maxPresetNameLength) {
    throw new Error('Invalid configuration name');
  }
  const presets = readToolPresets(toolPath).filter(
    (preset) => preset.name.toLowerCase() !== trimmedName.toLowerCase()
  );
  presets.push({ name: trimmedName, values });
  localStorage.setItem(
    getToolPresetsKey(toolPath),
    JSON.stringify({ version: 1, presets })
  );
  return presets;
}

export function deleteToolPreset(toolPath: string, name: string): ToolPreset[] {
  const presets = readToolPresets(toolPath).filter(
    (preset) => preset.name !== name
  );
  localStorage.setItem(
    getToolPresetsKey(toolPath),
    JSON.stringify({ version: 1, presets })
  );
  return presets;
}
