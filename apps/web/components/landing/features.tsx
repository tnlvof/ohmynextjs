const features = [
  { title: '인증', description: 'Supabase 기반 이메일/소셜 로그인' },
  { title: '결제', description: '토스페이먼츠 연동 결제 시스템' },
  { title: '관리자', description: '유저/결제/설정 관리 대시보드' },
];

export function Features() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="rounded-lg border p-6">
            <h3 className="text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
