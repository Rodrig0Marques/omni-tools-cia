import { useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Hero from 'components/Hero';
import Categories from './Categories';
import { Helmet } from 'react-helmet';
import { useUserTypeFilter } from 'providers/UserTypeFilterProvider';
import UserTypeFilter from '@components/UserTypeFilter';
import ToolCard from '@components/allTools/ToolCard';
import { filterToolsByUserTypes, tools } from '@tools/index';
import { getBookmarkedToolPaths } from '@utils/bookmark';
import { validNamespaces } from '../../i18n';

export default function Home() {
  const { t } = useTranslation(validNamespaces);
  const { selectedUserTypes, setSelectedUserTypes } = useUserTypeFilter();
  const { hash } = useLocation();
  const navigate = useNavigate();
  const activeTab = hash === '#favorites' ? 'favorites' : 'categories';
  const bookmarkedPaths = getBookmarkedToolPaths();
  const favoriteTools = filterToolsByUserTypes(
    tools.filter((tool) => bookmarkedPaths.includes(tool.path)),
    selectedUserTypes
  );

  useEffect(() => {
    if (hash === '#favorites' || hash === '#categories') {
      const frame = requestAnimationFrame(
        () =>
          document
            .getElementById('tool-catalog')
            ?.scrollIntoView({ behavior: 'smooth' })
      );
      return () => cancelAnimationFrame(frame);
    }
  }, [hash]);

  return (
    <Container
      component="main"
      maxWidth={false}
      sx={{ maxWidth: 1280, px: { xs: 2, sm: 3 }, pb: 3 }}
    >
      <Helmet title={'ConquestHub — ' + t('translation:frontend.allTools')} />
      <Hero />
      <Box
        component="section"
        id="tool-catalog"
        sx={{ scrollMarginTop: 105, pb: 6 }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ sm: 'flex-end' }}
          spacing={2}
          mb={3}
        >
          <Box>
            <Typography
              component="h2"
              variant="h2"
              sx={{ fontSize: { xs: 25, md: 30 }, mb: 0.75 }}
            >
              {t('translation:frontend.catalogTitle')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('translation:frontend.catalogDescription')}
            </Typography>
          </Box>
          <UserTypeFilter
            selectedUserTypes={selectedUserTypes}
            onUserTypesChange={setSelectedUserTypes}
          />
        </Stack>
        <Tabs
          value={activeTab}
          onChange={(_event, value: string) =>
            navigate('/#' + value, { replace: true })
          }
          aria-label={t('translation:frontend.catalogTitle')}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            mb: 3,
            minHeight: 46,
            '& .MuiTab-root': {
              minHeight: 46,
              px: 0,
              mr: 3,
              textTransform: 'none',
              fontSize: 13,
              fontWeight: 600
            }
          }}
        >
          <Tab
            id="categories-tab"
            aria-controls="categories-panel"
            value="categories"
            icon={<GridViewOutlinedIcon sx={{ fontSize: 17 }} />}
            iconPosition="start"
            label={t('translation:frontend.categories')}
          />
          <Tab
            id="favorites-tab"
            aria-controls="favorites-panel"
            value="favorites"
            icon={<BookmarkBorderOutlinedIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label={
              t('translation:frontend.favorites') +
              (bookmarkedPaths.length
                ? ' (' + bookmarkedPaths.length + ')'
                : '')
            }
          />
        </Tabs>
        <Box
          role="tabpanel"
          id="categories-panel"
          aria-labelledby="categories-tab"
          hidden={activeTab !== 'categories'}
        >
          {activeTab === 'categories' && <Categories />}
        </Box>
        <Box
          role="tabpanel"
          id="favorites-panel"
          aria-labelledby="favorites-tab"
          hidden={activeTab !== 'favorites'}
        >
          {activeTab === 'favorites' &&
            (favoriteTools.length ? (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    lg: 'repeat(3, 1fr)'
                  },
                  gap: 2.5
                }}
              >
                {favoriteTools.map((tool) => (
                  <ToolCard
                    key={tool.path}
                    title={t(tool.name)}
                    description={t(tool.shortDescription)}
                    link={'/' + tool.path}
                    icon={tool.icon}
                    category={tool.type}
                  />
                ))}
              </Box>
            ) : (
              <Box
                sx={{
                  p: { xs: 4, sm: 7 },
                  bgcolor: 'background.paper',
                  border: '1px dashed',
                  borderColor: 'divider',
                  borderRadius: 3,
                  textAlign: 'center'
                }}
              >
                <BookmarkBorderOutlinedIcon
                  sx={{ fontSize: 36, color: 'text.disabled', mb: 1.5 }}
                />
                <Typography component="h3" fontWeight={650} mb={1}>
                  {t('translation:frontend.noFavorites')}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ maxWidth: 420, mx: 'auto', mb: 2.5 }}
                >
                  {t('translation:frontend.noFavoritesDescription')}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setSelectedUserTypes([]);
                    navigate('/#categories', { replace: true });
                  }}
                >
                  {t('translation:frontend.exploreCategories')}
                </Button>
              </Box>
            ))}
        </Box>
      </Box>
      <Divider />
      <Stack
        component="footer"
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        spacing={1}
        sx={{ py: 3, color: 'text.secondary' }}
      >
        <Typography fontSize={12} fontWeight={600}>
          ConquestHub
        </Typography>
        <Typography fontSize={12}>
          {t('translation:frontend.footer')}
        </Typography>
      </Stack>
    </Container>
  );
}
