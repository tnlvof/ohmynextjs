import Link from 'next/link';

export function Hero() {
  return (
    <section className="flex flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
        Next.js 풀스택을 빠르게 시작하세요
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
        인증, 결제, 관리자 패널까지. 빠르게 시작할 수 있는 올인원 스타터 킷.
      </p>
      <Link
        href="/auth/signup"
        className="mt-8 inline-flex items-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        시작하기
      </Link>
    </section>
  );
}
