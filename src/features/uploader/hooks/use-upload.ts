'use client';

import { useState } from 'react';
import { generateReactHelpers } from '@uploadthing/react';
import type { OurFileRouter } from '@/app/api/uploadthing/core';
import { toast } from 'sonner';

export type UploadedFile = {
  url: string;
  name: string;
  size: number;
  key: string;
};

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

interface UseUploadOptions {
  onComplete?: (file: UploadedFile) => void;
  onError?: (error: Error) => void;
}

export function useUpload({ onComplete, onError }: UseUploadOptions = {}) {
  const [preview, setPreview] = useState<string | null>(null);

  const { startUpload, isUploading } = useUploadThing('imageUploader', {
    onClientUploadComplete: (res) => {
      const file = res?.[0];
      if (!file) return;

      const uploadedFile = {
        url: file.url,
        name: file.name,
        size: file.size,
        key: file.key
      };

      onComplete?.(uploadedFile);
    },
    onUploadError: (error) => {
      toast.error('Upload failed');
      onError?.(error);
    }
  });

  const handleFileChange = async (file: File | null) => {
    if (!file) {
      setPreview(null);
      return;
    }

    // Set preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    await startUpload([file]);
  };

  return {
    preview,
    isUploading,
    handleFileChange
  };
}
