import React from 'react';

interface BarChartItem {
  label: string;
  value: number;
  percentage: number;
}

interface BarChartProps {
  items: BarChartItem[];
}

export function BarChart({ items }: BarChartProps) {
  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <div key={item.label} className="w-full flex items-center justify-between gap-4">
          <div className="w-24 text-sm font-semibold text-[#484848] truncate">
            {item.label}
          </div>
          <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-[#FF5A5F] h-full rounded-full transition-all duration-500"
              style={{ width: `${item.percentage}%` }}
            />
          </div>
          <div className="w-24 text-right flex items-center justify-end gap-1.5">
            <span className="text-sm font-bold text-[#222222]">{item.value}</span>
            <span className="text-xs text-[#717171]">({item.percentage}%)</span>
          </div>
        </div>
      ))}
    </div>
  );
}
