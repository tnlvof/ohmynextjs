import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserFilters } from '../../src/components/users/user-filters';

describe('UserFilters', () => {
  it('should render search input', () => {
    render(<UserFilters filters={{}} onFilterChange={() => {}} />);
    expect(screen.getByPlaceholderText('이름 또는 이메일 검색')).toBeInTheDocument();
  });

  it('should call onFilterChange on search input', () => {
    const onFilterChange = vi.fn();
    render(<UserFilters filters={{}} onFilterChange={onFilterChange} />);
    fireEvent.change(screen.getByPlaceholderText('이름 또는 이메일 검색'), { target: { value: 'test' } });
    expect(onFilterChange).toHaveBeenCalledWith({ search: 'test' });
  });

  it('should render role and status filters', () => {
    render(<UserFilters filters={{}} onFilterChange={() => {}} />);
    expect(screen.getByLabelText('역할')).toBeInTheDocument();
    expect(screen.getByLabelText('상태')).toBeInTheDocument();
  });
});
