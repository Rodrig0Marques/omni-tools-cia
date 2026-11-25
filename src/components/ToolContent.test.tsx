import { cleanup, render, waitFor } from '@testing-library/react';
import { createInstance } from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, expect, it, vi } from 'vitest';
import ToolContent from './ToolContent';
import { CustomSnackBarContext } from '../contexts/CustomSnackBarContext';

const i18n = createInstance();
i18n
  .use(initReactI18next)
  .init({ lng: 'en', resources: {}, initImmediate: false });
afterEach(cleanup);

function Demo({
  compute,
  input = 'input',
  showSnackBar
}: {
  compute: () => void;
  input?: string;
  showSnackBar: (message: string, type: 'success' | 'error') => void;
}) {
  return (
    <I18nextProvider i18n={i18n}>
      <CustomSnackBarContext.Provider value={{ showSnackBar }}>
        <MemoryRouter>
          <ToolContent
            title="Demo"
            initialValues={{}}
            getGroups={null}
            input={input}
            compute={compute}
          />
        </MemoryRouter>
      </CustomSnackBarContext.Provider>
    </I18nextProvider>
  );
}

it('reports asynchronous processing errors', async () => {
  const showSnackBar = vi.fn();
  render(
    <Demo
      showSnackBar={showSnackBar}
      compute={() => Promise.reject(new Error('Processing failed'))}
    />
  );
  await waitFor(() =>
    expect(showSnackBar).toHaveBeenCalledWith('Processing failed', 'error')
  );
});

it('recomputes only for input/options changes, not notification callback changes', () => {
  const compute = vi.fn();
  const { rerender } = render(
    <Demo compute={compute} showSnackBar={vi.fn()} />
  );
  expect(compute).toHaveBeenCalledOnce();
  rerender(<Demo compute={compute} showSnackBar={vi.fn()} />);
  expect(compute).toHaveBeenCalledOnce();
  rerender(<Demo compute={compute} showSnackBar={vi.fn()} input="new input" />);
  expect(compute).toHaveBeenCalledTimes(2);
});
