'use server';

import { db } from '@/lib/db';
import { artworks, images, users } from '@/lib/db/schema';
import { and, eq, ilike, sql } from 'drizzle-orm';
import { ArtworkStatus } from '@/features/artworks/types';
import { auth } from '@/lib/auth';
import { cache } from 'react';
import { unstable_cache } from 'next/cache';

export type CreateArtworkData = {
  title: string;
  year?: number;
  medium?: string;
  dimensions?: string;
  status: ArtworkStatus;
  mainImageId?: string;
  artistId: string;
};

export type UpdateArtworkData = Partial<CreateArtworkData>;

export type ArtworkFilters = {
  page?: number;
  limit?: number;
  search?: string;
  status?: ArtworkStatus;
};

export const getArtworks = cache(async function getArtworks(
  filters: ArtworkFilters = {}
) {
  const { page = 1, limit = 10, search, status } = filters;
  const offset = (page - 1) * limit;
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  return await unstable_cache(
    async () => {
      const whereClause = [];

      if (search) {
        whereClause.push(ilike(artworks.title, `%${search}%`));
      }

      if (
        status &&
        ['available', 'sold', 'reserved', 'not_for_sale'].includes(status)
      ) {
        whereClause.push(eq(artworks.status, status as ArtworkStatus));
      }

      const [artworksData, totalCount] = await Promise.all([
        db
          .select({
            id: artworks.id,
            title: artworks.title,
            year: artworks.year,
            dimensions: artworks.dimensions,
            price: sql<number>`CAST(${artworks.retailPrice} AS decimal)`,
            status: artworks.status,
            mainImageId: artworks.mainImageId,
            artist: {
              id: users.id,
              name: users.name
            },
            mainImage: {
              url: images.url,
              alt: images.alt
            }
          })
          .from(artworks)
          .leftJoin(users, eq(artworks.artistId, users.id))
          .leftJoin(images, eq(artworks.mainImageId, images.id))
          .where(and(...whereClause))
          .limit(limit)
          .offset(offset),

        db
          .select({ count: sql<number>`cast(count(*) as integer)` })
          .from(artworks)
          .where(and(...whereClause))
          .then((res) => res[0].count)
      ]);

      return {
        artworks: artworksData,
        total_artworks: totalCount
      };
    },
    ['artworks', String(page), String(limit), search || '', status || ''],
    {
      revalidate: 60,
      tags: ['artworks']
    }
  )();
});

export const getArtworkById = cache(async function getArtworkById(id: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  return await unstable_cache(
    async () => {
      const artwork = await db
        .select({
          id: artworks.id,
          title: artworks.title,
          year: artworks.year,
          medium: artworks.medium,
          dimensions: artworks.dimensions,
          status: artworks.status,
          mainImageId: artworks.mainImageId,
          mainImage: {
            url: images.url,
            alt: images.alt
          }
        })
        .from(artworks)
        .leftJoin(images, eq(artworks.mainImageId, images.id))
        .where(eq(artworks.id, id))
        .then((res) => res[0] || null);

      return { artwork };
    },
    [`artwork-${id}`],
    {
      revalidate: 60,
      tags: [`artwork-${id}`, 'artworks']
    }
  )();
});

export async function createArtwork(data: CreateArtworkData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const newArtwork = await db
    .insert(artworks)
    .values({
      title: data.title,
      year: data.year || null,
      medium: data.medium || null,
      dimensions: data.dimensions || null,
      status: data.status,
      mainImageId: data.mainImageId || null,
      artistId: data.artistId
    })
    .returning();

  return { artwork: newArtwork[0] };
}

export async function updateArtwork(id: string, data: UpdateArtworkData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const updatedArtwork = await db
    .update(artworks)
    .set({
      ...(data.title && { title: data.title }),
      ...(data.year !== undefined && { year: data.year }),
      ...(data.medium !== undefined && { medium: data.medium }),
      ...(data.dimensions !== undefined && { dimensions: data.dimensions }),
      ...(data.status && { status: data.status }),
      ...(data.mainImageId !== undefined && { mainImageId: data.mainImageId }),
      ...(data.artistId && { artistId: data.artistId })
    })
    .where(eq(artworks.id, id))
    .returning();

  return { artwork: updatedArtwork[0] };
}

export async function deleteArtwork(id: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  await db.delete(artworks).where(eq(artworks.id, id));
  return { success: true };
}
