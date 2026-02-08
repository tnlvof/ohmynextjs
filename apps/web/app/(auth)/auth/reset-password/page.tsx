'use client';

export default function ResetPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">비밀번호 재설정</h1>
        <p className="mt-1 text-sm text-muted-foreground">이메일 주소를 입력하면 재설정 링크를 보내드립니다.</p>
      </div>
      <form className="space-y-4">
        <input type="email" placeholder="이메일" className="w-full rounded-md border px-3 py-2" />
        <button type="submit" className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground">
          재설정 링크 보내기
        </button>
      </form>
    </div>
  );
}
