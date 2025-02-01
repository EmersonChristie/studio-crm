'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Trash } from 'lucide-react';
import { useState } from 'react';
import { AlertModal } from '@/components/modal/alert-modal';
import { toast } from 'sonner';
import { deleteArtwork } from '@/lib/services/artwork.service';
import { useRouter } from 'next/navigation';

interface BulkActionsProps {
  selectedIds: string[];
}

export function BulkActions({ selectedIds }: BulkActionsProps) {
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();

  const handleBulkDelete = async () => {
    setLoading(true);
    try {
      await Promise.all(selectedIds.map((id) => deleteArtwork(id)));
      toast.success('Selected artworks deleted');
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete artworks');
      console.error(error);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  if (selectedIds.length === 0) return null;

  return (
    <>
      <AlertModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleBulkDelete}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size='sm'>
            Actions <ChevronDown className='ml-2 h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem onClick={() => setShowDeleteModal(true)}>
            <Trash className='mr-2 h-4 w-4' />
            Delete Selected ({selectedIds.length})
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
