import type { ReactNode } from 'react';
import { Box, Grid } from '@mui/material';

export default function ToolInputAndResult({
  input,
  result
}: {
  input?: ReactNode;
  result?: ReactNode;
}) {
  if (!input && !result) return null;
  const panelStyle = {
    p: { xs: 2, sm: 2.5 },
    border: 1,
    borderColor: 'divider',
    borderRadius: 2.5,
    bgcolor: 'background.paper',
    height: '100%',
    minWidth: 0
  };
  return (
    <Grid id="tool" container spacing={2.5} sx={{ scrollMarginTop: 105 }}>
      {input && (
        <Grid item xs={12} md={result ? 6 : 12}>
          <Box sx={panelStyle}>{input}</Box>
        </Grid>
      )}
      {result && (
        <Grid item xs={12} md={input ? 6 : 12}>
          <Box sx={panelStyle}>{result}</Box>
        </Grid>
      )}
    </Grid>
  );
}
