'use client';
import { createSelectionColumn } from '../data-table/data-table-column-def';
import { Artwork } from '@/features/artworks/types';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { CellAction } from './cell-action';
import { DataTableColumnHeader } from '../data-table/data-table-column-header';
import { ArtworkDisplay } from '@/components/ui/artwork-display';

export const columns: ColumnDef<Artwork>[] = [
  createSelectionColumn<Artwork>(),
  {
    accessorKey: 'mainImage',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='IMAGE' />
    ),
    cell: ({ row }) => {
      const image = row.original.mainImage;
      return image ? (
        <div className='relative aspect-square w-12 sm:w-16 md:w-20'>
          {/* <Image
            src={image.url}
            alt={image.alt || row.original.title}
            fill
            className='rounded-lg object-cover'
          /> */}
          <ArtworkDisplay
            src={image.url}
            alt={image.alt || row.original.title}

            // className='w-[300px]' // Optional custom size
          />
        </div>
      ) : null;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='TITLE' />
    ),
    cell: ({ row }) => (
      <div className='max-w-[120px] truncate font-medium sm:max-w-[200px] md:max-w-[350px]'>
        {row.getValue('title')}
      </div>
    ),
    enableHiding: false
  },
  {
    accessorKey: 'year',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='YEAR' />
    ),
    cell: ({ row }) => row.original.year || 'N/A'
  },
  {
    accessorKey: 'artist.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ARTIST' />
    ),
    cell: ({ row }) => (
      <div className='max-w-[150px] truncate'>
        {row.original.artist?.name || 'Unknown'}
      </div>
    )
  },
  {
    accessorKey: 'dimensions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='DIMENSIONS' />
    ),
    cell: ({ row }) => row.original.dimensions || 'N/A'
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='PRICE' />
    ),
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='STATUS' />
    ),
    cell: ({ row }) => {
      return <span className='capitalize'>{row.original.status}</span>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableHiding: false
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
    enableSorting: false,
    enableHiding: false
  }
];
