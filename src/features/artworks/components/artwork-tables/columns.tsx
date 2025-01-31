'use client';
import { Artwork } from '@/features/artworks/types';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Artwork>[] = [
  {
    accessorKey: 'mainImage',
    header: 'IMAGE',
    cell: ({ row }) => {
      const image = row.original.mainImage;
      return image ? (
        <div className='relative aspect-square w-20'>
          <Image
            src={image.url}
            alt={image.alt || row.original.title}
            fill
            className='rounded-lg object-cover'
          />
        </div>
      ) : null;
    }
  },
  {
    accessorKey: 'title',
    header: 'TITLE'
  },
  {
    accessorKey: 'year',
    header: 'YEAR',
    cell: ({ row }) => row.original.year || 'N/A'
  },
  {
    accessorKey: 'artist',
    header: 'ARTIST',
    cell: ({ row }) => row.original.artist?.name || 'Unknown'
  },
  {
    accessorKey: 'dimensions',
    header: 'DIMENSIONS',
    cell: ({ row }) => row.original.dimensions || 'N/A'
  },
  {
    accessorKey: 'price',
    header: 'PRICE',
    cell: ({ row }) => {
      const price = row.original.price;
      if (price === null) return 'N/A';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(price);
    }
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell: ({ row }) => {
      return <span className='capitalize'>{row.original.status}</span>;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
