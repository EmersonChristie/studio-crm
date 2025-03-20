'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Define variants for the loading spinner
const loadingVariants = cva('animate-spin text-muted-foreground', {
  variants: {
    size: {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-12 w-12'
    },
    fullscreen: {
      true: 'fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50',
      false: ''
    }
  },
  defaultVariants: {
    size: 'md',
    fullscreen: false
  }
});

export interface LoadingProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingVariants> {
  text?: string;
}

/**
 * Loading spinner component with size variants and optional fullscreen overlay
 */
export const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ className, size, fullscreen, text, ...props }, ref) => {
    // If fullscreen, create an overlay with the spinner centered
    if (fullscreen) {
      return (
        <div
          className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm'
          ref={ref}
          {...props}
        >
          <Loader2 className={cn(loadingVariants({ size }), className)} />
          {text && <p className='mt-2 text-sm text-muted-foreground'>{text}</p>}
        </div>
      );
    }

    // Otherwise, just return the spinner
    return (
      <div
        className={cn('flex items-center gap-2', className)}
        ref={ref}
        {...props}
      >
        <Loader2 className={loadingVariants({ size })} />
        {text && <span className='text-sm text-muted-foreground'>{text}</span>}
      </div>
    );
  }
);

Loading.displayName = 'Loading';

/**
 * Skeleton loading component for content placeholders
 */
export const Skeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
});

Skeleton.displayName = 'Skeleton';

/**
 * Fullscreen loading overlay with text
 */
export const FullscreenLoading = ({
  text = 'Loading...'
}: {
  text?: string;
}) => {
  return <Loading fullscreen size='lg' text={text} />;
};

/**
 * Button loading spinner
 */
export const ButtonLoading = () => {
  return <Loader2 className='h-4 w-4 animate-spin' />;
};

/**
 * Table loading overlay
 */
export const TableLoading = ({
  text = 'Loading data...'
}: {
  text?: string;
}) => {
  return (
    <div className='flex min-h-[200px] w-full flex-col items-center justify-center py-8'>
      <Loading size='md' text={text} />
    </div>
  );
};
