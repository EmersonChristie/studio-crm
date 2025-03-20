import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { images } from '@/lib/db/schema';
import { ratelimit } from '@/lib/utils/rate-limit';

const f = createUploadthing();

// Store uploads temporarily to track usage and enable cleanup of unused files
// Note: This isn't persisted between server restarts - for production use Redis or DB
const pendingUploads = new Map<
  string,
  { key: string; url: string; userId: string; timestamp: number }
>();

// Periodically clean up old pending uploads (older than 24 hours)
const CLEANUP_INTERVAL = 1000 * 60 * 60; // 1 hour
const MAX_AGE = 1000 * 60 * 60 * 24; // 24 hours

// Set up cleanup interval
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    pendingUploads.forEach((upload, key) => {
      if (now - upload.timestamp > MAX_AGE) {
        console.log(`Removing stale pending upload: ${key}`);
        pendingUploads.delete(key);
      }
    });
  }, CLEANUP_INTERVAL);
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: '8MB', maxFileCount: 10 } })
    .middleware(async () => {
      // Check user is authenticated
      const session = await auth();
      const userId = session?.user?.id;

      if (!userId) {
        throw new UploadThingError('Unauthorized');
      }

      // Add rate limiting if needed
      // const { success } = await ratelimit.limit(userId);
      // if (!success) throw new UploadThingError("Rate limit exceeded");

      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId);
      console.log('File URL:', file.url);
      console.log('File key:', file.key);

      // Store this upload in our pending map
      pendingUploads.set(file.key, {
        key: file.key,
        url: file.url,
        userId: metadata.userId,
        timestamp: Date.now()
      });

      // Note: We don't create an image record here - we'll do that when the form is submitted
      // This way we can clean up unused uploads later

      // Return metadata to the client
      return { uploadedBy: metadata.userId };
    })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

/**
 * Get all pending uploads for a user
 */
export function getPendingUploadsForUser(userId: string) {
  const userUploads: { key: string; url: string; timestamp: number }[] = [];

  pendingUploads.forEach((upload) => {
    if (upload.userId === userId) {
      userUploads.push({
        key: upload.key,
        url: upload.url,
        timestamp: upload.timestamp
      });
    }
  });

  return userUploads;
}

/**
 * Mark uploads as used so they don't get cleaned up
 */
export function markUploadsAsUsed(keys: string[]) {
  keys.forEach((key) => {
    pendingUploads.delete(key);
  });
}
