'use client';

import { cn } from '@/lib/utils';

interface EmptyPlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
}

export function EmptyPlaceholder({
  title,
  description,
  className,
  children,
  ...props
}: EmptyPlaceholderProps) {
  return (
    <div
      className={cn(
        'flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50',
        className
      )}
      {...props}
    >
      <div className='mx-auto flex max-w-[420px] flex-col items-center justify-center text-center'>
        <h3 className='mt-4 text-lg font-semibold'>{title}</h3>
        <p className='mb-4 mt-2 text-sm text-muted-foreground'>{description}</p>
        {children}
      </div>
    </div>
  );
}
