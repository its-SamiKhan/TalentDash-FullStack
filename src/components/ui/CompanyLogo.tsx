'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface CompanyLogoProps {
  name: string;
  logoUrl?: string | null;
  size?: number;
}

export function CompanyLogo({ name, logoUrl, size = 48 }: CompanyLogoProps) {
  const [error, setError] = useState(false);

  const initial = name.charAt(0).toUpperCase();

  if (error || !logoUrl) {
    return (
      <div
        className="flex items-center justify-center rounded-md bg-slate-100 border border-[#EBEBEB] text-[#717171] font-bold select-none"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          fontSize: `${Math.max(12, Math.floor(size * 0.45))}px`,
        }}
      >
        {initial}
      </div>
    );
  }

  return (
    <div
      className="relative flex-shrink-0 bg-white border border-[#EBEBEB] rounded-md overflow-hidden flex items-center justify-center"
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <Image
        src={logoUrl}
        alt={`${name} logo`}
        width={size}
        height={size}
        className="object-contain p-1"
        onError={() => setError(true)}
      />
    </div>
  );
}
