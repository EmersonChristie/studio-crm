'use client';

import { Table, flexRender, Row, Cell } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { Checkbox } from './checkbox';

interface DataGridProps<TData> {
  table: Table<TData>;
  imageComponent: React.ComponentType<any>;
  imageKey: string;
  getImageProps?: (row: TData) => Record<string, any>;
  onSelect?: (selectedItems: TData[]) => void;
}

export function DataGrid<TData>({
  table,
  imageComponent: ImageComponent,
  imageKey,
  getImageProps = () => ({}),
  onSelect
}: DataGridProps<TData>) {
  // Get all columns in their original order
  const allColumns = table.getAllColumns();

  // Find the index after the image column
  //   const startIndex = allColumns.findIndex((col) => col.id === imageKey) + 1;
  const startIndex = 2;

  // Get the next 4 visible columns after the image column
  const visibleTextColumns = allColumns
    .slice(startIndex) // Start after the image column
    .filter((column) => column.getIsVisible() && column.id !== 'select')
    .slice(0, 4); // Take only 4 columns

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      {table.getRowModel().rows.map((row) => {
        const imageValue = row.getValue(imageKey) as string;

        return (
          <div
            key={row.id}
            className={cn(
              'group relative rounded-lg border p-4 transition-colors hover:bg-muted/50',
              row.getIsSelected() && 'bg-muted'
            )}
          >
            {/* Selection checkbox */}
            <div className='absolute right-2 top-2 z-10'>
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label='Select item'
              />
            </div>

            {/* Image component */}
            <div className='mb-4 aspect-square w-full'>
              <ImageComponent
                src={imageValue}
                alt={`Image for ${row.getValue(visibleTextColumns[0]?.id || '')}`}
                {...getImageProps(row.original)}
              />
            </div>

            {/* Text content */}
            <div className='space-y-2'>
              {visibleTextColumns.map((column, index) => {
                const cell = row
                  .getAllCells()
                  .find((c) => c.column.id === column.id);

                return (
                  <div
                    key={column.id}
                    className={cn(
                      'line-clamp-1',
                      // Make first line larger
                      index === 0
                        ? 'text-base font-medium'
                        : 'text-sm text-muted-foreground'
                    )}
                  >
                    {cell &&
                      flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
