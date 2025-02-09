'use client';

import { Artwork } from '../types';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  RowSelectionState,
  PaginationState,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef
} from '@tanstack/react-table';
import { useState } from 'react';

interface UseArtworksTableProps {
  data: Artwork[];
  columns: ColumnDef<Artwork, any>[];
}

export function useArtworksTable({ data, columns }: UseArtworksTableProps) {
  // Table state
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    year: false,
    dimensions: false,
    price: false,
    'artist.name': false
  });

  // Create table instance
  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      sorting,
      columnFilters,
      pagination,
      columnVisibility
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  });

  // Computed values
  const selectedRows = table
    .getSelectedRowModel()
    .rows.map((row) => row.original);
  const totalRows = table.getFilteredRowModel().rows.length;

  // Update column visibility based on screen size
  const updateColumnVisibility = () => {
    const screenWidth = window.innerWidth;
    setColumnVisibility({
      year: screenWidth >= 640, // sm
      dimensions: screenWidth >= 1024, // lg
      price: screenWidth >= 768, // md
      'artist.name': screenWidth >= 640 // sm
    });
  };

  return {
    table,
    state: {
      rowSelection,
      columnFilters,
      sorting,
      pagination,
      columnVisibility
    },
    selectedRows,
    totalRows,
    updateColumnVisibility
  };
}
