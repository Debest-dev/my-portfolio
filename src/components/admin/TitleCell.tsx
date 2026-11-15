'use client';

import React from 'react';
import type { DefaultCellComponentProps } from 'payload';

export const TitleCell: React.FC<DefaultCellComponentProps> = ({ cellData, rowData }) => {
  const images = rowData?.images;
  const firstItem = Array.isArray(images) && images.length > 0 ? images[0] : null;
  const firstImage = firstItem?.image;

  let imageUrl: string | null = null;
  if (firstImage && typeof firstImage === 'object') {
    imageUrl =
      firstImage.sizes?.w800?.url ||
      firstImage.url ||
      firstImage.thumbnailURL ||
      null;
  }

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
