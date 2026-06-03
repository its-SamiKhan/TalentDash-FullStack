import React from 'react';
import { formatLevel } from '@/lib/formatters';

interface LevelBadgeProps {
  level: string;
}

export function LevelBadge({ level }: LevelBadgeProps) {
  const displayLevel = formatLevel(level);

  let styles = 'bg-slate-100 text-slate-700 border-slate-200/50';
  
  if (level === 'L3' || level === 'SDE_I' || displayLevel === 'SDE-I') {
    styles = 'bg-slate-100 text-slate-700 border-slate-200/50';
  } else if (level === 'L4' || level === 'SDE_II' || displayLevel === 'SDE-II') {
    styles = 'bg-blue-100 text-blue-700 border-blue-200/50';
  } else if (level === 'L5' || level === 'SDE_III' || displayLevel === 'SDE-III') {
    styles = 'bg-indigo-100 text-indigo-700 border-indigo-200/50';
  } else if (level === 'L6' || level === 'STAFF' || displayLevel === 'Staff') {
    styles = 'bg-purple-100 text-purple-700 border-purple-200/50';
  } else if (level === 'PRINCIPAL' || level === 'IC4' || level === 'IC5' || displayLevel === 'Principal') {
    styles = 'bg-[#222222] text-white border-black';
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${styles}`}>
      {displayLevel}
    </span>
  );
}
