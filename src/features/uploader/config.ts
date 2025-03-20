'use client';

export const uploadConfig = {
  maxFileSize: 4 * 1024 * 1024, // 4MB
  acceptedTypes: {
    'image/*': []
  }
} as const;
