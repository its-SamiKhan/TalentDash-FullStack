'use client';

import React, { useEffect, useState } from 'react';

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  delay?: number;
}

export function SearchInput({ value, onChange, delay = 300, className = '', ...props }: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const [prevValue, setPrevValue] = useState(value);

  if (value !== prevValue) {
    setPrevValue(value);
    setLocalValue(value);
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(localValue);
    }, delay);

    return () => clearTimeout(handler);
  }, [localValue, delay, onChange]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className={`w-full h-10 pl-9 pr-3 border border-[#EBEBEB] rounded-md text-sm text-[#222222] placeholder:text-[#717171] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]/50 focus:border-[#FF5A5F] ${className}`}
        {...props}
      />
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg className="h-4 w-4 text-[#717171]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
}
