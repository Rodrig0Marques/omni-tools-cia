import { Box, CircularProgress, TextField, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { CustomSnackBarContext } from '../../contexts/CustomSnackBarContext';
import InputHeader from '../InputHeader';
import ResultFooter from './ResultFooter';
import { replaceSpecialCharacters } from '@utils/string';
import mime from 'mime';
import { globalInputHeight } from '../../config/uiConfig';
import { useTranslation } from 'react-i18next';
import { downloadBlob } from '@utils/download';

export default function ToolTextResult({
  title = 'Result',
  value,
  extension = 'txt',
  keepSpecialCharacters,
  onClear,
  loading
}: {
  title?: string;
  value: string;
  extension?: string;
  keepSpecialCharacters?: boolean;
  onClear?: () => void;
  loading?: boolean;
}) {
  const { t } = useTranslation();
  const { showSnackBar } = useContext(CustomSnackBarContext);
  const handleCopy = () => {
    navigator.clipboard
      .writeText(value)
      .then(() => showSnackBar(t('toolTextResult.copied'), 'success'))
      .catch((err) => {
        showSnackBar(t('toolTextResult.copyFailed', { error: err }), 'error');
      });
  };
  const handleDownload = () => {
    const filename = `output-omni-tools.${extension}`;

    const mimeType = mime.getType(extension) || 'text/plain';

    const blob = new Blob([value], {
      type: mimeType
    });
    downloadBlob(blob, filename);
  };
  return (
    <Box>
      <InputHeader title={title || t('toolTextResult.result')} />
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: globalInputHeight
          }}
        >
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 2 }}>
            {t('toolTextResult.loading')}
          </Typography>
        </Box>
      ) : (
        <TextField
          value={
            keepSpecialCharacters ? value : replaceSpecialCharacters(value)
          }
          fullWidth
          multiline
          sx={{
            '&.MuiTextField-root': {
              backgroundColor: 'background.paper'
            }
          }}
          rows={10}
          inputProps={{ 'data-testid': 'text-result', readOnly: true }}
        />
      )}
      <ResultFooter
        handleCopy={handleCopy}
        handleDownload={handleDownload}
        handleClear={onClear}
        disabled={!value || loading}
      />
    </Box>
  );
}
