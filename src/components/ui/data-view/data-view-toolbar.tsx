'use client';

import { ViewMode } from './types';
import { Input } from '../input';
import { Button } from '../button';
import { LayoutGrid, Table } from 'lucide-react';

interface DataViewToolbarProps<TData> {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  enableGridView: boolean;
  onSearch?: (term: string) => void;
  selectedItems: TData[];
  bulkActions?: { label: string; value: string }[];
  onBulkAction?: (action: string, selectedItems: TData[]) => void;
}

export function DataViewToolbar<TData>({
  viewMode,
  setViewMode,
  enableGridView,
  onSearch,
  selectedItems,
  bulkActions,
  onBulkAction
}: DataViewToolbarProps<TData>) {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center space-x-2'>
        {onSearch && (
          <Input
            placeholder='Search...'
            onChange={(e) => onSearch(e.target.value)}
            className='w-[200px]'
          />
        )}
        {enableGridView && (
          <div className='flex items-center space-x-1'>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size='icon'
              onClick={() => setViewMode('table')}
            >
              <Table className='h-4 w-4' />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size='icon'
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className='h-4 w-4' />
            </Button>
          </div>
        )}
      </div>

      {selectedItems.length > 0 && bulkActions && (
        <div className='flex items-center space-x-2'>
          <span>{selectedItems.length} selected</span>
          {bulkActions.map((action) => (
            <Button
              key={action.value}
              variant='outline'
              onClick={() => onBulkAction?.(action.value, selectedItems)}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
