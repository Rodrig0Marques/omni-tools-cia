import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <Box component="main" sx={{ p: 4, textAlign: 'center' }}>
      <Typography component="h1" variant="h2">
        404
      </Typography>
      <Button component={Link} to="/" variant="contained" sx={{ mt: 3 }}>
        {t('navbar.home')}
      </Button>
    </Box>
  );
}
