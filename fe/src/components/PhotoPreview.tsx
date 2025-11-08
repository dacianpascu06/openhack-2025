import React, { useEffect, useState } from 'react';
import { Image, Badge, Button } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

export default function PhotoPreview({
  file,
  onConfirm,
  onRemove,
  confirmed = false,
}: {
  file: File | null;
  onConfirm: () => void;
  onRemove: () => void;
  confirmed?: boolean;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!file) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginTop: 12 }}>
      {previewUrl && (
        <Image
          src={previewUrl}
          alt={file.name}
          width={220}
          height={160}
          fit="cover"
        />
      )}

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{file.name}</div>
        <Badge color="gray" variant="light">{Math.round(file.size / 1024)} KB</Badge>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
        {!confirmed ? (
          <>
            <Button variant="outline" color="red" size="xs" onClick={onRemove}>
              <IconX size={14} style={{ marginRight: 8 }} />
              Remove
            </Button>
            <Button variant="light" size="xs" onClick={onConfirm}>
              Confirm
            </Button>
          </>
        ) : (
          <div style={{ color: '#2f9e44', fontSize: 16, fontWeight: 600 }}>Confirmed</div>
        )}
      </div>
    </div>
  );
}