import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SocialButtons } from './social-buttons';

describe('SocialButtons', () => {
  it('renders all providers by default', () => {
    render(<SocialButtons />);
    expect(screen.getByTestId('social-google')).toBeInTheDocument();
    expect(screen.getByTestId('social-kakao')).toBeInTheDocument();
    expect(screen.getByTestId('social-naver')).toBeInTheDocument();
    expect(screen.getByTestId('social-github')).toBeInTheDocument();
  });

  it('renders only specified providers', () => {
    render(<SocialButtons providers={['google', 'github']} />);
    expect(screen.getByTestId('social-google')).toBeInTheDocument();
    expect(screen.getByTestId('social-github')).toBeInTheDocument();
    expect(screen.queryByTestId('social-kakao')).not.toBeInTheDocument();
  });

  it('calls onProviderClick', async () => {
    const onClick = vi.fn().mockResolvedValue(undefined);
    render(<SocialButtons onProviderClick={onClick} />);
    fireEvent.click(screen.getByTestId('social-google'));
    expect(onClick).toHaveBeenCalledWith('google');
  });
});
