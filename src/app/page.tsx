import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          <span className="text-primary">OhMyNextJS</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground leading-8">
          Next.js 16 + Supabase + Drizzle ORM + TossPayments
          <br />
          한국형 SaaS를 5분 만에 시작하세요.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/auth/signup"
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            시작하기
          </Link>
          <Link
            href="/pricing"
            className="inline-flex h-11 items-center justify-center rounded-md border border-input px-8 text-sm font-medium hover:bg-accent transition-colors"
          >
            가격 보기
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {[
            { title: '🔐 인증', desc: 'Supabase Auth + 소셜 로그인 (Google, 카카오, 네이버, GitHub)' },
            { title: '💳 결제', desc: 'TossPayments 연동, 구독 결제, 환불 처리' },
            { title: '🗃️ 데이터베이스', desc: 'Drizzle ORM + Supabase PostgreSQL, 타입 안전 쿼리' },
          ].map((feature) => (
            <div key={feature.title} className="rounded-lg border p-6 text-left">
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
