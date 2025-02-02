import { DataTable } from './data-table/data-table';
import { searchParamsCache } from '@/lib/searchparams';
import { getArtworks } from '@/lib/services/artwork.service';
import { columns } from './artwork-tables/columns';
import { ArtworkStatus } from '../types';

export default async function ArtworkListingPage() {
  const page = searchParamsCache.get('page') || undefined;
  const search = searchParamsCache.get('q') || undefined;
  const pageLimit = searchParamsCache.get('limit') || undefined;
  const status =
    (searchParamsCache.get('status') as ArtworkStatus) || undefined;

  const { artworks, total_artworks } = await getArtworks({
    page,
    limit: pageLimit,
    search,
    status
  });

  return (
    <div className='space-y-4'>
      <DataTable
        columns={columns}
        data={artworks}
        totalItems={total_artworks}
      />
    </div>
  );
}
