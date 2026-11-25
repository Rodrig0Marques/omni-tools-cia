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
import { Icon } from '@iconify/react';
import type { IconifyIcon } from '@iconify/react';
import CategoryIcon from '../CategoryIcon';

interface ToolCardProps {
  title: string;
  description: string;
  link: string;
  icon: IconifyIcon | string;
  category?: string;
}

export default function ToolCard({
  title,
  description,
  link,
  icon,
  category
}: ToolCardProps) {
  return (
    <Card
      component="article"
      sx={{
        height: '100%',
        borderRadius: 2.5,
        transition: 'transform 180ms, border-color 180ms',
        '&:hover': {
          transform: 'translateY(-2px)',
          borderColor: 'text.disabled'
        }
      }}
    >
      <CardActionArea component={Link} to={link} sx={{ height: '100%' }}>
        <CardContent
          sx={{ p: 2.5, height: '100%', '&:last-child': { pb: 2.5 } }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            {category ? (
              <CategoryIcon category={category} />
            ) : (
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: 1.5,
                  bgcolor: 'action.hover'
                }}
              >
                <Icon icon={icon} fontSize={24} />
              </Box>
            )}
            <ArrowForwardIcon sx={{ fontSize: 17, color: 'text.disabled' }} />
          </Stack>
          <Typography component="h3" fontWeight={650} fontSize={16} mb={0.75}>
            {title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
