import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { Footer } from '../../src/components/layout/footer';

describe('Footer', () => {
  it('renders without crashing', () => {
    render(<Footer />);
    expect(document.querySelector('footer')).toBeInTheDocument();
  });

  it('renders copyright text', () => {
    render(<Footer copyright="© 2026 OhMyNextJS" />);
    expect(screen.getByText('© 2026 OhMyNextJS')).toBeInTheDocument();
  });

  it('renders links when provided', () => {
    const links = [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ];
    render(<Footer links={links} />);
    expect(screen.getByText('Privacy')).toBeInTheDocument();
    expect(screen.getByText('Terms')).toBeInTheDocument();
  });
});
