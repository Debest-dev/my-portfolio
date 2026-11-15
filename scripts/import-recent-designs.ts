import fs from 'fs';
import path from 'path';
import os from 'os';
import dns from 'dns';
import sharp from 'sharp';
import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd());

try {
  dns.setDefaultResultOrder('ipv4first');
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {}

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'My works', 'Recent Designs');
const TEMP_DIR = path.join(os.tmpdir(), 'portfolio-recent-designs-import');

const byName = (a: string, b: string) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });

async function processImage(sourcePath: string, outputPath: string) {
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

  if (info.size > 4 * 1024 * 1024) {
    console.warn(`File ${outputPath} is ${info.size} bytes (> 4MB). Re-encoding...`);
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

let timeout: NodeJS.Timeout;
function resetTimeout() {
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(() => {
    console.error('Timed out after 60s of inactivity');
    process.exit(1);
  }, 60000);
}
resetTimeout();

async function run() {
  try {
    if (!fs.existsSync(SRC_DIR)) {
      throw new Error(`Directory not found: ${SRC_DIR}`);
    }

    const files = fs
      .readdirSync(SRC_DIR)
      .filter((name) => /\.(jpe?g|png|webp)$/i.test(name))
      .sort(byName);

    console.log(`Found ${files.length} images in "${SRC_DIR}":`);
    files.forEach((f, idx) => console.log(`  ${idx + 1}. ${f}`));

    if (!fs.existsSync(TEMP_DIR)) {
      fs.mkdirSync(TEMP_DIR, { recursive: true });
    }

    const { getPayload } = await import('payload');
    const { default: config } = await import('../src/payload.config');
    const payload = await getPayload({ config });

    // Fetch existing Media and Project
    const existingMediaRes = await payload.find({
      collection: 'media',
      limit: 1000,
      pagination: false,
    });
    const mediaMap = new Map<string, any>(existingMediaRes.docs.map((m: any) => [m.filename, m]));

    const projectImages: { image: number }[] = [];

    for (let i = 0; i < files.length; i++) {
      resetTimeout();
      const fileName = files[i];
      const srcFilePath = path.join(SRC_DIR, fileName);
      const targetFilename = `recent-designs-${String(i + 1).padStart(2, '0')}.webp`;

      let mediaDoc = mediaMap.get(targetFilename);

      if (!mediaDoc) {
        console.log(`Processing and uploading ${targetFilename} from "${fileName}"...`);
        const tempPath = path.join(TEMP_DIR, targetFilename);
        await processImage(srcFilePath, tempPath);

        const stats = fs.statSync(tempPath);
        const fileBuffer = fs.readFileSync(tempPath);

        mediaDoc = await payload.create({
          collection: 'media',
          data: {
            alt: '',
          },
          file: {
            data: fileBuffer,
            name: targetFilename,
            mimetype: 'image/webp',
            size: stats.size,
          },
        });

        // Clean up temp file immediately
        try {
          fs.unlinkSync(tempPath);
        } catch {}

        console.log(`Uploaded media id: ${mediaDoc.id} (${targetFilename})`);
      } else {
        console.log(`Media ${targetFilename} already exists (id: ${mediaDoc.id}). Skipping upload.`);
      }

      projectImages.push({
        image: Number(mediaDoc.id),
      });
    }

    // Upsert project "Recent Designs"
    const existingProject = await payload.find({
      collection: 'projects',
      where: {
        slug: { equals: 'recent-designs' },
      },
      limit: 1,
    });

    const projectData = {
      title: 'Recent Designs',
      slug: 'recent-designs',
      section: 'Campaign design' as const,
      order: 0,
      newestFirst: true,
      _status: 'published' as const,
      summary: '',
      bullets: [],
      tools: [],
      images: projectImages,
      coverIndex: 1,
      coverFit: 'cover' as const,
      coverCrop: 'none' as const,
    };

    if (existingProject.docs.length > 0) {
      console.log(`Updating existing project "${projectData.title}" (id: ${existingProject.docs[0].id})...`);
      await payload.update({
        collection: 'projects',
        id: existingProject.docs[0].id,
        data: projectData,
      });
    } else {
      console.log(`Creating project "${projectData.title}"...`);
      await payload.create({
        collection: 'projects',
        data: projectData,
      });
    }

    // Clean temp dir
    try {
      if (fs.existsSync(TEMP_DIR)) {
        fs.rmSync(TEMP_DIR, { recursive: true, force: true });
      }
    } catch {}

    console.log('Import completed successfully!');
    clearTimeout(timeout);
    process.exit(0);
  } catch (err) {
    console.error('Error importing Recent Designs:', err);
    try {
      if (fs.existsSync(TEMP_DIR)) {
        fs.rmSync(TEMP_DIR, { recursive: true, force: true });
      }
    } catch {}
    clearTimeout(timeout);
    process.exit(1);
  }
}

run();
