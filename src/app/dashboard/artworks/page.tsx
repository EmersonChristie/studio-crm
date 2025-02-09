import PageContainer from '@/components/layout/page-container';
import { ArtworksActions } from '@/features/artworks/components/artworks-actions';
import { ArtworksTable } from '@/features/artworks/components/artworks-table';

export default function ArtworksPage() {
  return (
    <PageContainer>
      <div className='flex min-h-[calc(100vh-52px)] flex-col'>
        <div className='flex-1'>
          <ArtworksTable />
        </div>
        <ArtworksActions />
      </div>
    </PageContainer>
  );
}
