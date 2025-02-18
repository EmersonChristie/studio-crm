'use client';

import { useArtworkForm } from '../../hooks/use-artwork-form';
import { ArtworkFormTabs } from './artwork-form-tabs';
import { ArtworkFormActions } from './artwork-form-actions';
import { type Artwork } from '../../types';
import { ArtworkFormValues } from '../../schemas/artwork-schema';
import { Form } from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createArtwork } from '@/lib/services/artwork.service';
import { useSession } from 'next-auth/react';

interface ArtworkFormProps {
  mode: 'create' | 'edit';
  artwork?: Artwork; // Only needed for edit mode
}

export function ArtworkForm({ mode, artwork }: ArtworkFormProps) {
  const router = useRouter();
  const { data: session } = useSession();

  // Convert DB artwork type to form values type
  const defaultValues: Partial<ArtworkFormValues> = {
    title: artwork?.title ?? '',
    year: artwork?.year,
    medium: artwork?.medium ?? null,
    width: artwork?.width,
    height: artwork?.height,
    depth: artwork?.depth,
    dimensions: artwork?.dimensions ?? null,
    status: artwork?.status ?? 'available',
    mainImage: artwork?.mainImage
      ? {
          url: artwork.mainImage.url,
          alt: artwork.mainImage.alt
        }
      : null
  };

  const form = useArtworkForm({
    mode,
    defaultValues
  });

  async function onSubmit(data: ArtworkFormValues) {
    try {
      if (!session?.user?.id) {
        toast.error('You must be logged in to create artworks');
        return;
      }

      // Create dimensions string
      const dimensions = createDimensionsString(
        data.height ?? undefined,
        data.width ?? undefined,
        data.depth ?? undefined
      );

      if (mode === 'create') {
        await createArtwork({
          title: data.title,
          year: data.year ?? undefined,
          medium: data.medium ?? undefined,
          dimensions, // Use the generated dimensions string
          width: data.width ?? undefined,
          height: data.height ?? undefined,
          depth: data.depth ?? undefined,
          status: data.status,
          artistId: session.user.id
        });

        toast.success('Artwork created successfully');
      } else {
        // TODO: Implement edit mode
        toast.success('Artwork updated successfully');
      }

      router.push('/dashboard/artwork');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
      console.error('Error submitting form:', error);
    }
  }

  // Helper function to create dimensions string
  function createDimensionsString(
    height?: number,
    width?: number,
    depth?: number
  ): string | undefined {
    if (!height && !width) return undefined;

    const dimensions = [height, width]
      .filter(Boolean)
      .map((dim) => dim?.toFixed(1))
      .join(' × ');

    if (depth) {
      return `${dimensions} × ${depth.toFixed(1)} in`;
    }

    return `${dimensions} in`;
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
