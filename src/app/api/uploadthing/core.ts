import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { images } from '@/lib/db/schema';
import { ratelimit } from '@/lib/utils/rate-limit';

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: '4MB' } })
    .middleware(async () => {
      // Check user is authenticated
      // const session = await auth();
      // if (!session) throw new Error("Unauthorized");

      return { userId: 'test' }; // Add user data to middleware response
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId);
      console.log('File URL:', file.url);
    })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
