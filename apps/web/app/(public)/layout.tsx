import { Header, Footer } from '@ohmynextjs/core';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header
        logo="OhMyNextJS"
        navItems={[
          { label: '요금제', href: '/pricing' },
          { label: '이용약관', href: '/terms' },
        ]}
      />
      <main className="flex-1">{children}</main>
      <Footer links={[]} />
    </div>
  );
}
