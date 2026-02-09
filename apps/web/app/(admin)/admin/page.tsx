export default function AdminPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">관리자 대시보드</h1>
        <p className="text-muted-foreground">서비스 전체 현황을 한눈에 확인하세요.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: '총 사용자', value: '1,234', change: '+12%', icon: '👥' },
          { label: '월 매출', value: '₩3,456,000', change: '+8%', icon: '💰' },
          { label: '활성 구독', value: '567', change: '+5%', icon: '📊' },
          { label: '이번 달 가입', value: '89', change: '+23%', icon: '🆕' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <span className="text-xl">{stat.icon}</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold">{stat.value}</span>
              <span className="text-xs font-medium text-green-600">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">최근 가입 사용자</h3>
          <div className="space-y-3">
            {[
              { name: '김민수', email: 'minsu@example.com', date: '2시간 전' },
              { name: '이지영', email: 'jiyoung@example.com', date: '5시간 전' },
              { name: '박준혁', email: 'junhyuk@example.com', date: '1일 전' },
              { name: '최서연', email: 'seoyeon@example.com', date: '2일 전' },
            ].map((user) => (
              <div key={user.email} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                    {user.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{user.date}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">최근 결제</h3>
          <div className="space-y-3">
            {[
              { user: '김민수', amount: '₩29,000', plan: 'Pro', status: '완료' },
              { user: '이지영', amount: '₩9,000', plan: 'Basic', status: '완료' },
              { user: '박준혁', amount: '₩29,000', plan: 'Pro', status: '처리중' },
              { user: '최서연', amount: '₩99,000', plan: 'Enterprise', status: '완료' },
            ].map((payment, i) => (
              <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{payment.user}</p>
                  <p className="text-xs text-muted-foreground">{payment.plan} 플랜</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{payment.amount}</p>
                  <span className={`text-xs ${payment.status === '완료' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
