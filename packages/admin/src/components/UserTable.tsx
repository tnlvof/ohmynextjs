'use client';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface UserTableProps {
  users: User[];
}

export function UserTable({ users }: UserTableProps) {
  return (
    <table className="w-full bg-white rounded-lg shadow">
      <thead>
        <tr className="border-b text-left">
          <th className="p-4">이메일</th>
          <th className="p-4">이름</th>
          <th className="p-4">역할</th>
          <th className="p-4">상태</th>
          <th className="p-4">가입일</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="border-b hover:bg-gray-50">
            <td className="p-4">{user.email}</td>
            <td className="p-4">{user.name || '-'}</td>
            <td className="p-4">{user.role}</td>
            <td className="p-4">{user.isActive ? '✅' : '❌'}</td>
            <td className="p-4">{new Date(user.createdAt).toLocaleDateString('ko-KR')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
