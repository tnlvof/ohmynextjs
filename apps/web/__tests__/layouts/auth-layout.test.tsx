import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AuthLayout from '@/app/(auth)/layout';

describe('AuthLayout', () => {
  it('renders children with home link', () => {
    render(<AuthLayout><div>auth form</div></AuthLayout>);
    const container = screen.getByTestId('auth-layout');
    expect(container).toBeInTheDocument();
    expect(container.className).toContain('flex');
    expect(container.className).toContain('min-h-screen');
    expect(screen.getByText('auth form')).toBeInTheDocument();
  });
});
