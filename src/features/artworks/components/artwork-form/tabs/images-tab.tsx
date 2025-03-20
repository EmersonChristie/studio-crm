'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { ArtworkFormValues } from '../../../schemas/artwork-schema';
import { Button } from '@/components/ui/button';
import {
  GripVertical,
  Image as ImageIcon,
  Trash2,
  Star,
  Plus,
  Loader2
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FileUploader } from '@/features/uploader/components/file-uploader';
import { useUploadFile } from '@/features/uploader/hooks/use-upload-file';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { SecondaryImage, Image as ArtworkImage } from '@/types/artwork';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';

interface ImagesTabProps {
  form: UseFormReturn<ArtworkFormValues>;
}

// Interface for sortable image item component
interface SortableImageProps {
  id: string;
  index: number;
  children: React.ReactNode;
}

// Component for sortable image cards
function SortableImage({ id, index, children }: SortableImageProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div ref={setNodeRef} style={style} className='h-full'>
      <div className='flex h-full flex-col rounded-lg border bg-card'>
        <div
          className='flex cursor-move items-center gap-2 border-b px-3 py-2'
          {...attributes}
          {...listeners}
        >
          <div>
            <GripVertical className='h-5 w-5 text-muted-foreground' />
          </div>
          <span className='text-sm font-medium'>Image {index + 1}</span>
        </div>
        <div className='flex-1 p-4'>{children}</div>
      </div>
    </div>
  );
}

