import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { ArtworksView } from '@/features/artworks/components/artworks-view';
import ArtworkTableAction from '@/features/artworks/components/artwork-tables/artwork-table-action';

export default function ArtworkPage() {
  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Artworks'
            description='Manage your gallery artworks'
          />
          <Link
            href='/dashboard/artwork/new'
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <Plus className='mr-2 h-4 w-4' /> Add New
          </Link>
        </div>
        <Separator />
        <ArtworkTableAction />
        <Suspense
          fallback={<DataTableSkeleton columnCount={9} rowCount={10} />}
        >
          <ArtworksView />
        </Suspense>
      </div>
    </PageContainer>
  );
}
