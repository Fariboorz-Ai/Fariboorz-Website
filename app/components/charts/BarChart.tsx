
"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function BarChartComponent({ data, height }: { data: any[], height: number }) {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="day" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff'
            }}
          />
          <Bar dataKey="buy" fill="#dc2626" radius={[4, 4, 0, 0]} />
          <Bar dataKey="sell" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}