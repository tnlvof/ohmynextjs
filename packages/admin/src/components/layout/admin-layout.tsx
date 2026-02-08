import React from 'react';
import { AdminSidebar } from './admin-sidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div data-testid="admin-layout" style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <main data-testid="admin-content" style={{ flex: 1, padding: '24px' }}>
        {children}
      </main>
    </div>
  );
}
