'use client';

import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { ArtworkFormValues } from '../../schemas/artwork-schema';
import { useRouter } from 'next/navigation';

interface ArtworkFormActionsProps {
  form: UseFormReturn<ArtworkFormValues>;
  mode: 'create' | 'edit';
}

export function ArtworkFormActions({ form, mode }: ArtworkFormActionsProps) {
  const router = useRouter();
  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className='flex justify-end space-x-4 border-t pt-4'>
      <Button
        variant='outline'
        type='button'
        onClick={() => router.push('/dashboard/artwork')}
      >
        Cancel
      </Button>
      <Button type='submit' disabled={isSubmitting}>
        {isSubmitting ? (
          <span>Saving...</span>
        ) : (
          <span>{mode === 'create' ? 'Create Artwork' : 'Save Changes'}</span>
        )}
      </Button>
    </div>
  );
}
