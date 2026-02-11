'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LayoutDashboard, Users, CreditCard, Settings, Menu, X } from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { label: '대시보드', href: '/admin', icon: LayoutDashboard },
  { label: '유저 관리', href: '/admin/users', icon: Users },
  { label: '결제 내역', href: '/admin/payments', icon: CreditCard },
  { label: '앱 설정', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  const nav = (
    <nav className="flex flex-col gap-1 p-4" role="navigation" aria-label="관리자 메뉴">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setOpen(false)}
          className={clsx(
            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
            isActive(item.href)
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
          )}
          aria-current={isActive(item.href) ? 'page' : undefined}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-3 left-3 z-50 inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background md:hidden"
        aria-label="관리자 메뉴 토글"
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-40 w-60 border-r border-border bg-background transition-transform md:relative md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-14 items-center border-b border-border px-4">
          <Link href="/admin" className="font-bold text-lg" onClick={() => setOpen(false)}>
            Admin
          </Link>
        </div>
        {nav}
      </aside>
    </>
  );
}
