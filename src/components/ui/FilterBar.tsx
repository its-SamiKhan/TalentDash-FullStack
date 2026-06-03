'use client';

import React from 'react';

interface ActiveFilter {
  key: string;
  label: string;
  value: unknown;
}

interface FilterBarProps {
  filters: ActiveFilter[];
  onRemove: (key: string) => void;
  onClearAll: () => void;
}

export function FilterBar({ filters, onRemove, onClearAll }: FilterBarProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 py-2">
      <span className="text-xs font-semibold text-[#717171] uppercase tracking-wider">
        Active Filters:
      </span>
      {filters.map((filter) => (
        <span
          key={filter.key}
          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-white border border-[#EBEBEB] text-[#484848] rounded-full shadow-sm"
        >
          <span>{filter.label}</span>
          <button
            type="button"
            onClick={() => onRemove(filter.key)}
            className="text-[#717171] hover:text-[#FF5A5F] font-bold rounded-full focus:outline-none transition-colors"
          >
            ×
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="text-xs font-bold text-[#FF5A5F] hover:text-[#ff4449] focus:outline-none ml-2"
      >
        Clear All
      </button>
    </div>
  );
}
