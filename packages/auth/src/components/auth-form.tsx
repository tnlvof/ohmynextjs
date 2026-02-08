'use client';

import React, { useState } from 'react';
import { SocialButtons } from './social-buttons';

interface AuthFormProps {
  mode: 'login' | 'signup';
  showSocial?: boolean;
  redirectTo?: string;
  onSubmit?: (data: { email: string; password: string; name?: string }) => Promise<void>;
}

export function AuthForm({ mode, showSocial = true, redirectTo, onSubmit }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('이메일을 입력해주세요');
      return;
    }
    if (!password) {
      setError('비밀번호를 입력해주세요');
      return;
    }
    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다');
      return;
    }

    setLoading(true);
    try {
      await onSubmit?.({ email, password, ...(mode === 'signup' ? { name } : {}) });
    } catch (err: any) {
      setError(err.message || '오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="auth-form">
      <h2>{mode === 'login' ? '로그인' : '회원가입'}</h2>
      <form onSubmit={handleSubmit}>
        {mode === 'signup' && (
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            data-testid="name-input"
          />
        )}
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          data-testid="email-input"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          data-testid="password-input"
        />
        {error && <p data-testid="error-message" role="alert">{error}</p>}
        <button type="submit" disabled={loading} data-testid="submit-button">
          {loading ? '처리 중...' : mode === 'login' ? '로그인' : '회원가입'}
        </button>
      </form>
      {mode === 'login' && (
        <a href="/auth/reset-password" data-testid="reset-link">비밀번호 재설정</a>
      )}
      <a
        href={mode === 'login' ? '/auth/signup' : '/auth/login'}
        data-testid="toggle-link"
      >
        {mode === 'login' ? '회원가입' : '로그인'}
      </a>
      {showSocial && <SocialButtons />}
    </div>
  );
}
