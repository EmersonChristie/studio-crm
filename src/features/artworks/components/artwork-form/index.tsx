'use client';

import { useArtworkForm } from '../../hooks/use-artwork-form';
import { ArtworkFormTabs } from './artwork-form-tabs';
import { ArtworkFormActions } from './artwork-form-actions';
import { type Artwork, type SecondaryImage } from '@/types/artwork';
import {
  ArtworkFormValues,
  formValuesToCreateData
} from '../../schemas/artwork-schema';
import { Form } from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  createArtwork,
  updateArtwork
} from '@/features/artworks/actions/artwork-actions';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { createDimensionsString } from '../../utils/dimensions';
import { handleFormSubmit } from '@/lib/utils/form-helpers';
import { ErrorBoundary } from '@/components/error-boundary';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ArtworkFormProps {
  mode: 'create' | 'edit';
  artwork?: Artwork; // Only needed for edit mode
}

export function ArtworkForm({ mode, artwork }: ArtworkFormProps) {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      setAuthError(true);
      toast.error('You must be logged in to manage artworks');
    } else if (sessionStatus === 'authenticated') {
      setAuthError(false);
      console.log('User authenticated:', session?.user);
    }
  }, [sessionStatus, session]);

  // Convert secondary images to the expected format with required id and position
  const secondaryImages: SecondaryImage[] =
    artwork?.secondaryImages?.map((image, index) => ({
      url: image.url,
      alt: image.alt,
      name: image.name,
      size: image.size,
      type: image.type,
      id: image.id || `temp-${index}`,
      position: image.position || index
    })) || [];

  // Convert DB artwork type to form values type
  const defaultValues: Partial<ArtworkFormValues> = {
    title: artwork?.title ?? '',
    year: artwork?.year ?? new Date().getFullYear(),
    medium: artwork?.medium ?? null,
    width: artwork?.width ?? null,
    height: artwork?.height ?? null,
    depth: artwork?.depth ?? null,
    dimensions: artwork?.dimensions ?? null,
    description: artwork?.description ?? null,
    status: artwork?.status ?? 'available',
    retailPrice: artwork?.retailPrice ?? undefined,
    productionCosts: artwork?.productionCosts,
    provenance: artwork?.provenance,
    mainImage: artwork?.mainImage ?? null,
    secondaryImages
  };

  const form = useArtworkForm({
    mode,
    defaultValues
  });

  // Log when the form is about to submit
  useEffect(() => {
    // Log when the form is submitting
    if (form.formState.isSubmitting) {
      console.log('Form is submitting...');
    }

    // Log form errors when they change
    if (Object.keys(form.formState.errors).length > 0) {
      console.log('Form errors:', form.formState.errors);
    }
  }, [form.formState.isSubmitting, form.formState.errors]);

  async function onSubmit(data: ArtworkFormValues) {
    console.log('onSubmit called with data:', data);

    // Double check authentication
    if (!session?.user?.id) {
      toast.error('You must be logged in to manage artworks');
      setAuthError(true);
      return;
    }

    setIsSubmitting(true);
    // Show a loading toast
    toast.loading('Creating artwork...');

    try {
      console.log('Starting form submission process');
      await handleFormSubmit({
        form,
        resetOnSuccess: false,
        successMessage:
          mode === 'create'
            ? 'Artwork created successfully'
            : 'Artwork updated successfully',
        action: async (formData) => {
          // Create dimensions string
          const dimensions = createDimensionsString(
            formData.height ?? undefined,
            formData.width ?? undefined,
            formData.depth ?? undefined
          );

          console.log('Computed dimensions:', dimensions);

          // Ensure we have a valid session user ID
          const userId = session.user.id;
          if (!userId) {
            throw new Error('User ID is required');
          }

          // Prepare data for submission, including image data
          const artworkData = {
            ...formValuesToCreateData(formData, userId),
            dimensions,
            // Include the main image and secondary images
            mainImage: formData.mainImage,
            secondaryImages: formData.secondaryImages
          };

          console.log('Prepared artwork data:', artworkData);

          if (mode === 'create') {
            console.log('Creating new artwork');
            const result = await createArtwork(artworkData);
            console.log('Create artwork result:', result);

            if (!result.success) {
              throw new Error(result.message || 'Failed to create artwork');
            }

            return result;
          } else if (artwork?.id) {
            console.log('Updating artwork:', artwork.id);
            const result = await updateArtwork(artwork.id, artworkData);
            console.log('Update artwork result:', result);

            if (!result.success) {
              throw new Error(result.message || 'Failed to update artwork');
            }

            return result;
          } else {
            throw new Error('Missing artwork ID for update operation');
          }
        },
        onSuccess: (response) => {
          console.log('Form submission successful:', response);
          // Clear any loading toast
          toast.dismiss();

          // Show success toast
          toast.success(
            mode === 'create'
              ? 'Artwork created successfully'
              : 'Artwork updated successfully'
          );

          // Navigate back to artwork list
          router.push('/dashboard/artwork');
          router.refresh(); // This forces a refresh of the server components
        },
        onError: (error) => {
          // Clear any loading toast
          toast.dismiss();
          console.error('Form submission error in callback:', error);
        }
      });
    } catch (error) {
      // Clear any loading toast
      toast.dismiss();
      const errorMessage =
        error instanceof Error ? error.message : 'Something went wrong';

      toast.error(errorMessage);
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (authError) {
    return (
      <Alert variant='destructive'>
        <AlertCircle className='h-4 w-4' />
        <AlertTitle>Authentication Error</AlertTitle>
        <AlertDescription>
          You must be logged in to manage artworks. Please sign in and try
          again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <ErrorBoundary>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <ArtworkFormTabs form={form} />
          <ArtworkFormActions
            form={form}
            mode={mode}
            isSubmitting={isSubmitting}
          />
        </form>
      </Form>
    </ErrorBoundary>
  );
}
