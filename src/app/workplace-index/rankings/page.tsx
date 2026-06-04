import React from 'react';
import Link from 'next/link';
import { getWorkplaceRankings, getIndustriesWithScores } from '@/services/workplace.service';
import { RankingsClient } from './RankingsClient';
import { generateWorkplaceRankingsMetadata } from '@/lib/seo';

export const revalidate = 3600; // Cache for 1 hour

export async function generateMetadata() {
  return generateWorkplaceRankingsMetadata();
}

export default async function WorkplaceRankingsPage() {
  const rankings = await getWorkplaceRankings();
  const industries = await getIndustriesWithScores();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-6">
      {/* Navigation breadcrumb */}
      <div>
        <Link
          href="/workplace-index"
          className="text-xs font-semibold text-[#717171] hover:text-[#222222] transition-colors"
        >
          ← Back to Workplace Index
        </Link>
      </div>

      {/* Heading */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-black text-[#222222] tracking-tight">
          Employer Rankings Table
        </h1>
        <p className="text-sm text-[#484848] leading-relaxed">
          Sort by specific categories (Culture, Comp Fairness, WFH Policy) by clicking the column headers.
        </p>
      </div>

      {/* Main rankings grid */}
      <RankingsClient
        initialRankings={rankings}
        industries={industries}
        selectedIndustrySlug="all"
      />
    </div>
  );
}
