import { Header, Footer } from '@ohmynextjs/core';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header
        logo="OhMyNextJS"
        navItems={[
          { label: '기능', href: '/#features' },
          { label: '요금제', href: '/pricing' },
        ]}
      />
      <main className="flex-1">{children}</main>
      <Footer
        copyright="© 2026 OhMyNextJS. All rights reserved."
        links={[
          { label: '요금제', href: '/pricing' },
          { label: '이용약관', href: '/terms' },
          { label: '개인정보처리방침', href: '/privacy' },
        ]}
      />
    </div>
  );
}
