import { describe, expect, it } from 'vitest';
import { stringifyJson } from './service';

describe('stringifyJson', () => {
  it('formats object literals with unquoted keys, single quotes and trailing commas', () => {
    expect(stringifyJson("{ name: 'Ana', age: 30, }", 'space', 2, false)).toBe(
      '{\n  "name": "Ana",\n  "age": 30\n}'
    );
  });

  it('formats arrays and comments with tabs', () => {
    expect(
      stringifyJson('[1, /* comment */ true, null]', 'tab', 2, false)
    ).toBe('[\n\t1,\n\ttrue,\n\tnull\n]');
  });

  it('escapes HTML characters when requested', () => {
    expect(stringifyJson(`{ html: "<&>'" }`, 'space', 0, true)).toBe(
      '{&quot;html&quot;:&quot;&lt;&amp;&gt;&#039;&quot;}'
    );
  });

  it.each([
    '(() => { localStorage.setItem("stringify-executed", "yes"); return {}; })()',
    '{ get value() { localStorage.setItem("stringify-executed", "yes"); return 1; } }',
    '{ value: (localStorage.setItem("stringify-executed", "yes"), 1) }'
  ])('rejects executable input without side effects: %s', (input) => {
    localStorage.removeItem('stringify-executed');

    expect(() => stringifyJson(input, 'space', 2, false)).toThrow(
      'Invalid JavaScript object/array'
    );
    expect(localStorage.getItem('stringify-executed')).toBeNull();
  });

  it('rejects malformed input', () => {
    expect(() => stringifyJson('{', 'space', 2, false)).toThrow(
      'Invalid JavaScript object/array'
    );
  });

  it.each([-1, NaN, Infinity, 1000000000])(
    'bounds indentation without allocating a large string: %s',
    (spacesCount) => {
      const expected = JSON.stringify({ value: 1 }, null, spacesCount);
      expect(stringifyJson('{ value: 1 }', 'space', spacesCount, false)).toBe(
        expected
      );
    }
  );
});
