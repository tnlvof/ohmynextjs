import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-testid="auth-layout" className="flex min-h-screen flex-col bg-background">
      <header className="flex h-14 items-center px-6">
        <Link href="/" className="text-lg font-bold">
          ← OhMyNextJS
        </Link>
      </header>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
