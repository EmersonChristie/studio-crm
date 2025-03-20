import { toast } from 'sonner';
import { ZodSchema } from 'zod';
import { FieldValues, UseFormReturn } from 'react-hook-form';

/**
 * Options for the handleFormSubmit function
 */
export interface FormSubmitOptions<TFormValues extends FieldValues, TResponse> {
  // React Hook Form methods
  form: UseFormReturn<TFormValues>;

  // The action to execute
  action: (values: TFormValues) => Promise<TResponse>;

  // Optional callbacks
  onSuccess?: (data: TResponse) => void | Promise<void>;
  onError?: (error: unknown) => void | Promise<void>;

  // Success message to display
  successMessage?: string;

  // Whether to reset the form on success
  resetOnSuccess?: boolean;
}

/**
 * A helper function to handle form submission with improved error handling and toast notifications
 */
export async function handleFormSubmit<
  TFormValues extends FieldValues,
  TResponse = any
>({
  form,
  action,
  onSuccess,
  onError,
  successMessage = 'Success!',
  resetOnSuccess = true
}: FormSubmitOptions<TFormValues, TResponse>) {
  try {
    // Get form values
    const values = form.getValues();

    // Execute the action
    const response = await action(values);

    // Show success message
    if (successMessage) {
      toast.success(successMessage);
    }

    // Reset form if needed
    if (resetOnSuccess) {
      form.reset(values);
    }

    // Execute success callback
    if (onSuccess) {
      await onSuccess(response);
    }

    return response;
  } catch (error) {
    // Show error message
    const errorMessage =
      error instanceof Error ? error.message : 'Something went wrong';

    toast.error(errorMessage);
    console.error('Form submission error:', error);

    // Execute error callback
    if (onError) {
      await onError(error);
    }

    throw error;
  }
}

/**
 * Validates a form against a Zod schema and adds errors to the form state
 */
export function validateFormWithSchema<T, TFormValues extends FieldValues>(
  form: UseFormReturn<TFormValues>,
  schema: ZodSchema<T>,
  data: unknown
): T | null {
  try {
    return schema.parse(data) as T;
  } catch (error: any) {
    if (error.errors) {
      error.errors.forEach((err: any) => {
        const path = err.path.join('.');
        form.setError(path as any, {
          type: 'manual',
          message: err.message
        });
      });
    }
    return null;
  }
}
