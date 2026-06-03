import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'slate' | 'green' | 'blue' | 'red' | 'orange';
}

export function Badge({ children, variant = 'slate' }: BadgeProps) {
  const variants = {
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    green: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    red: 'bg-red-100 text-red-800 border-red-200',
    orange: 'bg-amber-100 text-amber-800 border-amber-200',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${variants[variant]}`}>
      {children}
    </span>
  );
}
