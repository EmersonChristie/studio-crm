'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2 } from 'lucide-react';
import { cleanupMyOrphanedUploads } from '@/features/uploader/actions/cleanup-actions';
import { toast } from 'sonner';

interface CleanupButtonProps {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function CleanupButton({
  variant = 'outline',
  size = 'sm',
  className
}: CleanupButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCleanup = async () => {
    try {
      setIsLoading(true);
      const result = await cleanupMyOrphanedUploads();

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to clean up uploads');
      console.error('Cleanup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCleanup}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          Cleaning...
        </>
      ) : (
        <>
          <Trash2 className='mr-2 h-4 w-4' />
          Cleanup Unused Files
        </>
      )}
    </Button>
  );
}
