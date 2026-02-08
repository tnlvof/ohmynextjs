import React from 'react';

const menuItems = [
  { label: '대시보드', href: '/admin' },
  { label: '유저 관리', href: '/admin/users' },
  { label: '결제 관리', href: '/admin/payments' },
  { label: '설정', href: '/admin/settings' },
];

export function AdminSidebar() {
  return (
    <aside data-testid="admin-sidebar" style={{ width: '240px', borderRight: '1px solid #e5e7eb', padding: '16px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>관리자</h2>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {menuItems.map((item) => (
            <li key={item.href} style={{ marginBottom: '8px' }}>
              <a href={item.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
