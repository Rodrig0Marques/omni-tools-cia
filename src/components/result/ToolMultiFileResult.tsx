import {
  Box,
  CircularProgress,
  Typography,
  useTheme,
  Button
} from '@mui/material';
import InputHeader from '../InputHeader';
import greyPattern from '@assets/grey-pattern.png';
import { globalInputHeight } from '../../config/uiConfig';
import ResultFooter from './ResultFooter';
import { useTranslation } from 'react-i18next';
import useObjectUrl from '../../hooks/useObjectUrl';
import { downloadBlob } from '@utils/download';

function FilePreview({ file, disabled }: { file: File; disabled?: boolean }) {
  const preview = useObjectUrl(file);
  const theme = useTheme();
  const { t } = useTranslation();
  const fileType = file.type.split('/')[0];

  return (
    <Box
      sx={{
        backgroundImage:
          fileType === 'image' && theme.palette.mode !== 'dark'
            ? `url(${greyPattern})`
            : 'none',
        p: 1,
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '100%'
      }}
    >
      {preview && fileType === 'image' ? (
        <img
          src={preview}
          alt={file.name}
          decoding="async"
          loading="lazy"
          style={{ maxWidth: '100%', maxHeight: 300 }}
        />
      ) : preview && fileType === 'video' ? (
        <video
          src={preview}
          controls
          preload="metadata"
          style={{ maxWidth: '100%' }}
        />
      ) : preview && fileType === 'audio' ? (
        <audio
          src={preview}
          controls
          preload="metadata"
          style={{ width: '100%' }}
        />
      ) : preview && file.type === 'application/pdf' ? (
        <iframe title={file.name} src={preview} width="100%" height="400px" />
      ) : (
        <Typography sx={{ overflowWrap: 'anywhere' }}>{file.name}</Typography>
      )}
      <Button
        onClick={() => downloadBlob(file, file.name)}
        disabled={disabled}
        size="small"
        sx={{ mt: 1, overflowWrap: 'anywhere' }}
        variant="contained"
      >
        {t('resultFooter.download')} {file.name}
      </Button>
    </Box>
  );
}

export default function ToolMultiFileResult({
  title = 'Result',
  value,
  zipFile,
  onClear,
  loading,
  loadingText
}: {
  title?: string;
  value: File[];
  zipFile?: File | null;
  onClear?: () => void;
  loading?: boolean;
  loadingText?: string;
}) {
  const { t } = useTranslation();

  return (
    <Box>
      <InputHeader title={title || t('toolMultiFileResult.result')} />
      <Box
        sx={{
          width: '100%',
          height: globalInputHeight,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          border: 1,
          borderRadius: 2,
          boxShadow: '5',
          bgcolor: 'background.paper',
          alignItems: 'center',
          p: 2
        }}
      >
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
              {loadingText || t('toolMultiFileResult.loading')}
            </Typography>
          </Box>
        ) : (
          value.length > 0 &&
          value.map((file, idx) => (
            <FilePreview
              key={`${file.name}-${idx}`}
              file={file}
              disabled={loading}
            />
          ))
        )}
      </Box>
      <ResultFooter
        downloadLabel={t('resultFooter.downloadAll')}
        hideCopy
        disabled={!zipFile || loading}
        handleClear={onClear}
        clearDisabled={!!loading || (!value.length && !zipFile)}
        handleDownload={() => zipFile && downloadBlob(zipFile, zipFile.name)}
      />
    </Box>
  );
}
