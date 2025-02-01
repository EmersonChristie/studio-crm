'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { useArtworkView } from '../hooks/use-artwork-view';
import { Artwork } from '../types';
import { useState } from 'react';

export function ArtworkListing() {
  const { data, viewMode, gridColumns } = useArtworkView();
  const [selectedItems, setSelectedItems] = useState(new Set<string>());

  const handleSelect = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  return (
    <div
      className='grid gap-4'
      style={{
        gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`
      }}
    >
      {data.map((artwork: Artwork) => (
        <Card key={artwork.id} className='relative'>
          <div className='absolute right-2 top-2 z-10'>
            <Checkbox
              checked={selectedItems.has(artwork.id)}
              onCheckedChange={() => handleSelect(artwork.id)}
            />
          </div>
          <CardContent className='p-0'>
            <div className='relative aspect-square'>
              {artwork.mainImage && (
                <Image
                  src={artwork.mainImage.url}
                  alt={artwork.mainImage.alt || artwork.title}
                  fill
                  className='rounded-t-lg object-cover'
                />
              )}
            </div>
          </CardContent>
          <CardFooter className='flex flex-col items-start p-4'>
            <h3 className='font-semibold'>{artwork.title}</h3>
            <p className='text-sm text-muted-foreground'>
              {artwork.artist?.name || 'Unknown Artist'}
            </p>
            {artwork.year && (
              <p className='text-sm text-muted-foreground'>{artwork.year}</p>
            )}
            {artwork.dimensions && (
              <p className='text-sm text-muted-foreground'>
                {artwork.dimensions.width} x {artwork.dimensions.height}{' '}
                {artwork.dimensions.unit}
              </p>
            )}
            <p className='mt-2 text-sm'>
              {artwork.price
                ? formatPrice(Number(artwork.price))
                : 'Price on request'}
            </p>
            <span className='mt-1 text-xs capitalize text-muted-foreground'>
              {artwork.status}
            </span>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
