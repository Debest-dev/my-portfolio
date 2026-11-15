import fs from 'fs';
import path from 'path';
import os from 'os';
import dns from 'dns';
import { loadEnvConfig } from '@next/env';
import sharp from 'sharp';

loadEnvConfig(process.cwd());

try {
  dns.setDefaultResultOrder('ipv4first');
} catch {}

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'My works');
const PUBLIC_WORKS = path.join(ROOT, 'public', 'works');
const TEMP_DIR = path.join(os.tmpdir(), 'portfolio-works-import');

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');
const byName = (a: string, b: string) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });

const CONFIG = [
  { slug: 'tokenfi', dirs: ['Graphic Designs/TokenFi'], first: ['tokenfi.jpg'] },
  {
    slug: 'photo-compositing',
    dirs: ['Image Composition'],
    first: ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', 'AI-AND-LAW.jpg'],
  },
  {
    slug: 'portrait-retouching',
    dirs: ['Studio Pictures'],
    first: ['Retouch Before and After.jpg', 'Clean Retouch.png'],
    sessions: ['Adekunle', 'Big joe', 'Kiitan', 'Odetola', 'Whitney'],
  },
  { slug: 'kedolikswap', dirs: ['Graphic Designs/Kedolikswap'] },
  { slug: 'sqwad', dirs: ['Graphic Designs/SQWAD'] },
  { slug: 'alphax', dirs: ['Graphic Designs/AlphaX'], first: ['AlphaX Designs.jpg'] },
  { slug: 'church-photography', dirs: ['Church Photography'] },
  { slug: 'medigo', dirs: ['Graphic Designs/MediGo'] },
  { slug: 'peec-graphics', dirs: ['Graphic Designs/PEEC'] },
  { slug: 'church-posters', dirs: ['Graphic Designs/Church Poster'] },
  { slug: 'birthday-posters', dirs: ['Graphic Designs/Birthday Posters'] },
  {
    slug: 'social-and-event-graphics',
    dirs: ['Graphic Designs/Others'],
    exclude: ['BNB INU DESIGN 3.png'],
  },
];

function listFiles(dirs: string[]) {
  const files: { name: string; path: string }[] = [];
  for (const dir of dirs) {
    const full = path.join(SRC, dir);
    if (!fs.existsSync(full)) continue;
    for (const name of fs.readdirSync(full)) {
      const p = path.join(full, name);
      if (fs.statSync(p).isFile() && /\.(jpe?g|png|webp)$/i.test(name)) {
        files.push({ name, path: p });
      }
    }
  }
  return files.sort((a, b) => byName(a.name, b.name));
}

function orderFiles(cfg: any, files: { name: string; path: string }[]) {
  const used = new Set<string>();
  const ordered: { name: string; path: string }[] = [];
  const take = (match: (f: { name: string; path: string }) => boolean) => {
    const hit = files.find((f) => !used.has(f.name) && match(f));
    if (hit) {
      used.add(hit.name);
      ordered.push(hit);
    }
    return hit;
  };
  for (const name of cfg.first ?? []) {
    take((f) => norm(f.name) === norm(name));
  }
  for (const session of cfg.sessions ?? []) {
    const key = norm(session);
    take((f) => norm(f.name).startsWith(key + 'birthdayportraits'));
    const singles = files.filter((f) => !used.has(f.name) && norm(f.name).startsWith(key));
    for (const f of singles) {
      used.add(f.name);
      ordered.push(f);
    }
  }
  const excluded = new Set((cfg.exclude ?? []).map(norm));
  for (const f of files) {
    if (!used.has(f.name) && !excluded.has(norm(f.name))) ordered.push(f);
  }
  return ordered;
}

function safeUnlink(filePath: string) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch {}
}

async function processImage(sourcePath: string, outputPath: string): Promise<{ width: number; height: number; size: number }> {
  sharp.cache(false);
  const image = sharp(sourcePath).rotate();
  const meta = await image.metadata();
  const width = meta.width || 0;
  const height = meta.height || 0;
  const longEdge = Math.max(width, height);

  let pipeline = image;
  if (longEdge > 2400) {
    if (width >= height) {
      pipeline = pipeline.resize({ width: 2400, withoutEnlargement: true });
    } else {
      pipeline = pipeline.resize({ height: 2400, withoutEnlargement: true });
    }
  }

  let info = await pipeline.webp({ quality: 85 }).toFile(outputPath);

  // Guard for 4 MB limit
  if (info.size > 4 * 1024 * 1024) {
    console.warn(`File ${outputPath} is ${info.size} bytes (> 4MB). Re-encoding at quality 75 and 2000px...`);
    info = await sharp(sourcePath)
      .rotate()
      .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 75 })
      .toFile(outputPath);
  }

  return {
    width: info.width || 0,
    height: info.height || 0,
    size: info.size,
  };
}

