import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-muted-foreground/30">404</h1>
        <h2 className="mt-4 text-2xl font-bold">페이지를 찾을 수 없습니다</h2>
        <p className="mt-2 text-muted-foreground">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
        <Link
          href="/"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
