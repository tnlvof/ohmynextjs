'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SocialButtons } from './social-buttons';

const MIN_PASSWORD_LENGTH = 6;

interface AuthFormProps {
  mode: 'login' | 'signup';
  showSocial?: boolean;
  redirectTo?: string;
  onSubmit?: (data: AuthFormData) => Promise<void>;
}

interface AuthFormData {
  email: string;
  password: string;
  name?: string;
}

function validateForm(mode: 'login' | 'signup', email: string, password: string): string | null {
  if (!email) return '이메일을 입력해주세요';
  if (!password) return '비밀번호를 입력해주세요';
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `비밀번호는 ${MIN_PASSWORD_LENGTH}자 이상이어야 합니다`;
  }
  return null;
}

export function AuthForm({ mode, showSocial = true, redirectTo, onSubmit }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isLogin = mode === 'login';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm(mode, email, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await onSubmit?.({ email, password, ...(!isLogin ? { name } : {}) });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '오류가 발생했습니다';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="auth-form" className="mx-auto w-full max-w-md">
      <div className="rounded-lg border bg-card p-8 shadow-sm">
        <AuthFormHeader isLogin={isLogin} />

        {showSocial && (
          <>
            <SocialButtons />
            <Divider />
          </>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <FormField label="이름" htmlFor="name">
              <input
                id="name"
                type="text"
                placeholder="홍길동"
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-testid="name-input"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </FormField>
          )}

          <FormField label="이메일" htmlFor="email">
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="email-input"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </FormField>

          <FormField label="비밀번호" htmlFor="password">
            <input
              id="password"
              type="password"
              placeholder={`${MIN_PASSWORD_LENGTH}자 이상`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="password-input"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </FormField>

          {error && (
            <div
              data-testid="error-message"
              role="alert"
              className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            data-testid="submit-button"
            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? '처리 중...' : isLogin ? '로그인' : '회원가입'}
          </button>
        </form>

        <AuthFormFooter isLogin={isLogin} />
      </div>
    </div>
  );
}

/* --- Sub-components (SRP: each handles one concern) --- */

function AuthFormHeader({ isLogin }: { isLogin: boolean }) {
  return (
    <div className="mb-6 text-center">
      <h2 className="text-2xl font-bold tracking-tight">
        {isLogin ? '로그인' : '회원가입'}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {isLogin ? '계정에 로그인하세요' : '새 계정을 만들어보세요'}
      </p>
    </div>
  );
}

function AuthFormFooter({ isLogin }: { isLogin: boolean }) {
  return (
    <div className="mt-6 text-center text-sm">
      {isLogin ? (
        <>
          <Link
            href="/auth/reset-password"
            data-testid="reset-link"
            className="text-muted-foreground underline-offset-4 hover:underline"
          >
            비밀번호 재설정
          </Link>
          <span className="mx-2 text-muted-foreground">·</span>
          <Link
            href="/auth/signup"
            data-testid="toggle-link"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            회원가입
          </Link>
        </>
      ) : (
        <span className="text-muted-foreground">
          이미 계정이 있으신가요?{' '}
          <Link
            href="/auth/login"
            data-testid="toggle-link"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            로그인
          </Link>
        </span>
      )}
    </div>
  );
}

function FormField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="text-sm font-medium leading-none">
        {label}
      </label>
      {children}
    </div>
  );
}

function Divider() {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-card px-2 text-muted-foreground">또는</span>
      </div>
    </div>
  );
}
