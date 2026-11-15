import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" ALTER COLUMN "alt" DROP NOT NULL;
  ALTER TABLE "projects" ADD COLUMN "newest_first" boolean DEFAULT false;
  ALTER TABLE "_projects_v" ADD COLUMN "version_newest_first" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" ALTER COLUMN "alt" SET NOT NULL;
  ALTER TABLE "projects" DROP COLUMN "newest_first";
  ALTER TABLE "_projects_v" DROP COLUMN "version_newest_first";`)
}
