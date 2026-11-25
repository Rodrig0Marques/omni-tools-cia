import { createTheme, ThemeOptions } from '@mui/material';

const sharedThemeOptions: ThemeOptions = {
  shape: { borderRadius: 6 },
  typography: {
    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: { fontWeight: 750, letterSpacing: '-0.045em', lineHeight: 1.1 },
    h2: { fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1.2 },
    h3: { fontWeight: 650, letterSpacing: '-0.02em' },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: 0 },
    body1: { lineHeight: 1.7 },
    body2: { lineHeight: 1.65 }
  },
  zIndex: { snackbar: 100000 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { minHeight: 38, borderRadius: 10, paddingInline: 16 }
      }
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { border: '1px solid', borderColor: 'var(--card-border)' }
      }
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 10 },
        notchedOutline: { borderColor: 'var(--card-border)' }
      }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { fontSize: 12, borderRadius: 8, padding: '8px 12px' }
      }
    },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 18 } } },
    MuiChip: { styleOverrides: { root: { fontWeight: 550 } } }
  }
};

export const lightTheme = createTheme({
  ...sharedThemeOptions,
  palette: {
    primary: {
      main: '#242D3C',
      light: '#4C596F',
      dark: '#121923',
      contrastText: '#FFFFFF'
    },
    secondary: { main: '#A87909', light: '#F7D968', dark: '#795500' },
    background: {
      default: '#F7F8FA',
      paper: '#FFFFFF',
      hover: '#FAFBFD',
      lightSecondary: '#F2F4F7',
      darkSecondary: '#354254'
    },
    text: { primary: '#202938', secondary: '#647084' },
    divider: '#E5E9F0'
  },
  components: {
    ...sharedThemeOptions.components,
    MuiCssBaseline: { styleOverrides: { body: { '--card-border': '#E5E9F0' } } }
  }
});

export const darkTheme = createTheme({
  ...sharedThemeOptions,
  palette: {
    mode: 'dark',
    primary: {
      main: '#F2CC60',
      light: '#F9DF93',
      dark: '#D7AA30',
      contrastText: '#181C24'
    },
    secondary: { main: '#F2CC60' },
    background: {
      default: '#10141C',
      paper: '#191F2A',
      hover: '#202734',
      lightSecondary: '#202734',
      darkSecondary: '#354254'
    },
    text: { primary: '#F0F3F8', secondary: '#A4AFC0' },
    divider: '#2C3545'
  },
  components: {
    ...sharedThemeOptions.components,
    MuiCssBaseline: { styleOverrides: { body: { '--card-border': '#2C3545' } } }
  }
});
