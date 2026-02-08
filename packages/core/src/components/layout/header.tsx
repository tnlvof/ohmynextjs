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
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            {logo || <span className="font-bold">OhMyNextJS</span>}
          </Link>
        </div>

        <nav className="flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {item.icon && <span className="mr-1">{item.icon}</span>}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
          {showThemeToggle && <ThemeToggle />}
        </div>
      </div>
    </header>
  );
}
