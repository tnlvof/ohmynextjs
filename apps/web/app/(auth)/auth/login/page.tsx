'use client';

import { AuthForm, SocialButtons } from '@ohmynextjs/auth';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">로그인</h1>
        <p className="mt-1 text-sm text-muted-foreground">계정에 로그인하세요</p>
      </div>
      <AuthForm mode="login" />
      <SocialButtons />
      <p className="text-center text-sm text-muted-foreground">
        계정이 없으신가요? <Link href="/auth/signup" className="underline">회원가입</Link>
      </p>
      <p className="text-center text-sm">
        <Link href="/auth/reset-password" className="text-muted-foreground underline">비밀번호 찾기</Link>
      </p>
    </div>
  );
}
