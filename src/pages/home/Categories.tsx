import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getToolsByCategory } from '@tools/index';
import { useUserTypeFilter } from '../../providers/UserTypeFilterProvider';
import CategoryIcon from '../../components/CategoryIcon';

export default function Categories() {
  const { selectedUserTypes } = useUserTypeFilter();
  const { t } = useTranslation();
  const categories = getToolsByCategory(selectedUserTypes, t);

  return (
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
      {categories.map((category) => (
        <Card
          key={category.type}
          component="article"
          sx={{
            borderRadius: 2.5,
            transition: 'transform 180ms, box-shadow 180ms, border-color 180ms',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 10px 28px #11182709',
              borderColor: 'text.disabled'
            }
          }}
        >
          <CardActionArea
            component={Link}
            to={'/categories/' + category.type}
            sx={{ height: '100%' }}
          >
            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2.25}
              >
                <CategoryIcon category={category.type} size={46} />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    bgcolor: 'action.hover',
                    px: 1.1,
                    py: 0.4,
                    borderRadius: 1
                  }}
                >
                  {t('frontend.toolCount', { count: category.tools.length })}
                </Typography>
              </Stack>
              <Typography
                component="h3"
                fontSize={18}
                fontWeight={650}
                mb={0.75}
              >
                {category.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  minHeight: 46
                }}
              >
                {category.description}
              </Typography>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mt={2.75}
              >
                <Typography fontSize={12} fontWeight={650}>
                  {t('frontend.explore')}
                </Typography>
                <ArrowForwardIcon
                  sx={{ fontSize: 17, color: 'text.secondary' }}
                />
              </Stack>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
}
