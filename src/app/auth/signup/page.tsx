'use client';

import { AuthForm } from '@/components/auth-form';
import { signUp, signInWithOAuth } from '@/lib/auth/actions';
import type { OAuthProvider } from '@/types/auth';

export default function SignUpPage() {
  const handleSubmit = async (data: { email: string; password: string; name?: string }) => {
    const result = await signUp(data);
    if (result?.error) {
      throw new Error(result.error.message);
    }
  };

  const handleOAuth = async (provider: OAuthProvider) => {
    await signInWithOAuth(provider);
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <AuthForm mode="signup" onSubmit={handleSubmit} onOAuthClick={handleOAuth} />
    </div>
  );
}
