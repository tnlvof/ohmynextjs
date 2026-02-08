import React from 'react';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'user' | 'admin';
  status: 'active' | 'banned' | 'deleted';
  avatar_url: string | null;
  created_at: string;
  last_sign_in_at: string | null;
}

interface UserDetailDialogProps {
  user: User;
  open: boolean;
  onClose: () => void;
}

export function UserDetailDialog({ user, open, onClose }: UserDetailDialogProps) {
  if (!open) return null;

  return (
    <div data-testid="user-detail-dialog" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', padding: '24px', borderRadius: '8px', minWidth: '400px' }}>
        <h2>유저 상세</h2>
        <div><strong>이름:</strong> {user.name || '-'}</div>
        <div><strong>이메일:</strong> {user.email}</div>
        <div><strong>역할:</strong> {user.role}</div>
        <div><strong>상태:</strong> {user.status}</div>
        <div><strong>가입일:</strong> {user.created_at}</div>
        <div><strong>마지막 로그인:</strong> {user.last_sign_in_at || '-'}</div>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}
