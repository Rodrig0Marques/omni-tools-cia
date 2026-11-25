import { Box, alpha } from '@mui/material';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import TextFieldsOutlinedIcon from '@mui/icons-material/TextFieldsOutlined';
import MovieOutlinedIcon from '@mui/icons-material/MovieOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import HeadphonesOutlinedIcon from '@mui/icons-material/HeadphonesOutlined';
import DataObjectOutlinedIcon from '@mui/icons-material/DataObjectOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import GifBoxOutlinedIcon from '@mui/icons-material/GifBoxOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';

const categoryStyles: Record<
  string,
  { icon: typeof ImageOutlinedIcon; color: string }
> = {
  'image-generic': { icon: ImageOutlinedIcon, color: '#34856C' },
  pdf: { icon: PictureAsPdfOutlinedIcon, color: '#CF655B' },
  string: { icon: TextFieldsOutlinedIcon, color: '#8270C4' },
  video: { icon: MovieOutlinedIcon, color: '#BA8738' },
  time: { icon: ScheduleOutlinedIcon, color: '#5684CA' },
  audio: { icon: HeadphonesOutlinedIcon, color: '#B76C9E' },
  json: { icon: DataObjectOutlinedIcon, color: '#4E91AA' },
  list: { icon: FormatListBulletedOutlinedIcon, color: '#788F54' },
  csv: { icon: TableChartOutlinedIcon, color: '#388F81' },
  number: { icon: CalculateOutlinedIcon, color: '#8B75BA' },
  png: { icon: ImageOutlinedIcon, color: '#34856C' },
  xml: { icon: CodeOutlinedIcon, color: '#5E86B0' },
  gif: { icon: GifBoxOutlinedIcon, color: '#B76C9E' },
  converters: { icon: SwapHorizOutlinedIcon, color: '#5684CA' }
};

export default function CategoryIcon({
  category,
  size = 44
}: {
  category: string;
  size?: number;
}) {
  const { icon: Icon, color } =
    categoryStyles[category] ?? categoryStyles.converters;
  return (
    <Box
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: '28%',
        display: 'grid',
        placeItems: 'center',
        color,
        backgroundColor: alpha(color, 0.11)
      }}
    >
      <Icon sx={{ fontSize: size * 0.52 }} />
    </Box>
  );
}
