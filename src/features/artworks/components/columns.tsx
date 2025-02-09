'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { ArtworkDisplay } from '@/components/ui/artwork-display';
import { Artwork } from '../types';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from './data-table/data-table-column-header';

export const columns: ColumnDef<Artwork>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
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
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => {
      const image = row.getValue('image') as string;
      return (
        <div className='h-[100px] w-[100px] p-2'>
          <ArtworkDisplay src={image} alt={row.getValue('title')} />
        </div>
      );
    }
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Title' />
    )
  },
  {
    accessorKey: 'artist.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Artist' />
    )
  },
  {
    accessorKey: 'year',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Year' />
    )
  },
  {
    accessorKey: 'dimensions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Dimensions' />
    )
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Price' />
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(price);

      return formatted;
    }
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string;

      return (
        <Badge
          variant={
            status === 'available'
              ? 'default'
              : status === 'sold'
                ? 'destructive'
                : status === 'reserved'
                  ? 'outline'
                  : 'secondary'
          }
        >
          {status}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  }
];
