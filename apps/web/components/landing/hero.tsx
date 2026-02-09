import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,hsl(222.2_47.4%_11.2%/0.12),transparent)]" />
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center rounded-full border px-3 py-1 text-sm text-muted-foreground">
          🚀 Next.js SaaS 스타터킷
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          풀스택 프로젝트를
          <br />
          <span className="text-primary">빠르게 시작</span>하세요
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          인증, 결제, 관리자 패널까지. 프로덕션 레벨의 Next.js 보일러플레이트로
          아이디어를 빠르게 현실로 만드세요.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/auth/signup"
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            무료로 시작하기
          </Link>
          <Link
            href="/pricing"
            className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            요금제 보기
          </Link>
        </div>
      </div>
    </section>
  );
}
