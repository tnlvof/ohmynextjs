import { authMiddleware } from '@ohmynextjs/auth';

export default authMiddleware;

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/auth|api/payment/webhook).*)',
  ],
};
