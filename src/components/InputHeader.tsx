import Typography from '@mui/material/Typography';

export default function InputHeader({ title }: { title: string }) {
  return (
    <Typography
      component="h2"
      mb={1.5}
      fontSize={16}
      fontWeight={650}
      color="text.primary"
    >
      {title}
    </Typography>
  );
}
