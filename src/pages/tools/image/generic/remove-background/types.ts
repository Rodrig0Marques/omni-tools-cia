export type RemovalProgress = {
  key: string;
  current: number;
  total: number;
};

export type RemovalRequest = { id: number; file: File };

export type RemovalResponse =
  | { id: number; type: 'progress'; progress: RemovalProgress }
  | { id: number; type: 'complete'; blob: Blob }
  | { id: number; type: 'error'; error: string };
