import type { CollectionConfig } from 'payload';
import { APIError } from 'payload';
import { revalidateHomepage } from './hooks/revalidate';

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    mimeTypes: ['image/*'],
    adminThumbnail: ({ doc }) => {
      const sizes = doc?.sizes as Record<string, { url?: string }> | undefined;
      return sizes?.w800?.url || (doc?.url as string) || null;
    },
    imageSizes: [
      {
        name: 'w800',
        width: 800,
        formatOptions: {
          format: 'webp',
          options: {
            quality: 80,
          },
        },
      },
      {
        name: 'w1600',
        width: 1600,
        formatOptions: {
          format: 'webp',
          options: {
            quality: 80,
          },
        },
      },
    ],
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeValidate: [
      ({ req }) => {
        if (req?.file && req.file.size > MAX_FILE_SIZE) {
          throw new APIError('Export the image as WebP or JPG under 4 MB.', 400);
        }
      },
    ],
    beforeChange: [
      ({ data, req }) => {
        if (data?.filesize && data.filesize > MAX_FILE_SIZE) {
          throw new APIError('Export the image as WebP or JPG under 4 MB.', 400);
        }
        if (req?.file && req.file.size > MAX_FILE_SIZE) {
          throw new APIError('Export the image as WebP or JPG under 4 MB.', 400);
        }
        return data;
      },
    ],
    afterChange: [revalidateHomepage],
    afterDelete: [revalidateHomepage],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: false,
      admin: {
        description: 'Leave blank to use the project name and image number',
      },
    },
  ],
};
