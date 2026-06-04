import React from 'react';
import type { Metadata } from 'next';
import { EquityCalculator } from './EquityCalculator';
import Link from 'next/link';
import { generateToolPageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolPageMetadata(
    'equity-calculator',
    'ESOP & Equity Vesting Calculator',
    'Calculate the vesting schedule of your stock options (ESOPs) or RSUs. Project exit values and evaluate potential net worth from startup equity.'
  );
}

export default function EquityCalculatorPage() {
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
          ESOP & Equity Vesting Calculator
        </h1>
        <p className="text-sm text-[#717171] mt-1.5 font-medium">
          Calculate options value, customize cliffs and vesting periods, and model growth exit scenarios.
        </p>
      </div>

      <EquityCalculator />
    </div>
  );
}
