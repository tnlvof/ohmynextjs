import { createClient } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import { SignOutButton } from './sign-out-button';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="container mx-auto max-w-screen-xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">대시보드</h1>
          <p className="mt-1 text-muted-foreground">{user.email}</p>
        </div>
        <SignOutButton />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard title="구독 상태" value="무료" description="현재 무료 플랜을 사용 중입니다" />
        <DashboardCard title="결제 내역" value="0건" description="결제 내역이 없습니다" />
        <DashboardCard title="가입일" value={new Date(user.created_at).toLocaleDateString('ko-KR')} description="가입해주셔서 감사합니다" />
      </div>
    </div>
  );
}

function DashboardCard({ title, value, description }: { title: string; value: string; description: string }) {
  return (
    <div className="rounded-lg border p-6">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
