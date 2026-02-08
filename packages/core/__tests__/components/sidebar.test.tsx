import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) =>
    React.createElement('a', { href, ...props }, children),
}));

import { Sidebar } from '../../src/components/layout/sidebar';

const mockItems = [
  { label: 'Dashboard', href: '/dashboard', icon: React.createElement('span', null, '📊') },
  { label: 'Settings', href: '/settings', icon: React.createElement('span', null, '⚙️') },
];

describe('Sidebar', () => {
  it('renders without crashing', () => {
    render(<Sidebar items={mockItems} />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders all sidebar items', () => {
    render(<Sidebar items={mockItems} />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('supports collapse toggle when collapsible', () => {
    render(<Sidebar items={mockItems} collapsible={true} />);
    const toggleButton = screen.getByRole('button', { name: /toggle/i });
    expect(toggleButton).toBeInTheDocument();
    fireEvent.click(toggleButton);
    // After collapse, labels may be hidden
  });

  it('renders badges when provided', () => {
    const itemsWithBadge = [
      { label: 'Inbox', href: '/inbox', icon: React.createElement('span', null, '📬'), badge: '5' },
    ];
    render(<Sidebar items={itemsWithBadge} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
