'use client';

import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { ArtworkFormValues } from '../../schemas/artwork-schema';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

interface ArtworkFormActionsProps {
  form: UseFormReturn<ArtworkFormValues>;
  mode: 'create' | 'edit';
  isSubmitting?: boolean;
}

export function ArtworkFormActions({
  form,
  mode,
  isSubmitting: externalIsSubmitting
}: ArtworkFormActionsProps) {
  const router = useRouter();
  // Use external isSubmitting state if provided, otherwise use form state
  const isSubmitting = externalIsSubmitting ?? form.formState.isSubmitting;
  const isDirty = form.formState.isDirty;

  // Debug logs to help identify the issue
  useEffect(() => {
    console.log('Form state:', {
      isDirty,
      isSubmitting,
      errors: form.formState.errors,
      isValid: form.formState.isValid,
      values: form.getValues()
    });
  }, [form, isDirty, isSubmitting]);

  // Handle cancellation with confirmation if form is dirty
  const handleCancel = () => {
    if (isDirty && !window.confirm('Discard unsaved changes?')) {
      return;
    }
    router.push('/dashboard/artwork');
  };

  // Handle manual form submission
  const handleSubmit = () => {
    console.log('Manual submit clicked');
    form.handleSubmit((data) => {
      console.log('Form data submitted:', data);
    })();
  };

  return (
    <div className='flex justify-end space-x-4 border-t pt-4'>
      <Button
        variant='outline'
        type='button'
        onClick={handleCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button
        type='submit'
        disabled={isSubmitting}
        onClick={() => console.log('Submit button clicked')}
      >
        {isSubmitting ? (
          <span className='flex items-center gap-2'>
            <Loader2 className='h-4 w-4 animate-spin' />
            Saving...
          </span>
        ) : (
          <span>{mode === 'create' ? 'Create Artwork' : 'Save Changes'}</span>
        )}
      </Button>
    </div>
  );
}
