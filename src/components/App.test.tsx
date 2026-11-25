import {
  act,
  cleanup,
  fireEvent,
  render,
  screen
} from '@testing-library/react';
import { useState } from 'react';
import { useTheme } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import type { Mode } from './App';

const { toolRender, routerState } = vi.hoisted(() => ({
  toolRender: vi.fn(),
  routerState: { path: '/' }
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const router = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...router,
    BrowserRouter: ({ children }: { children: ReactNode }) => (
      <router.MemoryRouter initialEntries={[routerState.path]}>
        {children}
      </router.MemoryRouter>
    )
  };
});

vi.mock('../tools', () => ({
  tools: [
    {
      path: 'string/test-tool',
      component: function TestTool() {
        const [text, setText] = useState('');
        toolRender();
        return (
          <input
            aria-label="Tool input"
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
        );
      }
    }
  ]
}));

vi.mock('./Navbar', () => ({
  default: function Navbar({
    mode,
    onChangeMode
  }: {
    mode: Mode;
    onChangeMode: () => void;
  }) {
    const theme = useTheme();
    const location = useLocation();
    return (
      <>
        <span data-testid="theme">{theme.palette.mode}</span>
        <span data-testid="path">{location.pathname}</span>
        <Link to="/string/test-tool">Open tool</Link>
        <button onClick={onChangeMode}>Change theme ({mode})</button>
      </>
    );
  }
}));

vi.mock('./ScrollToTopButton', () => ({ default: () => null }));
vi.mock('../pages/home', () => ({ default: () => <h1>Home page</h1> }));
vi.mock('../pages/tools-by-category', () => ({ default: () => null }));
vi.mock('../i18n', async () => {
  const { createInstance } = await import('i18next');
  const i18n = createInstance();
  await i18n.init({
    lng: 'en',
    resources: { en: { translation: { navbar: { home: 'Home' } } } }
  });
  return { default: i18n };
});

let mediaQuery: MediaQueryList;
let mediaListeners: Set<(event: MediaQueryListEvent) => void>;

function changeSystemTheme(dark: boolean) {
  Object.defineProperty(mediaQuery, 'matches', {
    value: dark,
    configurable: true
  });
  act(() =>
    mediaListeners.forEach((listener) =>
      listener({ matches: dark } as MediaQueryListEvent)
    )
  );
}

beforeEach(() => {
  localStorage.clear();
  routerState.path = '/';
  toolRender.mockClear();
  mediaListeners = new Set();
  mediaQuery = {
    matches: false,
    media: '(prefers-color-scheme: dark)',
    addEventListener: (
      _event: string,
      listener: (event: MediaQueryListEvent) => void
    ) => mediaListeners.add(listener),
    removeEventListener: (
      _event: string,
      listener: (event: MediaQueryListEvent) => void
    ) => mediaListeners.delete(listener),
    addListener: (listener: (event: MediaQueryListEvent) => void) =>
      mediaListeners.add(listener),
    removeListener: (listener: (event: MediaQueryListEvent) => void) =>
      mediaListeners.delete(listener)
  } as unknown as MediaQueryList;
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => mediaQuery)
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  localStorage.clear();
});

describe('App theme', () => {
  it.each(['light', 'dark'])(
    'preserves the selected %s theme when the system changes',
    async (mode) => {
      localStorage.setItem('theme', mode);
      render(<App />);
      await screen.findByRole('heading', { name: 'Home page' });

      changeSystemTheme(true);
      expect(screen.getByTestId('theme')).toHaveTextContent(mode);
      changeSystemTheme(false);
      expect(screen.getByTestId('theme')).toHaveTextContent(mode);
    }
  );

  it('follows system changes in system mode', async () => {
    localStorage.setItem('theme', 'system');
    render(<App />);
    await screen.findByRole('heading', { name: 'Home page' });

    expect(screen.getByTestId('theme')).toHaveTextContent('light');
    changeSystemTheme(true);
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    changeSystemTheme(false);
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });

  it('uses the system theme when a saved preference is invalid', async () => {
    localStorage.setItem('theme', 'invalid');
    changeSystemTheme(true);
    render(<App />);
    await screen.findByRole('heading', { name: 'Home page' });

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  it('cycles and persists the theme preference', async () => {
    localStorage.setItem('theme', 'light');
    render(<App />);
    await screen.findByRole('heading', { name: 'Home page' });

    for (const mode of ['dark', 'system', 'light']) {
      fireEvent.click(screen.getByRole('button', { name: /Change theme/ }));
      expect(localStorage.getItem('theme')).toBe(mode);
      expect(screen.getByTestId('theme')).toHaveTextContent(
        mode === 'dark' ? 'dark' : 'light'
      );
    }
  });
});

describe('App routing', () => {
  it('renders a 404 page for nested unknown paths and offers a route home', async () => {
    routerState.path = '/unknown/nested/path';
    render(<App />);

    expect(await screen.findByRole('heading', { name: '404' })).toBeVisible();
    expect(screen.getByTestId('path')).toHaveTextContent('/404');
    fireEvent.click(screen.getByRole('link', { name: 'Home' }));
    expect(
      await screen.findByRole('heading', { name: 'Home page' })
    ).toBeVisible();
    expect(screen.getByTestId('path')).toHaveTextContent(/^\/$/);
  });

  it('only renders a tool on its route and preserves its state across theme changes', async () => {
    render(<App />);
    await screen.findByRole('heading', { name: 'Home page' });
    expect(toolRender).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('link', { name: 'Open tool' }));
    const input = await screen.findByRole('textbox', { name: 'Tool input' });
    fireEvent.change(input, { target: { value: 'Keep this input' } });
    fireEvent.click(screen.getByRole('button', { name: /Change theme/ }));
    expect(screen.getByRole('textbox', { name: 'Tool input' })).toHaveValue(
      'Keep this input'
    );
  });
});
