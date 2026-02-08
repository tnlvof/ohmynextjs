import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RootLayoutContent } from '@/app/layout-content';

describe('RootLayout', () => {
  it('wraps children with OhMyProvider', () => {
    render(<RootLayoutContent><div>child</div></RootLayoutContent>);
    expect(screen.getByTestId('ohmy-provider')).toBeInTheDocument();
    expect(screen.getByText('child')).toBeInTheDocument();
  });
});
