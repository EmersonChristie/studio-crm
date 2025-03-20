'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { artworks, images, artworkSecondaryImages } from '@/lib/db/schema';
import {
  CreateArtworkData,
  UpdateArtworkData,
  Image,
  SecondaryImage
} from '@/types/artwork';
import { eq, sql } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';
import { artworkFormSchema } from '../schemas/artwork-schema';
import { AppError } from '@/lib/utils/error-handler';
import { cleanupAllArtworkImages, deleteImage } from '../utils/image-cleanup';
import { cleanupArtworkSecondaryImages } from '../utils/image-cleanup';

// Common error messages
const UNAUTHORIZED_ERROR = 'You must be logged in to perform this action';
const NOT_FOUND_ERROR = 'Artwork not found';
const SERVER_ERROR = 'Something went wrong. Please try again.';

// Add a new interface for creating artwork with images
interface CreateArtworkWithImagesData extends CreateArtworkData {
  mainImage?: Image | null;
  secondaryImages?: SecondaryImage[];
}

// Add a new interface for updating artwork with images
interface UpdateArtworkWithImagesData extends UpdateArtworkData {
  mainImage?: Image | null;
  secondaryImages?: SecondaryImage[];
}

/**
 * Creates a new artwork with images
 */
export async function createArtwork(data: CreateArtworkWithImagesData) {
  console.log('Server action: createArtwork called with data:', data);
  try {
    const session = await auth();
    console.log('Server action: session user:', session?.user);

    if (!session?.user?.id) {
      console.error('Server action: No authenticated user');
      throw new Error(UNAUTHORIZED_ERROR);
    }

    // Validate the artistId matches the current user
    if (data.artistId !== session.user.id) {
      console.error('Server action: User ID mismatch', {
        providedId: data.artistId,
        sessionId: session.user.id
      });
      throw new Error('You cannot create artworks for other artists');
    }

    console.log('Server action: Preparing to insert artwork');

    try {
      // First, save the main image if present
      let mainImageId = data.mainImageId;

      if (data.mainImage?.url && !mainImageId) {
        console.log('Server action: Creating main image record');
        const [mainImageRecord] = await db
          .insert(images)
          .values({
            url: data.mainImage.url,
            alt: data.mainImage.alt || data.title,
            filename: data.mainImage.name,
            size: data.mainImage.size,
            mimeType: data.mainImage.type
          })
          .returning();

        mainImageId = mainImageRecord.id;
        console.log('Server action: Created main image with ID:', mainImageId);
      }

      // Use standard Drizzle ORM insert method
      // Convert number values to strings for decimal fields in the database
      const insertData = {
        title: data.title,
        artistId: data.artistId,
        year: data.year,
        medium: data.medium,
        dimensions: data.dimensions,
        width: data.width !== null ? String(data.width) : null,
        height: data.height !== null ? String(data.height) : null,
        depth: data.depth !== null ? String(data.depth) : null,
        status: data.status,
        mainImageId: mainImageId,
        description: data.description
      };

      console.log('Server action: Insert data prepared:', insertData);

      const [artwork] = await db
        .insert(artworks)
        .values(insertData)
        .returning();

      // Now handle secondary images if present
      if (data.secondaryImages && data.secondaryImages.length > 0) {
        console.log(
          'Server action: Processing secondary images:',
          data.secondaryImages.length
        );

        // Insert all secondary images
        for (const secondaryImage of data.secondaryImages) {
          // First create the image record
          const [imageRecord] = await db
            .insert(images)
            .values({
              url: secondaryImage.url,
              alt: secondaryImage.alt || data.title,
              filename: secondaryImage.name,
              size: secondaryImage.size,
              mimeType: secondaryImage.type
            })
            .returning();

          // Then link it to the artwork with position
          await db.insert(artworkSecondaryImages).values({
            artworkId: artwork.id,
            imageId: imageRecord.id,
            position: secondaryImage.position
          });
        }

        console.log('Server action: Processed all secondary images');
      }

      console.log('Server action: Artwork created successfully', artwork);

      // Revalidate the artworks cache
      revalidateTag('artworks');

      return {
        success: true,
        artwork,
        message: 'Artwork created successfully'
      };
    } catch (dbError) {
      console.error('Server action: Database error:', dbError);
      throw new Error(
        `Database error: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`
      );
    }
  } catch (error) {
    console.error('Server action: Error creating artwork:', error);

    if (error instanceof Error) {
      return {
        success: false,
        message: error.message
      };
    }

    return {
      success: false,
      message: SERVER_ERROR
    };
  }
}

/**
 * Updates an existing artwork
 */
