export default function BillingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">빌링</h1>
        <p className="text-muted-foreground">구독 및 결제 내역을 관리하세요.</p>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">현재 플랜</h3>
            <p className="text-sm text-muted-foreground">Pro 플랜을 사용 중입니다</p>
          </div>
          <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            Pro
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-3xl font-bold">₩29,000</span>
          <span className="text-muted-foreground">/ 월</span>
        </div>
        <div className="mt-4 flex gap-3">
          <button className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent">
            플랜 변경
          </button>
          <button className="inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            구독 취소
          </button>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">결제 내역</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-medium text-muted-foreground">날짜</th>
                <th className="pb-3 font-medium text-muted-foreground">설명</th>
                <th className="pb-3 font-medium text-muted-foreground">금액</th>
                <th className="pb-3 text-right font-medium text-muted-foreground">상태</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: '2024-02-01', desc: 'Pro 플랜 - 월간', amount: '₩29,000', status: '완료' },
                { date: '2024-01-01', desc: 'Pro 플랜 - 월간', amount: '₩29,000', status: '완료' },
                { date: '2023-12-01', desc: 'Pro 플랜 - 월간', amount: '₩29,000', status: '완료' },
              ].map((row, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="py-3">{row.date}</td>
                  <td className="py-3">{row.desc}</td>
                  <td className="py-3">{row.amount}</td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
