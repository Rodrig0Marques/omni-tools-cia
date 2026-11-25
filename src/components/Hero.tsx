import { Box, Card, Chip, Divider, Stack, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { tools } from '@tools/index';
import type { DefinedTool } from '@tools/defineTool';
import { validNamespaces } from '../i18n';
import ToolSearch from './ToolSearch';
import CategoryIcon from './CategoryIcon';

const featuredTools = ['pdf/merge-pdf', 'image-generic/resize', 'json/prettify']
  .map((path) => tools.find((tool) => tool.path === path))
  .filter((tool): tool is DefinedTool => Boolean(tool));

export default function Hero() {
  const { t } = useTranslation(validNamespaces);
  return (
    <Box
      component="section"
      aria-labelledby="home-heading"
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1.4fr 1fr' },
        alignItems: 'center',
        gap: { xs: 3, md: 9 },
        py: { xs: 4, md: 8 }
      }}
    >
      <Box>
        <Stack
          direction="row"
          spacing={1.5}
          useFlexGap
          alignItems="center"
          sx={{ mb: 2.5, flexWrap: 'wrap', rowGap: 1 }}
        >
          <Box
            sx={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              bgcolor: '#C7A333'
            }}
          />
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'text.secondary'
            }}
          >
            {t('translation:frontend.heroEyebrow')}
          </Typography>
          <Chip
            label={t('translation:frontend.toolCount', { count: tools.length })}
            size="small"
            sx={{
              height: 24,
              fontSize: 11,
              bgcolor: 'background.paper',
              border: 1,
              borderColor: 'divider',
              display: { xs: 'none', sm: 'inline-flex' }
            }}
          />
        </Stack>
        <Typography
          component="h1"
          variant="h1"
          id="home-heading"
          sx={{ fontSize: { xs: 39, sm: 52, lg: 62 }, mb: 2.5 }}
        >
          {t('translation:frontend.heroTitle')}
          <br />
          <Box
            component="span"
            sx={{
              position: 'relative',
              whiteSpace: 'nowrap',
              backgroundImage:
                'linear-gradient(transparent 80%, #EFCB5845 80%)',
              pb: 0.25
            }}
          >
            {t('translation:frontend.heroAccent')}
          </Box>
        </Typography>
        <Typography
          color="text.secondary"
          sx={{ maxWidth: 550, fontSize: { xs: 15, md: 16 }, mb: 3.5 }}
        >
          {t('translation:frontend.heroDescription')}
        </Typography>
        <Box sx={{ maxWidth: 600 }}>
          <ToolSearch />
        </Box>
        <Stack
          direction="row"
          spacing={2.5}
          mt={1.75}
          sx={{ color: 'text.secondary', flexWrap: 'wrap', rowGap: 1 }}
        >
          <Stack direction="row" spacing={0.75} alignItems="center">
            <CheckCircleOutlineIcon sx={{ fontSize: 15, color: '#34856C' }} />
            <Typography variant="caption">
              {t('translation:frontend.noInstallation')}
            </Typography>
          </Stack>
          <Typography
            variant="caption"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            {t('translation:frontend.shortcutHint')}
          </Typography>
        </Stack>
      </Box>
      <Card
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          boxShadow: '0 8px 32px #11182704'
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={0.75}
        >
          <Typography fontSize={16} fontWeight={700}>
            {t('translation:frontend.quickAccess')}
          </Typography>
          <Box
            sx={{
              bgcolor: '#F2CC6025',
              borderRadius: 1.5,
              p: 0.75,
              color: 'secondary.main',
              display: 'flex'
            }}
          >
            <BoltOutlinedIcon fontSize="small" />
          </Box>
        </Stack>
        <Typography variant="body2" color="text.secondary" mb={2}>
          {t('translation:frontend.featuredLabel')}
        </Typography>
        <Stack spacing={0.75}>
          {featuredTools.map((tool) => (
            <Box
              key={tool.path}
              component={Link}
              to={'/' + tool.path}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 1.25,
                borderRadius: 2,
                transition: 'background-color 160ms',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <CategoryIcon category={tool.type} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography fontSize={14} fontWeight={650}>
                  {t(tool.name)}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                  component="p"
                >
                  {t(tool.shortDescription)}
                </Typography>
              </Box>
              <ArrowForwardIcon
                sx={{ fontSize: 16, color: 'text.secondary' }}
              />
            </Box>
          ))}
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Box
          component={Link}
          to="/#categories"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 12,
            fontWeight: 650,
            color: 'text.secondary',
            '&:hover': { color: 'text.primary' }
          }}
        >
          {t('translation:frontend.exploreCategories')}
          <ArrowForwardIcon sx={{ fontSize: 15 }} />
        </Box>
      </Card>
    </Box>
  );
}
