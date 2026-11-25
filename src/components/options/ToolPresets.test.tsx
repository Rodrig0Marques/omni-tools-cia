import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within
} from '@testing-library/react';
import { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { createInstance } from 'i18next';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ToolContent from '../ToolContent';
import { CustomSnackBarContext } from '../../contexts/CustomSnackBarContext';
import translation from '../../../public/locales/en/translation.json';
import { getToolPresetsKey, readToolPresets } from '@utils/toolPresets';
import type { PresetFields } from '@utils/toolPresets';

const initialValues = {
  separator: ',',
  uppercase: false,
  privateText: '',
  password: ''
};
const fields = ['separator', 'uppercase'] as const;
const i18n = createInstance();
i18n.use(initReactI18next).init({
  lng: 'en',
  resources: { en: { translation } },
  initImmediate: false
});
const showSnackBar = vi.fn();

function DemoTool({
  presetFields = fields
}: {
  presetFields?: PresetFields<typeof initialValues>;
}) {
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState('');
  return (
    <ToolContent
      title="Demo"
      initialValues={initialValues}
      presetFields={presetFields}
      input={input}
      compute={(options, text) => {
        const output = text.split('\n').join(options.separator);
        setResult(options.uppercase ? output.toUpperCase() : output);
      }}
      renderCustomInput={(values, setFieldValue) => (
        <>
          <textarea
            aria-label="Input text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <input
            aria-label="Private form content"
            value={values.privateText}
            onChange={(event) =>
              setFieldValue('privateText', event.target.value)
            }
          />
          <input
            aria-label="File input"
            type="file"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
          <span>{file?.name}</span>
        </>
      )}
      resultComponent={<output aria-label="Result">{result}</output>}
      getGroups={({ values, updateField }) => [
        {
          title: 'Options',
          component: (
            <>
              <input
                aria-label="Separator"
                value={values.separator}
                onChange={(event) =>
                  updateField('separator', event.target.value)
                }
              />
              <input
                aria-label="Uppercase"
                type="checkbox"
                checked={values.uppercase}
                onChange={(event) =>
                  updateField('uppercase', event.target.checked)
                }
              />
            </>
          )
        }
      ]}
    />
  );
}

function renderTool(
  path = '/string/demo',
  presetFields?: PresetFields<typeof initialValues>
) {
  return render(
    <I18nextProvider i18n={i18n}>
      <CustomSnackBarContext.Provider value={{ showSnackBar }}>
        <MemoryRouter initialEntries={[path]}>
          <DemoTool presetFields={presetFields} />
        </MemoryRouter>
      </CustomSnackBarContext.Provider>
    </I18nextProvider>
  );
}

async function saveConfiguration(name: string) {
  fireEvent.click(screen.getByRole('button', { name: 'Save configuration' }));
  const dialog = await screen.findByRole('dialog');
  fireEvent.change(
    within(dialog).getByRole('textbox', { name: 'Configuration name' }),
    { target: { value: name } }
  );
  fireEvent.submit(
    within(dialog).getByRole('button', { name: 'Save' }).closest('form')!
  );
  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  );
}

