'use client';

import { DataView } from '@/components/ui/data-view/data-view';
import { columns } from './artwork-tables/columns';
import { useArtworkView } from '../hooks/use-artwork-view';

export function ArtworksView() {
  const { data, totalItems, viewMode, setViewMode } = useArtworkView();

  return (
    <DataView
      columns={columns}
      data={data}
      totalItems={totalItems}
      enableGridView
      viewMode={viewMode}
      setViewMode={setViewMode}
    />
  );
}
