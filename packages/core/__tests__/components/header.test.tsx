import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
    resolvedTheme: 'light',
  }),
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) =>
    React.createElement('a', { href, ...props }, children),
}));

import { Header } from '../../src/components/layout/header';

describe('Header', () => {
  it('renders without crashing', () => {
    render(<Header />);
    expect(document.querySelector('header')).toBeInTheDocument();
  });

  it('renders navigation items', () => {
    const navItems = [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
    ];
    render(<Header navItems={navItems} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('renders logo when provided', () => {
    render(<Header logo={<span>MyLogo</span>} />);
    expect(screen.getByText('MyLogo')).toBeInTheDocument();
  });

  it('hides theme toggle when showThemeToggle is false', () => {
    render(<Header showThemeToggle={false} />);
    expect(screen.queryByRole('button', { name: /theme/i })).not.toBeInTheDocument();
  });
});
