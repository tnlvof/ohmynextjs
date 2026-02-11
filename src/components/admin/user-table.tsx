'use client';

import { useState, useTransition } from 'react';
import { updateUserRole, updateUserStatus } from '@/lib/admin/actions';
import { ConfirmDialog } from './confirm-dialog';
import { useToast } from './toast';

interface UserRow {
  id: string;
  email: string;
  name: string | null;
  role: 'user' | 'admin';
  status: 'active' | 'banned' | 'deleted';
  provider: string | null;
  createdAt: Date;
  lastSignInAt: Date | null;
}

interface UserTableProps {
  users: UserRow[];
  currentAdminId: string;
}

export function UserTable({ users, currentAdminId }: UserTableProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [dialog, setDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    action: () => Promise<void>;
  }>({ open: false, title: '', description: '', action: async () => {} });

  const handleRoleChange = (user: UserRow, newRole: 'user' | 'admin') => {
    if (user.id === currentAdminId) {
      toast('자기 자신의 역할은 변경할 수 없습니다.', 'error');
      return;
    }
    setDialog({
      open: true,
      title: '역할 변경',
      description: `${user.email}의 역할을 ${newRole}로 변경하시겠습니까?`,
      action: async () => {
        startTransition(async () => {
          const result = await updateUserRole(user.id, newRole);
          if (result.success) {
            toast('역할이 변경되었습니다.');
          } else {
            toast(result.error, 'error');
          }
        });
      },
    });
  };

  const handleStatusChange = (user: UserRow, newStatus: 'active' | 'banned') => {
    if (user.id === currentAdminId) {
      toast('자기 자신의 상태는 변경할 수 없습니다.', 'error');
      return;
    }
    setDialog({
      open: true,
      title: '상태 변경',
      description: `${user.email}의 상태를 ${newStatus}로 변경하시겠습니까?`,
      action: async () => {
        startTransition(async () => {
          const result = await updateUserStatus(user.id, newStatus);
          if (result.success) {
            toast('상태가 변경되었습니다.');
          } else {
            toast(result.error, 'error');
          }
        });
      },
    });
  };

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm" role="table">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">이름</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">이메일</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">역할</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">상태</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">가입일</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border hover:bg-accent/50">
                <td className="px-4 py-3">{user.name ?? '-'}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user, e.target.value as 'user' | 'admin')}
                    disabled={user.id === currentAdminId || isPending}
                    className="rounded-md border border-border bg-background px-2 py-1 text-sm disabled:opacity-50"
                    aria-label={`${user.email} 역할`}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={user.status}
                    onChange={(e) => handleStatusChange(user, e.target.value as 'active' | 'banned')}
                    disabled={user.id === currentAdminId || isPending}
                    className="rounded-md border border-border bg-background px-2 py-1 text-sm disabled:opacity-50"
                    aria-label={`${user.email} 상태`}
                  >
                    <option value="active">active</option>
                    <option value="banned">banned</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {users.map((user) => (
          <div key={user.id} className="rounded-lg border border-border p-4">
            <p className="font-medium">{user.name ?? '-'}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="mt-3 flex items-center gap-2">
              <select
                value={user.role}
                onChange={(e) => handleRoleChange(user, e.target.value as 'user' | 'admin')}
                disabled={user.id === currentAdminId || isPending}
                className="rounded-md border border-border bg-background px-2 py-1 text-xs disabled:opacity-50"
                aria-label={`${user.email} 역할`}
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
              <select
                value={user.status}
                onChange={(e) => handleStatusChange(user, e.target.value as 'active' | 'banned')}
                disabled={user.id === currentAdminId || isPending}
                className="rounded-md border border-border bg-background px-2 py-1 text-xs disabled:opacity-50"
                aria-label={`${user.email} 상태`}
              >
                <option value="active">active</option>
                <option value="banned">banned</option>
              </select>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {new Date(user.createdAt).toLocaleDateString('ko-KR')}
            </p>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={dialog.open}
        title={dialog.title}
        description={dialog.description}
        onConfirm={async () => {
          setDialog((d) => ({ ...d, open: false }));
          await dialog.action();
        }}
        onCancel={() => setDialog((d) => ({ ...d, open: false }))}
      />
    </>
  );
}
