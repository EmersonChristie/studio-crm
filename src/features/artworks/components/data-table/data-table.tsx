'use client';

import { ColumnDef, flexRender } from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Artwork } from '../../types';
import React from 'react';
import { DataTableToolbar } from './data-table-toolbar';
import { DataTablePagination } from './data-table-pagination';
import { useDataTable } from '@/hooks/use-data-table';
import { ViewToggle } from '@/components/ui/view-toggle';
import { DataGrid } from '@/components/ui/data-grid';
import { ArtworkDisplay } from '@/components/ui/artwork-display';

interface DataTableProps {
  columns: ColumnDef<Artwork, any>[];
  data: Artwork[];
  totalItems: number;
  onRowSelection?: (rows: Artwork[]) => void;
}

export function DataTable({
  columns,
  data,
  totalItems,
  onRowSelection
}: DataTableProps) {
  const { table, view, setView, debugState } = useDataTable({
    data,
    columns,
    initialVisibility: {
      year: false,
      dimensions: false,
      price: false,
      'artist.name': false
    }
  });

  // Log state changes
  React.useEffect(() => {
    console.log('Table State:', debugState);
  }, [debugState]);

  // Handle row selection callback
  React.useEffect(() => {
    if (onRowSelection) {
      onRowSelection(debugState.selectedRows);
    }
  }, [debugState.selectedRows, onRowSelection]);

  return (
    <div className='w-full space-y-4 px-2 md:px-4'>
      <div className='flex items-center justify-between'>
        <DataTableToolbar table={table} />
        <ViewToggle view={view} onViewChange={setView} />
      </div>

      {view === 'table' ? (
        <div className='relative rounded-md border'>
          <ScrollArea className='w-full rounded-md border'>
            <div className='min-w-full'>
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className='whitespace-nowrap px-2 py-3 text-left text-sm font-semibold first:pl-4 last:pr-4'
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                        className='hover:bg-muted/50'
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className='px-2 py-2 first:pl-4 last:pr-4'
                          >
                            <div className='min-w-[80px] overflow-hidden text-ellipsis'>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </div>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className='h-24 text-center'
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
        </div>
      ) : (
        <DataGrid
          table={table}
          imageComponent={ArtworkDisplay}
          imageKey='mainImage'
          getImageProps={(artwork: Artwork) => ({
            shadowIntensity: 0.3,
            alt: artwork.title,
            src: artwork.mainImage?.url || ''
          })}
          onSelect={onRowSelection}
        />
      )}

      <div className='overflow-hidden'>
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
