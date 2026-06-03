import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function StatCard({ title, value, subValue, trend }: StatCardProps) {
  return (
    <div className="bg-white border border-[#EBEBEB] rounded-lg p-6 shadow-sm flex flex-col justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#717171]">
          {title}
        </p>
        <p className="text-3xl sm:text-4xl font-bold text-[#222222] tracking-tight mt-2">
          {value}
        </p>
      </div>
      {(subValue || trend) && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#EBEBEB]">
          {subValue && <span className="text-xs text-[#717171]">{subValue}</span>}
          {trend && (
            <span
              className={`text-xs font-semibold flex items-center gap-0.5 ${
                trend.isPositive ? 'text-[#008A05]' : 'text-[#D93025]'
              }`}
            >
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
