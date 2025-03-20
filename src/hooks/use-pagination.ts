'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { createUrl } from '@/lib/utils';

export interface PaginationState {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  startItem: number;
  endItem: number;
}

export interface UsePaginationProps {
  /** The total number of items */
  totalItems: number;

  /** The number of items per page (default: 10) */
  defaultLimit?: number;

  /** The default page (default: 1) */
  defaultPage?: number;

  /** Whether to update the URL params (default: true) */
  updateUrl?: boolean;
}

/**
 * A hook for handling pagination with URL state
 */
export function usePagination({
  totalItems,
  defaultLimit = 10,
  defaultPage = 1,
  updateUrl = true
}: UsePaginationProps): PaginationState & {
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPrevPage: () => void;
  setLimit: (limit: number) => void;
} {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get the current page and limit from URL or defaults
  const page = Number(searchParams.get('page') || defaultPage);
  const limit = Number(searchParams.get('limit') || defaultLimit);

  // Calculate pagination stats
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  const startItem = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(startItem + limit - 1, totalItems);

  // Update the URL when page or limit changes
  const updateParams = useCallback(
    (params: Record<string, string>) => {
      if (updateUrl) {
        const url = createUrl(pathname, {
          ...Object.fromEntries(searchParams.entries()),
          ...params
        });
        router.push(url, { scroll: false });
      }
    },
    [pathname, router, searchParams, updateUrl]
  );

  // Functions to change pages
  const goToPage = useCallback(
    (newPage: number) => {
      const validPage = Math.max(1, Math.min(newPage, totalPages));
      if (validPage !== page) {
        updateParams({ page: String(validPage) });
      }
    },
    [page, totalPages, updateParams]
  );

  const goToNextPage = useCallback(() => {
    if (hasNextPage) {
      goToPage(page + 1);
    }
  }, [goToPage, hasNextPage, page]);

  const goToPrevPage = useCallback(() => {
    if (hasPrevPage) {
      goToPage(page - 1);
    }
  }, [goToPage, hasPrevPage, page]);

  // Function to change limit
  const setLimit = useCallback(
    (newLimit: number) => {
      if (newLimit !== limit) {
        updateParams({
          limit: String(newLimit),
          page: '1' // Reset to first page when changing limit
        });
      }
    },
    [limit, updateParams]
  );

  // Return pagination state and functions
  return useMemo(
    () => ({
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
    }),
    [
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
    ]
  );
}
