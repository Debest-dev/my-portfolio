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

    const validDocs = res.docs.filter(
      (p: any) => Array.isArray(p.images) && p.images.length > 0
    );

    if (validDocs.length === 0) {
      console.warn('Payload returned 0 valid projects with images; falling back to static works data.');
      return staticWorks;
    }

    const projects: WorkProject[] = validDocs.map((p: any) => {
      const isNewestFirst = Boolean(p.newestFirst);
      const rawImages = isNewestFirst ? [...p.images].reverse() : (p.images ?? []);
      const totalImages = rawImages.length;

      const images: WorkImage[] = rawImages.map((imgItem: any, idx: number) => {
        const media = typeof imgItem.image === 'object' && imgItem.image !== null ? imgItem.image : null;
        const caption = imgItem.caption || undefined;
        const baseAlt = `${p.title} – image ${idx + 1} of ${totalImages}`;
        const alt =
          media?.alt?.trim()
            ? media.alt.trim()
            : (caption ? `${baseAlt} - ${caption}` : baseAlt);

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

      let cover = images[0]?.file ?? '01';
      if (!isNewestFirst) {
        const coverIdx =
          typeof p.coverIndex === 'number' && p.coverIndex >= 1 && p.coverIndex <= images.length
            ? p.coverIndex - 1
            : 0;
        cover = images[coverIdx]?.file ?? (images[0]?.file ?? '01');
      }

      return {
        slug: p.slug,
        section: p.section,
        title: p.title,
        summary: p.summary || '',
        bullets: p.bullets ?? [],
        tools: p.tools ?? [],
        cover,
        coverPosition: p.coverPosition || undefined,
        coverCrop: p.coverCrop === 'bottom-half' ? 'bottom-half' : undefined,
        coverFit: p.coverFit === 'contain' ? 'contain' : undefined,
        images,
        newestFirst: isNewestFirst,
      };
    });

    return projects;
  } catch (error) {
    console.warn('Failed to fetch projects from Payload CMS; falling back to static works data:', error);
    return staticWorks;
  }
}
