'use client';

import { Artwork } from '../../types';
import { createContext, useContext, useState } from 'react';

interface DataTableContextType {
  selectedRows: Artwork[];
  setSelectedRows: (rows: Artwork[]) => void;
  handleBulkAction: (action: string) => void;
}

const DataTableContext = createContext<DataTableContextType | undefined>(
  undefined
);

export function DataTableProvider({ children }: { children: React.ReactNode }) {
  const [selectedRows, setSelectedRows] = useState<Artwork[]>([]);

  const handleBulkAction = async (action: string) => {
    if (selectedRows.length === 0) return;

    switch (action) {
      case 'delete':
        // Handle bulk delete
        console.log('Deleting:', selectedRows);
        break;
      case 'update-status':
        // Handle bulk status update
        console.log('Updating status:', selectedRows);
        break;
      default:
        break;
    }
  };

  return (
    <DataTableContext.Provider
      value={{
        selectedRows,
        setSelectedRows,
        handleBulkAction
      }}
    >
      {children}
    </DataTableContext.Provider>
  );
}

export const useDataTable = () => {
  const context = useContext(DataTableContext);
  if (context === undefined) {
    throw new Error('useDataTable must be used within a DataTableProvider');
  }
  return context;
};
