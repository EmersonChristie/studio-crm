import {
  pgTable,
  text,
  timestamp,
  varchar,
  uuid,
  integer,
  decimal,
  foreignKey,
  pgEnum,
  serial
} from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const users = pgTable('users', {
  id: varchar('id', { length: 128 })
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  password: text('password'), // Will store hashed passwords
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// For OAuth accounts (like GitHub)
export const accounts = pgTable('accounts', {
  id: varchar('id', { length: 128 })
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: varchar('user_id', { length: 128 }).notNull(),
  type: text('type').$type<'oauth' | 'credentials'>().notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refreshToken: text('refresh_token'),
  accessToken: text('access_token'),
  expiresAt: timestamp('expires_at', { mode: 'date' }),
  tokenType: text('token_type'),
  scope: text('scope'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Create ENUMs
export const artworkStatusEnum = pgEnum('artwork_status', [
  'available',
  'sold',
  'reserved',
  'not_for_sale'
]);

export const listTypeEnum = pgEnum('list_type', [
  'contact_favorite',
  'website_collection',
  'series',
  'curated_show',
  'internal'
]);

// Series table
export const series = pgTable('series', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Materials table
export const materials = pgTable('materials', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  unitMeasurement: text('unit_measurement').notNull(),
  supplier: text('supplier'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Artwork Production Costs table
export const artworkProductionCosts = pgTable('artwork_production_costs', {
  id: uuid('id').defaultRandom().primaryKey(),
  totalCost: decimal('total_cost', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Provenance table
export const provenance = pgTable('provenance', {
  id: uuid('id').defaultRandom().primaryKey(),
  previousOwner: text('previous_owner'),
  acquisitionMethod: text('acquisition_method'),
  dateAcquired: timestamp('date_acquired'),
  salePrice: decimal('sale_price', { precision: 10, scale: 2 }),
  exhibitionHistory: text('exhibition_history').array(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Artworks table
export const artworks = pgTable('artworks', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  artistId: varchar('artist_id', { length: 128 })
    .notNull()
    .references(() => users.id),
  year: integer('year'),
  medium: text('medium'),
  dimensions: text('dimensions'),
  description: text('description'),
  seriesId: uuid('series_id').references(() => series.id),
  editionNumber: integer('edition_number'),
  editionTotal: integer('edition_total'),
  provenanceId: uuid('provenance_id').references(() => provenance.id),
  productionCostId: uuid('production_cost_id').references(
    () => artworkProductionCosts.id
  ),
  retailPrice: decimal('retail_price', { precision: 10, scale: 2 }),
  status: artworkStatusEnum('status').default('available').notNull(),
  location: text('location'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Artwork-Material Usage table
export const artworkMaterials = pgTable('artwork_materials', {
  id: uuid('id').defaultRandom().primaryKey(),
  artworkId: uuid('artwork_id')
    .notNull()
    .references(() => artworks.id),
  materialId: uuid('material_id')
    .notNull()
    .references(() => materials.id),
  quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Artwork Lists table
export const artworkLists = pgTable('artwork_lists', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  listType: listTypeEnum('list_type').notNull(),
  referenceId: text('reference_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Artwork List Items table
export const artworkListItems = pgTable('artwork_list_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  artworkListId: uuid('artwork_list_id')
    .notNull()
    .references(() => artworkLists.id),
  artworkId: uuid('artwork_id')
    .notNull()
    .references(() => artworks.id),
  position: integer('position').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});
