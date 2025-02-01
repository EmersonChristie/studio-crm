'use client';

import { useMediaQuery } from '@/hooks/use-media-query';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useState, useEffect } from 'react';
import { Artwork } from '../types';
import { ViewMode } from '@/components/ui/data-view/types';
import { useQueryState } from 'nuqs';
import { searchParams } from '@/lib/searchparams';
import { toast } from 'sonner';
import {
  bulkUpdateArtworkStatus,
  generatePdfCatalog,
  generatePriceList
} from '../services/artwork-actions';

export function useArtworkView() {
  // View mode state
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>(
    'artwork-view-mode',
    'table'
  );

  // Grid columns based on screen size
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isTablet = useMediaQuery('(min-width: 768px)');

  const defaultColumns = isDesktop ? 5 : isTablet ? 3 : 2;
  const [gridColumns, setGridColumns] = useLocalStorage(
    'artwork-grid-columns',
    defaultColumns
  );

  // URL state
  const [page] = useQueryState('page', searchParams.page);
  const [limit] = useQueryState('limit', searchParams.limit);
  const [search] = useQueryState('q', searchParams.q);
  const [status] = useQueryState('status', searchParams.status);

  // Local state
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Artwork[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/artwork?${new URLSearchParams({
            page: String(page),
            limit: String(limit),
            ...(search && { q: search }),
            ...(status && { status })
          })}`
        );
        const { artworks, total_artworks } = await response.json();
        setData(artworks);
        setTotalItems(total_artworks);
      } catch (error) {
        toast.error('Failed to fetch artworks');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page, limit, search, status]);

  const handleSearch = (term: string) => {
    setSearch(term);
    setPage(1);
  };

  const handleFilter = (filters: any) => {
    if (filters.status) {
      setStatus(filters.status);
      setPage(1);
    }
  };

  const handleBulkAction = async (action: string, selectedItems: Artwork[]) => {
    const ids = selectedItems.map((item) => item.id);

    try {
      switch (action) {
        case 'price-list':
          const priceList = await generatePriceList(ids);
          // TODO: Handle the generated price list
          toast.success('Price list generated');
          break;

        case 'pdf-catalog':
          const catalog = await generatePdfCatalog(ids);
          // TODO: Handle the generated catalog
          toast.success('PDF catalog generated');
          break;

        case 'delete':
          await bulkUpdateArtworkStatus(ids, 'not_for_sale');
          toast.success('Selected artworks marked as not for sale');
          break;

        default:
          console.warn(`Unhandled bulk action: ${action}`);
      }
    } catch (error) {
      toast.error('Failed to perform bulk action');
      console.error(error);
    }
  };

  return {
    viewMode,
    setViewMode,
    gridColumns,
    isLoading,
    data,
    totalItems,
    toggleViewMode: () => setViewMode(viewMode === 'table' ? 'grid' : 'table'),
    updateGridColumns: (columns: number) =>
      setGridColumns(Math.min(Math.max(columns, 1), 5)),
    handleSearch,
    handleFilter,
    handleBulkAction
  };
}
