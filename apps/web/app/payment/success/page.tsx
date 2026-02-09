export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        </div>
        <h1 className="text-2xl font-bold">결제 처리 중...</h1>
        <p className="mt-2 text-muted-foreground">결제를 확인하고 있습니다. 잠시만 기다려주세요.</p>
      </div>
    </div>
  );
}
