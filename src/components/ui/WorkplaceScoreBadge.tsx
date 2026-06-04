import React from 'react';

interface WorkplaceScoreBadgeProps {
  score: number;
  showScore?: boolean;
}

export function WorkplaceScoreBadge({ score, showScore = true }: WorkplaceScoreBadgeProps) {
  let stars = '';
  let label = '';
  let badgeClass = '';

  if (score >= 4.5) {
    stars = '⭐️⭐️⭐️';
    label = '3-Star Index';
    badgeClass = 'bg-rose-50 text-rose-800 border-rose-200';
  } else if (score >= 4.0) {
    stars = '⭐️⭐️';
    label = '2-Star Index';
    badgeClass = 'bg-amber-50 text-amber-800 border-amber-200';
  } else if (score >= 3.5) {
    stars = '⭐️';
    label = '1-Star Index';
    badgeClass = 'bg-blue-50 text-blue-800 border-blue-200';
  } else {
    stars = '';
    label = 'Qualified';
    badgeClass = 'bg-slate-50 text-slate-700 border-slate-200';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border shadow-sm ${badgeClass}`}>
      {stars && <span className="tracking-tight text-[10px]">{stars}</span>}
      <span>{label}</span>
      {showScore && (
        <span className="bg-white/60 px-1.5 py-0.5 rounded-full text-[10px] font-black border border-black/5 ml-0.5">
          {score.toFixed(1)}
        </span>
      )}
    </span>
  );
}
