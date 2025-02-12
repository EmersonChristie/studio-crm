import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { ArtworkForm } from '@/features/artworks/components/artwork-form';

export const metadata = {
  title: 'New Artwork'
};

export default function NewArtworkPage() {
  return (
    <PageContainer>
      <div className='flex flex-col gap-4'>
        <div>
          <Heading
            title='Create New Artwork'
            description='Add a new artwork to your gallery'
          />
          <Separator className='my-4' />
        </div>

        <div className='flex-1 space-y-4 p-1'>
          <ArtworkForm mode='create' />
        </div>
      </div>
    </PageContainer>
  );
}
