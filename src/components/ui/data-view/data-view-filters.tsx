'use client';

import { FilterableColumn } from './types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../select';

interface DataViewFiltersProps {
  columns: FilterableColumn[];
  onFilter?: (filters: any) => void;
}

export function DataViewFilters({ columns, onFilter }: DataViewFiltersProps) {
  return (
    <div className='flex flex-wrap gap-2'>
      {columns.map((column) => (
        <Select
          key={column.id}
          onValueChange={(value) => onFilter?.({ [column.id]: value })}
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder={column.title} />
          </SelectTrigger>
          <SelectContent>
            {column.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>
  );
}
