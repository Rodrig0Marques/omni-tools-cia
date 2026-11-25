import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { createInstance } from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ToolFileResult from './ToolFileResult';
import ToolTextResult from './ToolTextResult';
import ToolDiffResult from './ToolDiffResult';
import ToolMultiFileResult from './ToolMultiFileResult';
import { CustomSnackBarContext } from '../../contexts/CustomSnackBarContext';
import translation from '../../../public/locales/en/translation.json';

const i18n = createInstance();
i18n.use(initReactI18next).init({
  lng: 'en',
  resources: { en: { translation } },
  initImmediate: false
});

const file = new File(['image'], 'test.png', { type: 'image/png' });
const showSnackBar = vi.fn();

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <CustomSnackBarContext.Provider value={{ showSnackBar }}>
        {children}
      </CustomSnackBarContext.Provider>
    </I18nextProvider>
  );
}

beforeEach(() => {
  // Happy DOM 12 rejects MUI's -1 sentinel during textarea cleanup.
  const cancel = window.cancelAnimationFrame.bind(window);
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
    if (id !== -1) cancel(id);
  });
  vi.spyOn(URL, 'createObjectURL').mockImplementation(
    () => `blob:${Math.random()}`
  );
  vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('tool outputs', () => {
  it.each([ToolTextResult, ToolDiffResult])(
    'clears text output without changing the input',
    (Result) => {
      function Demo() {
        const [value, setValue] = useState('processed output');
        return (
          <>
            <input aria-label="Original input" defaultValue="original" />
            <Result value={value} onClear={() => setValue('')} />
          </>
        );
      }
      render(<Demo />, { wrapper: Wrapper });
      fireEvent.click(screen.getByRole('button', { name: 'Clear output' }));
      expect(screen.getByLabelText('Original input')).toHaveValue('original');
      expect(screen.queryByText('processed output')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Download' })).toBeDisabled();
      expect(
        screen.getByRole('button', { name: 'Copy to clipboard' })
      ).toBeDisabled();
      expect(
        screen.getByRole('button', { name: 'Clear output' })
      ).toBeDisabled();
    }
  );

  it('clears a file, revokes the preview and accepts a new output', () => {
    function Demo() {
      const [value, setValue] = useState<File | null>(file);
      return (
        <>
          <ToolFileResult value={value} onClear={() => setValue(null)} />
          <button onClick={() => setValue(file)}>New result</button>
        </>
      );
    }
    render(<Demo />, { wrapper: Wrapper });
    expect(screen.getByRole('img')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Clear output' }));
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(URL.revokeObjectURL).toHaveBeenCalledOnce();
    expect(screen.getByRole('button', { name: 'Download' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'New result' }));
    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Download' })).toBeEnabled();
  });

  it('keeps batch previews stable on rerender and releases every URL when cleared', () => {
    const files = [
      file,
      new File(['other'], 'other.png', { type: 'image/png' })
    ];
    const clear = vi.fn();
    const { rerender } = render(
      <ToolMultiFileResult value={files} onClear={clear} />,
      { wrapper: Wrapper }
    );
    expect(URL.createObjectURL).toHaveBeenCalledTimes(2);
    rerender(<ToolMultiFileResult value={[...files]} onClear={clear} />);
    expect(URL.createObjectURL).toHaveBeenCalledTimes(2);
    // A batch can be cleared even when it does not have a ZIP yet.
    expect(
      screen.getByRole('button', { name: 'Download all as ZIP' })
    ).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Clear output' }));
    expect(clear).toHaveBeenCalledOnce();
    rerender(<ToolMultiFileResult value={[]} onClear={clear} />);
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('disables file actions while a new output is processing', () => {
    render(<ToolFileResult value={file} loading onClear={vi.fn()} />, {
      wrapper: Wrapper
    });
    expect(screen.getByRole('button', { name: 'Download' })).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Copy to clipboard' })
    ).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Clear output' })).toBeDisabled();
  });
});
