'use client';

import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ArtworksActions() {
  const router = useRouter();

  return (
    <div className='mt-auto border-t bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Button
            onClick={() => router.push('/dashboard/artwork/new')}
            className='gap-2'
          >
            <PlusIcon className='h-4 w-4' />
            New Artwork
          </Button>
        </div>
      </div>
    </div>
  );
}
