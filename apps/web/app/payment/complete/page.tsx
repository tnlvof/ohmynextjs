import Link from 'next/link';

export default function PaymentCompletePage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">결제 완료</h1>
        <p className="mt-2 text-muted-foreground">결제가 성공적으로 완료되었습니다.</p>
        <Link href="/dashboard" className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-primary-foreground">
          대시보드로 이동
        </Link>
      </div>
    </div>
  );
}
