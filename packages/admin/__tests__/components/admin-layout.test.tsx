import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdminLayout } from '../../src/components/layout/admin-layout';

describe('AdminLayout', () => {
  it('should render sidebar and content area', () => {
    render(<AdminLayout><div>Content</div></AdminLayout>);
    expect(screen.getByTestId('admin-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('admin-content')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should have correct layout structure', () => {
    const { container } = render(<AdminLayout><div>Test</div></AdminLayout>);
    expect(container.querySelector('[data-testid="admin-layout"]')).toBeInTheDocument();
  });
});
