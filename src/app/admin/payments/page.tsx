import { getPayments } from '@/lib/admin/queries';
import { PaymentTable } from '@/components/admin/payment-table';
import { Pagination } from '@/components/admin/pagination';

interface Props {
  searchParams: Promise<{ status?: string; page?: string }>;
}

export default async function AdminPaymentsPage({ searchParams }: Props) {
  const params = await searchParams;
  const status = params.status ?? '';
  const page = Number(params.page) || 1;

  const { payments, total, totalPages } = await getPayments({
    status: status || undefined,
    page,
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">결제 내역</h1>

      <PaymentTable payments={payments} currentStatus={status} />

      <Pagination currentPage={page} totalPages={totalPages} total={total} />
    </div>
  );
}
