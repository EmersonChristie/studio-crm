'use client';

import { Button } from '@/components/ui/button';
import { LayoutGridIcon, TableIcon } from 'lucide-react';

interface ViewToggleProps {
  view: 'table' | 'grid';
  onViewChange: (view: 'table' | 'grid') => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className='flex items-center pl-4'>
      <Button
        variant={view === 'table' ? 'default' : 'ghost'}
        size='sm'
        onClick={() => onViewChange('table')}
      >
        <TableIcon className='h-4 w-4' />
      </Button>
      <Button
        variant={view === 'grid' ? 'default' : 'ghost'}
        size='sm'
        onClick={() => onViewChange('grid')}
      >
        <LayoutGridIcon className='h-4 w-4' />
      </Button>
    </div>
  );
}
