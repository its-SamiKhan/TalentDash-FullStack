import React from 'react';
import type { Metadata } from 'next';
import { SalaryCalculator } from './SalaryCalculator';
import Link from 'next/link';
import { generateToolPageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolPageMetadata(
    'salary-calculator',
    'Salary & Take-Home Pay Calculator',
    'Calculate your yearly total compensation mix and estimate progressive monthly income taxes and take-home pay for Indian and global tech roles.'
  );
}

export default function SalaryCalculatorPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      {/* Breadcrumb */}
      <div>
        <Link
          href="/tools"
          className="text-xs font-semibold text-[#717171] hover:text-[#222222] transition-colors"
        >
          ← Back to Tools
        </Link>
      </div>

      {/* Header */}
      <div className="pb-6 border-b border-[#EBEBEB]">
        <h1 className="text-3xl font-extrabold text-[#222222] tracking-tight">
          Salary & Take-Home Pay Calculator
        </h1>
        <p className="text-sm text-[#717171] mt-1.5 font-medium">
          Estimate progressive tax rates (under standard Indian slabs) and visualize your cash vs stock compensation mix.
        </p>
      </div>

      <SalaryCalculator />
    </div>
  );
}
