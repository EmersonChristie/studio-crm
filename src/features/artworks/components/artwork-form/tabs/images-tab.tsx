'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { ArtworkFormValues } from '../../../schemas/artwork-schema';
import { Button } from '@/components/ui/button';
import { Plus, GripVertical } from 'lucide-react';
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
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FileUploader } from '@/features/uploader/components/file-uploader';
import { useUploadFile } from '@/features/uploader/hooks/use-upload-file';
import { UploadedFilesCard } from '@/features/uploader/components/uploaded-files-card';

interface ImagesTabProps {
  form: UseFormReturn<ArtworkFormValues>;
}

interface FileWithPreview extends File {
  preview?: string;
}

interface SortableImageProps {
  id: string;
  index: number;
  children: React.ReactNode;
}

function SortableImage({ id, index, children }: SortableImageProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className='flex items-start gap-4 rounded-lg border p-4'>
        <div className='mt-3 cursor-move'>
          <GripVertical className='h-5 w-5 text-muted-foreground' />
        </div>
        <div className='flex-1'>{children}</div>
      </div>
    </div>
  );
}

export function ImagesTab({ form }: ImagesTabProps) {
  const { onUpload, progresses, uploadedFiles, isUploading } = useUploadFile(
    'imageUploader',
    {
      onUploadComplete: (files) => {
        const file = files[0];
        if (file) {
          form.setValue('mainImage', {
            url: file.url,
            name: file.name,
            size: file.size,
            type: 'image',
            alt: file.name
          });
        }
      }
    }
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = active.data.current?.sortable.index;
    const newIndex = over.data.current?.sortable.index;

    if (typeof oldIndex !== 'number' || typeof newIndex !== 'number') return;

    const items = form.getValues().secondaryImages || [];
    const newItems = arrayMove(items, oldIndex, newIndex);
    form.setValue('secondaryImages', newItems, { shouldValidate: true });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Artwork Images</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Main Image */}
        <FormField
          control={form.control}
          name='mainImage'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Main Image</FormLabel>
              <FormControl>
                <FileUploader
                  value={
                    field.value?.url
                      ? [
                          new File([field.value.url], field.value.name || '', {
                            type: field.value.type || 'image/jpeg'
                          })
                        ]
                      : []
                  }
                  onValueChange={(files) => {
                    if (files.length > 0) {
                      onUpload(files);
                    } else {
                      field.onChange(undefined);
                    }
                  }}
                  maxFileCount={1}
                  maxSize={4 * 1024 * 1024}
                  progresses={progresses}
                  disabled={isUploading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Secondary Images */}
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <FormLabel>Additional Images</FormLabel>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() => {
                const current = form.getValues('secondaryImages') || [];
                form.setValue('secondaryImages', [
                  ...current,
                  {
                    id: crypto.randomUUID(),
                    url: '',
                    alt: '',
                    position: current.length
                  }
                ]);
              }}
            >
              <Plus className='mr-2 h-4 w-4' />
              Add Image
            </Button>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={form.watch('secondaryImages') || []}
              strategy={verticalListSortingStrategy}
            >
              {form.watch('secondaryImages')?.map((image, index) => (
                <SortableImage key={image.id} id={image.id} index={index}>
                  <FormField
                    control={form.control}
                    name={`secondaryImages.${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUploader
                            value={
                              field.value?.url
                                ? [
                                    new File(
                                      [field.value.url],
                                      field.value.name || '',
                                      {
                                        type: field.value.type || 'image/jpeg'
                                      }
                                    )
                                  ]
                                : []
                            }
                            onValueChange={(files) => {
                              if (files.length > 0) {
                                const file = files[0] as FileWithPreview;
                                field.onChange({
                                  url:
                                    file.preview || URL.createObjectURL(file),
                                  name: file.name,
                                  size: file.size,
                                  type: file.type,
                                  alt: file.name
                                });
                              } else {
                                field.onChange(undefined);
                              }
                            }}
                            maxFileCount={1}
                            maxSize={4 * 1024 * 1024}
                            progresses={progresses}
                            disabled={isUploading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </SortableImage>
              ))}
            </SortableContext>
          </DndContext>
        </div>

        {uploadedFiles.length > 0 ? (
          <UploadedFilesCard uploadedFiles={uploadedFiles} />
        ) : null}
      </CardContent>
    </Card>
  );
}
