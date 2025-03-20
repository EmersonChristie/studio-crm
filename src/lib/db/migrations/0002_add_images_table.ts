import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { artworks } from '../schema';

export const images = pgTable('images', {
  id: uuid('id').defaultRandom().primaryKey(),
  url: text('url').notNull(),
  alt: text('alt'),
  key: text('key').notNull(),
  artworkId: uuid('artwork_id').references(() => artworks.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export async function up(db: any) {
  await db.schema.createTable(images);
}

export async function down(db: any) {
  await db.schema.dropTable(images);
}
