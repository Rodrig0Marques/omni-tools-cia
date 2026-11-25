import { Breadcrumbs, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  title: string;
  link?: string;
}

export default function ToolBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <Breadcrumbs
      separator={
        <NavigateNextIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
      }
      sx={{
        fontSize: 12,
        '& a:hover': { color: 'text.primary', textDecoration: 'underline' }
      }}
    >
      {items.map((item, index) =>
        index === items.length - 1 || !item.link ? (
          <Typography
            fontSize={12}
            color="text.secondary"
            key={item.title}
            aria-current="page"
          >
            {item.title}
          </Typography>
        ) : (
          <Link to={item.link} key={item.title}>
            {item.title}
          </Link>
        )
      )}
    </Breadcrumbs>
  );
}
