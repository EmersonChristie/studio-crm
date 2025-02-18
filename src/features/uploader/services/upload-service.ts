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

// Optional: Add any additional upload configurations or utilities
export const uploadConfig = {
  maxFileSize: 4 * 1024 * 1024, // 4MB
  acceptedTypes: {
    'image/*': []
  }
} as const;
