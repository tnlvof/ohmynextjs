import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock next-themes
vi.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', { 'data-testid': 'theme-provider' }, children),
}));

// Mock sonner
vi.mock('sonner', () => ({
  Toaster: () => React.createElement('div', { 'data-testid': 'toaster' }),
}));

// Mock the theme-provider to avoid transitive next-themes import issues
vi.mock('../src/components/theme/theme-provider', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', { 'data-testid': 'theme-provider' }, children),
}));

import { OhMyProvider } from '../src/provider';

describe('OhMyProvider', () => {
  it('renders children', () => {
    render(
      <OhMyProvider>
        <div>Test Content</div>
      </OhMyProvider>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('wraps children with ThemeProvider', () => {
    render(
      <OhMyProvider>
        <div>Child</div>
      </OhMyProvider>
    );
    expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
  });

  it('renders Toaster', () => {
    render(
      <OhMyProvider>
        <div>Child</div>
      </OhMyProvider>
    );
    expect(screen.getByTestId('toaster')).toBeInTheDocument();
  });

  it('accepts custom config', () => {
    const config = {
      app: { name: 'MyApp' },
      theme: { defaultTheme: 'dark' as const },
    };
    render(
      <OhMyProvider config={config}>
        <div>Child</div>
      </OhMyProvider>
    );
    expect(screen.getByText('Child')).toBeInTheDocument();
  });
});
