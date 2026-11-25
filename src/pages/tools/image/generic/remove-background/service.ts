import type { RemovalProgress, RemovalRequest, RemovalResponse } from './types';

/** Retain the loaded model between images and terminate it on cancel/unmount. */
export function createBackgroundRemovalProcessor() {
  let worker: Worker | null = null;
  let nextId = 0;
  let pending: {
    id: number;
    resolve: (blob: Blob) => void;
    reject: (error: Error) => void;
    onProgress: (progress: RemovalProgress) => void;
  } | null = null;

  const dispose = () => {
    worker?.terminate();
    worker = null;
    const job = pending;
    pending = null;
    job?.reject(new DOMException('Processing cancelled', 'AbortError'));
  };

  const process = (
    file: File,
    onProgress: (progress: RemovalProgress) => void
  ): Promise<Blob> => {
    if (pending) dispose();
    return new Promise((resolve, reject) => {
      try {
        if (!worker) {
          worker = new Worker(
            new URL('./background-removal.worker.ts', import.meta.url),
            { type: 'module' }
          );
          const currentWorker = worker;
          worker.onmessage = ({ data }: MessageEvent<RemovalResponse>) => {
            if (!pending || data.id !== pending.id) return;
            if (data.type === 'progress') {
              pending.onProgress(data.progress);
            } else {
              const job = pending;
              pending = null;
              if (data.type === 'complete') job.resolve(data.blob);
              else {
                job.reject(new Error(data.error));
                dispose();
              }
            }
          };
          worker.onerror = (event) => {
            if (worker !== currentWorker) return;
            const job = pending;
            pending = null;
            job?.reject(
              new Error(event.message || 'Background removal failed')
            );
            dispose();
          };
        }
        const id = ++nextId;
        pending = { id, resolve, reject, onProgress };
        worker.postMessage({ id, file } satisfies RemovalRequest);
      } catch (error) {
        pending = null;
        dispose();
        reject(error);
      }
    });
  };

  return { process, dispose };
}
