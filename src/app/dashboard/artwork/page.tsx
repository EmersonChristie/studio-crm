import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { searchParamsCache, serialize } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import ArtworkListingPage from '@/features/artworks/components/artwork-listing';
import ArtworkTableAction from '@/features/artworks/components/artwork-tables/artwork-table-action';

export const metadata = {
  title: 'Dashboard: Artworks'
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);
  const key = serialize({ ...searchParams });

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
          key={key}
          fallback={<DataTableSkeleton columnCount={7} rowCount={10} />}
        >
          <ArtworkListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
