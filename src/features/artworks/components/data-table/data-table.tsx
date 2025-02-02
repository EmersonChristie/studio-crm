'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  RowSelectionState,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
  VisibilityState
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Artwork } from '../../types';
import React from 'react';
import { DataTableToolbar } from './data-table-toolbar';
import { DataTablePagination } from './data-table-pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon
} from '@radix-ui/react-icons';

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
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      year: false,
      dimensions: false,
      price: false,
      'artist.name': false
    });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      rowSelection,
      sorting,
      columnFilters,
      columnVisibility
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    }
  });

  // Update column visibility based on screen size
  React.useEffect(() => {
    const updateColumnVisibility = () => {
      const screenWidth = window.innerWidth;

      // iPhone SE size and smaller
      const isMobile = screenWidth < 375;
      // iPhone 12/13/14 size
      const isSmallTablet = screenWidth >= 375 && screenWidth < 390;
      // iPad Mini / Small tablets
      const isTablet = screenWidth >= 390 && screenWidth < 768;

      setColumnVisibility({
        year: !isMobile,
        dimensions: !isMobile && !isSmallTablet && !isTablet,
        price: !isMobile && !isSmallTablet,
        'artist.name': !isMobile
      });
    };

    updateColumnVisibility();
    window.addEventListener('resize', updateColumnVisibility);
    return () => window.removeEventListener('resize', updateColumnVisibility);
  }, []);

  React.useEffect(() => {
    if (onRowSelection) {
      const selectedRows = table
        .getSelectedRowModel()
        .rows.map((row) => row.original);
      onRowSelection(selectedRows);
    }
  }, [rowSelection, onRowSelection, table]);

  return (
    <div className='w-full space-y-4'>
      <DataTableToolbar table={table} />

      {/* Wrap table in a scrollable container */}
      <div className='relative rounded-md border'>
        <div className='overflow-hidden'>
          <div className='overflow-x-auto'>
            <div className='inline-block min-w-full align-middle'>
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className='whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold'
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
                            className='whitespace-nowrap px-2 py-2'
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
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
          </div>
        </div>
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
