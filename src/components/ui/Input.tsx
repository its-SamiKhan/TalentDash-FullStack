import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({ label, error, helperText, className = '', id, ...props }: InputProps) {
  const generatedId = React.useId();
  const inputId = id || generatedId;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-[#717171] mb-1.5">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full h-10 px-3 border rounded-md text-sm text-[#222222] placeholder:text-[#717171] bg-white transition-shadow focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]/50 focus:border-[#FF5A5F] ${
          error ? 'border-[#D93025]' : 'border-[#EBEBEB]'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-[#D93025] font-medium">{error}</p>}
      {!error && helperText && <p className="mt-1 text-xs text-[#717171]">{helperText}</p>}
    </div>
  );
}