async function runImport() {
  const isDryRun = process.argv.includes('--dry-run');
  const onlyIndex = process.argv.indexOf('--only');
  const onlySlug = onlyIndex !== -1 ? process.argv[onlyIndex + 1] : null;

  console.log(`=== STARTING WORKS IMPORT ${isDryRun ? '(DRY RUN)' : ''} ===`);
  if (onlySlug) {
    console.log(`Filtering for single project slug: "${onlySlug}"\n`);
  }

  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  const { works } = await import('../src/data/works');
  const { getPayload } = await import('payload');
  const { default: config } = await import('../src/payload.config');

  let payload: any = null;
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      payload = await getPayload({ config });
      break;
    } catch (err: any) {
      if (attempt < 5 && err?.message?.includes('ENOTFOUND')) {
        console.warn(`Postgres DNS/connection attempt ${attempt} failed: ${err.message}. Retrying in 2s...`);
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }
      throw err;
    }
  }

  // Prevent unhandled error crashes from idle connection pool events on Neon
  if ((payload.db as any)?.pool) {
    (payload.db as any).pool.on('error', (err: any) => {
      // Ignored: pool manages reconnecting
    });
  }

  process.on('uncaughtException', (err: any) => {
    if (err?.message?.includes('Connection terminated unexpectedly')) {
      console.warn('Neon connection reset handled.');
      return;
    }
    console.error('Uncaught Exception:', err);
    process.exit(1);
  });

  const withRetry = async <T>(fn: () => Promise<T>, retries = 3, delay = 1500): Promise<T> => {
    let lastErr: any;
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        return await fn();
      } catch (err: any) {
        lastErr = err;
        if (attempt < retries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay * (attempt + 1)));
        }
      }
    }
    throw lastErr;
  };

  const projectsToImport = onlySlug
    ? works.filter((w) => w.slug === onlySlug)
    : works;

  if (projectsToImport.length === 0) {
    console.error(`No project found matching slug "${onlySlug}".`);
    process.exit(1);
  }

  // Pre-load all existing media and projects in a single query to avoid connection dropouts
  console.log('Fetching existing media and projects from database...');
  const existingMediaRes = await payload.find({
    collection: 'media',
    limit: 10000,
    pagination: false,
  });
  const existingMediaMap = new Map<string, any>(
    existingMediaRes.docs.map((m: any) => [m.filename, m])
  );
  console.log(`Found ${existingMediaMap.size} existing media records in database.`);

  const existingProjectsRes = await payload.find({
    collection: 'projects',
    limit: 1000,
    draft: true,
    pagination: false,
  });
  const existingProjectsMap = new Map<string, any>(
    existingProjectsRes.docs.map((p: any) => [p.slug, p])
  );
  console.log(`Found ${existingProjectsMap.size} existing project records in database.`);

  const stats = {
    projectsProcessed: 0,
    imagesUploaded: 0,
    imagesSkipped: 0,
    totalBytesUploaded: 0,
    failures: [] as string[],
    sourcesUsed: {} as Record<string, string>,
  };

  for (let pIndex = 0; pIndex < projectsToImport.length; pIndex++) {
    const project = projectsToImport[pIndex];
    // Global order based on original works array index
    const originalOrder = works.findIndex((w) => w.slug === project.slug) + 1;
    console.log(`\n--------------------------------------------------`);
    console.log(`[${pIndex + 1}/${projectsToImport.length}] Project: "${project.title}" (${project.slug})`);

    const cfg = CONFIG.find((c) => c.slug === project.slug);
    const myWorksFiles = cfg ? orderFiles(cfg, listFiles(cfg.dirs)) : [];

    let imageSources: { name: string; path: string }[] = [];
    let sourceName = '';

    if (myWorksFiles.length === project.images.length) {
      imageSources = myWorksFiles;
      sourceName = 'My works (Originals)';
    } else {
      sourceName = 'public/works (1600px fallback)';
      const publicDir = path.join(PUBLIC_WORKS, project.slug);
      for (const img of project.images) {
        const fallback1600 = path.join(publicDir, `${img.file}-1600.webp`);
        if (fs.existsSync(fallback1600)) {
          imageSources.push({ name: `${img.file}-1600.webp`, path: fallback1600 });
        } else {
          stats.failures.push(`Missing fallback image for ${project.slug} file ${img.file}`);
        }
      }
    }

    stats.sourcesUsed[project.slug] = sourceName;
    console.log(`Source used: ${sourceName} (${imageSources.length} images)`);

    const projectImageRelations: { image: number | string; caption?: string }[] = [];

    for (let i = 0; i < project.images.length; i++) {
      const imgConfig = project.images[i];
      const source = imageSources[i];
      const nn = String(i + 1).padStart(2, '0');
      const stableFilename = `${project.slug}-${nn}.webp`;

      // Alt text format: "<Project title> – image N of M", plus the caption if there is one.
      // Never put people's names in filenames, titles or alt text.
      const alt = imgConfig.caption
        ? `${project.title} – image ${i + 1} of ${project.images.length} – ${imgConfig.caption}`
        : `${project.title} – image ${i + 1} of ${project.images.length}`;

      // In-memory check for existing media
      const existingDoc = existingMediaMap.get(stableFilename);
      let mediaDocId: number | string;

      if (existingDoc) {
        mediaDocId = existingDoc.id;
        stats.imagesSkipped++;
        console.log(`  [Image ${nn}/${project.images.length}] ${stableFilename}: Already exists (ID: ${mediaDocId}). Skipping upload.`);
      } else {
        const tempFilePath = path.join(TEMP_DIR, stableFilename);

        try {
          const { width, height, size } = await processImage(source.path, tempFilePath);

          if (isDryRun) {
            mediaDocId = `dry-run-media-${stableFilename}`;
            stats.imagesUploaded++;
            stats.totalBytesUploaded += size;
            console.log(`  [DRY RUN] Would upload ${stableFilename} (${width}x${height}, ${(size / 1024).toFixed(1)} KB) -> alt: "${alt}"`);
            safeUnlink(tempFilePath);
          } else {
            const createdMedia: any = await withRetry(() =>
              payload.create({
                collection: 'media',
                data: {
                  alt,
                },
                filePath: tempFilePath,
              })
            );

            mediaDocId = createdMedia.id;
            existingMediaMap.set(stableFilename, createdMedia);
            stats.imagesUploaded++;
            stats.totalBytesUploaded += size;
            console.log(`  [UPLOADED] ${stableFilename} (ID: ${mediaDocId}, ${(size / 1024).toFixed(1)} KB) -> alt: "${alt}"`);
            safeUnlink(tempFilePath);
          }
        } catch (err: any) {
          safeUnlink(tempFilePath);
          const msg = `Failed to process/upload ${stableFilename}: ${err?.message || err}`;
          console.error(`  [ERROR] ${msg}`);
          stats.failures.push(msg);
          continue;
        }
      }

      projectImageRelations.push({
        image: mediaDocId,
        caption: imgConfig.caption || undefined,
      });
    }

    // Upsert project
    const projectData = {
      title: project.title,
      slug: project.slug,
      section: project.section,
      summary: project.summary,
      bullets: project.bullets,
      tools: project.tools,
      images: projectImageRelations,
      coverIndex: parseInt(project.cover, 10) || 1,
      coverFit: project.coverFit || 'cover',
      coverCrop: project.coverCrop || 'none',
      coverPosition: project.coverPosition || undefined,
      order: originalOrder,
      _status: 'published' as const,
    };

    if (isDryRun) {
      console.log(`  [DRY RUN] Would upsert Project "${project.title}" (order: ${originalOrder}, images: ${projectImageRelations.length}, status: published)`);
      stats.projectsProcessed++;
    } else {
      const existingProj = existingProjectsMap.get(project.slug);

      if (existingProj) {
        const id = existingProj.id;
        await withRetry(() =>
          payload.update({
            collection: 'projects',
            id,
            data: projectData,
            draft: false,
          })
        );
        console.log(`  [UPDATED] Project "${project.title}" (ID: ${id}, published)`);
      } else {
        const createdProj: any = await withRetry(() =>
          payload.create({
            collection: 'projects',
            data: projectData,
            draft: false,
          })
        );
        existingProjectsMap.set(project.slug, createdProj);
        console.log(`  [CREATED] Project "${project.title}" (ID: ${createdProj.id}, published)`);
      }
      stats.projectsProcessed++;
    }
  }

  // Cleanup temp dir
  try {
    if (fs.existsSync(TEMP_DIR)) {
      fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    }
  } catch {}

  console.log(`\n==================================================`);
  console.log(`=== IMPORT SUMMARY ${isDryRun ? '(DRY RUN)' : ''} ===`);
  console.log(`Projects processed:  ${stats.projectsProcessed}`);
  console.log(`Images to upload:    ${stats.imagesUploaded}`);
  console.log(`Images skipped (dup): ${stats.imagesSkipped}`);
  console.log(`Total upload size:   ${(stats.totalBytesUploaded / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Failures:            ${stats.failures.length}`);
  if (stats.failures.length > 0) {
    stats.failures.forEach((f) => console.error(` - ${f}`));
  }
  console.log(`\nSources used per project:`);
  for (const [slug, srcName] of Object.entries(stats.sourcesUsed)) {
    console.log(`  • ${slug}: ${srcName}`);
  }
  console.log(`==================================================\n`);

  process.exit(stats.failures.length > 0 ? 1 : 0);
}

runImport().catch((err) => {
  console.error('Fatal import error:', err);
  process.exit(1);
});
