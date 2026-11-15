import type { CollectionConfig } from 'payload';
import { revalidateHomepage } from './hooks/revalidate';

export const Projects: CollectionConfig = {
  slug: 'projects',
  defaultSort: 'order',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'section', 'order', '_status'],
  },
  versions: {
    drafts: true,
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true;
      return {
        _status: {
          equals: 'published',
        },
      };
    },
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data && !data.slug && data.title) {
          data.slug = data.title
            .toLowerCase()
            .trim()
            .replace(/[\s\W-]+/g, '-')
            .replace(/^-+|-+$/g, '');
        }
        return data;
      },
    ],
    afterChange: [revalidateHomepage],
    afterDelete: [revalidateHomepage],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Project title (e.g. TokenFi)',
        components: {
          Cell: '@/components/admin/TitleCell#TitleCell',
        },
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      admin: {
        description: 'URL-friendly slug (auto-generated from title, editable)',
      },
    },
    {
      name: 'section',
      type: 'select',
      required: true,
      options: ['Campaign design', 'Compositing', 'Retouching'],
      admin: {
        description: 'Category section: Campaign design, Compositing, or Retouching',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Brief description or summary of the project',
      },
    },
    {
      name: 'bullets',
      type: 'text',
      hasMany: true,
      admin: {
        description: 'Key highlights or bullet points for the project',
      },
    },
    {
      name: 'tools',
      type: 'text',
      hasMany: true,
      admin: {
        description: 'Tools and software used (e.g. Photoshop, Illustrator)',
      },
    },
    {
      name: 'images',
      type: 'array',
      admin: {
        description: 'Project gallery images and optional captions',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Select an uploaded image from Media',
          },
        },
        {
          name: 'caption',
          type: 'text',
          admin: {
            description: 'Optional caption for this image',
          },
        },
      ],
    },
    {
      name: 'coverIndex',
      type: 'number',
      defaultValue: 1,
      admin: {
        description: '1 = the first image above',
      },
    },
    {
      name: 'coverFit',
      type: 'select',
      defaultValue: 'cover',
      options: ['cover', 'contain'],
      admin: {
        description: 'Image fit style for the card: cover or contain',
      },
    },
    {
      name: 'coverCrop',
      type: 'select',
      defaultValue: 'none',
      options: ['none', 'bottom-half'],
      admin: {
        description: 'Crop style for the card: none or bottom-half',
      },
    },
    {
      name: 'coverPosition',
      type: 'text',
      admin: {
        description: 'Optional CSS object-position for the cover (e.g. "center 8%")',
      },
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        description: 'Display order (lowest number appears first)',
      },
    },
  ],
};
