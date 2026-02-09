'use client';

import React from 'react';
import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

const defaultNavItems: NavItem[] = [
  { label: '가격', href: '/pricing' },
  { label: '문서', href: '/docs' },
];

export function Header({ navItems = defaultNavItems }: { navItems?: NavItem[] }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            OhMyNextJS
          </Link>

          {navItems.length > 0 && (
            <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/auth/login"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            로그인
          </Link>
        </div>
      </div>
    </header>
  );
}
