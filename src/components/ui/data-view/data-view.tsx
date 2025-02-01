'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../table/data-table';
import { DataGrid } from './data-grid';
import { DataViewToolbar } from './data-view-toolbar';
import { DataViewFilters } from './data-view-filters';
import { ViewMode } from './types';

interface DataViewProps<TData extends { id: string }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalItems: number;
  pageSizeOptions?: number[];
  enableGridView?: boolean;
  viewMode?: ViewMode;
  setViewMode?: (mode: ViewMode) => void;
  onSearch?: (term: string) => void;
  onFilter?: (filters: any) => void;
  onBulkAction?: (action: string, selectedItems: TData[]) => void;
  filterableColumns?: {
    id: string;
    title: string;
    options: { label: string; value: any }[];
  }[];
  bulkActions?: { label: string; value: string }[];
}

export function DataView<TData extends { id: string }, TValue>({
  columns,
  data,
  totalItems,
  pageSizeOptions = [10, 20, 30, 40, 50],
  enableGridView = false,
  viewMode = 'table',
  setViewMode = () => {},
  onSearch,
  onFilter,
  onBulkAction,
  filterableColumns,
  bulkActions
}: DataViewProps<TData, TValue>) {
  const [selectedItems, setSelectedItems] = useState<TData[]>([]);

  return (
    <div className='space-y-4'>
      <DataViewToolbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        enableGridView={enableGridView}
        onSearch={onSearch}
        selectedItems={selectedItems}
        bulkActions={bulkActions}
        onBulkAction={onBulkAction}
      />

      {filterableColumns && (
        <DataViewFilters columns={filterableColumns} onFilter={onFilter} />
      )}

      <div className='flex flex-1 flex-col space-y-4 overflow-hidden'>
        {viewMode === 'table' ? (
          <DataTable
            columns={columns}
            data={data}
            totalItems={totalItems}
            pageSizeOptions={pageSizeOptions}
            onSelectionChange={setSelectedItems}
          />
        ) : (
          <DataGrid
            data={data}
            totalItems={totalItems}
            pageSizeOptions={pageSizeOptions}
            onSelectionChange={setSelectedItems}
          />
        )}
      </div>
    </div>
  );
}
