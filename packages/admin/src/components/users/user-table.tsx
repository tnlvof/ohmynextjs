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

interface UserTableProps {
  users: User[];
  total: number;
  page: number;
  onPageChange: (page: number) => void;
  onAction: (userId: string, action: string) => void;
}

export function UserTable({ users, total, page, onPageChange, onAction }: UserTableProps) {
  if (users.length === 0) {
    return <div>유저가 없습니다</div>;
  }

  return (
    <div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>이름</th>
            <th>이메일</th>
            <th>역할</th>
            <th>상태</th>
            <th>가입일</th>
            <th>마지막 로그인</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name || '-'}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
              <td>{user.created_at}</td>
              <td>{user.last_sign_in_at || '-'}</td>
              <td>
                <button onClick={() => onAction(user.id, 'detail')}>상세</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        총 {total}명 | 페이지 {page}
        <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}>이전</button>
        <button onClick={() => onPageChange(page + 1)}>다음</button>
      </div>
    </div>
  );
}
