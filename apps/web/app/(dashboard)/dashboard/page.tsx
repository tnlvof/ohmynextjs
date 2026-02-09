export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">대시보드</h1>
        <p className="text-muted-foreground">환영합니다! 여기서 활동을 확인할 수 있습니다.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: '총 프로젝트', value: '12', change: '+2' },
          { label: '이번 달 사용량', value: '2,350', change: '+180' },
          { label: '활성 구독', value: 'Pro', change: '' },
          { label: '남은 크레딧', value: '8,500', change: '-150' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold">{stat.value}</span>
              {stat.change && (
                <span className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                  {stat.change}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">최근 활동</h3>
          <div className="space-y-4">
            {[
              { action: '프로젝트 생성', time: '2시간 전', desc: '새 프로젝트 "마이앱"' },
              { action: '결제 완료', time: '1일 전', desc: 'Pro 플랜 구독' },
              { action: '설정 변경', time: '3일 전', desc: '프로필 사진 업데이트' },
            ].map((item, i) => (
              <div key={i} className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{item.action}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">빠른 작업</h3>
          <div className="grid gap-3">
            {[
              { label: '새 프로젝트 만들기', icon: '➕' },
              { label: '팀원 초대하기', icon: '👥' },
              { label: '결제 관리', icon: '💳' },
              { label: '도움말 보기', icon: '❓' },
            ].map((action) => (
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
      </div>
    </div>
  );
}
