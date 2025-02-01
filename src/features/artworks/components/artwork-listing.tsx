'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './artwork-tables/columns';
import { ArtworkGrid } from './artwork-grid/artwork-grid';
import { useArtworkView } from '../hooks/use-artwork-view';
import { ViewToggle } from './artwork-view-toggle';
import { BulkActions } from './artwork-tables/bulk-actions';
import { Artwork } from '../types';
import { DataTablePagination } from '@/components/ui/pagination/data-table-pagination';

interface ArtworkListingProps {
  data: Artwork[];
  totalItems: number;
}

export function ArtworkListing({ data, totalItems }: ArtworkListingProps) {
  const {
    viewMode,
    gridColumns,
    selectedItems,
    toggleViewMode,
    updateGridColumns,
    setSelectedItems
  } = useArtworkView();

  const handleSelect = (id: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <ViewToggle currentView={viewMode} onToggle={toggleViewMode} />
        {selectedItems.size > 0 && (
          <BulkActions selectedIds={Array.from(selectedItems)} />
        )}
      </div>

      {viewMode === 'table' ? (
        <DataTable columns={columns} data={data} totalItems={totalItems} />
      ) : (
        <div className='space-y-4'>
          <ArtworkGrid
            data={data}
            columns={gridColumns}
            selectedItems={selectedItems}
            onSelect={handleSelect}
          />
          <DataTablePagination totalItems={totalItems} />
        </div>
      )}
    </div>
  );
}
