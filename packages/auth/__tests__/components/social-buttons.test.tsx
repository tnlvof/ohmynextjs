import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { SocialButtons } from '../../src/components/social-buttons';

describe('SocialButtons', () => {
  it('should render all default providers', () => {
    render(<SocialButtons />);
    expect(screen.getByTestId('social-google')).toBeInTheDocument();
    expect(screen.getByTestId('social-kakao')).toBeInTheDocument();
    expect(screen.getByTestId('social-naver')).toBeInTheDocument();
    expect(screen.getByTestId('social-github')).toBeInTheDocument();
  });

  it('should render only specified providers', () => {
    render(<SocialButtons providers={['google', 'github']} />);
    expect(screen.getByTestId('social-google')).toBeInTheDocument();
    expect(screen.getByTestId('social-github')).toBeInTheDocument();
    expect(screen.queryByTestId('social-kakao')).not.toBeInTheDocument();
  });

  it('should show provider labels', () => {
    render(<SocialButtons />);
    expect(screen.getByTestId('social-google')).toHaveTextContent('Google로 로그인');
    expect(screen.getByTestId('social-kakao')).toHaveTextContent('Kakao로 로그인');
  });

  it('should call onProviderClick when clicked', async () => {
    const onClick = vi.fn().mockResolvedValue(undefined);
    render(<SocialButtons onProviderClick={onClick} />);
    fireEvent.click(screen.getByTestId('social-google'));
    await waitFor(() => {
      expect(onClick).toHaveBeenCalledWith('google');
    });
  });

  it('should apply brand colors', () => {
    render(<SocialButtons />);
    expect(screen.getByTestId('social-google')).toHaveStyle({ backgroundColor: '#4285F4' });
    expect(screen.getByTestId('social-kakao')).toHaveStyle({ backgroundColor: '#FEE500' });
  });
});
