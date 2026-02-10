import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border py-8 md:py-0">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:h-16 md:flex-row">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} OhMyNextJS. All rights reserved.
        </p>
        <nav className="flex gap-4">
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            이용약관
          </Link>
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            개인정보처리방침
          </Link>
        </nav>
      </div>
    </footer>
  );
}
