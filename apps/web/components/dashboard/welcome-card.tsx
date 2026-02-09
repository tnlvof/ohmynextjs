interface WelcomeCardProps {
  userName?: string;
}

export function WelcomeCard({ userName = '사용자' }: WelcomeCardProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">대시보드</h1>
      <p className="text-muted-foreground">
        환영합니다, {userName}님! 여기서 활동을 확인할 수 있습니다.
      </p>
    </div>
  );
}
