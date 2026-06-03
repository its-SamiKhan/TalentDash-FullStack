'use client';

import React, { useState, useRef, useEffect } from 'react';

interface MultiSelectProps {
  label?: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export function MultiSelect({ label, options, selected, onChange, placeholder = 'Select options' }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const selectedLabels = options
    .filter((opt) => selected.includes(opt.value))
    .map((opt) => opt.label);

  return (
    <div className="w-full relative" ref={containerRef}>
      {label && (
        <span className="block text-xs font-semibold uppercase tracking-wider text-[#717171] mb-1.5">
          {label}
        </span>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-10 px-3 flex items-center justify-between border border-[#EBEBEB] rounded-md text-sm text-[#222222] bg-white transition-shadow focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]/50 focus:border-[#FF5A5F]"
      >
        <span className="truncate text-left">
          {selectedLabels.length > 0 ? selectedLabels.join(', ') : placeholder}
        </span>
        <svg className="h-4 w-4 text-[#717171] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto border border-[#EBEBEB] bg-white rounded-md shadow-lg p-2 flex flex-col gap-1.5">
          {options.map((opt) => {
            const isChecked = selected.includes(opt.value);
            return (
              <label key={opt.value} className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-slate-50 rounded cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggle(opt.value)}
                  className="rounded border-[#EBEBEB] text-[#FF5A5F] focus:ring-[#FF5A5F]"
                />
                <span className="text-[#484848] font-medium">{opt.label}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
