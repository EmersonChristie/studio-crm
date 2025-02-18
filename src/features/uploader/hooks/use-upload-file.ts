'use client';

import * as React from 'react';
import { toast } from 'sonner';
import type { AnyFileRoute } from 'uploadthing/types';

import { getErrorMessage } from '@/lib/utils/handle-error';
import { uploadFiles } from '../services/upload-service';
import type { OurFileRouter } from '@/app/api/uploadthing/core';
import type { UploadedFile } from '../types';

interface UseUploadFileOptions {
  defaultUploadedFiles?: UploadedFile[];
  onUploadComplete?: (files: UploadedFile[]) => void;
  onUploadError?: (error: Error) => void;
}

export function useUploadFile(
  endpoint: keyof OurFileRouter,
  {
    defaultUploadedFiles = [],
    onUploadComplete,
    onUploadError
  }: UseUploadFileOptions = {}
) {
  const [uploadedFiles, setUploadedFiles] =
    React.useState<UploadedFile[]>(defaultUploadedFiles);
  const [progresses, setProgresses] = React.useState<Record<string, number>>(
    {}
  );
  const [isUploading, setIsUploading] = React.useState(false);

  async function onUpload(files: File[]) {
    setIsUploading(true);
    try {
      const res = await uploadFiles(endpoint, {
        files,
        onUploadProgress: ({ file, progress }) => {
          setProgresses((prev) => ({
            ...prev,
            [file.name]: progress
          }));
        }
      });

      const uploadedFiles = res.map((file) => ({
        url: file.url,
        name: file.name,
        key: file.key,
        size: file.size
      }));

      setUploadedFiles((prev) => [...prev, ...uploadedFiles]);
      onUploadComplete?.(uploadedFiles);
    } catch (err) {
      const error = new Error(getErrorMessage(err));
      toast.error(error.message);
      onUploadError?.(error);
    } finally {
      setProgresses({});
      setIsUploading(false);
    }
  }

  return {
    onUpload,
    uploadedFiles,
    progresses,
    isUploading
  };
}
