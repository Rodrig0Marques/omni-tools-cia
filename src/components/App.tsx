import { BrowserRouter, useRoutes } from 'react-router-dom';
import routesConfig from '../config/routesConfig';
import Navbar from './Navbar';
import { Suspense, useState } from 'react';
import Loading from './Loading';
import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import { CustomSnackBarProvider } from '../contexts/CustomSnackBarContext';
import { SnackbarProvider } from 'notistack';
import { tools } from '../tools';
import './index.css';
import { darkTheme, lightTheme } from '../config/muiConfig';
import ScrollToTopButton from './ScrollToTopButton';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import { UserTypeFilterProvider } from 'providers/UserTypeFilterProvider';

export type Mode = 'dark' | 'light' | 'system';

const AppRoutes = () => {
  const updatedRoutesConfig = [...routesConfig];
  tools.forEach(({ path, component: ToolComponent }) => {
    updatedRoutesConfig.push({ path, element: <ToolComponent /> });
  });
  return useRoutes(updatedRoutesConfig);
};

function App() {
  const [mode, setMode] = useState<Mode>(() => {
    const savedMode = localStorage.getItem('theme');
    return savedMode === 'light' || savedMode === 'dark' ? savedMode : 'system';
  });
  const systemDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme =
    mode === 'dark' || (mode === 'system' && systemDarkMode)
      ? darkTheme
      : lightTheme;

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider
          maxSnack={5}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
        >
          <CustomSnackBarProvider>
            <UserTypeFilterProvider>
              <BrowserRouter>
                <Navbar
                  mode={mode}
                  onChangeMode={() => {
                    setMode((prev) => nextMode(prev));
                    localStorage.setItem('theme', nextMode(mode));
                  }}
                />
                <Suspense fallback={<Loading />}>
                  <AppRoutes />
                </Suspense>
              </BrowserRouter>
            </UserTypeFilterProvider>
          </CustomSnackBarProvider>
        </SnackbarProvider>
        <ScrollToTopButton />
      </ThemeProvider>
    </I18nextProvider>
  );
}

function nextMode(mode: Mode): Mode {
  return mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light';
}

export default App;
