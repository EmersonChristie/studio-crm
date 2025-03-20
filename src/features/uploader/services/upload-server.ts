'use server';

import { UTApi } from 'uploadthing/server';
import { getFileKeyFromUrl } from './upload-service';

// Create UploadThing server API client
const utapi = new UTApi();

/**
 * Delete a file from UploadThing by its URL
 * @param url The URL of the file to delete
 * @returns A promise that resolves when the file is deleted
 */
export async function deleteFileByUrl(url: string) {
  try {
    // Extract the key from the URL
    const fileKey = getFileKeyFromUrl(url);
    if (!fileKey) {
      console.error('Invalid UploadThing URL format:', url);
      return false;
    }

    // Delete the file using the UploadThing API
    await utapi.deleteFiles(fileKey);
    console.log('Successfully deleted file from UploadThing:', fileKey);
    return true;
  } catch (error) {
    console.error('Error deleting file from UploadThing:', error);
    return false;
  }
}

/**
 * Delete multiple files from UploadThing by their URLs
 * @param urls Array of file URLs to delete
 * @returns A promise that resolves to an array of deletion results
 */
export async function deleteFilesByUrls(urls: string[]) {
  const results = await Promise.allSettled(
    urls.map((url) => deleteFileByUrl(url))
  );

  // Count successes and failures
  const succeeded = results.filter(
    (r) => r.status === 'fulfilled' && r.value
  ).length;
  const failed = results.length - succeeded;

  console.log(`Deleted ${succeeded} files, ${failed} failed`);
  return results;
}
