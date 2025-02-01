'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon
} from '@radix-ui/react-icons';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { parseAsInteger, useQueryState } from 'nuqs';

interface DataTablePaginationProps {
  totalItems: number;
  pageSizeOptions?: number[];
}

export function DataTablePagination({
  totalItems,
  pageSizeOptions = [10, 20, 30, 40, 50]
}: DataTablePaginationProps) {
  const [currentPage, setCurrentPage] = useQueryState(
    'page',
    parseAsInteger.withOptions({ shallow: false }).withDefault(1)
  );
  const [pageSize, setPageSize] = useQueryState(
    'limit',
    parseAsInteger
      .withOptions({ shallow: false, history: 'push' })
      .withDefault(10)
  );

  const pageCount = Math.ceil(totalItems / pageSize);

  return (
    <div className='flex flex-col items-center justify-end gap-2 space-x-2 py-2 sm:flex-row'>
      <div className='flex w-full items-center justify-between'>
        <div className='flex-1 text-sm text-muted-foreground'>
          {totalItems > 0 ? (
            <>
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, totalItems)} of {totalItems}{' '}
              entries
            </>
          ) : (
            'No entries found'
          )}
        </div>
        <div className='flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8'>
          <div className='flex items-center space-x-2'>
            <p className='whitespace-nowrap text-sm font-medium'>
              Rows per page
            </p>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                setPageSize(Number(value));
                setCurrentPage(1); // Reset to first page when changing page size
              }}
            >
              <SelectTrigger className='h-8 w-[70px]'>
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side='top'>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className='flex w-full items-center justify-between gap-2 sm:justify-end'>
        <div className='flex w-[150px] items-center justify-center text-sm font-medium'>
          {totalItems > 0 ? (
            <>
              Page {currentPage} of {pageCount}
            </>
          ) : (
            'No pages'
          )}
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            aria-label='Go to first page'
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            <DoubleArrowLeftIcon className='h-4 w-4' aria-hidden='true' />
          </Button>
          <Button
            aria-label='Go to previous page'
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeftIcon className='h-4 w-4' aria-hidden='true' />
          </Button>
          <Button
            aria-label='Go to next page'
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === pageCount}
          >
            <ChevronRightIcon className='h-4 w-4' aria-hidden='true' />
          </Button>
          <Button
            aria-label='Go to last page'
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => setCurrentPage(pageCount)}
            disabled={currentPage === pageCount}
          >
            <DoubleArrowRightIcon className='h-4 w-4' aria-hidden='true' />
          </Button>
        </div>
      </div>
    </div>
  );
}
