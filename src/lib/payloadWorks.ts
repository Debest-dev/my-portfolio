import configPromise from '@payload-config';
import { getPayload } from 'payload';
import { works as staticWorks, WorkProject, WorkImage, ImageVariant } from '@/data/works';

export async function getWorks(): Promise<WorkProject[]> {
  try {
    const payload = await getPayload({ config: configPromise });
    const res = await payload.find({
      collection: 'projects',
      where: {
        _status: {
          equals: 'published',
        },
      },
      sort: 'order',
      limit: 100,
      depth: 2,
    });

    if (!res.docs || res.docs.length === 0) {
      console.warn('Payload returned 0 published projects; falling back to static works data.');
      return staticWorks;
    }

    const projects: WorkProject[] = res.docs.map((p: any) => {
      const images: WorkImage[] = (p.images ?? []).map((imgItem: any, idx: number) => {
        const media = typeof imgItem.image === 'object' && imgItem.image !== null ? imgItem.image : null;
        const caption = imgItem.caption || undefined;
        const alt =
          media?.alt ||
          (caption
            ? `${p.title} - ${caption}`
            : `${p.title} - image ${idx + 1} of ${p.images?.length ?? 1}`);

        const variants: ImageVariant[] = [];
        if (media?.sizes?.w800?.url && media?.sizes?.w800?.width && media?.sizes?.w800?.height) {
          variants.push({
            src: media.sizes.w800.url,
            width: media.sizes.w800.width,
            height: media.sizes.w800.height,
          });
        }
        if (media?.sizes?.w1600?.url && media?.sizes?.w1600?.width && media?.sizes?.w1600?.height) {
          variants.push({
            src: media.sizes.w1600.url,
            width: media.sizes.w1600.width,
            height: media.sizes.w1600.height,
          });
        }
        if (media?.url && media?.width && media?.height) {
          if (!variants.some((v) => v.width === media.width)) {
            variants.push({
              src: media.url,
              width: media.width,
              height: media.height,
            });
          }
        }
        variants.sort((a, b) => a.width - b.width);

        return {
          file: String(idx + 1).padStart(2, '0'),
          caption,
          alt,
          variants: variants.length > 0 ? variants : undefined,
        };
      });

      const coverIdx =
        typeof p.coverIndex === 'number' && p.coverIndex >= 1 && p.coverIndex <= images.length
          ? p.coverIndex - 1
          : 0;

      const cover = images[coverIdx]?.file ?? (images[0]?.file ?? '01');

      return {
        slug: p.slug,
        section: p.section,
        title: p.title,
        summary: p.summary,
        bullets: p.bullets ?? [],
        tools: p.tools ?? [],
        cover,
        coverPosition: p.coverPosition || undefined,
        coverCrop: p.coverCrop === 'bottom-half' ? 'bottom-half' : undefined,
        coverFit: p.coverFit === 'contain' ? 'contain' : undefined,
        images,
      };
    });

    return projects;
  } catch (error) {
    console.warn('Failed to fetch projects from Payload CMS; falling back to static works data:', error);
    return staticWorks;
  }
}
