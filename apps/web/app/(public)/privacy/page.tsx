export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-bold">개인정보처리방침</h1>
      <p className="mt-4 text-muted-foreground">
        최종 수정일: 2026년 2월 9일
      </p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">1. 수집하는 개인정보</h2>
          <p>
            서비스 이용 과정에서 이메일 주소, 이름, 결제 정보 등을 수집할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">2. 개인정보의 이용 목적</h2>
          <p>
            수집된 개인정보는 서비스 제공, 본인 확인, 결제 처리, 고객 지원 등의 목적으로
            이용됩니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">3. 개인정보의 보유 및 이용 기간</h2>
          <p>
            회원 탈퇴 시까지 보유하며, 관련 법령에 따라 일정 기간 보관이 필요한 경우
            해당 기간 동안 보관합니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">4. 개인정보의 제3자 제공</h2>
          <p>
            원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 법령에 의한
            경우는 예외로 합니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">5. 개인정보 보호책임자</h2>
          <p>
            개인정보 관련 문의사항은 고객센터를 통해 연락해주시기 바랍니다.
          </p>
        </section>
      </div>
    </div>
  );
}
