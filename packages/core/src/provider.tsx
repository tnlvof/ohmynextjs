'use client';

import React from 'react';
import { ThemeProvider } from './components/theme/theme-provider';
import { Toaster } from 'sonner';
import { type OhMyConfig, defaultConfig } from './config';

export interface OhMyProviderProps {
  children: React.ReactNode;
  config?: Partial<OhMyConfig>;
}

export function OhMyProvider({ children, config }: OhMyProviderProps) {
  const mergedConfig = {
    ...defaultConfig,
    ...config,
    app: { ...defaultConfig.app, ...config?.app },
    theme: { ...defaultConfig.theme, ...config?.theme },
    layout: { ...defaultConfig.layout, ...config?.layout },
  };

  return (
    <ThemeProvider
      defaultTheme={mergedConfig.theme?.defaultTheme}
      storageKey={mergedConfig.theme?.storageKey}
    >
      {children}
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}
