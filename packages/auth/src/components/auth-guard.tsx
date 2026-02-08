'use client';

import React from 'react';
import type { User } from '../types';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredRole?: 'admin' | 'user';
  user: User | null;
  isLoading?: boolean;
}

export function AuthGuard({ children, fallback, requiredRole, user, isLoading }: AuthGuardProps) {
  if (isLoading) {
    return <div data-testid="auth-guard-loading">로딩 중...</div>;
  }

  if (!user) {
    return fallback ? <>{fallback}</> : <div data-testid="auth-guard-redirect">로그인이 필요합니다</div>;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <div data-testid="auth-guard-forbidden">접근 권한이 없습니다</div>;
  }

  return <>{children}</>;
}
