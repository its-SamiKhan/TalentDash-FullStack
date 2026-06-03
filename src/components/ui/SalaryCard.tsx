'use client';

import React from 'react';
import type { SalaryForDisplay } from '@/types';
import { CompanyLogo } from './CompanyLogo';
import { LevelBadge } from './LevelBadge';
import { formatCurrency, formatExperience, formatDate } from '@/lib/formatters';
import Link from 'next/link';

interface SalaryCardProps {
  salary: SalaryForDisplay;
}

export function SalaryCard({ salary }: SalaryCardProps) {
  return (
    <div className="bg-white border border-[#EBEBEB] rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <CompanyLogo name={salary.companyName} logoUrl={salary.companyLogoUrl} size={40} />
          <div>
            <Link
              href={`/companies/${salary.companySlug}`}
              className="text-sm font-bold text-[#222222] hover:text-[#FF5A5F] transition-colors"
            >
              {salary.companyName}
            </Link>
            <p className="text-xs text-[#717171]">{salary.location}</p>
          </div>
        </div>
        <LevelBadge level={salary.level} />
      </div>

      <div className="border-t border-b border-[#EBEBEB] py-3 flex justify-between text-center">
        <div className="flex-1 px-1">
          <p className="text-[10px] uppercase font-bold tracking-wider text-[#717171]">Role</p>
          <p className="text-sm font-semibold text-[#222222] mt-1 truncate max-w-[120px] mx-auto">{salary.role}</p>
        </div>
        <div className="flex-1 px-1 border-l border-r border-[#EBEBEB]">
          <p className="text-[10px] uppercase font-bold tracking-wider text-[#717171]">Experience</p>
          <p className="text-sm font-semibold text-[#222222] mt-1">{formatExperience(salary.experienceYears)}</p>
        </div>
        <div className="flex-1 px-1">
          <p className="text-[10px] uppercase font-bold tracking-wider text-[#717171]">Submitted</p>
          <p className="text-sm font-semibold text-[#222222] mt-1">{formatDate(salary.submittedAt)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-[#717171]">Total Compensation</p>
          <p className="text-lg font-bold text-[#FF5A5F] tracking-tight">
            {formatCurrency(salary.totalCompensation, salary.currency)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-[#717171]">Base: {formatCurrency(salary.baseSalary, salary.currency)}</p>
          <p className="text-[10px] text-[#717171]">
            Stock: {formatCurrency(salary.stock, salary.currency)} | Bonus: {formatCurrency(salary.bonus, salary.currency)}
          </p>
        </div>
      </div>
    </div>
  );
}
