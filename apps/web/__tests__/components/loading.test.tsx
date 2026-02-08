import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Loading } from '@/components/common/loading';

describe('Loading', () => {
  it('renders skeleton by default', () => {
    render(<Loading />);
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('renders spinner variant', () => {
    render(<Loading variant="spinner" />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    render(<Loading className="custom-class" />);
    expect(screen.getByTestId('loading-skeleton').className).toContain('custom-class');
  });
});
