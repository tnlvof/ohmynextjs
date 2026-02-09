export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-screen-md px-4 py-24">
      <h1 className="text-3xl font-bold">이용약관</h1>
      <div className="mt-8 space-y-6 text-muted-foreground leading-7">
        <section>
          <h2 className="text-xl font-semibold text-foreground">제1조 (목적)</h2>
          <p className="mt-2">이 약관은 OhMyNextJS(이하 &quot;서비스&quot;)의 이용과 관련하여 서비스 제공자와 이용자 간의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">제2조 (정의)</h2>
          <p className="mt-2">&quot;서비스&quot;란 OhMyNextJS가 제공하는 SaaS 보일러플레이트 및 관련 기능을 말합니다.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">제3조 (약관의 효력)</h2>
          <p className="mt-2">이 약관은 서비스를 이용하고자 하는 모든 이용자에게 적용됩니다.</p>
        </section>
      </div>
    </div>
  );
}
