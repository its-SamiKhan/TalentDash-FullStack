'use client';

import React from 'react';

interface CurrencyToggleProps {
  selected: string;
  onChange: (currency: string) => void;
  options?: string[];
}

export function CurrencyToggle({ selected, onChange, options = ['INR', 'USD', 'GBP', 'EUR'] }: CurrencyToggleProps) {
  return (
    <div className="inline-flex rounded-md border border-[#EBEBEB] bg-white p-1">
      {options.map((opt) => {
        const isSelected = selected === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-3 py-1.5 text-xs font-bold rounded-sm transition-colors focus:outline-none ${
              isSelected
                ? 'bg-[#FF5A5F] text-white'
                : 'text-[#484848] hover:text-[#222222] hover:bg-slate-50'
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
