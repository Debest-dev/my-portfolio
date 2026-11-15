import fs from 'fs';
import path from 'path';
import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd());

async function runBackup() {
  const { getPayload } = await import('payload');
  const { default: config } = await import('../src/payload.config');

  console.log('Initializing Payload for backup...');
  const payload = await getPayload({ config });

  console.log('Fetching projects and media...');
  const projects = await payload.find({
    collection: 'projects',
    depth: 2,
    limit: 10000,
    draft: true,
  });

  const media = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 10000,
  });

  const backupsDir = path.resolve(process.cwd(), 'backups');
  if (!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `backup-${timestamp}.json`;
  const filePath = path.join(backupsDir, filename);

  const backupPayload = {
    exportedAt: new Date().toISOString(),
    counts: {
      projects: projects.totalDocs,
      media: media.totalDocs,
    },
    projects: projects.docs,
    media: media.docs,
  };

  fs.writeFileSync(filePath, JSON.stringify(backupPayload, null, 2), 'utf-8');
  console.log(`Backup completed successfully! Saved to: ${filePath}`);
  process.exit(0);
}

runBackup().catch((error) => {
  console.error('Backup failed:', error);
  process.exit(1);
});
