export type OAuthProvider = 'google' | 'kakao' | 'naver' | 'github';

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  provider: string | null;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
  last_sign_in_at: string | null;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface SignUpInput {
  email: string;
  password: string;
  name?: string;
}

export interface AuthError {
  code: string;
  message: string;
}

export const AUTH_ERRORS = {
  AUTH_INVALID_CREDENTIALS: '이메일 또는 비밀번호가 올바르지 않습니다',
  AUTH_EMAIL_EXISTS: '이미 가입된 이메일입니다',
  AUTH_WEAK_PASSWORD: '비밀번호는 6자 이상이어야 합니다',
  AUTH_EMAIL_NOT_CONFIRMED: '이메일 인증을 완료해주세요',
  AUTH_USER_BANNED: '계정이 정지되었습니다',
  AUTH_SESSION_EXPIRED: '다시 로그인해주세요',
} as const;
