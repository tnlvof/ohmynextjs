'use client';

import { AuthForm, SocialButtons } from '@ohmynextjs/auth';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">회원가입</h1>
        <p className="mt-1 text-sm text-muted-foreground">새 계정을 만드세요</p>
      </div>
      <AuthForm mode="signup" />
      <SocialButtons />
      <p className="text-center text-sm text-muted-foreground">
        이미 계정이 있으신가요? <Link href="/auth/login" className="underline">로그인</Link>
      </p>
    </div>
  );
}
