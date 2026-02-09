'use client';

import { signOut } from '@/lib/auth/actions';

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="inline-flex h-9 items-center justify-center rounded-md border border-input px-4 text-sm font-medium hover:bg-accent transition-colors"
    >
      로그아웃
    </button>
  );
}
