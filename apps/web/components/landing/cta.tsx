import Link from 'next/link';

export function CTA() {
  return (
    <section className="flex flex-col items-center px-4 py-16 text-center">
      <h2 className="text-3xl font-bold">지금 바로 시작하세요</h2>
      <p className="mt-4 text-muted-foreground">무료 플랜으로 모든 기능을 체험해보세요.</p>
      <Link
        href="/auth/signup"
        className="mt-6 inline-flex items-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        무료로 시작하기
      </Link>
    </section>
  );
}
