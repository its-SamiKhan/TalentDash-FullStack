import React from 'react';
import type { Metadata } from 'next';
import { OfferComparison } from './OfferComparison';
import { getAllCompanies } from '@/services/company.service';
import Link from 'next/link';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Side-by-Side Offer Comparison Tool | TalentDash',
  description:
    'Compare two tech job offers side-by-side. Input base, bonus, and stock options in different currencies and compare in a normalized target currency.',
};

export default async function OfferComparisonPage() {
  const companiesList = await getAllCompanies();

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
          Offer Comparison Tool
        </h1>
        <p className="text-sm text-[#717171] mt-1.5 font-medium">
          Compare two different job offers side-by-side. Convert different currencies automatically and see a clear category breakdown.
        </p>
      </div>

      <OfferComparison companiesList={companiesList} />
    </div>
  );
}
