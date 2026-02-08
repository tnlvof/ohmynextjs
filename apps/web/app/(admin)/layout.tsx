import { Header, Sidebar } from '@ohmynextjs/core';

const adminSidebarItems = [
  { label: '관리자 대시보드', href: '/admin' },
  { label: '유저 관리', href: '/admin/users' },
  { label: '결제 관리', href: '/admin/payments' },
  { label: '앱 설정', href: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header logo="OhMyNextJS Admin" navItems={[]} />
      <div className="flex flex-1">
        <Sidebar items={adminSidebarItems} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
