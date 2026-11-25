import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createBackgroundRemovalProcessor } from './service';

class MockWorker {
  static instances: MockWorker[] = [];
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  postMessage = vi.fn();
  terminate = vi.fn();
  constructor() {
    MockWorker.instances.push(this);
  }
  respond(data: unknown) {
    this.onmessage?.({ data } as MessageEvent);
  }
}

beforeEach(() => {
  MockWorker.instances = [];
  vi.stubGlobal('Worker', MockWorker);
});
afterEach(() => {
  vi.unstubAllGlobals();
});

describe('background removal worker lifecycle', () => {
  it('reports progress and reuses the worker for the next completed image', async () => {
    const processor = createBackgroundRemovalProcessor();
    const file = new File(['image'], 'image.png');
    const progress = vi.fn();
    const first = processor.process(file, progress);
    const worker = MockWorker.instances[0];
    expect(worker.postMessage).toHaveBeenCalledWith({ id: 1, file });
    const update = { key: 'compute:encode', current: 3, total: 4 };
    worker.respond({ id: 1, type: 'progress', progress: update });
    expect(progress).toHaveBeenCalledWith(update);
    const blob = new Blob(['result']);
    worker.respond({ id: 1, type: 'complete', blob });
    await expect(first).resolves.toBe(blob);
    const second = processor.process(file, progress);
    worker.respond({ id: 2, type: 'complete', blob });
    await expect(second).resolves.toBe(blob);
    expect(MockWorker.instances).toHaveLength(1);
    processor.dispose();
    expect(worker.terminate).toHaveBeenCalledOnce();
  });

  it('cancels the previous image and ignores its late result', async () => {
    const processor = createBackgroundRemovalProcessor();
    const file = new File(['image'], 'image.png');
    const first = processor.process(file, vi.fn());
    const rejected = expect(first).rejects.toMatchObject({
      name: 'AbortError'
    });
    const oldWorker = MockWorker.instances[0];
    const progress = vi.fn();
    const second = processor.process(file, progress);
    await rejected;
    expect(oldWorker.terminate).toHaveBeenCalledOnce();
    oldWorker.respond({ id: 1, type: 'complete', blob: new Blob(['old']) });
    oldWorker.respond({ id: 1, type: 'progress', progress: {} });
    expect(progress).not.toHaveBeenCalled();
    const blob = new Blob(['new']);
    MockWorker.instances[1].respond({ id: 2, type: 'complete', blob });
    await expect(second).resolves.toBe(blob);
    processor.dispose();
  });

  it('rejects failures, releases the failed worker and allows retry', async () => {
    const processor = createBackgroundRemovalProcessor();
    const file = new File(['image'], 'image.png');
    const first = processor.process(file, vi.fn());
    MockWorker.instances[0].respond({
      id: 1,
      type: 'error',
      error: 'Model unavailable'
    });
    await expect(first).rejects.toThrow('Model unavailable');
    expect(MockWorker.instances[0].terminate).toHaveBeenCalledOnce();
    const retry = processor.process(file, vi.fn());
    const rejected = expect(retry).rejects.toMatchObject({
      name: 'AbortError'
    });
    processor.dispose();
    await rejected;
    expect(MockWorker.instances[1].terminate).toHaveBeenCalledOnce();
  });

  it('handles worker loading errors without leaving a pending promise', async () => {
    const processor = createBackgroundRemovalProcessor();
    const result = processor.process(new File(['image'], 'image.png'), vi.fn());
    MockWorker.instances[0].onerror?.({
      message: 'Worker failed to load'
    } as ErrorEvent);
    await expect(result).rejects.toThrow('Worker failed to load');
    expect(MockWorker.instances[0].terminate).toHaveBeenCalledOnce();
  });
});
