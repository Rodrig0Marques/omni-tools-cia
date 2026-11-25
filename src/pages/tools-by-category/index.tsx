import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';
import { Link, Navigate, useParams } from 'react-router-dom';
import { filterTools, getToolsByCategory } from '../../tools';
import { Helmet } from 'react-helmet';
import UserTypeFilter from '@components/UserTypeFilter';
import CategoryIcon from '@components/CategoryIcon';
import ToolCard from '@components/allTools/ToolCard';
import { useTranslation } from 'react-i18next';
import { validNamespaces } from '../../i18n';
import { useUserTypeFilter } from '../../providers/UserTypeFilterProvider';

export default function ToolsByCategory() {
  const { categoryName } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const { selectedUserTypes, setSelectedUserTypes } = useUserTypeFilter();
  const { t } = useTranslation(validNamespaces);
  const category = getToolsByCategory([], t).find(
    ({ type }) => type === categoryName
  );
  if (!category) return <Navigate to="/404" replace />;
  const categoryTools = filterTools(
    category.tools,
    searchTerm,
    selectedUserTypes,
    t
  );

  return (
    <Container
      component="main"
      maxWidth={false}
      sx={{
        maxWidth: 1280,
        px: { xs: 2, sm: 3 },
        py: { xs: 3, sm: 5 },
        minHeight: 'calc(100vh - 80px)'
      }}
    >
      <Helmet title={category.rawTitle + ' — ConquestHub'} />
      <Button
        component={Link}
        to="/#categories"
        startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
        sx={{ color: 'text.secondary', px: 0, mb: 3, fontSize: 12 }}
      >
        {t('translation:frontend.backHome')}
      </Button>
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <CategoryIcon category={category.type} size={60} />
        <Box>
          <Typography
            component="h1"
            variant="h1"
            sx={{ fontSize: { xs: 30, sm: 40 }, mb: 0.5 }}
          >
            {category.rawTitle}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t('translation:frontend.toolCount', {
              count: category.tools.length
            })}
          </Typography>
        </Box>
      </Stack>
      <Typography
        color="text.secondary"
        sx={{ maxWidth: 760, fontSize: 15, mb: 4 }}
      >
        {category.description}
      </Typography>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        spacing={2}
        alignItems={{ md: 'center' }}
        sx={{
          py: 2.5,
          mb: 3,
          borderTop: 1,
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        <UserTypeFilter
          selectedUserTypes={selectedUserTypes}
          onUserTypesChange={setSelectedUserTypes}
        />
        <TextField
          size="small"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder={t('translation:frontend.searchCategory')}
          inputProps={{
            'aria-label': t('translation:frontend.searchCategory')
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon fontSize="small" />
              </InputAdornment>
            )
          }}
          sx={{ width: { xs: '100%', md: 340 }, bgcolor: 'background.paper' }}
        />
      </Stack>
      {categoryTools.length ? (
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
          {categoryTools.map((tool) => (
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
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <SearchOffOutlinedIcon
            sx={{ fontSize: 42, color: 'text.disabled', mb: 2 }}
          />
          <Typography component="h2" fontWeight={650} mb={1}>
            {t('translation:frontend.noResults')}
          </Typography>
          <Typography color="text.secondary" variant="body2" mb={2}>
            {t('translation:frontend.noResultsDescription')}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => {
              setSearchTerm('');
              setSelectedUserTypes([]);
            }}
          >
            {t('translation:frontend.resetFilters')}
          </Button>
        </Box>
      )}
    </Container>
  );
}
