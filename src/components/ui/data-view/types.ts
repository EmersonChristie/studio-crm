export type ViewMode = 'table' | 'grid';

export interface FilterOption {
  label: string;
  value: any;
}

export interface FilterableColumn {
  id: string;
  title: string;
  options: FilterOption[];
}

export interface BulkAction {
  label: string;
  value: string;
}
