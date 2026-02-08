import { Header, Sidebar } from '@ohmynextjs/core';

const sidebarItems = [
  { label: '대시보드', href: '/dashboard' },
  { label: '설정', href: '/settings' },
  { label: '빌링', href: '/billing' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header logo="OhMyNextJS" navItems={[]} />
      <div className="flex flex-1">
        <Sidebar items={sidebarItems} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
