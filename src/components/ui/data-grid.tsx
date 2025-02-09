'use client';

import { Table, flexRender, Row, Cell } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { Checkbox } from './checkbox';
import { useCallback, useRef } from 'react';

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
  const lastSelectedRef = useRef<number | null>(null);

  // Get all columns in their original order
  const allColumns = table.getAllColumns();
  const startIndex = 2;
  const visibleTextColumns = allColumns
    .slice(startIndex)
    .filter((column) => column.getIsVisible() && column.id !== 'select')
    .slice(0, 4);

  const handleSelection = useCallback(
    (
      index: number,
      checked: boolean,
      event: React.MouseEvent<HTMLDivElement>
    ) => {
      const rows = table.getRowModel().rows;

      if (event.shiftKey && lastSelectedRef.current !== null) {
        // Get the range of indices to select
        const start = Math.min(lastSelectedRef.current, index);
        const end = Math.max(lastSelectedRef.current, index);

        // Select all rows in the range
        for (let i = start; i <= end; i++) {
          rows[i].toggleSelected(checked);
        }
      } else {
        // Normal selection
        rows[index].toggleSelected(checked);
        lastSelectedRef.current = checked ? index : null;
      }
    },
    [table]
  );

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      {table.getRowModel().rows.map((row, index) => {
        const imageValue = row.getValue(imageKey) as string;

        return (
          <div
            key={row.id}
            className={cn(
              'group relative rounded-lg border p-4 transition-colors',
              row.getIsSelected() && 'bg-muted'
            )}
          >
            {/* Selection checkbox */}
            <div className='absolute right-2 top-2 z-10'>
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(checked) => {
                  if (checked !== 'indeterminate') {
                    handleSelection(
                      index,
                      checked,
                      new KeyboardEvent('keydown', {
                        shiftKey: true
                      }) as unknown as React.MouseEvent<HTMLDivElement>
                    );
                  }
                }}
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
              {visibleTextColumns.map((column, colIndex) => {
                const cell = row
                  .getAllCells()
                  .find((c) => c.column.id === column.id);

                return (
                  <div
                    key={column.id}
                    className={cn(
                      'line-clamp-1',
                      colIndex === 0
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
