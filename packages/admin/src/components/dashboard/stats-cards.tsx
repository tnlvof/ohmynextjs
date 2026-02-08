import React from 'react';

interface Stats {
  totalUsers: number;
  activeUsers: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
  totalUsersChange: number;
  activeUsersChange: number;
  monthlyRevenueChange: number;
  activeSubscriptionsChange: number;
}

interface StatsCardsProps {
  stats: Stats | null;
  isLoading: boolean;
}

function formatNumber(n: number): string {
  return n.toLocaleString('ko-KR');
}

function formatCurrency(n: number): string {
  return `₩${n.toLocaleString('ko-KR')}`;
}

function formatChange(n: number): string {
  return n >= 0 ? `+${n}%` : `${n}%`;
}

const cards = [
  { key: 'totalUsers' as const, label: '전체 유저 수', changeKey: 'totalUsersChange' as const, format: formatNumber },
  { key: 'activeUsers' as const, label: '활성 유저', changeKey: 'activeUsersChange' as const, format: formatNumber },
  { key: 'monthlyRevenue' as const, label: '이번 달 매출', changeKey: 'monthlyRevenueChange' as const, format: formatCurrency },
  { key: 'activeSubscriptions' as const, label: '구독자 수', changeKey: 'activeSubscriptionsChange' as const, format: formatNumber },
];

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  if (isLoading || !stats) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {cards.map((card) => (
          <div key={card.key} data-testid="stats-card-loading" style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div>로딩 중...</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
      {cards.map((card) => (
        <div key={card.key} style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>{card.label}</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{card.format(stats[card.key])}</div>
          <div style={{ fontSize: '12px', color: stats[card.changeKey] >= 0 ? '#10b981' : '#ef4444' }}>
            {formatChange(stats[card.changeKey])}
          </div>
        </div>
      ))}
    </div>
  );
}
