'use client';

import { OhMyProvider } from '@ohmynextjs/core';

export function RootLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <OhMyProvider config={{ app: { name: 'OhMyNextJS' } }}>
      {children}
    </OhMyProvider>
  );
}
