'use client';

import { Button } from '@/components/ui/button';

interface DataTableResetFilterProps {
  isFilterActive: boolean;
  onReset: () => void;
}

export function DataTableResetFilter({
  isFilterActive,
  onReset
}: DataTableResetFilterProps) {
  if (!isFilterActive) return null;

  return (
    <Button variant='outline' onClick={onReset} className='h-8'>
      Reset Filters
    </Button>
  );
}
