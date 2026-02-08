'use client';

import { ReactNode } from 'react';

interface OhMyProviderProps {
  children: ReactNode;
}

export function OhMyProvider({ children }: OhMyProviderProps) {
  return <>{children}</>;
}
