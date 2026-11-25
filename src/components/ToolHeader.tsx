import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { getToolsByCategory } from '@tools/index';
import { isBookmarked, toggleBookmarked } from '@utils/bookmark';
import { useTranslation } from 'react-i18next';
import ToolBreadcrumb from './ToolBreadcrumb';
import CategoryIcon from './CategoryIcon';

interface ToolHeaderProps {
  title: string;
  description: string;
  type: string;
  path: string;
}

export default function ToolHeader({
  title,
  description,
  type,
  path
}: ToolHeaderProps) {
  const { t } = useTranslation();
  const [bookmarked, setBookmarked] = useState(() => isBookmarked(path));
  const [examplesVisible, setExamplesVisible] = useState(false);
  const category = getToolsByCategory([], t).find((item) => item.type === type);
  const bookmarkLabel = t(
    bookmarked ? 'frontend.favoriteRemove' : 'frontend.favoriteAdd'
  );
  useEffect(() => {
    setExamplesVisible(Boolean(document.getElementById('examples')));
  }, []);

  return (
    <Box sx={{ mb: 3.5 }}>
      <ToolBreadcrumb
        items={[
          { title: t('frontend.allTools'), link: '/#categories' },
          { title: category?.rawTitle ?? type, link: '/categories/' + type },
          { title }
        ]}
      />
      <Stack
        direction="row"
        alignItems="flex-start"
        spacing={{ xs: 1.5, sm: 2 }}
        useFlexGap
        mt={3}
      >
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <CategoryIcon category={type} size={56} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1} alignItems="flex-start">
            <Typography
              component="h1"
              variant="h1"
              sx={{ fontSize: { xs: 28, sm: 36 }, flex: 1 }}
            >
              {title}
            </Typography>
            <Tooltip title={bookmarkLabel}>
              <IconButton
                aria-label={bookmarkLabel}
                aria-pressed={bookmarked}
                onClick={() => {
                  toggleBookmarked(path);
                  setBookmarked(!bookmarked);
                }}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                  flexShrink: 0,
                  bgcolor: 'background.paper'
                }}
              >
                {bookmarked ? (
                  <BookmarkOutlinedIcon fontSize="small" color="primary" />
                ) : (
                  <BookmarkBorderOutlinedIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          </Stack>
          <Typography
            color="text.secondary"
            sx={{ mt: 1.5, fontSize: 14, maxWidth: 900 }}
          >
            {description}
          </Typography>
          {examplesVisible && (
            <Button
              size="small"
              startIcon={<ArrowDownwardIcon sx={{ fontSize: 15 }} />}
              onClick={() =>
                document
                  .getElementById('examples')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              sx={{ mt: 1, px: 0, color: 'text.secondary', fontSize: 12 }}
            >
              {t('toolHeader.seeExamples')}
            </Button>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
