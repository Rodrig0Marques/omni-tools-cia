import { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import ToolFileResult from '@components/result/ToolFileResult';
import ToolContent from '@components/ToolContent';
import { ToolComponentProps } from '@tools/defineTool';
import ToolImageInput from '@components/input/ToolImageInput';
import { Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { createBackgroundRemovalProcessor } from './service';
import type { RemovalProgress } from './types';

const initialValues = {};

const validationSchema = Yup.object({});

export default function RemoveBackgroundFromImage({
  title
}: ToolComponentProps) {
  const [input, setInput] = useState<File | null>(null);
  const [result, setResult] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<RemovalProgress | null>(null);
  const [failed, setFailed] = useState(false);
  const processor = useRef<ReturnType<
    typeof createBackgroundRemovalProcessor
  > | null>(null);
  const { t } = useTranslation('image');

  useEffect(() => () => processor.current?.dispose(), []);

  useEffect(() => {
    let active = true;
    let running = true;
    setResult(null);
    setProgress(null);
    setFailed(false);
    setIsProcessing(!!input);
    if (!input) {
      processor.current?.dispose();
      return;
    }

    const run = async () => {
      try {
        let file = input;
        if (file.type === 'image/heic' || /\.heic$/i.test(file.name)) {
          const { default: heic2any } = await import('heic2any');
          const converted = await heic2any({ blob: file, toType: 'image/png' });
          const blob = Array.isArray(converted) ? converted[0] : converted;
          file = new File([blob], file.name.replace(/\.[^/.]+$/, '') + '.png', {
            type: 'image/png'
          });
        }
        if (!active) return;
        processor.current ??= createBackgroundRemovalProcessor();
        const blob = await processor.current.process(file, (value) => {
          if (active) setProgress(value);
        });
        if (active) {
          setResult(
            new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, '') + '-no-bg.png',
              {
                type: 'image/png'
              }
            )
          );
        }
      } catch (error) {
        if (
          active &&
          !(error instanceof DOMException && error.name === 'AbortError')
        ) {
          console.error('Error removing background:', error);
          setFailed(true);
        }
      } finally {
        running = false;
        if (active) setIsProcessing(false);
      }
    };
    void run();
    return () => {
      active = false;
      if (running) processor.current?.dispose();
    };
  }, [input]);

  const clearResult = () => {
    setResult(null);
    processor.current?.dispose();
  };

  const loadingText = progress?.key.startsWith('fetch:')
    ? t('removeBackground.downloading', {
        percent:
          progress.total > 0
            ? Math.round((progress.current / progress.total) * 100)
            : 0
      })
    : t('removeBackground.processing');

  return (
    <ToolContent
      title={title}
      initialValues={initialValues}
      getGroups={null}
      compute={() => {}}
      input={input}
      validationSchema={validationSchema}
      inputComponent={
        <ToolImageInput
          value={input}
          onChange={setInput}
          accept={['image/*']}
          title={t('removeBackground.inputTitle')}
        />
      }
      resultComponent={
        <>
          {failed && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {t('removeBackground.failed')}
            </Alert>
          )}
          <ToolFileResult
            title={t('removeBackground.resultTitle')}
            value={result}
            onClear={clearResult}
            extension={'png'}
            loading={isProcessing}
            loadingText={loadingText}
          />
        </>
      }
      toolInfo={{
        title: 'Remove Background from Image',
        description:
          'This tool uses AI to automatically remove the background from your images, creating a transparent PNG. Perfect for product photos, profile pictures, and design assets.'
      }}
    />
  );
}
