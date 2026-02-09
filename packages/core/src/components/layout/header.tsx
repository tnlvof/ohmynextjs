'use client';

import React from 'react';
import Link from 'next/link';
import { ThemeToggle } from '../theme/theme-toggle';

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  external?: boolean;
}

export interface HeaderProps {
  logo?: React.ReactNode;
  navItems?: NavItem[];
  showAuth?: boolean;
  showThemeToggle?: boolean;
}

export function Header({
  logo,
  navItems = [],
  showAuth = true,
  showThemeToggle = true,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            {typeof logo === 'string' ? <span>{logo}</span> : logo || <span>OhMyNextJS</span>}
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
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2">
          {showThemeToggle && <ThemeToggle />}
        </div>
      </div>
    </header>
  );
}
