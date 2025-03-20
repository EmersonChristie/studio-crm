'use client';

import { generateReactHelpers } from '@uploadthing/react';
import type { OurFileRouter } from '@/app/api/uploadthing/core';

// Create a single source of truth for uploadthing helpers
export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();

// Optional: Add any service-specific utilities here
export async function uploadImage(file: File) {
  try {
    const [res] = await uploadFiles('imageUploader', {
      files: [file]
    });
    return res;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

/**
 * Extract file key from UploadThing URL
 * @param url The UploadThing URL
 * @returns The file key or null if not found
 */
export function getFileKeyFromUrl(url: string): string | null {
  try {
    // UploadThing URLs follow the pattern:
    // https://utfs.io/f/[fileKey]-[filename].[ext]
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');

    // The last part should be like [fileKey]-[filename].[ext]
    const lastPart = pathParts[pathParts.length - 1];

    // Extract everything before the first dash as the key
    const fileKey = lastPart.split('-')[0];

    return fileKey || null;
  } catch (error) {
    console.error('Error extracting file key from URL:', error);
    return null;
  }
}

// Optional: Add any additional upload configurations or utilities
export const uploadConfig = {
  maxFileSize: 8 * 1024 * 1024, // 8MB
  acceptedTypes: {
    'image/*': []
  }
} as const;
