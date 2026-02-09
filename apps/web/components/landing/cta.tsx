import Link from 'next/link';

export function CTA() {
  return (
    <section className="border-t px-4 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight">지금 바로 시작하세요</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          무료 플랜으로 모든 핵심 기능을 체험해보세요.
          <br />
          신용카드 없이 시작할 수 있습니다.
        </p>
        <Link
          href="/auth/signup"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          무료로 시작하기 →
        </Link>
      </div>
    </section>
  );
}
