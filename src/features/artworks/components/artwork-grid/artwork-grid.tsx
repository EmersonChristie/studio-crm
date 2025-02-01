'use client';

import { Artwork } from '../../types';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { formatPrice } from '@/lib/utils';

interface ArtworkGridProps {
  data: Artwork[];
  columns: number;
  selectedItems: Set<string>;
  onSelect: (id: string) => void;
}

export function ArtworkGrid({
  data,
  columns,
  selectedItems,
  onSelect
}: ArtworkGridProps) {
  return (
    <div
      className='grid gap-4'
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
      }}
    >
      {data.map((artwork) => (
        <Card key={artwork.id} className='relative'>
          <div className='absolute right-2 top-2 z-10'>
            <Checkbox
              checked={selectedItems.has(artwork.id)}
              onCheckedChange={() => onSelect(artwork.id)}
            />
          </div>
          <CardContent className='p-0'>
            <div className='relative aspect-square'>
              {artwork.mainImage && (
                <Image
                  src={artwork.mainImage.url}
                  alt={artwork.mainImage.alt || artwork.title}
                  fill
                  className='object-cover'
                />
              )}
            </div>
          </CardContent>
          <CardFooter className='flex flex-col items-start p-4'>
            <h3 className='font-semibold'>{artwork.title}</h3>
            <p className='text-sm text-muted-foreground'>
              {artwork.artist?.name || 'Unknown Artist'}
            </p>
            <p className='mt-2 text-sm'>
              {artwork.price ? formatPrice(artwork.price) : 'Price on request'}
            </p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
