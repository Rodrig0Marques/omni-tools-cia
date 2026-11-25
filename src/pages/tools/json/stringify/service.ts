import JSON5 from 'json5';

export const stringifyJson = (
  input: string,
  indentationType: 'tab' | 'space',
  spacesCount: number,
  escapeHtml: boolean
): string => {
  let parsedInput;
  try {
    parsedInput = JSON5.parse(input);
  } catch {
    throw new Error('Invalid JavaScript object/array');
  }

  const indent =
    indentationType === 'tab'
      ? '\t'
      : Math.min(10, Math.max(0, Math.trunc(spacesCount) || 0));
  let result = JSON.stringify(parsedInput, null, indent);

  if (escapeHtml) {
    result = result
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  return result;
};
