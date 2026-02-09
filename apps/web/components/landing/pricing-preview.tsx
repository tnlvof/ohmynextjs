import Link from 'next/link';

const PLANS = [
  { name: 'Free', price: '₩0', description: '개인 프로젝트에 적합', highlighted: false },
  { name: 'Pro', price: '₩29,000', description: '성장하는 팀에 적합', highlighted: true },
  { name: 'Enterprise', price: '₩99,000', description: '대규모 조직에 적합', highlighted: false },
] as const;

export function PricingPreview() {
  return (
    <section className="border-t px-4 py-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight">합리적인 요금제</h2>
          <p className="mt-3 text-muted-foreground">
            프로젝트 규모에 맞는 플랜을 선택하세요.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg border p-6 text-center shadow-sm ${
                plan.highlighted ? 'border-primary shadow-md' : ''
              }`}
            >
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
              <p className="mt-3 text-2xl font-bold">{plan.price}</p>
              {plan.name !== 'Free' && (
                <p className="text-sm text-muted-foreground">/ 월</p>
              )}
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/pricing"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            요금제 자세히 보기 →
          </Link>
        </div>
      </div>
    </section>
  );
}
