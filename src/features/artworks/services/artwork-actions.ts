'use server';

import { revalidateTag } from 'next/cache';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { artworks } from '@/lib/db/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { ArtworkStatus } from '../types';

export async function bulkUpdateArtworkStatus(
  ids: string[],
  status: ArtworkStatus
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  await db
    .update(artworks)
    .set({ status })
    .where(and(inArray(artworks.id, ids)));

  revalidateTag('artworks');
}

export async function generatePriceList(ids: string[]) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const selectedArtworks = await db
    .select({
      id: artworks.id,
      title: artworks.title,
      price: artworks.retailPrice,
      status: artworks.status
    })
    .from(artworks)
    .where(and(inArray(artworks.id, ids)));

  // TODO: Implement price list generation logic
  // This could involve creating a PDF using a library like pdfkit
  // For now, we'll just return the data
  return selectedArtworks;
}

export async function generatePdfCatalog(ids: string[]) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const selectedArtworks = await db
    .select({
      id: artworks.id,
      title: artworks.title,
      description: artworks.description,
      price: artworks.retailPrice,
      status: artworks.status,
      mainImageId: artworks.mainImageId
    })
    .from(artworks)
    .where(and(inArray(artworks.id, ids)));

  // TODO: Implement PDF catalog generation logic
  // This could involve creating a PDF using a library like pdfkit
  // For now, we'll just return the data
  return selectedArtworks;
}
