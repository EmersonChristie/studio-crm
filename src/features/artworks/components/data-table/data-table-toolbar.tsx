'use client';

import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from './data-table-view-options';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { Artwork } from '../../types';

interface DataTableToolbarProps {
  table: Table<Artwork>;
}

export function DataTableToolbar({ table }: DataTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className='flex w-full flex-wrap items-center justify-between gap-2'>
      <div className='flex flex-wrap items-center gap-2'>
        <Input
          placeholder='Filter artworks...'
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('title')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />
        {table.getColumn('status') && (
          <DataTableFacetedFilter
            column={table.getColumn('status')}
            title='Status'
            options={[
              { value: 'available', label: 'Available' },
              { value: 'sold', label: 'Sold' },
              { value: 'reserved', label: 'Reserved' },
              { value: 'not_for_sale', label: 'Not For Sale' }
            ]}
          />
        )}
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <div className='flex-none'>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
