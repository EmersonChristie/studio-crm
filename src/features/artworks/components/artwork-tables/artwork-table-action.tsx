'use client';

import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { useArtworkTableFilters } from './use-artwork-table-filters';

export default function ArtworkTableAction() {
  const {
    statusFilter,
    setStatusFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery
  } = useArtworkTableFilters();

  return (
    <div className='flex flex-wrap items-center gap-4'>
      <DataTableSearch
        searchKey='title'
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      />
      <DataTableFilterBox
        filterKey='status'
        title='Status'
        options={[
          { value: 'available', label: 'Available' },
          { value: 'sold', label: 'Sold' },
          { value: 'reserved', label: 'Reserved' },
          { value: 'not_for_sale', label: 'Not For Sale' }
        ]}
        setFilterValue={setStatusFilter}
        filterValue={statusFilter}
      />
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
