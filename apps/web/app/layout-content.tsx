'use client';

import { OhMyProvider } from '@ohmynextjs/core';

export function RootLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <OhMyProvider config={{ appName: 'OhMyNextJS' }}>
      {children}
    </OhMyProvider>
  );
}
