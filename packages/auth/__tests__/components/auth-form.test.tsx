import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { AuthForm } from '../../src/components/auth-form';

// Mock SocialButtons to avoid complexity
vi.mock('../../src/components/social-buttons', () => ({
  SocialButtons: () => <div data-testid="social-buttons-mock">Social</div>,
}));

describe('AuthForm', () => {
  it('should render login mode', () => {
    render(<AuthForm mode="login" />);
    expect(screen.getByRole('heading', { name: '로그인' })).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
  });

  it('should render signup mode with name field', () => {
    render(<AuthForm mode="signup" />);
    expect(screen.getByRole('heading', { name: '회원가입' })).toBeInTheDocument();
    expect(screen.getByTestId('name-input')).toBeInTheDocument();
  });

  it('should show toggle link to signup from login', () => {
    render(<AuthForm mode="login" />);
    expect(screen.getByTestId('toggle-link')).toHaveTextContent('회원가입');
  });

  it('should show toggle link to login from signup', () => {
    render(<AuthForm mode="signup" />);
    expect(screen.getByTestId('toggle-link')).toHaveTextContent('로그인');
  });

  it('should show reset password link in login mode', () => {
    render(<AuthForm mode="login" />);
    expect(screen.getByTestId('reset-link')).toBeInTheDocument();
  });

  it('should validate empty email', async () => {
    render(<AuthForm mode="login" />);
    fireEvent.click(screen.getByTestId('submit-button'));
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('이메일을 입력해주세요');
    });
  });

  it('should validate empty password', async () => {
    render(<AuthForm mode="login" />);
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'test@test.com' } });
    fireEvent.click(screen.getByTestId('submit-button'));
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('비밀번호를 입력해주세요');
    });
  });

  it('should validate short password', async () => {
    render(<AuthForm mode="login" />);
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: '123' } });
    fireEvent.click(screen.getByTestId('submit-button'));
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('비밀번호는 6자 이상이어야 합니다');
    });
  });

  it('should show social buttons by default', () => {
    render(<AuthForm mode="login" />);
    expect(screen.getByTestId('social-buttons-mock')).toBeInTheDocument();
  });

  it('should hide social buttons when showSocial is false', () => {
    render(<AuthForm mode="login" showSocial={false} />);
    expect(screen.queryByTestId('social-buttons-mock')).not.toBeInTheDocument();
  });

  it('should call onSubmit with form data', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<AuthForm mode="login" onSubmit={onSubmit} />);
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByTestId('submit-button'));
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ email: 'test@test.com', password: 'password123' });
    });
  });
});
