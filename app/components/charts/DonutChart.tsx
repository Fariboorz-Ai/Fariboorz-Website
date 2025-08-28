// components/charts/DonutChart.tsx
"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#dc2626', '#ef4444', '#f87171', '#fca5a5'];

export function DonutChartComponent({ data, height }: { data: any[], height: number }) {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}