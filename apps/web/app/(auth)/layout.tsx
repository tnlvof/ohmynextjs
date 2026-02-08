export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-testid="auth-layout" className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md p-4">
        {children}
      </div>
    </div>
  );
}
