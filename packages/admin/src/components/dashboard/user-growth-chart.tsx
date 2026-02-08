import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface GrowthData {
  date: string;
  count: number;
}

interface UserGrowthChartProps {
  data: GrowthData[];
}

export function UserGrowthChart({ data }: UserGrowthChartProps) {
  return (
    <div data-testid="user-growth-chart" style={{ width: '100%', height: 300 }}>
      <h3>일별 신규 가입자</h3>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#10b981" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
