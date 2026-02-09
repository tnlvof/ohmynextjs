const features = [
  {
    icon: '🔐',
    title: '인증',
    description: 'Supabase 기반 이메일/소셜 로그인. Google, Kakao, Naver, GitHub 지원.',
  },
  {
    icon: '💳',
    title: '결제',
    description: '토스페이먼츠 연동 결제 시스템. 일회성/구독 결제 모두 지원.',
  },
  {
    icon: '👨‍💼',
    title: '관리자',
    description: '사용자/결제/설정 관리 대시보드. 통계 차트와 데이터 테이블.',
  },
  {
    icon: '🎨',
    title: 'UI 컴포넌트',
    description: 'shadcn/ui + Tailwind CSS. 다크모드, 반응형 디자인 기본 탑재.',
  },
  {
    icon: '🗄️',
    title: '데이터베이스',
    description: 'Drizzle ORM + Supabase PostgreSQL. 타입 안전한 스키마 관리.',
  },
  {
    icon: '🤖',
    title: 'AI 에이전트',
    description: 'AI 코딩 에이전트 설정 자동 생성. AGENTS.md 기반 워크플로우.',
  },
];

export function Features() {
  return (
    <section className="border-t bg-muted/30 px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight">모든 것이 준비되어 있습니다</h2>
          <p className="mt-3 text-muted-foreground">
            프로덕션에 필요한 핵심 기능을 모두 포함하고 있어요.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-3 text-3xl">{f.icon}</div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
