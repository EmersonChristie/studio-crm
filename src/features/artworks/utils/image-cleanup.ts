'use server';

import { db } from '@/lib/db';
import { artworks, images, artworkSecondaryImages } from '@/lib/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { getFileKeyFromUrl } from '@/features/uploader/services/upload-service';
import { deleteFileByUrl } from '@/features/uploader/services/upload-server';

/**
 * Delete an image from the database and UploadThing
 * @param imageId The database ID of the image to delete
 * @returns A promise that resolves when the image is deleted
 */
export async function deleteImage(imageId: string): Promise<boolean> {
  try {
    // First, get the image URL from the database
    const imageRecord = await db
      .select({ url: images.url })
      .from(images)
      .where(eq(images.id, imageId))
      .then((res) => res[0]);

    if (!imageRecord) {
      console.warn('Image not found in database:', imageId);
      return false;
    }

    // Check if this image is used as a main image in any artwork
    const artworksUsingImage = await db
      .select({ id: artworks.id })
      .from(artworks)
      .where(eq(artworks.mainImageId, imageId))
      .limit(1);

    // If this image is used as a main image, update those artworks to set mainImageId to null
    if (artworksUsingImage.length > 0) {
      await db
        .update(artworks)
        .set({ mainImageId: null })
        .where(eq(artworks.mainImageId, imageId));
    }

    // Check if this image is used in secondary images
    const secondaryImageLinks = await db
      .select({ id: artworkSecondaryImages.id })
      .from(artworkSecondaryImages)
      .where(eq(artworkSecondaryImages.imageId, imageId));

    // Delete any secondary image links that reference this image
    if (secondaryImageLinks.length > 0) {
      await db
        .delete(artworkSecondaryImages)
        .where(eq(artworkSecondaryImages.imageId, imageId));
    }

    // Delete the image from UploadThing
    await deleteFileByUrl(imageRecord.url);

    // Delete the image from the database
    await db.delete(images).where(eq(images.id, imageId));

    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}

/**
 * Clean up secondary images for an artwork
 * @param artworkId The ID of the artwork
 * @param keepImageIds Array of image IDs to keep
 * @returns A promise that resolves when the cleanup is complete
 */
export async function cleanupArtworkSecondaryImages(
  artworkId: string,
  keepImageIds: string[]
): Promise<void> {
  // Get all secondary image links for this artwork
  const secondaryImageLinks = await db
    .select({
      linkId: artworkSecondaryImages.id,
      imageId: artworkSecondaryImages.imageId
    })
    .from(artworkSecondaryImages)
    .where(eq(artworkSecondaryImages.artworkId, artworkId));

  // Filter out the image IDs to remove
  const imageIdsToRemove = secondaryImageLinks
    .filter((link) => !keepImageIds.includes(link.imageId))
    .map((link) => link.imageId);

  if (imageIdsToRemove.length === 0) {
    console.log('No secondary images to remove for artwork:', artworkId);
    return;
  }

  console.log(
    `Removing ${imageIdsToRemove.length} unused secondary images for artwork:`,
    artworkId
  );

  // Get the URLs for the images to remove
  const imagesToRemove = await db
    .select({ id: images.id, url: images.url })
    .from(images)
    .where(inArray(images.id, imageIdsToRemove));

  // Delete the image files from UploadThing
  for (const image of imagesToRemove) {
    await deleteFileByUrl(image.url);
  }

  // Delete the secondary image links from the database
  await db
    .delete(artworkSecondaryImages)
    .where(
      eq(artworkSecondaryImages.artworkId, artworkId) &&
        inArray(artworkSecondaryImages.imageId, imageIdsToRemove)
    );

  // Delete the image records from the database
  await db.delete(images).where(inArray(images.id, imageIdsToRemove));
}

/**
 * Clean up all images for an artwork (when deleting the artwork)
 * @param artworkId The ID of the artwork to clean up
 * @returns A promise that resolves when the cleanup is complete
 */
export async function cleanupAllArtworkImages(
  artworkId: string
): Promise<void> {
  try {
    // Get the artwork's main image ID
    const artwork = await db
      .select({ mainImageId: artworks.mainImageId })
      .from(artworks)
      .where(eq(artworks.id, artworkId))
      .then((res) => res[0]);

    // Get all secondary image links for this artwork
    const secondaryImageLinks = await db
      .select({ imageId: artworkSecondaryImages.imageId })
      .from(artworkSecondaryImages)
      .where(eq(artworkSecondaryImages.artworkId, artworkId));

    const secondaryImageIds = secondaryImageLinks.map((link) => link.imageId);

    // Collect all image IDs to clean up
    const allImageIds = [];
    if (artwork?.mainImageId) {
      allImageIds.push(artwork.mainImageId);
    }
    allImageIds.push(...secondaryImageIds);

    if (allImageIds.length === 0) {
      console.log('No images to clean up for artwork:', artworkId);
      return;
    }

    console.log(
      `Cleaning up ${allImageIds.length} images for artwork:`,
      artworkId
    );

    // Get the URLs for all images
    const imagesToRemove = await db
      .select({ id: images.id, url: images.url })
      .from(images)
      .where(inArray(images.id, allImageIds));

    // Delete the image files from UploadThing
    for (const image of imagesToRemove) {
      await deleteFileByUrl(image.url);
    }

    // Important: First update the artwork to set mainImageId to null
    // This removes the foreign key reference before we delete the images
    await db
      .update(artworks)
      .set({ mainImageId: null })
      .where(eq(artworks.id, artworkId));

    // Delete the secondary image links from the database
    if (secondaryImageIds.length > 0) {
      await db
        .delete(artworkSecondaryImages)
        .where(eq(artworkSecondaryImages.artworkId, artworkId));
    }

    // Now it's safe to delete the image records from the database
    await db.delete(images).where(inArray(images.id, allImageIds));

    console.log('Successfully cleaned up all images for artwork:', artworkId);
  } catch (error) {
    console.error('Error cleaning up artwork images:', error);
    throw error;
  }
}
