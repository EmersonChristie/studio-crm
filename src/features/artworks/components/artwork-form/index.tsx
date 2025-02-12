'use client';

import { useArtworkForm } from '../../hooks/use-artwork-form';
import { ArtworkFormTabs } from './artwork-form-tabs';
import { ArtworkFormActions } from './artwork-form-actions';
import { type Artwork } from '../../types';
import { ArtworkFormValues } from '../../schemas/artwork-schema';
import { Form } from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface ArtworkFormProps {
  mode: 'create' | 'edit';
  artwork?: Artwork; // Only needed for edit mode
}

export function ArtworkForm({ mode, artwork }: ArtworkFormProps) {
  const router = useRouter();
  // Convert DB artwork type to form values type
  const defaultValues: Partial<ArtworkFormValues> | undefined = artwork
    ? {
        title: artwork.title,
        year: artwork.year ?? undefined,
        medium: artwork.medium ?? undefined,
        dimensions: artwork.dimensions ?? undefined,
        status: artwork.status,
        // Add other fields as needed, converting null to undefined where necessary
        mainImage: artwork.mainImage
          ? {
              id: artwork.mainImage.url, // Assuming url can be used as ID
              url: artwork.mainImage.url,
              alt: artwork.mainImage.alt ?? undefined
            }
          : undefined
      }
    : undefined;

  const form = useArtworkForm({
    mode,
    defaultValues
  });

  async function onSubmit(data: ArtworkFormValues) {
    try {
      // TODO: Implement the create/update artwork API call
      console.log('Form submitted:', data);
      toast.success(
        mode === 'create'
          ? 'Artwork created successfully'
          : 'Artwork updated successfully'
      );
      router.push('/dashboard/artwork');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
      console.error('Error submitting form:', error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <ArtworkFormTabs form={form} />
        <ArtworkFormActions form={form} mode={mode} />
      </form>
    </Form>
  );
}
