'use client';
import { Artwork } from '@/features/artworks/types';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import { CellAction } from './cell-action';
import { formatPrice } from '@/lib/utils';

export const columns: ColumnDef<Artwork>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'mainImage',
    header: 'IMAGE',
    cell: ({ row }) => {
      const mainImage = row.original.mainImage;
      return mainImage ? (
        <div className='relative aspect-square w-20'>
          <Image
            src={mainImage.url}
            alt={mainImage.alt || row.original.title}
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
    id: 'artist',
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
      return price ? formatPrice(Number(price)) : 'N/A';
    }
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell: ({ row }) => <span className='capitalize'>{row.original.status}</span>
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
