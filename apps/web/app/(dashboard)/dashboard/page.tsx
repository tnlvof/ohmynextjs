import { WelcomeCard } from '@/components/dashboard/welcome-card';
import { StatCard } from '@/components/dashboard/stat-card';

const DASHBOARD_STATS = [
  { label: '총 프로젝트', value: '12', change: '+2' },
  { label: '이번 달 사용량', value: '2,350', change: '+180' },
  { label: '활성 구독', value: 'Pro' },
  { label: '남은 크레딧', value: '8,500', change: '-150' },
] as const;

const RECENT_ACTIVITIES = [
  { action: '프로젝트 생성', time: '2시간 전', description: '새 프로젝트 "마이앱"' },
  { action: '결제 완료', time: '1일 전', description: 'Pro 플랜 구독' },
  { action: '설정 변경', time: '3일 전', description: '프로필 사진 업데이트' },
] as const;

const QUICK_ACTIONS = [
  { label: '새 프로젝트 만들기', icon: '➕' },
  { label: '팀원 초대하기', icon: '👥' },
  { label: '결제 관리', icon: '💳' },
  { label: '도움말 보기', icon: '❓' },
] as const;

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <WelcomeCard />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DASHBOARD_STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentActivityCard />
        <QuickActionsCard />
      </div>
    </div>
  );
}

function RecentActivityCard() {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">최근 활동</h3>
      <div className="space-y-4">
        {RECENT_ACTIVITIES.map((item) => (
          <div
            key={item.action}
            className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0"
          >
            <div>
              <p className="text-sm font-medium">{item.action}</p>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
            <span className="text-xs text-muted-foreground">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickActionsCard() {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">빠른 작업</h3>
      <div className="grid gap-3">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.label}
            className="flex items-center gap-3 rounded-md border p-3 text-left text-sm transition-colors hover:bg-accent"
          >
            <span className="text-lg">{action.icon}</span>
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
