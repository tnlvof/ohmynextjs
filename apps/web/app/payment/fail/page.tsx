import Link from 'next/link';

export default function PaymentFailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-destructive">결제 실패</h1>
        <p className="mt-2 text-muted-foreground">결제 처리 중 오류가 발생했습니다.</p>
        <Link href="/billing" className="mt-4 inline-block underline">다시 시도하기</Link>
      </div>
    </div>
  );
}
