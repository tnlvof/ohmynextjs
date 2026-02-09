import { Header, Footer } from '@ohmynextjs/core';
import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';
import { PricingPreview } from '@/components/landing/pricing-preview';
import { CTA } from '@/components/landing/cta';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header
        logo="OhMyNextJS"
        navItems={[
          { label: '요금제', href: '/pricing' },
          { label: '이용약관', href: '/terms' },
        ]}
      />
      <main className="flex-1">
        <Hero />
        <Features />
        <PricingPreview />
        <CTA />
      </main>
      <Footer
        copyright="© 2026 OhMyNextJS. All rights reserved."
        links={[
          { label: '이용약관', href: '/terms' },
          { label: '개인정보처리방침', href: '/privacy' },
        ]}
      />
    </div>
  );
}
