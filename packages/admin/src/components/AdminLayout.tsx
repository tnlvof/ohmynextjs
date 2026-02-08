'use client';

import { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white p-4">
        <h1 className="text-xl font-bold mb-8">Admin</h1>
        <nav className="space-y-2">
          <a href="/admin" className="block px-3 py-2 rounded hover:bg-gray-800">대시보드</a>
          <a href="/admin/users" className="block px-3 py-2 rounded hover:bg-gray-800">유저 관리</a>
          <a href="/admin/settings" className="block px-3 py-2 rounded hover:bg-gray-800">설정</a>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  );
}