beforeEach(() => {
  localStorage.clear();
  showSnackBar.mockClear();
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('saved tool configurations', () => {
  it('saves and applies options, recalculates the result and keeps input content and files', async () => {
    renderTool();
    fireEvent.change(screen.getByRole('textbox', { name: 'Input text' }), {
      target: { value: 'private\ncontent' }
    });
    fireEvent.change(
      screen.getByRole('textbox', { name: 'Private form content' }),
      { target: { value: 'Keep this content' } }
    );
    fireEvent.change(screen.getByLabelText('File input'), {
      target: { files: [new File(['private data'], 'private.txt')] }
    });
    fireEvent.change(screen.getByRole('textbox', { name: 'Separator' }), {
      target: { value: '|' }
    });
    fireEvent.click(screen.getByRole('checkbox', { name: 'Uppercase' }));
    await saveConfiguration('My format');

    expect(readToolPresets('/string/demo')).toEqual([
      { name: 'My format', values: { separator: '|', uppercase: true } }
    ]);
    fireEvent.change(screen.getByRole('textbox', { name: 'Separator' }), {
      target: { value: ';' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
    expect(screen.getByRole('textbox', { name: 'Separator' })).toHaveValue('|');
    expect(screen.getByLabelText('Result')).toHaveTextContent(
      'PRIVATE|CONTENT'
    );

    fireEvent.click(screen.getByRole('button', { name: 'Restore defaults' }));
    expect(screen.getByRole('textbox', { name: 'Separator' })).toHaveValue(',');
    expect(
      screen.getByRole('checkbox', { name: 'Uppercase' })
    ).not.toBeChecked();
    expect(screen.getByLabelText('Result')).toHaveTextContent(
      'private,content'
    );
    expect(screen.getByRole('textbox', { name: 'Input text' })).toHaveValue(
      'private\ncontent'
    );
    expect(
      screen.getByRole('textbox', { name: 'Private form content' })
    ).toHaveValue('Keep this content');
    expect(screen.getByText('private.txt')).toBeVisible();
    expect(readToolPresets('/string/demo')).toHaveLength(1);
  });

  it('persists across remounts, applies only on request and isolates other tools', async () => {
    const first = renderTool();
    fireEvent.change(screen.getByRole('textbox', { name: 'Separator' }), {
      target: { value: '|' }
    });
    await saveConfiguration('Pipes');
    first.unmount();

    const second = renderTool();
    await screen.findByRole('option', { name: 'Pipes' });
    expect(screen.getByRole('textbox', { name: 'Separator' })).toHaveValue(',');
    fireEvent.change(
      screen.getByRole('combobox', { name: 'Saved configurations' }),
      { target: { value: 'Pipes' } }
    );
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
    expect(screen.getByRole('textbox', { name: 'Separator' })).toHaveValue('|');
    second.unmount();

    renderTool('/csv/demo');
    expect(
      screen.queryByRole('option', { name: 'Pipes' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();
  });

  it('updates a named configuration and deletes it without changing active options', async () => {
    renderTool();
    await saveConfiguration('My format');
    fireEvent.change(screen.getByRole('textbox', { name: 'Separator' }), {
      target: { value: '|' }
    });
    await saveConfiguration('MY FORMAT');
    expect(readToolPresets('/string/demo')).toEqual([
      { name: 'MY FORMAT', values: { separator: '|', uppercase: false } }
    ]);

    fireEvent.click(
      screen.getByRole('button', { name: 'Delete configuration' })
    );
    expect(readToolPresets('/string/demo')).toEqual([]);
    expect(screen.getByRole('textbox', { name: 'Separator' })).toHaveValue('|');
  });

  it('keeps the save dialog open and explains a storage failure', async () => {
    renderTool();
    vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new DOMException('Full', 'QuotaExceededError');
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save configuration' }));
    const dialog = await screen.findByRole('dialog');
    fireEvent.change(
      within(dialog).getByRole('textbox', { name: 'Configuration name' }),
      { target: { value: 'My format' } }
    );
    fireEvent.submit(
      within(dialog).getByRole('button', { name: 'Save' }).closest('form')!
    );
    expect(await within(dialog).findByRole('alert')).toHaveTextContent(
      translation.toolPresets.storageError
    );
    expect(readToolPresets('/string/demo')).toEqual([]);
  });

  it('refreshes configurations when another tab updates storage', async () => {
    renderTool();
    localStorage.setItem(
      getToolPresetsKey('/string/demo'),
      JSON.stringify({
        version: 1,
        presets: [{ name: 'Other tab', values: { separator: '|' } }]
      })
    );
    fireEvent(
      window,
      new StorageEvent('storage', { key: getToolPresetsKey('/string/demo') })
    );
    expect(
      await screen.findByRole('option', { name: 'Other tab' })
    ).toBeInTheDocument();
  });

  it('hides the controls when a tool has no reusable options', () => {
    renderTool('/pdf/protect', false);
    expect(
      screen.queryByRole('button', { name: 'Save configuration' })
    ).not.toBeInTheDocument();
  });
});
