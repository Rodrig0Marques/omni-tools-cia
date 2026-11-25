import { useEffect, useState } from 'react';

export default function useObjectUrl(value: Blob | null): string | null {
  const [preview, setPreview] = useState<{
    value: Blob;
    url: string;
  } | null>(null);

  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(value);
    setPreview({ value, url });
    return () => URL.revokeObjectURL(url);
  }, [value]);

  return preview?.value === value ? preview?.url ?? null : null;
}
