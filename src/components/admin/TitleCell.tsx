'use client';

import React, { useEffect, useState } from 'react';
import type { DefaultCellComponentProps } from 'payload';

const urlCache = new Map<string | number, string>();

export const TitleCell: React.FC<DefaultCellComponentProps> = ({ cellData, rowData }) => {
  const images = rowData?.images;
  const targetItem =
    Array.isArray(images) && images.length > 0
      ? rowData?.newestFirst
        ? images[images.length - 1]
        : images[0]
      : null;
  const firstImage = targetItem?.image;

  let initialUrl: string | null = null;
  if (firstImage && typeof firstImage === 'object') {
    initialUrl =
      (firstImage as any).sizes?.w800?.url ||
      (firstImage as any).thumbnailURL ||
      (firstImage as any).url ||
      null;
  } else if (firstImage && (typeof firstImage === 'string' || typeof firstImage === 'number')) {
    initialUrl = urlCache.get(firstImage) || null;
  }

  const [imageUrl, setImageUrl] = useState<string | null>(initialUrl);

  useEffect(() => {
    if (imageUrl) return;
    if (firstImage && (typeof firstImage === 'string' || typeof firstImage === 'number')) {
      const cached = urlCache.get(firstImage);
      if (cached) {
        setImageUrl(cached);
        return;
      }
      fetch(`/api/media/${firstImage}?depth=0`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (!data) return;
          const url =
            data.sizes?.w800?.url ||
            data.thumbnailURL ||
            data.url ||
            null;
          if (url) {
            urlCache.set(firstImage, url);
            setImageUrl(url);
          }
        })
        .catch(() => {});
    }
  }, [firstImage, imageUrl]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          style={{
            width: '36px',
            height: '36px',
            objectFit: 'cover',
            borderRadius: '4px',
            flexShrink: 0,
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        />
      ) : (
        <div
          style={{
            width: '36px',
            height: '36px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '4px',
            flexShrink: 0,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            color: '#888',
          }}
        >
          No img
        </div>
      )}
      <span style={{ fontWeight: 500 }}>{cellData ? String(cellData) : 'Untitled'}</span>
    </div>
  );
};

export default TitleCell;
