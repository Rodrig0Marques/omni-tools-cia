import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  deleteToolPreset,
  getToolPresetsKey,
  pickPresetValues,
  readToolPresets,
  saveToolPreset
} from './toolPresets';

beforeEach(() => localStorage.clear());
afterEach(() => {
  vi.restoreAllMocks();
});

describe('tool configuration storage', () => {
  it('isolates configurations by tool and normalizes surrounding slashes', () => {
    saveToolPreset('/string/join/', 'Commas', { separator: ',' });

    expect(readToolPresets('string/join')).toEqual([
      { name: 'Commas', values: { separator: ',' } }
    ]);
    expect(readToolPresets('/csv/csv-to-json')).toEqual([]);
  });

  it('updates an existing name without creating case or whitespace duplicates', () => {
    saveToolPreset('tool', '  My settings  ', { quality: 80 });
    saveToolPreset('tool', 'my SETTINGS', { quality: 90 });

    expect(readToolPresets('tool')).toEqual([
      { name: 'my SETTINGS', values: { quality: 90 } }
    ]);
  });

  it('preserves other saved configurations when saving or deleting one', () => {
    saveToolPreset('tool', 'Small', { width: 200 });
    saveToolPreset('tool', 'Large', { width: 1200 });
    deleteToolPreset('tool', 'Small');

    expect(readToolPresets('tool')).toEqual([
      { name: 'Large', values: { width: 1200 } }
    ]);
  });

  it.each(['', '   ', 'a'.repeat(81)])(
    'rejects an invalid name without writing: %j',
    (name) => {
      expect(() => saveToolPreset('tool', name, { enabled: true })).toThrow();
      expect(localStorage.getItem(getToolPresetsKey('tool'))).toBeNull();
    }
  );

  it.each(['{invalid', 'null', '[]', '{"version":2,"presets":[]}'])(
    'recovers from malformed or unsupported stored data: %s',
    (raw) => {
      localStorage.setItem(getToolPresetsKey('tool'), raw);
      expect(readToolPresets('tool')).toEqual([]);
      saveToolPreset('tool', 'New', { enabled: true });
      expect(readToolPresets('tool')).toHaveLength(1);
    }
  );

  it('ignores malformed entries and duplicate names', () => {
    localStorage.setItem(
      getToolPresetsKey('tool'),
      JSON.stringify({
        version: 1,
        presets: [
          null,
          { name: '', values: {} },
          { name: 'Broken', values: [] },
          {
            name: 'Valid',
            values: { enabled: true, nested: { file: 'data' } }
          },
          { name: 'valid', values: { enabled: false } }
        ]
      })
    );

    expect(readToolPresets('tool')).toEqual([
      { name: 'Valid', values: { enabled: true } }
    ]);
  });

  it('reports storage failures without claiming the configuration was saved', () => {
    vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage is full', 'QuotaExceededError');
    });
    expect(() => saveToolPreset('tool', 'New', { enabled: true })).toThrow();
    expect(readToolPresets('tool')).toEqual([]);
  });
});

describe('configuration option selection', () => {
  it('only includes the allowed options, excluding content, passwords and files', () => {
    const defaults = {
      quality: 80,
      enabled: true,
      text: '',
      password: '',
      file: null
    };
    const values = {
      quality: 90,
      enabled: false,
      text: 'Private content',
      password: 'secret',
      file: new File(['contents'], 'private.txt')
    };

    expect(pickPresetValues(defaults, values, ['quality', 'enabled'])).toEqual({
      quality: 90,
      enabled: false
    });
    expect(pickPresetValues(defaults, values)).not.toHaveProperty('password');
    expect(pickPresetValues(defaults, values)).not.toHaveProperty('file');
  });

  it('ignores unknown fields, mismatched types, non-finite numbers and prototype keys', () => {
    const defaults = { quality: 80, enabled: true, separator: ',' };
    const values = JSON.parse(
      '{"quality":"90","enabled":false,"separator":"|","unexpected":"input","__proto__":{"polluted":true}}'
    );
    expect(pickPresetValues(defaults, values)).toEqual({
      enabled: false,
      separator: '|'
    });
    expect(
      pickPresetValues(defaults, { ...defaults, quality: Infinity })
    ).not.toHaveProperty('quality');
    expect(pickPresetValues(defaults, values, false)).toEqual({});
  });
});
