import React from 'react';

interface WinnerBadgeProps {
  winner: 'record1' | 'record2' | 'tie';
  recordName: string;
}

export function WinnerBadge({ winner, recordName }: WinnerBadgeProps) {
  if (winner === 'tie') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border border-slate-200 bg-slate-100 text-slate-700">
        Tie
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border border-[#008A05]/20 bg-[#008A05]/10 text-[#008A05]">
      🏆 {recordName} wins
    </span>
  );
}
