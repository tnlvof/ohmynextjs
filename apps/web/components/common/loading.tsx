interface LoadingProps {
  variant?: 'skeleton' | 'spinner';
  className?: string;
}

export function Loading({ variant = 'skeleton', className = '' }: LoadingProps) {
  if (variant === 'spinner') {
    return (
      <div data-testid="loading-spinner" className={`flex items-center justify-center ${className}`}>
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  return (
    <div data-testid="loading-skeleton" className={`animate-pulse space-y-4 ${className}`}>
      <div className="h-4 w-3/4 rounded bg-muted" />
      <div className="h-4 w-1/2 rounded bg-muted" />
      <div className="h-4 w-2/3 rounded bg-muted" />
    </div>
  );
}
