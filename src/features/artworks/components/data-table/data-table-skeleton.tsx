import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

interface DataTableSkeletonProps {
  columnCount: number;
  rowCount?: number;
  searchableColumnCount?: number;
  filterableColumnCount?: number;
}

export function DataTableSkeleton({
  columnCount,
  rowCount = 10,
  searchableColumnCount = 1,
  filterableColumnCount = 1
}: DataTableSkeletonProps) {
  return (
    <div className='w-full space-y-3 overflow-auto'>
      <div className='flex w-full items-center justify-between space-x-2 overflow-auto p-1'>
        <div className='flex flex-1 items-center space-x-2'>
          {searchableColumnCount > 0 &&
            Array(searchableColumnCount)
              .fill(null)
              .map((_, i) => (
                <Skeleton key={i} className='h-8 w-[150px] lg:w-[250px]' />
              ))}
          {filterableColumnCount > 0 &&
            Array(filterableColumnCount)
              .fill(null)
              .map((_, i) => (
                <Skeleton key={i} className='h-8 w-[70px] border-dashed' />
              ))}
        </div>
        <Skeleton className='ml-auto h-8 w-[70px]' />
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              {Array(columnCount)
                .fill(null)
                .map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className='h-6 w-full' />
                  </TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(rowCount)
              .fill(null)
              .map((_, i) => (
                <TableRow key={i}>
                  {Array(columnCount)
                    .fill(null)
                    .map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className='h-6 w-full' />
                      </TableCell>
                    ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <div className='flex w-full items-center justify-between space-x-2 overflow-auto p-1'>
        <Skeleton className='h-8 w-[100px]' />
        <div className='flex items-center space-x-2'>
          <Skeleton className='h-8 w-[70px]' />
          <Skeleton className='h-8 w-[70px]' />
          <Skeleton className='h-8 w-[70px]' />
        </div>
      </div>
    </div>
  );
}
