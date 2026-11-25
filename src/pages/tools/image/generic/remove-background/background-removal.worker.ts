import { removeBackground } from '@imgly/background-removal';
import type { RemovalRequest, RemovalResponse } from './types';

const respond = (response: RemovalResponse) => self.postMessage(response);
let activeId = 0;

// The library caches its configuration with the loaded inference session.
const progress = (key: string, current: number, total: number) => {
  respond({
    id: activeId,
    type: 'progress',
    progress: { key, current, total }
  });
};

self.onmessage = async ({ data }: MessageEvent<RemovalRequest>) => {
  const { id, file } = data;
  activeId = id;
  try {
    const blob = await removeBackground(file, {
      device: 'cpu',
      proxyToWorker: false,
      progress
    });
    respond({ id, type: 'complete', blob });
  } catch (error) {
    respond({
      id,
      type: 'error',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};
