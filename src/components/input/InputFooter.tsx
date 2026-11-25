import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import PublishIcon from '@mui/icons-material/Publish';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import ClearIcon from '@mui/icons-material/Clear';
import { useTranslation } from 'react-i18next';

export default function InputFooter({
  handleImport,
  handleCopy,
  handleClear
}: {
  handleImport: () => void;
  handleCopy?: () => void;
  handleClear?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Stack mt={2} direction={'row'} spacing={1} useFlexGap flexWrap="wrap">
      <Button
        size="small"
        variant="outlined"
        onClick={handleImport}
        startIcon={<PublishIcon />}
      >
        {t('inputFooter.importFromFile')}
      </Button>
      {handleCopy && (
        <Button
          size="small"
          onClick={handleCopy}
          startIcon={<ContentPasteIcon />}
        >
          {t('inputFooter.copyToClipboard')}
        </Button>
      )}
      {handleClear && (
        <Button size="small" onClick={handleClear} startIcon={<ClearIcon />}>
          {t('inputFooter.clear')}
        </Button>
      )}
    </Stack>
  );
}
