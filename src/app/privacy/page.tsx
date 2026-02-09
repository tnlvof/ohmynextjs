export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-screen-md px-4 py-24">
      <h1 className="text-3xl font-bold">개인정보처리방침</h1>
      <div className="mt-8 space-y-6 text-muted-foreground leading-7">
        <section>
          <h2 className="text-xl font-semibold text-foreground">1. 수집하는 개인정보</h2>
          <p className="mt-2">서비스 이용을 위해 이메일 주소, 이름, 프로필 이미지를 수집합니다. 소셜 로그인 시 해당 플랫폼에서 제공하는 기본 프로필 정보를 수집할 수 있습니다.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">2. 개인정보의 이용 목적</h2>
          <p className="mt-2">수집된 개인정보는 서비스 제공, 본인 인증, 서비스 개선 목적으로만 사용됩니다.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">3. 개인정보의 보유 및 이용 기간</h2>
          <p className="mt-2">회원 탈퇴 시 즉시 파기하며, 관련 법령에 의해 보관이 필요한 경우 해당 기간 동안 보관합니다.</p>
        </section>
      </div>
    </div>
  );
}
