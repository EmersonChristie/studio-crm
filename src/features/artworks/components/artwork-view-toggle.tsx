'use client';

import { Button } from '@/components/ui/button';
import { Grid, Table } from 'lucide-react';
import { ViewMode } from '@/components/ui/data-view/types';

interface ViewToggleProps {
  currentView: ViewMode;
  onToggle: () => void;
}

export function ViewToggle({ currentView, onToggle }: ViewToggleProps) {
  return (
    <Button variant='outline' size='sm' onClick={onToggle}>
      {currentView === 'table' ? (
        <>
          <Grid className='mr-2 h-4 w-4' />
          Grid View
        </>
      ) : (
        <>
          <Table className='mr-2 h-4 w-4' />
          Table View
        </>
      )}
    </Button>
  );
}
