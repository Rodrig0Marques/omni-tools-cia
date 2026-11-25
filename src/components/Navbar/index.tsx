import { useEffect, useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import SettingsBrightnessOutlinedIcon from '@mui/icons-material/SettingsBrightnessOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import type { Mode } from 'components/App';
import logo from '../../assets/CONQUESTHUB-HORIZONTAL-PRETO.png';
import logoWhite from '../../assets/CONQUESTHUB-HORIZONTAL-BRANCO.png';
import ToolSearch from '../ToolSearch';

interface NavbarProps {
  mode: Mode;
  onChangeMode: () => void;
}

const languages = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'pt', label: 'Português' },
  { code: 'ja', label: '日本語' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'ru', label: 'Русский' },
  { code: 'zh', label: '中文' }
];

export default function Navbar({ mode, onChangeMode }: NavbarProps) {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const { pathname, hash } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const currentLanguage = (
    i18n.resolvedLanguage ??
    i18n.language ??
    'en'
  ).split('-')[0];
  const themeLabel = t('frontend.themeLabel', {
    mode: t(`frontend.themeModes.${mode}`)
  });

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        (event.target instanceof Element &&
          event.target.closest('.monaco-editor'))
      )
        return;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const changeLanguage = (event: SelectChangeEvent) => {
    i18n.changeLanguage(event.target.value);
  };
  const languageSelector = (
    <Select
      value={
        languages.some(({ code }) => code === currentLanguage)
          ? currentLanguage
          : 'en'
      }
      onChange={changeLanguage}
      size="small"
      inputProps={{ 'aria-label': t('frontend.language') }}
      sx={{
        fontSize: 13,
        '& fieldset': { border: 0 },
        '& .MuiSelect-select': { py: 1 }
      }}
    >
      {languages.map(({ code, label }) => (
        <MenuItem key={code} value={code}>
          {label}
        </MenuItem>
      ))}
    </Select>
  );

  const navLinks = [
    {
      to: '/#categories',
      label: t('frontend.allTools'),
      icon: <GridViewOutlinedIcon fontSize="small" />,
      active: pathname === '/' && hash !== '#favorites'
    },
    {
      to: '/#favorites',
      label: t('frontend.favorites'),
      icon: <BookmarkBorderOutlinedIcon fontSize="small" />,
      active: pathname === '/' && hash === '#favorites'
    }
  ];

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          color: 'text.primary',
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: 1328 }}>
          <Toolbar
            disableGutters
            sx={{ minHeight: { xs: 68, md: 78 }, gap: { xs: 0.5, md: 3 } }}
          >
            <Box
              component={Link}
              to="/"
              sx={{ display: 'flex', flexShrink: 0, mr: { xs: 'auto', md: 1 } }}
              aria-label="ConquestHub"
            >
              <Box
                component="img"
                src={theme.palette.mode === 'light' ? logo : logoWhite}
                alt="ConquestHub"
                sx={{ width: { xs: 148, md: 186 }, height: 'auto' }}
              />
            </Box>
            <Stack
              component="nav"
              direction="row"
              spacing={0.5}
              aria-label={t('frontend.navigation')}
              sx={{ display: { xs: 'none', md: 'flex' } }}
            >
              {navLinks.map(({ to, label, active }) => (
                <Button
                  key={to}
                  component={Link}
                  to={to}
                  aria-current={active ? 'page' : undefined}
                  sx={{
                    fontSize: 13,
                    color: active ? 'text.primary' : 'text.secondary',
                    bgcolor: active ? 'action.hover' : 'transparent'
                  }}
                >
                  {label}
                </Button>
              ))}
            </Stack>
            <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' } }} />
            <Tooltip title={t('frontend.searchTitle')}>
              <Button
                onClick={() => setSearchOpen(true)}
                aria-label={t('frontend.searchTitle')}
                sx={{
                  display: { xs: 'none', lg: 'flex' },
                  color: 'text.secondary',
                  border: 1,
                  borderColor: 'divider',
                  gap: 3,
                  py: 0.75,
                  minWidth: 188,
                  justifyContent: 'space-between'
                }}
                startIcon={<SearchOutlinedIcon />}
              >
                {t('frontend.search')}
                <Box
                  component="kbd"
                  sx={{
                    fontFamily: 'inherit',
                    fontSize: 10,
                    bgcolor: 'action.hover',
                    borderRadius: 0.5,
                    px: 0.75,
                    py: 0.25
                  }}
                >
                  Ctrl K
                </Box>
              </Button>
            </Tooltip>
            <IconButton
              onClick={() => setSearchOpen(true)}
              aria-label={t('frontend.searchTitle')}
              sx={{ display: { lg: 'none' } }}
            >
              <SearchOutlinedIcon fontSize="small" />
            </IconButton>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              {languageSelector}
            </Box>
            <Tooltip title={themeLabel}>
              <IconButton
                onClick={onChangeMode}
                aria-label={themeLabel}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                  width: 38,
                  height: 38
                }}
              >
                {mode === 'light' ? (
                  <LightModeOutlinedIcon fontSize="small" />
                ) : mode === 'dark' ? (
                  <DarkModeOutlinedIcon fontSize="small" />
                ) : (
                  <SettingsBrightnessOutlinedIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
            <IconButton
              onClick={() => setDrawerOpen(true)}
              aria-label={t('frontend.openMenu')}
              sx={{ display: { md: 'none' }, ml: 0.5 }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 300, maxWidth: '90vw', p: 2 } }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography fontWeight={700}>ConquestHub</Typography>
          <IconButton
            onClick={() => setDrawerOpen(false)}
            aria-label={t('frontend.closeMenu')}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
        <Stack
          component="nav"
          spacing={1}
          aria-label={t('frontend.navigation')}
        >
          {navLinks.map(({ to, label, icon }) => (
            <Button
              key={to}
              component={Link}
              to={to}
              startIcon={icon}
              onClick={() => setDrawerOpen(false)}
              sx={{ justifyContent: 'flex-start', py: 1.5 }}
            >
              {label}
            </Button>
          ))}
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Typography variant="caption" color="text.secondary" mb={1}>
          {t('frontend.language')}
        </Typography>
        {languageSelector}
      </Drawer>
      <Dialog
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        fullWidth
        maxWidth="sm"
        aria-labelledby="global-search-title"
        PaperProps={{
          sx: { overflow: 'visible', mt: { xs: 5, sm: 12 }, mx: 2 }
        }}
        sx={{ '& .MuiDialog-container': { alignItems: 'flex-start' } }}
      >
        <DialogTitle
          id="global-search-title"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 17,
            fontWeight: 650
          }}
        >
          {t('frontend.searchTitle')}
          <IconButton
            onClick={() => setSearchOpen(false)}
            aria-label={t('frontend.closeSearch')}
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pb: 3, overflow: 'visible' }}>
          <ToolSearch autoFocus onSelect={() => setSearchOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
