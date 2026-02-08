import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EmptyState } from '@/components/common/empty-state';

describe('EmptyState', () => {
  it('renders message', () => {
    render(<EmptyState message="데이터가 없습니다" />);
    expect(screen.getByText('데이터가 없습니다')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    const Icon = () => <svg data-testid="custom-icon" />;
    render(<EmptyState message="없음" icon={<Icon />} />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders CTA button when provided', () => {
    render(<EmptyState message="없음" ctaLabel="추가하기" ctaHref="/add" />);
    const link = screen.getByRole('link', { name: '추가하기' });
    expect(link).toHaveAttribute('href', '/add');
  });
});
