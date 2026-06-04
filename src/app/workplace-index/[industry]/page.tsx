import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getWorkplaceRankings,
  getIndustriesWithScores,
} from '@/services/workplace.service';
import { RankingsClient } from '../rankings/RankingsClient';
import { generateWorkplaceIndustryMetadata } from '@/lib/seo';

export const revalidate = 3600; // Cache for 1 hour

interface PageProps {
  params: Promise<{
    industry: string;
  }>;
}

export async function generateStaticParams() {
  const industries = await getIndustriesWithScores();
  return industries.map((ind) => ({
    industry: ind.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const awaitedParams = await params;
  const industries = await getIndustriesWithScores();
  const currentIndustry = industries.find(
    (ind) => ind.slug === awaitedParams.industry.toLowerCase()
  );

  if (!currentIndustry) {
    return {};
  }

  return generateWorkplaceIndustryMetadata(currentIndustry.name);
}

export default async function IndustryWorkplaceRankingsPage({ params }: PageProps) {
  const awaitedParams = await params;
  const industries = await getIndustriesWithScores();
  const currentIndustry = industries.find(
    (ind) => ind.slug === awaitedParams.industry.toLowerCase()
  );

  if (!currentIndustry) {
    notFound();
  }

  // Fetch rankings for this specific industry segment
  const rankings = await getWorkplaceRankings(awaitedParams.industry);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-6">
      {/* Navigation Breadcrumb */}
      <div>
        <Link
          href="/workplace-index"
          className="text-xs font-semibold text-[#717171] hover:text-[#222222] transition-colors"
        >
          ← Back to Workplace Index
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-black text-[#222222] tracking-tight">
          {currentIndustry.name} Workplace Rankings
        </h1>
        <p className="text-sm text-[#484848] leading-relaxed">
          Detailed employer scores within the {currentIndustry.name.toLowerCase()} sector.
        </p>
      </div>

      {/* Main rankings grid */}
      <RankingsClient
        initialRankings={rankings}
        industries={industries}
        selectedIndustrySlug={awaitedParams.industry}
      />
    </div>
  );
}