// Loading Image Card component - shown while an image is uploading
function LoadingImageCard({
  progress,
  filename
}: {
  progress: number;
  filename: string;
}) {
  return (
    <div className='flex h-full flex-col rounded-lg border bg-card'>
      <div className='flex items-center gap-2 border-b px-3 py-2'>
        <Loader2 className='h-5 w-5 animate-spin text-muted-foreground' />
        <span className='truncate text-sm font-medium'>
          Uploading {filename}
        </span>
      </div>
      <div className='flex-1 p-4'>
        <div className='flex h-full flex-col'>
          <div className='relative flex aspect-square w-full items-center justify-center rounded-md bg-muted/20'>
            <div className='flex flex-col items-center'>
              <div className='relative h-16 w-16'>
                <svg className='absolute' viewBox='0 0 100 100'>
                  <circle
                    className='stroke-current text-muted'
                    strokeWidth='8'
                    cx='50'
                    cy='50'
                    r='40'
                    fill='transparent'
                  ></circle>
                  <circle
                    className='stroke-current text-primary'
                    strokeWidth='8'
                    strokeLinecap='round'
                    cx='50'
                    cy='50'
                    r='40'
                    fill='transparent'
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                  ></circle>
                </svg>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <span className='text-sm font-medium'>
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>
              <span className='mt-4 text-sm text-muted-foreground'>
                {progress < 100 ? 'Uploading...' : 'Processing...'}
              </span>
            </div>
          </div>
          <div className='mt-4 space-y-4'>
            <div className='h-6 w-full animate-pulse rounded bg-muted'></div>
            <div className='h-24 w-full animate-pulse rounded bg-muted'></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Metadata form component for both main and secondary images
function ImageMetadataForm({
  image,
  onUpdate,
  prefix = ''
}: {
  image: ArtworkImage;
  onUpdate: (key: string, value: string) => void;
  prefix?: string;
}) {
  return (
    <div className='mt-4 space-y-4'>
      <div>
        <label htmlFor={`${prefix}alt`} className='text-sm font-medium'>
          Alt Text
        </label>
        <FormDescription className='text-xs'>
          Add descriptive text to help accessibility
        </FormDescription>
        <Input
          id={`${prefix}alt`}
          value={image.alt || ''}
          onChange={(e) => onUpdate('alt', e.target.value)}
          placeholder='Describe the image for accessibility'
          className='mt-1'
        />
      </div>
      <div>
        <label htmlFor={`${prefix}name`} className='text-sm font-medium'>
          Image Name
        </label>
        <Input
          id={`${prefix}name`}
          value={image.name || ''}
          onChange={(e) => onUpdate('name', e.target.value)}
          placeholder='Give this image a name'
          className='mt-1'
        />
      </div>
      {image.size && (
        <div className='text-xs text-muted-foreground'>
          Size: {(image.size / 1024 / 1024).toFixed(2)} MB
        </div>
      )}
    </div>
  );
}

export function ImagesTab({ form }: ImagesTabProps) {
  // State to track which image is the main image (by ID)
  const [mainImageId, setMainImageId] = useState<string | null>(null);

  // State to track uploading files
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, number>>(
    {}
  );

  // Get all secondary images from the form
  const secondaryImages = form.watch('secondaryImages') || [];
  const mainImage = form.watch('mainImage');

  // Initialize mainImageId from the main image if available
  useEffect(() => {
    const currentMainImage = form.getValues('mainImage');
    if (currentMainImage?.id) {
      setMainImageId(currentMainImage.id);
    }
  }, [form]);

  // Hook for handling file uploads
  const { onUpload, progresses, isUploading, resetProgresses } = useUploadFile(
    'imageUploader',
    {
      onUploadComplete: (files) => {
        handleUploadComplete(files);
      }
    }
  );

  // Update uploadingFiles state when progresses change
  useEffect(() => {
    setUploadingFiles(progresses);
  }, [progresses]);

  // Set up drag sensors for DnD functionality
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  // Function to convert uploaded files into SecondaryImage objects
  const handleUploadComplete = (files: any[]) => {
    console.log('Upload complete response:', files);

    if (!files || files.length === 0) {
      toast.error('No files were uploaded successfully');
      return;
    }

    // Get current images
    const currentImages = [...(form.getValues('secondaryImages') || [])];
    const newImages: SecondaryImage[] = [];

    // Convert each uploaded file to a SecondaryImage
    files.forEach((file, index) => {
      // Ensure we have valid file data
      if (!file?.url) {
        console.error('Invalid file data received:', file);
        return;
      }

      const newImage: SecondaryImage = {
        id: crypto.randomUUID(),
        url: file.url,
        alt: file.name || '',
        name: file.name,
        size: file.size,
        type: 'image',
        position: currentImages.length + index
      };
      newImages.push(newImage);
    });

    if (newImages.length === 0) {
      toast.error('Failed to process uploaded images');
      return;
    }

    // If we have no main image yet, set the first uploaded image as the main image
    if (!form.getValues('mainImage') && newImages.length > 0) {
      const firstImage = newImages[0];
      // Only use the allowed properties from BaseImage
      const mainImageData = {
        url: firstImage.url,
        alt: firstImage.alt,
        name: firstImage.name,
        size: firstImage.size,
        type: firstImage.type
      };

      form.setValue('mainImage', mainImageData);

      // Store the ID separately for UI purposes
      if (firstImage.id) {
        setMainImageId(firstImage.id);
      }

      // Remove the first image if it's been set as the main image
      newImages.shift();
    }

    // Update the form with the new images
    form.setValue('secondaryImages', [...currentImages, ...newImages], {
      shouldValidate: true,
      shouldDirty: true
    });

    toast.success(
      `${newImages.length + (form.getValues('mainImage') && !mainImageId ? 1 : 0)} image${newImages.length + (form.getValues('mainImage') && !mainImageId ? 1 : 0) > 1 ? 's' : ''} uploaded successfully`
    );

    // Clear progress bars after successful upload
    resetProgresses();
  };

  // Function to handle image reordering when dragging ends
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = active.data.current?.sortable.index;
    const newIndex = over.data.current?.sortable.index;

    if (typeof oldIndex !== 'number' || typeof newIndex !== 'number') return;

    const items = form.getValues().secondaryImages || [];
    const newItems = arrayMove(items, oldIndex, newIndex).map(
      (item, index) => ({
        ...item,
        position: index
      })
    );

    form.setValue('secondaryImages', newItems, {
      shouldValidate: true,
      shouldDirty: true
    });
  };

  // Set an image as the main image
  const setAsMainImage = (image: SecondaryImage, index: number) => {
    try {
      // Get current secondary images
      const currentImages = [...(form.getValues('secondaryImages') || [])];

      console.log(`Setting image at index ${index} as main image`, image);

      // Store the current main image to secondary if it exists
      const currentMain = form.getValues('mainImage');
      if (currentMain && currentMain.url) {
        // Create a secondary image from the current main image
        const mainAsSecondary: SecondaryImage = {
          id: mainImageId || crypto.randomUUID(),
          url: currentMain.url,
          alt: currentMain.alt || '',
          name: currentMain.name || '',
          size: currentMain.size,
          type: currentMain.type || 'image',
          position: currentImages.length
        };
        currentImages.push(mainAsSecondary);
      }

      // Remove the selected image from secondary images
      currentImages.splice(index, 1);

      // Set the selected image as the main image (only using the allowed properties)
      const mainImageData = {
        url: image.url,
        alt: image.alt,
        name: image.name,
        size: image.size,
        type: image.type
      };

      // Update form values
      form.setValue('mainImage', mainImageData, {
        shouldValidate: true,
        shouldDirty: true
      });
      setMainImageId(image.id);

      // Update secondary images with corrected positions
      const updatedImages = currentImages.map((img, idx) => ({
        ...img,
        position: idx
      }));

      form.setValue('secondaryImages', updatedImages, {
        shouldValidate: true,
        shouldDirty: true
      });

      // Force re-renders by triggering validation
      form.trigger('mainImage');
      form.trigger('secondaryImages');

      toast.success('Main image updated');
    } catch (error) {
      console.error('Error setting main image:', error);
      toast.error('Failed to set main image');
    }
  };

  // Function to remove an image
  const removeImage = (index: number) => {
    try {
      // Get current images before modification
      const currentImages = [...(form.getValues('secondaryImages') || [])];

      // Log for debugging
      console.log(
        `Removing image at index ${index}. Before: ${currentImages.length} images`
      );

      if (index < 0 || index >= currentImages.length) {
        console.error(
          `Invalid index ${index} for removal. Array length: ${currentImages.length}`
        );
        toast.error('Could not remove image: invalid index');
        return;
      }

      // Remove the image at the specified index
      currentImages.splice(index, 1);

      console.log(`After removal: ${currentImages.length} images`);

      // Update the positions of remaining images
      const updatedImages = currentImages.map((img, idx) => ({
        ...img,
        position: idx
      }));

      // Update the form with the new images array
      form.setValue('secondaryImages', updatedImages, {
        shouldValidate: true,
        shouldDirty: true
      });

      // Force a re-render by triggering a form update
      form.trigger('secondaryImages');

      toast.success('Image removed');
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Failed to remove image');
    }
  };

  // Function to remove the main image
  const removeMainImage = () => {
    form.setValue('mainImage', null);
    setMainImageId(null);
    toast.success('Main image removed');
  };

  // Function to update main image metadata
  const updateMainImageMetadata = (key: string, value: string) => {
    const currentMain = form.getValues('mainImage');
    if (currentMain) {
      form.setValue(
        'mainImage',
        {
          ...currentMain,
          [key]: value
        },
        {
          shouldValidate: true,
          shouldDirty: true
        }
      );
    }
  };

  // Function to update secondary image metadata
  const updateSecondaryImageMetadata = (
    index: number,
    key: string,
    value: string
  ) => {
    const currentImages = [...(form.getValues('secondaryImages') || [])];
    if (currentImages[index]) {
      currentImages[index] = {
        ...currentImages[index],
        [key]: value
      };

      form.setValue('secondaryImages', currentImages, {
        shouldValidate: true,
        shouldDirty: true
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Artwork Images</CardTitle>
      </CardHeader>
      <CardContent className='space-y-8'>
        {/* Main Upload Component for All Images */}
        <div className='space-y-4'>
          <FormLabel>Upload Images</FormLabel>
          <FormItem>
            <FormControl>
              <div
                className={isUploading ? 'pointer-events-none opacity-50' : ''}
              >
                <FileUploader
                  maxFileCount={10}
                  multiple={true}
                  onValueChange={(files) => {
                    if (files.length > 0) {
                      console.log('Files selected for upload:', files.length);
                      onUpload(files);
                      // Clear the file input's value after starting the upload
                      // This ensures the files list doesn't show up in the FileUploader's default UI
                      setTimeout(() => {
                        const fileInput =
                          document.querySelector('input[type="file"]');
                        if (fileInput) {
                          (fileInput as HTMLInputElement).value = '';
                        }
                      }, 100);
                    }
                  }}
                  maxSize={8 * 1024 * 1024} // 8MB to match backend config
                  disabled={isUploading}
                  accept={{
                    'image/*': []
                  }}
                  value={[]} // Always keep the value as an empty array to prevent showing files
                  hideFilesDisplay={true} // Hide the default files display
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>

        {/* Main Image Display with Metadata Form */}
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <FormLabel>Main Image</FormLabel>
            {mainImage && (
              <Button
                type='button'
                variant='destructive'
                size='sm'
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeMainImage();
                }}
              >
                <Trash2 className='mr-2 h-4 w-4' />
                Remove Main Image
              </Button>
            )}
          </div>
          <FormField
            control={form.control}
            name='mainImage'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className='rounded-lg border p-4'>
                    {field.value ? (
                      <div className='space-y-4'>
                        <div className='flex flex-col gap-6 md:flex-row'>
                          <div className='relative aspect-video w-full md:w-1/2'>
                            <Image
                              src={field.value.url}
                              alt={field.value.alt || 'Main artwork image'}
                              fill
                              sizes='(max-width: 768px) 100vw, 600px'
                              className='rounded-md object-contain'
                            />
                          </div>
                          <div className='w-full md:w-1/2'>
                            <h3 className='mb-2 text-lg font-medium'>
                              Main Image Metadata
                            </h3>
                            <ImageMetadataForm
                              image={field.value}
                              onUpdate={updateMainImageMetadata}
                              prefix='main_'
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className='flex h-40 flex-col items-center justify-center rounded-md bg-muted/20'>
                        <ImageIcon className='mb-2 h-10 w-10 text-muted-foreground' />
                        <p className='text-sm text-muted-foreground'>
                          No main image selected
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          Upload images and select one as main
                        </p>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Secondary Images Display with DnD as Grid */}
        <div className='space-y-4'>
          <FormLabel>Additional Images</FormLabel>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {/* Loading Cards - Show for files currently uploading */}
            {Object.entries(uploadingFiles).map(([filename, progress]) => (
              <LoadingImageCard
                key={`loading-${filename}`}
                progress={progress}
                filename={filename}
              />
            ))}
          </div>

          {secondaryImages.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                <SortableContext
                  items={secondaryImages}
                  strategy={rectSortingStrategy}
                >
                  {secondaryImages.map((image, index) => (
                    <SortableImage key={image.id} id={image.id} index={index}>
                      <div className='flex h-full flex-col'>
                        <div className='relative aspect-square w-full'>
                          <Image
                            src={image.url}
                            alt={image.alt || `Image ${index + 1}`}
                            fill
                            sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                            className='rounded-md object-cover'
                          />
                        </div>

                        <div className='mt-4 flex-1'>
                          <ImageMetadataForm
                            image={image}
                            onUpdate={(key, value) =>
                              updateSecondaryImageMetadata(index, key, value)
                            }
                            prefix={`sec_${index}_`}
                          />
                        </div>

                        <div className='mt-4 flex justify-between border-t pt-4'>
                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent event from bubbling to DnD handlers
                              setAsMainImage(image, index);
                            }}
                          >
                            <Star className='mr-2 h-4 w-4' />
                            Set as Main
                          </Button>
                          <Button
                            type='button'
                            variant='destructive'
                            size='sm'
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent event from bubbling to DnD handlers
                              removeImage(index);
                            }}
                          >
                            <Trash2 className='mr-2 h-4 w-4' />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </SortableImage>
                  ))}
                </SortableContext>
              </div>
            </DndContext>
          ) : isUploading ? null : (
            <div className='flex h-32 flex-col items-center justify-center rounded-md bg-muted/20'>
              <p className='text-sm text-muted-foreground'>
                No additional images
              </p>
              <p className='text-xs text-muted-foreground'>
                Upload images above to add them here
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
