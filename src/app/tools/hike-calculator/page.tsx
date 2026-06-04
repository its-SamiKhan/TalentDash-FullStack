import React from 'react';
import type { Metadata } from 'next';
import { HikeCalculator } from './HikeCalculator';
import Link from 'next/link';
import { generateToolPageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolPageMetadata(
    'hike-calculator',
    'Salary Hike & Promotion Calculator',
    'Evaluate proposed job offers side-by-side against your current compensation. Calculate percentages, absolute increases, and monthly take-home increments.'
  );
}

export default function HikeCalculatorPage() {
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
          Salary Hike & Increments Calculator
        </h1>
        <p className="text-sm text-[#717171] mt-1.5 font-medium">
          Compare proposed base salary increases, variables, and ESOP allocations against your current packages.
        </p>
      </div>

      <HikeCalculator />
    </div>
  );
}
