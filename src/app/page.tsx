import Link from 'next/link';
import { Zap, Shield, Database, CreditCard, Globe, Code } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: '소셜 인증',
    desc: 'Supabase Auth + 소셜 로그인 (Google, 카카오, 네이버, GitHub)',
  },
  {
    icon: CreditCard,
    title: '간편 결제',
    desc: 'TossPayments 연동, 구독 결제, 환불 처리 자동화',
  },
  {
    icon: Database,
    title: '타입세이프 DB',
    desc: 'Drizzle ORM + Supabase PostgreSQL, 타입 안전 쿼리',
  },
  {
    icon: Zap,
    title: '초고속 빌드',
    desc: 'Next.js 16 + Turbopack으로 빠른 개발 경험',
  },
  {
    icon: Globe,
    title: 'SEO 최적화',
    desc: '서버 컴포넌트 기반 SSR, 메타데이터 API 완벽 지원',
  },
  {
    icon: Code,
    title: 'DX 중심 설계',
    desc: 'TypeScript, ESLint, Prettier, Vitest 기본 설정 완비',
  },
];

const techStack = [
  'Next.js 16',
  'React 19',
  'TypeScript',
  'Tailwind CSS v4',
  'Supabase',
  'Drizzle ORM',
  'TossPayments',
  'Vitest',
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-4 py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground">
            🚀 Next.js 16 기반 SaaS 보일러플레이트
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-primary">OhMyNextJS</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-8">
            Next.js 16 + Supabase + Drizzle ORM + TossPayments
            <br className="hidden sm:block" />
            한국형 SaaS를 5분 만에 시작하세요.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/auth/signup"
              className="inline-flex h-11 w-full sm:w-auto items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              시작하기
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-11 w-full sm:w-auto items-center justify-center rounded-md border border-input px-8 text-sm font-medium hover:bg-accent transition-colors"
            >
              가격 보기
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-muted/30 px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-screen-xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">모든 것이 준비되어 있습니다</h2>
            <p className="mt-3 text-muted-foreground">
              SaaS 개발에 필요한 핵심 기능을 바로 사용하세요.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/50"
              >
                <feature.icon className="h-8 w-8 text-primary mb-3" />
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-screen-xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">기술 스택</h2>
          <p className="mt-3 text-muted-foreground">검증된 최신 기술로 구성되어 있습니다.</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-muted/30 px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">지금 바로 시작하세요</h2>
          <p className="mt-4 text-muted-foreground">
            복잡한 설정 없이, 비즈니스 로직에만 집중할 수 있습니다.
          </p>
          <Link
            href="/auth/signup"
            className="mt-8 inline-flex h-11 w-full sm:w-auto items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            무료로 시작하기
          </Link>
        </div>
      </section>
    </div>
  );
}
