import Link from 'next/link';
import { Check } from 'lucide-react';

const plans = [
  {
    name: '무료',
    price: '₩0',
    interval: '월',
    description: '시작하기에 완벽한 플랜',
    features: ['기본 기능', '커뮤니티 지원', '1개 프로젝트'],
    cta: '시작하기',
    href: '/auth/signup',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '₩9,900',
    interval: '월',
    description: '성장하는 팀을 위한 플랜',
    features: ['모든 기능', '우선 지원', '무제한 프로젝트', 'API 접근', '팀 협업'],
    cta: '구독하기',
    href: '/auth/signup',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: '문의',
    interval: '',
    description: '대규모 조직을 위한 맞춤 플랜',
    features: ['모든 Pro 기능', '전담 지원', 'SLA 보장', '커스텀 연동', 'SSO'],
    cta: '문의하기',
    href: 'mailto:hello@ohmynextjs.com',
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="container mx-auto max-w-screen-xl px-4 py-16 sm:py-24">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">가격</h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground">
          필요에 맞는 플랜을 선택하세요.
        </p>
      </div>

      <div className="mt-12 sm:mt-16 grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-lg border p-6 sm:p-8 ${plan.highlighted ? 'border-primary shadow-lg' : 'border-border'}`}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                인기
              </div>
            )}
            <h3 className="text-xl font-bold">{plan.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
            <div className="mt-4">
              <span className="text-3xl sm:text-4xl font-bold">{plan.price}</span>
              {plan.interval && <span className="text-muted-foreground">/{plan.interval}</span>}
            </div>
            <ul className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center text-sm">
                  <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href={plan.href}
              className={`mt-8 inline-flex h-10 w-full items-center justify-center rounded-md text-sm font-medium transition-colors ${
                plan.highlighted
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'border border-input hover:bg-accent'
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
