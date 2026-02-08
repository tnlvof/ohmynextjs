'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">오류 발생</h1>
      <p className="mt-2 text-muted-foreground">{error.message || '알 수 없는 오류가 발생했습니다'}</p>
      <button onClick={reset} className="mt-4 underline">다시 시도</button>
    </div>
  );
}
