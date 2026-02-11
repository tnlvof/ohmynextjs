import { getUsers } from '@/lib/admin/queries';
import { requireAdmin } from '@/lib/admin/auth';
import { UserTable } from '@/components/admin/user-table';
import { Pagination } from '@/components/admin/pagination';
import { SearchInput } from '@/components/admin/search-input';

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function AdminUsersPage({ searchParams }: Props) {
  const params = await searchParams;
  const admin = await requireAdmin();
  const query = params.q ?? '';
  const page = Number(params.page) || 1;

  const { users, total, totalPages } = await getUsers({ query, page });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">유저 관리</h1>

      <div className="mb-4 max-w-md">
        <SearchInput placeholder="이메일 또는 이름으로 검색..." defaultValue={query} />
      </div>

      <div className="rounded-lg border border-border">
        <UserTable users={users} currentAdminId={admin.userId} />
      </div>

      <Pagination currentPage={page} totalPages={totalPages} total={total} />
    </div>
  );
}
