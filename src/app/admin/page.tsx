import { Users, UserPlus, DollarSign, TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/admin/stat-card';
import { PaymentStatusBadge } from '@/components/admin/payment-status-badge';
import { getAdminStats, getRecentUsers, getRecentPayments } from '@/lib/admin/queries';

export default async function AdminDashboardPage() {
  const [stats, recentUsers, recentPayments] = await Promise.all([
    getAdminStats(),
    getRecentUsers(5),
    getRecentPayments(5),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">대시보드</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="총 유저" value={stats.totalUsers.toLocaleString()} icon={Users} />
        <StatCard title="오늘 가입" value={stats.todaySignups.toLocaleString()} icon={UserPlus} />
        <StatCard title="총 매출" value={`₩${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} />
        <StatCard title="이번 달 매출" value={`₩${stats.monthlyRevenue.toLocaleString()}`} icon={TrendingUp} />
      </div>

      {/* Recent Users */}
      <section className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">최근 가입</h2>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">이름</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">이메일</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">가입일</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u) => (
                <tr key={u.id} className="border-b border-border">
                  <td className="px-4 py-3">{u.name ?? '-'}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(u.createdAt).toLocaleDateString('ko-KR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent Payments */}
      <section className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">최근 결제</h2>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">주문ID</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">유저</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">금액</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">상태</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">결제일</th>
              </tr>
            </thead>
            <tbody>
              {recentPayments.map((p) => (
                <tr key={p.id} className="border-b border-border">
                  <td className="px-4 py-3 font-mono text-xs">{p.orderId}</td>
                  <td className="px-4 py-3">{p.userEmail ?? '-'}</td>
                  <td className="px-4 py-3 text-right">₩{p.amount.toLocaleString()}</td>
                  <td className="px-4 py-3"><PaymentStatusBadge status={p.status} /></td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {p.paidAt ? new Date(p.paidAt).toLocaleDateString('ko-KR') : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
