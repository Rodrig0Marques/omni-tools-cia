import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import { useContext } from 'react';
import InputHeader from '../InputHeader';
import greyPattern from '@assets/grey-pattern.png';
import { globalInputHeight } from '../../config/uiConfig';
import ResultFooter from './ResultFooter';
import { CustomSnackBarContext } from '../../contexts/CustomSnackBarContext';
import { useTranslation } from 'react-i18next';
import useObjectUrl from '../../hooks/useObjectUrl';
import { downloadBlob } from '@utils/download';

export default function ToolFileResult({
  title = 'Result',
  value,
  extension,
  onClear,
  loading,
  loadingText
}: {
  title?: string;
  value: File | null;
  extension?: string;
  onClear?: () => void;
  loading?: boolean;
  loadingText?: string;
}) {
  const { t } = useTranslation();
  const preview = useObjectUrl(value);
  const { showSnackBar } = useContext(CustomSnackBarContext);
  const theme = useTheme();

  const handleCopy = async () => {
    if (value) {
      try {
        const clipboardItem = new ClipboardItem({ [value.type]: value });
        await navigator.clipboard.write([clipboardItem]);
        showSnackBar(t('toolFileResult.copied'), 'success');
      } catch (err) {
        showSnackBar(t('toolFileResult.copyFailed', { error: err }), 'error');
      }
    }
  };

  const handleDownload = () => {
    if (value) {
      let filename: string = value.name;
      if (extension) {
        // Split at the last period to separate filename and extension
        const parts = filename.split('.');
        // If there's more than one part (meaning there was a period)
        if (parts.length > 1) {
          // Remove the last part (the extension) and add the new extension
          parts.pop();
          filename = `${parts.join('.')}.${extension}`;
        } else {
          // No extension exists, just add it
          filename = `${filename}.${extension}`;
        }
      }
      downloadBlob(value, filename);
    }
  };

  type SupportedFileType = 'image' | 'video' | 'audio' | 'pdf' | 'unknown';
  // Determine the file type based on MIME type
  const getFileType = (): SupportedFileType => {
    if (!value) return 'unknown';
    if (value.type.startsWith('image/')) return 'image';
    if (value.type.startsWith('video/')) return 'video';
    if (value.type.startsWith('audio/')) return 'audio';
    if (value.type.startsWith('application/pdf')) return 'pdf';
    return 'unknown';
  };

  const fileType = getFileType();

  return (
    <Box>
      <InputHeader title={title || t('toolFileResult.result')} />
      <Box
        sx={{
          width: '100%',
          height: globalInputHeight,
          border: preview ? 0 : 1,
          borderRadius: 2,
          boxShadow: '5',
          bgcolor: 'background.paper'
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%'
            }}
          >
            <CircularProgress />
            <Typography variant="body2" sx={{ mt: 2 }}>
              {loadingText || t('toolFileResult.loading')}
            </Typography>
          </Box>
        ) : (
          preview && (
            <Box
              width={'100%'}
              height={'100%'}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage:
                  theme.palette.mode === 'dark' ? null : `url(${greyPattern})`
              }}
            >
              {fileType === 'image' && (
                <img
                  src={preview}
                  alt="Result"
                  decoding="async"
                  style={{ maxWidth: '100%', maxHeight: globalInputHeight }}
                />
              )}
              {fileType === 'video' && (
                <video
                  src={preview}
                  controls
                  style={{ maxWidth: '100%', maxHeight: globalInputHeight }}
                />
              )}
              {fileType === 'audio' && (
                <audio
                  src={preview}
                  controls
                  style={{ width: '100%', maxWidth: '500px' }}
                />
              )}
              {fileType === 'pdf' && (
                <iframe
                  title={title || t('toolFileResult.result')}
                  src={preview}
                  width="100%"
                  height="100%"
                  style={{ maxWidth: '500px' }}
                />
              )}
              {fileType === 'unknown' && (
                <Box sx={{ padding: 2, textAlign: 'center' }}>
                  File processed successfully. Click download to save the
                  result.
                </Box>
              )}
            </Box>
          )
        )}
      </Box>
      <ResultFooter
        disabled={!value || loading}
        handleClear={onClear}
        handleCopy={handleCopy}
        handleDownload={handleDownload}
        hideCopy={
          fileType === 'video' || fileType === 'audio' || fileType === 'pdf'
        }
      />
    </Box>
  );
}
