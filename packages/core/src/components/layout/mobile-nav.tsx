'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { type NavItem } from './header';

export interface MobileNavProps {
  navItems?: NavItem[];
}

export function MobileNav({ navItems = [] }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle mobile menu"
        className="inline-flex items-center justify-center rounded-md p-2"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div className="fixed inset-0 top-14 z-50 bg-background/80 backdrop-blur-sm">
          <nav className="container grid gap-3 p-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-lg font-medium"
              >
                {item.icon && <span>{item.icon}</span>}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
