import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PublicLayout from '@/app/(public)/layout';

describe('PublicLayout', () => {
  it('renders Header and Footer', () => {
    render(<PublicLayout><div>content</div></PublicLayout>);
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByText('content')).toBeInTheDocument();
  });
});
