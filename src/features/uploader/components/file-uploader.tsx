'use client';

import * as React from 'react';
import Image from 'next/image';
import { FileText, Upload, X } from 'lucide-react';
import Dropzone, { type DropzoneProps } from 'react-dropzone';
import { toast } from 'sonner';

import { cn, formatBytes } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { uploadConfig } from '../services/upload-service';

interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: File[];
  onValueChange?: (files: File[]) => void;
  onUpload?: (files: File[]) => Promise<void>;
  progresses?: Record<string, number>;
  accept?: DropzoneProps['accept'];
  maxSize?: number;
  maxFileCount?: number;
  multiple?: boolean;
  disabled?: boolean;
}

export function FileUploader({
  value,
  onValueChange,
  onUpload,
  progresses,
  maxFileCount = 1,
  maxSize = uploadConfig.maxFileSize,
  accept = uploadConfig.acceptedTypes,
  disabled = false,
  className,
  ...props
}: FileUploaderProps) {
  const [files, setFiles] = React.useState<File[]>(value || []);

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...files, ...acceptedFiles].slice(0, maxFileCount);
      setFiles(newFiles);
      onValueChange?.(newFiles);
    },
    [files, maxFileCount, onValueChange]
  );

  const onRemove = React.useCallback(
    (index: number) => {
      const newFiles = files.filter((_, i) => i !== index);
      setFiles(newFiles);
      onValueChange?.(newFiles);
    },
    [files, onValueChange]
  );

  React.useEffect(() => {
    if (value) {
      setFiles(value);
    }
  }, [value]);

  return (
    <div className={cn('space-y-4', className)} {...props}>
      <Dropzone
        onDrop={onDrop}
        maxSize={maxSize}
        accept={accept}
        maxFiles={maxFileCount}
        disabled={disabled}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            {...getRootProps()}
            className={cn(
              'relative cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors',
              isDragActive && 'border-primary bg-primary/5',
              disabled && 'cursor-not-allowed opacity-60'
            )}
          >
            <input {...getInputProps()} />
            <div className='flex flex-col items-center gap-2'>
              <Upload className='h-8 w-8 text-gray-400' />
              <p className='text-sm text-gray-600'>
                Drag & drop files here, or click to select files
              </p>
              <p className='text-xs text-gray-500'>
                Max file size: {formatBytes(maxSize)}
              </p>
            </div>
          </div>
        )}
      </Dropzone>

      {files?.length > 0 && (
        <ScrollArea className='h-fit w-full px-3'>
          <div className='flex max-h-48 flex-col gap-4'>
            {files?.map((file, index) => (
              <FileCard
                key={index}
                file={file}
                onRemove={() => onRemove(index)}
                progress={progresses?.[file.name]}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

interface FileCardProps {
  file: File;
  onRemove: () => void;
  progress?: number;
}

function FileCard({ file, progress, onRemove }: FileCardProps) {
  return (
    <div className='relative flex items-center gap-2.5'>
      <div className='flex flex-1 gap-2.5'>
        {isFileWithPreview(file) ? <FilePreview file={file} /> : null}
        <div className='flex w-full flex-col gap-2'>
          <div className='flex flex-col gap-px'>
            <p className='line-clamp-1 text-sm font-medium text-foreground/80'>
              {file.name}
            </p>
            <p className='text-xs text-muted-foreground'>
              {formatBytes(file.size)}
            </p>
          </div>
          {progress ? <Progress value={progress} /> : null}
        </div>
      </div>
      <Button
        type='button'
        variant='outline'
        size='icon'
        className='size-7'
        onClick={onRemove}
      >
        <X className='size-4' aria-hidden='true' />
        <span className='sr-only'>Remove file</span>
      </Button>
    </div>
  );
}

function isFileWithPreview(file: File): file is File & { preview: string } {
  return 'preview' in file && typeof file.preview === 'string';
}

interface FilePreviewProps {
  file: File & { preview: string };
}

function FilePreview({ file }: FilePreviewProps) {
  if (file.type.startsWith('image/')) {
    return (
      <Image
        src={file.preview}
        alt={file.name}
        width={48}
        height={48}
        className='aspect-square shrink-0 rounded-md object-cover'
      />
    );
  }

  return (
    <FileText className='size-10 text-muted-foreground' aria-hidden='true' />
  );
}
