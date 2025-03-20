'use server';

import { db } from '@/lib/db';
import { images } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { getPendingUploadsForUser } from '@/app/api/uploadthing/core';
import { deleteFileByUrl } from '../services/upload-server';

/**
 * Find and clean up orphaned UploadThing files for a user
 * @param userId User ID to clean up files for
 * @returns Number of files deleted
 */
export async function cleanupOrphanedUploads(userId: string): Promise<number> {
  try {
    // 1. Get all pending uploads from our in-memory tracker
    const pendingUploads = getPendingUploadsForUser(userId);
    console.log(
      `Found ${pendingUploads.length} pending uploads for user ${userId}`
    );

    if (pendingUploads.length === 0) {
      return 0;
    }

    // 2. Get URLs that are actually stored in the database
    const storedImages = await db.select({ url: images.url }).from(images);

    const storedUrls = new Set(storedImages.map((img) => img.url));
    console.log(`Found ${storedUrls.size} stored image URLs in the database`);

    // 3. Find uploads that aren't in the database
    const orphanedUploads = pendingUploads.filter(
      (upload) => !storedUrls.has(upload.url)
    );
    console.log(`Found ${orphanedUploads.length} orphaned uploads to delete`);

    if (orphanedUploads.length === 0) {
      return 0;
    }

    // 4. Delete the orphaned files from UploadThing
    for (const upload of orphanedUploads) {
      try {
        await deleteFileByUrl(upload.url);
        console.log(`Deleted orphaned file: ${upload.key}`);
      } catch (error) {
        console.error(`Failed to delete file ${upload.key}:`, error);
      }
    }

    return orphanedUploads.length;
  } catch (error) {
    console.error('Error cleaning up orphaned uploads:', error);
    return 0;
  }
}

// Note: We're using a manual approach with a cleanup button in settings
// instead of an automated scheduled job
