import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import ClearIcon from '@mui/icons-material/Clear';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function ResultFooter({
  handleDownload,
  handleCopy,
  handleClear,
  disabled,
  clearDisabled = disabled,
  hideCopy,
  downloadLabel
}: {
  handleDownload: () => void;
  handleCopy?: () => void;
  handleClear?: () => void;
  disabled?: boolean;
  clearDisabled?: boolean;
  hideCopy?: boolean;
  downloadLabel?: string;
}) {
  const { t } = useTranslation();
  return (
    <Stack mt={2} direction={'row'} spacing={1} useFlexGap flexWrap="wrap">
      <Button
        size="small"
        variant="contained"
        disabled={disabled}
        onClick={handleDownload}
        startIcon={<DownloadIcon />}
      >
        {downloadLabel || t('resultFooter.download')}
      </Button>
      {!hideCopy && (
        <Button
          size="small"
          variant="outlined"
          disabled={disabled}
          onClick={handleCopy}
          startIcon={<ContentPasteIcon />}
        >
          {t('resultFooter.copy')}
        </Button>
      )}
      {handleClear && (
        <Button
          size="small"
          disabled={clearDisabled}
          onClick={handleClear}
          startIcon={<ClearIcon />}
          sx={{ ml: { sm: 'auto' } }}
        >
          {t('resultFooter.clear')}
        </Button>
      )}
    </Stack>
  );
}
