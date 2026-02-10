'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Github } from 'lucide-react';
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
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-md border border-input hover:bg-accent transition-colors"
            aria-label="GitHub"
          >
            <Github className="h-4 w-4" />
          </a>
          <ThemeToggle />
          <Link
            href="/auth/login"
            className="hidden sm:inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            로그인
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input hover:bg-accent transition-colors md:hidden"
            aria-label="메뉴"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border md:hidden">
          <nav className="container mx-auto flex flex-col gap-2 px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/auth/login"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              로그인
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
