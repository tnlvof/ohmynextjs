'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-3xl">
          ⚠️
        </div>
        <h1 className="text-2xl font-bold">오류가 발생했습니다</h1>
        <p className="mt-2 text-muted-foreground">
          {error.message || '예상치 못한 오류가 발생했습니다'}
        </p>
        <button
          onClick={reset}
          className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
