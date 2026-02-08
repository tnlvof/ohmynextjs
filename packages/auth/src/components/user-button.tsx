'use client';

import React, { useState } from 'react';
import type { User } from '../types';

interface UserButtonProps {
  user: User | null;
  showName?: boolean;
  onSignOut?: () => void;
}

export function UserButton({ user, showName = false, onSignOut }: UserButtonProps) {
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const initials = (user.name || user.email)
    .charAt(0)
    .toUpperCase();

  return (
    <div data-testid="user-button">
      <button onClick={() => setOpen(!open)} data-testid="avatar-button">
        {user.avatar_url ? (
          <img src={user.avatar_url} alt="avatar" data-testid="avatar-image" />
        ) : (
          <span data-testid="avatar-initials">{initials}</span>
        )}
        {showName && <span data-testid="user-name">{user.name || user.email}</span>}
      </button>
      {open && (
        <div data-testid="dropdown-menu" role="menu">
          <a href="/settings" role="menuitem">프로필</a>
          <a href="/settings" role="menuitem">설정</a>
          <a href="/billing" role="menuitem">빌링</a>
          {user.role === 'admin' && (
            <a href="/admin" role="menuitem" data-testid="admin-link">관리자 대시보드</a>
          )}
          <button onClick={onSignOut} role="menuitem" data-testid="signout-button">
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}
