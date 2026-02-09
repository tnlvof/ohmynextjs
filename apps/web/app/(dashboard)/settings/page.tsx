export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">개인 설정</h1>
        <p className="text-muted-foreground">프로필과 계정 설정을 관리하세요.</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">프로필</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-2xl">
                👤
              </div>
              <button className="rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent">
                사진 변경
              </button>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">이름</label>
              <input
                type="text"
                defaultValue="사용자"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">이메일</label>
              <input
                type="email"
                defaultValue="user@example.com"
                disabled
                className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground"
              />
            </div>
            <button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              저장
            </button>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">비밀번호 변경</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">현재 비밀번호</label>
              <input
                type="password"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">새 비밀번호</label>
              <input
                type="password"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              비밀번호 변경
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-destructive/50 bg-card p-6 shadow-sm">
          <h3 className="mb-2 text-lg font-semibold text-destructive">계정 삭제</h3>
          <p className="text-sm text-muted-foreground">
            계정을 삭제하면 모든 데이터가 영구적으로 제거됩니다.
          </p>
          <button className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-destructive px-4 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90">
            계정 삭제
          </button>
        </div>
      </div>
    </div>
  );
}
