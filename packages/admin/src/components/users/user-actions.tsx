import React from 'react';

interface UserActionsProps {
  userId: string;
  currentRole: 'user' | 'admin';
  currentStatus: 'active' | 'banned' | 'deleted';
  onRoleChange: (userId: string, role: 'user' | 'admin') => void;
  onStatusChange: (userId: string, status: 'active' | 'banned') => void;
  onDelete: (userId: string) => void;
}

export function UserActions({ userId, currentRole, currentStatus, onRoleChange, onStatusChange, onDelete }: UserActionsProps) {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button onClick={() => onRoleChange(userId, currentRole === 'admin' ? 'user' : 'admin')}>
        {currentRole === 'admin' ? '일반으로 변경' : '관리자로 변경'}
      </button>
      <button onClick={() => onStatusChange(userId, currentStatus === 'active' ? 'banned' : 'active')}>
        {currentStatus === 'active' ? '차단' : '활성화'}
      </button>
      <button onClick={() => onDelete(userId)} style={{ color: 'red' }}>삭제</button>
    </div>
  );
}
