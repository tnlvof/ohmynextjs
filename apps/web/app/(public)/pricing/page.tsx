import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: '₩0',
    period: '무료',
    description: '개인 프로젝트에 적합',
    features: ['프로젝트 3개', '기본 분석', '커뮤니티 지원', '1GB 스토리지'],
    cta: '무료로 시작',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '₩29,000',
    period: '/ 월',
    description: '성장하는 팀에 적합',
    features: ['프로젝트 무제한', '고급 분석', '우선 지원', '10GB 스토리지', 'API 접근', '팀 협업'],
    cta: 'Pro 시작하기',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: '₩99,000',
    period: '/ 월',
    description: '대규모 조직에 적합',
    features: ['모든 Pro 기능', '전담 매니저', 'SLA 보장', '100GB 스토리지', 'SSO/SAML', '커스텀 인테그레이션'],
    cta: '상담 요청',
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">요금제</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            프로젝트 규모에 맞는 요금제를 선택하세요.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-lg border p-8 shadow-sm ${
                plan.highlighted
                  ? 'border-primary bg-card shadow-md'
                  : 'bg-card'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  인기
                </div>
              )}
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.period !== '무료' && (
                  <span className="ml-1 text-muted-foreground">{plan.period}</span>
                )}
              </div>
              <Link
                href="/auth/signup"
                className={`mt-6 flex h-10 w-full items-center justify-center rounded-md text-sm font-medium transition-colors ${
                  plan.highlighted
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border border-input bg-background hover:bg-accent'
                }`}
              >
                {plan.cta}
              </Link>
              <ul className="mt-6 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <span className="text-green-600">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
