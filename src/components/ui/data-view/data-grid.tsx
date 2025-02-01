'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { useState } from 'react';

interface DataGridProps<TData> {
  data: TData[];
  totalItems: number;
  pageSizeOptions?: number[];
  onSelectionChange?: (items: TData[]) => void;
}

export function DataGrid<TData extends { id: string }>({
  data,
  totalItems,
  pageSizeOptions,
  onSelectionChange
}: DataGridProps<TData>) {
  const [selectedItems, setSelectedItems] = useState(new Set<string>());

  const handleSelect = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);

    if (onSelectionChange) {
      const selectedData = data.filter((item) => newSelected.has(item.id));
      onSelectionChange(selectedData);
    }
  };

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {data.map((item: any) => (
        <Card key={item.id} className='relative'>
          <div className='absolute right-2 top-2 z-10'>
            <Checkbox
              checked={selectedItems.has(item.id)}
              onCheckedChange={() => handleSelect(item.id)}
            />
          </div>
          <CardContent className='p-0'>
            <div className='relative aspect-square'>
              {item.mainImage && (
                <Image
                  src={item.mainImage.url}
                  alt={item.mainImage.alt || item.title}
                  fill
                  className='rounded-t-lg object-cover'
                />
              )}
            </div>
          </CardContent>
          <CardFooter className='flex flex-col items-start p-4'>
            <h3 className='font-semibold'>{item.title}</h3>
            <p className='text-sm text-muted-foreground'>
              {item.artist?.name || 'Unknown Artist'}
            </p>
            {item.year && (
              <p className='text-sm text-muted-foreground'>{item.year}</p>
            )}
            {item.dimensions && (
              <p className='text-sm text-muted-foreground'>{item.dimensions}</p>
            )}
            <p className='mt-2 text-sm'>
              {item.price
                ? formatPrice(Number(item.price))
                : 'Price on request'}
            </p>
            <span className='mt-1 text-xs capitalize text-muted-foreground'>
              {item.status}
            </span>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