export async function updateArtwork(
  id: string,
  data: UpdateArtworkWithImagesData
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error(UNAUTHORIZED_ERROR);
    }

    // Verify the artwork exists and belongs to the current user
    const existingArtwork = await db
      .select({
        artistId: artworks.artistId,
        mainImageId: artworks.mainImageId
      })
      .from(artworks)
      .where(eq(artworks.id, id))
      .then((res) => res[0]);

    if (!existingArtwork) {
      throw new Error(NOT_FOUND_ERROR);
    }

    if (existingArtwork.artistId !== session.user.id) {
      throw new Error('You do not have permission to update this artwork');
    }

    // Handle main image if present
    let mainImageId = existingArtwork.mainImageId;
    let oldMainImageId = null;

    if (data.mainImage?.url) {
      // Check if the main image has changed
      if (data.mainImageId !== existingArtwork.mainImageId) {
        // Create a new image entry if this is a new image
        console.log('Server action: Updating main image');
        const [mainImageRecord] = await db
          .insert(images)
          .values({
            url: data.mainImage.url,
            alt: data.mainImage.alt || data.title || '',
            filename: data.mainImage.name,
            size: data.mainImage.size,
            mimeType: data.mainImage.type
          })
          .returning();

        // Store the old main image ID for cleanup later
        if (existingArtwork.mainImageId) {
          oldMainImageId = existingArtwork.mainImageId;
        }

        mainImageId = mainImageRecord.id;
        console.log(
          'Server action: Created new main image with ID:',
          mainImageId
        );
      }
    }

    // Create an update object with properly typed values
    const updateData: Record<string, unknown> = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.year !== undefined) updateData.year = data.year;
    if (data.medium !== undefined) updateData.medium = data.medium;
    if (data.dimensions !== undefined) updateData.dimensions = data.dimensions;
    if (data.width !== undefined) updateData.width = data.width;
    if (data.height !== undefined) updateData.height = data.height;
    if (data.depth !== undefined) updateData.depth = data.depth;
    if (data.status !== undefined) updateData.status = data.status;
    if (mainImageId !== undefined) updateData.mainImageId = mainImageId;
    if (data.description !== undefined)
      updateData.description = data.description;

    const [updatedArtwork] = await db
      .update(artworks)
      .set(updateData)
      .where(eq(artworks.id, id))
      .returning();

    // Clean up the old main image if it was replaced
    if (oldMainImageId) {
      await deleteImage(oldMainImageId);
    }

    // Handle secondary images if present
    if (data.secondaryImages) {
      console.log('Server action: Processing secondary images for update');

      // Create new images for all secondary images in the request
      const newSecondaryImageIds: string[] = [];

      for (const secondaryImage of data.secondaryImages) {
        // Create a new image record
        const [imageRecord] = await db
          .insert(images)
          .values({
            url: secondaryImage.url,
            alt: secondaryImage.alt || data.title || '',
            filename: secondaryImage.name,
            size: secondaryImage.size,
            mimeType: secondaryImage.type
          })
          .returning();

        newSecondaryImageIds.push(imageRecord.id);

        // Create a link to the artwork with the proper position
        await db.insert(artworkSecondaryImages).values({
          artworkId: id,
          imageId: imageRecord.id,
          position: secondaryImage.position
        });
      }

      // Clean up any old secondary images that are no longer used
      await cleanupArtworkSecondaryImages(id, newSecondaryImageIds);

      console.log('Server action: Finished processing secondary images');
    }

    // Revalidate cache for this specific artwork and the list
    revalidateTag(`artwork-${id}`);
    revalidateTag('artworks');

    return {
      success: true,
      artwork: updatedArtwork,
      message: 'Artwork updated successfully'
    };
  } catch (error) {
    console.error('Error updating artwork:', error);

    if (error instanceof Error) {
      return {
        success: false,
        message: error.message
      };
    }

    return {
      success: false,
      message: SERVER_ERROR
    };
  }
}

/**
 * Deletes an artwork
 */
export async function deleteArtwork(id: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error(UNAUTHORIZED_ERROR);
    }

    // Verify the artwork exists and belongs to the current user
    const existingArtwork = await db
      .select({ artistId: artworks.artistId })
      .from(artworks)
      .where(eq(artworks.id, id))
      .then((res) => res[0]);

    if (!existingArtwork) {
      throw new Error(NOT_FOUND_ERROR);
    }

    if (existingArtwork.artistId !== session.user.id) {
      throw new Error('You do not have permission to delete this artwork');
    }

    // First, clean up all associated images from UploadThing and the database
    await cleanupAllArtworkImages(id);

    // Then delete the artwork itself
    await db.delete(artworks).where(eq(artworks.id, id));

    // Revalidate cache
    revalidateTag('artworks');

    return {
      success: true,
      message: 'Artwork deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting artwork:', error);

    if (error instanceof Error) {
      return {
        success: false,
        message: error.message
      };
    }

    return {
      success: false,
      message: SERVER_ERROR
    };
  }
}

/**
 * Validates artwork form data
 */
export async function validateArtworkData(data: unknown) {
  try {
    const validatedData = artworkFormSchema.parse(data);
    return {
      success: true,
      data: validatedData
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors
      };
    }
    return {
      success: false,
      message: 'Invalid data provided'
    };
  }
}
