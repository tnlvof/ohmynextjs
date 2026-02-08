import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueData {
  month: string;
  revenue: number;
}

interface RevenueChartProps {
  data: RevenueData[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div data-testid="revenue-chart" style={{ width: '100%', height: 300 }}>
      <h3>월별 매출</h3>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value: number) => `₩${value.toLocaleString('ko-KR')}`} />
          <Bar dataKey="revenue" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
