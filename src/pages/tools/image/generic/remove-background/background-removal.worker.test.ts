import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import type { RemovalRequest, RemovalResponse } from './types';

const removeBackground = vi.hoisted(() => vi.fn());
vi.mock('@imgly/background-removal', () => ({ removeBackground }));
const worker = {
  postMessage: vi.fn<[RemovalResponse], void>(),
  onmessage: null as
    | ((event: MessageEvent<RemovalRequest>) => Promise<void>)
    | null
};

beforeEach(async () => {
  vi.resetModules();
  removeBackground.mockReset();
  worker.postMessage.mockClear();
  vi.stubGlobal('self', worker);
  await import('./background-removal.worker');
});
afterEach(() => {
  vi.unstubAllGlobals();
});

it('reports progress for the current image when the model reuses its cached callback', async () => {
  let cachedProgress:
    | ((key: string, current: number, total: number) => void)
    | undefined;
  const blob = new Blob(['result'], { type: 'image/png' });
  removeBackground.mockImplementation(async (_file, config) => {
    cachedProgress ??= config.progress;
    cachedProgress?.('compute:inference', 1, 4);
    return blob;
  });
  const file = new File(['image'], 'image.png');
  await worker.onmessage?.({
    data: { id: 1, file }
  } as MessageEvent<RemovalRequest>);
  worker.postMessage.mockClear();
  await worker.onmessage?.({
    data: { id: 2, file }
  } as MessageEvent<RemovalRequest>);
  expect(worker.postMessage).toHaveBeenCalledWith({
    id: 2,
    type: 'progress',
    progress: { key: 'compute:inference', current: 1, total: 4 }
  });
  expect(worker.postMessage).toHaveBeenLastCalledWith({
    id: 2,
    type: 'complete',
    blob
  });
});

it('returns model failures to the interface', async () => {
  removeBackground.mockRejectedValue(new Error('Cannot load model'));
  await worker.onmessage?.({
    data: { id: 3, file: new File([], 'image.png') }
  } as MessageEvent<RemovalRequest>);
  expect(worker.postMessage).toHaveBeenCalledWith({
    id: 3,
    type: 'error',
    error: 'Cannot load model'
  });
});
