import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-md';
  
  const variants = {
    primary: 'bg-[#FF5A5F] text-white hover:bg-[#ff4449] focus:ring-[#FF5A5F]/50',
    secondary: 'bg-white border border-[#EBEBEB] text-[#484848] hover:bg-slate-50 focus:ring-slate-200',
    ghost: 'text-[#484848] hover:bg-slate-100 hover:text-[#222222] focus:ring-slate-100',
    danger: 'bg-[#D93025] text-white hover:bg-[#c2251a] focus:ring-[#D93025]/50',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
