'use client';

import {
  ColumnDef,
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
  Table
} from '@tanstack/react-table';
import { useState } from 'react';

interface UseDataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  initialVisibility?: VisibilityState;
}

export function useDataTable<TData>({
  data,
  columns,
  initialVisibility = {}
}: UseDataTableProps<TData>) {
  // View state
  const [view, setView] = useState<'table' | 'grid'>('table');

  // Table state
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(initialVisibility);

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
  const currentView = {
    isTable: view === 'table',
    isGrid: view === 'grid'
  };

  // Debug current state
  const debugState = {
    view,
    rowSelection,
    columnFilters,
    sorting,
    pagination,
    columnVisibility,
    selectedRows,
    totalRows: table.getFilteredRowModel().rows.length,
    currentPage: table.getState().pagination.pageIndex + 1,
    pageCount: table.getPageCount()
  };

  return {
    table,
    view,
    setView,
    currentView,
    debugState,
    state: {
      rowSelection,
      columnFilters,
      sorting,
      pagination,
      columnVisibility
    }
  };
}
