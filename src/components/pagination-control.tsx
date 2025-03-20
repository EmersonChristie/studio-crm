'use client';

import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { type PaginationState } from '@/hooks/use-pagination';

export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  paginationState: PaginationState & {
    goToPage: (page: number) => void;
    goToNextPage: () => void;
    goToPrevPage: () => void;
    setLimit: (limit: number) => void;
  };
  showPageSizeSelector?: boolean;
  pageSizeOptions?: number[];
  showItemCount?: boolean;
  compact?: boolean;
  maxPageButtons?: number;
}

/**
 * A reusable pagination component that works with the usePagination hook
 */
export function PaginationControl({
  paginationState,
  showPageSizeSelector = true,
  pageSizeOptions = [5, 10, 25, 50, 100],
  showItemCount = true,
  compact = false,
  maxPageButtons = 5,
  className,
  ...props
}: PaginationProps) {
  const {
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage,
    hasPrevPage,
    startItem,
    endItem,
    goToPage,
    goToNextPage,
    goToPrevPage,
    setLimit
  } = paginationState;

  // Calculate which page buttons to show
  const pageButtons = React.useMemo(() => {
    // Always show the first page, last page, current page, and pages around current
    const buttonCount = Math.min(maxPageButtons, totalPages);
    const halfCount = Math.floor(buttonCount / 2);

    let startPage = Math.max(1, page - halfCount);
    const endPage = Math.min(totalPages, startPage + buttonCount - 1);

    // Adjust startPage if we hit the end
    startPage = Math.max(1, Math.min(startPage, totalPages - buttonCount + 1));

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  }, [page, maxPageButtons, totalPages]);

  return (
    <div
      className={cn(
        'flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between',
        className
      )}
      {...props}
    >
      {/* Item count */}
      {showItemCount && totalItems > 0 && (
        <div className='text-sm text-muted-foreground'>
          {compact ? (
            <span>
              {startItem}-{endItem} of {totalItems}
            </span>
          ) : (
            <span>
              Showing <strong>{startItem}</strong> to <strong>{endItem}</strong>{' '}
              of <strong>{totalItems}</strong> items
            </span>
          )}
        </div>
      )}

      {/* Pagination controls */}
      <div className='flex items-center gap-1'>
        {/* Page size selector */}
        {showPageSizeSelector && (
          <div className='mr-4 flex items-center gap-2'>
            <span className='hidden text-sm text-muted-foreground sm:inline'>
              Rows per page
            </span>
            <Select
              value={String(limit)}
              onValueChange={(value) => setLimit(Number(value))}
            >
              <SelectTrigger className='h-8 w-[70px]'>
                <SelectValue placeholder={limit} />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Page buttons */}
        <div className='flex items-center'>
          {/* First page button */}
          <Button
            variant='outline'
            size='icon'
            className='h-8 w-8'
            onClick={() => goToPage(1)}
            disabled={!hasPrevPage}
          >
            <ChevronsLeft className='h-4 w-4' />
            <span className='sr-only'>First page</span>
          </Button>

          {/* Previous page button */}
          <Button
            variant='outline'
            size='icon'
            className='h-8 w-8'
            onClick={goToPrevPage}
            disabled={!hasPrevPage}
          >
            <ChevronLeft className='h-4 w-4' />
            <span className='sr-only'>Previous page</span>
          </Button>

          {/* Page number buttons */}
          {!compact &&
            pageButtons.map((pageNum) => (
              <Button
                key={pageNum}
                variant={page === pageNum ? 'default' : 'outline'}
                size='icon'
                className='h-8 w-8'
                onClick={() => goToPage(pageNum)}
              >
                {pageNum}
                <span className='sr-only'>Page {pageNum}</span>
              </Button>
            ))}

          {/* Compact page indicator */}
          {compact && (
            <div className='px-2 text-sm'>
              Page {page} of {totalPages}
            </div>
          )}

          {/* Next page button */}
          <Button
            variant='outline'
            size='icon'
            className='h-8 w-8'
            onClick={goToNextPage}
            disabled={!hasNextPage}
          >
            <ChevronRight className='h-4 w-4' />
            <span className='sr-only'>Next page</span>
          </Button>

          {/* Last page button */}
          <Button
            variant='outline'
            size='icon'
            className='h-8 w-8'
            onClick={() => goToPage(totalPages)}
            disabled={!hasNextPage}
          >
            <ChevronsRight className='h-4 w-4' />
            <span className='sr-only'>Last page</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
