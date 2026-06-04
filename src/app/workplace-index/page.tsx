import React from 'react';
import Link from 'next/link';
import {
  getWorkplaceRankings,
  getWorkplaceStats,
  getIndustriesWithScores,
} from '@/services/workplace.service';
import { WorkplaceScoreBadge, CompanyLogo } from '@/components/ui';
import { generateWorkplaceHubMetadata } from '@/lib/seo';

export const revalidate = 3600; // Cache for 1 hour

export async function generateMetadata() {
  return generateWorkplaceHubMetadata();
}

export default async function WorkplaceIndexHubPage() {
  const stats = await getWorkplaceStats();
  const industries = await getIndustriesWithScores();
  const topRanked = (await getWorkplaceRankings()).slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-10">
      {/* Hero Section */}
      <div className="text-center flex flex-col items-center gap-3">
        <span className="text-[10px] uppercase font-black tracking-widest bg-rose-100 text-[#FF5A5F] px-3 py-1 rounded-full border border-rose-200 shadow-sm">
          🏆 Michelin-Style Employer Ratings
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#222222] tracking-tight mt-1">
          The Workplace Index
        </h1>
        <p className="max-w-2xl text-sm sm:text-base text-[#484848] leading-relaxed">
          Discover the top-ranked tech employers. We rank companies based on crowdsourced and normalized scores covering culture, compensation fairness, growth, diversity, and WFH policy.
        </p>
      </div>

      {/* Leaders Grid */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-black text-[#222222] border-b border-[#EBEBEB] pb-2">
          Category Leaders
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Leader 1: Overall */}
          <div className="bg-white border border-[#EBEBEB] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#717171]">
                Overall Ranked Leader
              </span>
              <span className="text-xs bg-rose-50 text-rose-700 font-extrabold px-2 py-0.5 rounded border border-rose-150">
                ★ {stats.overallLeader?.overallScore?.toFixed(1) || '0.0'}
              </span>
            </div>
            {stats.overallLeader && (
              <div className="flex items-center gap-3 mt-1">
                <CompanyLogo
                  name={stats.overallLeader.companyName}
                  logoUrl={stats.overallLeader.companyLogoUrl}
                  size={40}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#222222]">
                    {stats.overallLeader.companyName}
                  </span>
                  <span className="text-xs text-[#717171]">
                    {stats.overallLeader.companyIndustry}
                  </span>
                </div>
              </div>
            )}
            <Link
              href={`/companies/${stats.overallLeader?.companySlug}`}
              className="text-xs font-semibold text-[#FF5A5F] hover:underline mt-auto pt-2"
            >
              View Profile →
            </Link>
          </div>

          {/* Leader 2: Culture */}
          <div className="bg-white border border-[#EBEBEB] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#717171]">
                Best Workplace Culture
              </span>
              <span className="text-xs bg-blue-50 text-blue-700 font-extrabold px-2 py-0.5 rounded border border-blue-150">
                ★ {stats.cultureLeader?.cultureScore?.toFixed(1) || '0.0'}
              </span>
            </div>
            {stats.cultureLeader && (
              <div className="flex items-center gap-3 mt-1">
                <CompanyLogo
                  name={stats.cultureLeader.companyName}
                  logoUrl={stats.cultureLeader.companyLogoUrl}
                  size={40}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#222222]">
                    {stats.cultureLeader.companyName}
                  </span>
                  <span className="text-xs text-[#717171]">
                    {stats.cultureLeader.companyIndustry}
                  </span>
                </div>
              </div>
            )}
            <Link
              href={`/companies/${stats.cultureLeader?.companySlug}`}
              className="text-xs font-semibold text-[#FF5A5F] hover:underline mt-auto pt-2"
            >
              View Profile →
            </Link>
          </div>

          {/* Leader 3: Comp Fairness */}
          <div className="bg-white border border-[#EBEBEB] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#717171]">
                Compensation Fairness
              </span>
              <span className="text-xs bg-emerald-50 text-emerald-700 font-extrabold px-2 py-0.5 rounded border border-emerald-150">
                ★ {stats.compLeader?.compensationFairness?.toFixed(1) || '0.0'}
              </span>
            </div>
            {stats.compLeader && (
              <div className="flex items-center gap-3 mt-1">
                <CompanyLogo
                  name={stats.compLeader.companyName}
                  logoUrl={stats.compLeader.companyLogoUrl}
                  size={40}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#222222]">
                    {stats.compLeader.companyName}
                  </span>
                  <span className="text-xs text-[#717171]">
                    {stats.compLeader.companyIndustry}
                  </span>
                </div>
              </div>
            )}
            <Link
              href={`/companies/${stats.compLeader?.companySlug}`}
              className="text-xs font-semibold text-[#FF5A5F] hover:underline mt-auto pt-2"
            >
              View Profile →
            </Link>
          </div>

          {/* Leader 4: WFH Policy */}
          <div className="bg-white border border-[#EBEBEB] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#717171]">
                Top Hybrid / WFH Policy
              </span>
              <span className="text-xs bg-amber-50 text-amber-700 font-extrabold px-2 py-0.5 rounded border border-amber-150">
                ★ {stats.wfhLeader?.wfhScore?.toFixed(1) || '0.0'}
              </span>
            </div>
            {stats.wfhLeader && (
              <div className="flex items-center gap-3 mt-1">
                <CompanyLogo
                  name={stats.wfhLeader.companyName}
                  logoUrl={stats.wfhLeader.companyLogoUrl}
                  size={40}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#222222]">
                    {stats.wfhLeader.companyName}
                  </span>
                  <span className="text-xs text-[#717171]">
                    {stats.wfhLeader.companyIndustry}
                  </span>
                </div>
              </div>
            )}
            <Link
              href={`/companies/${stats.wfhLeader?.companySlug}`}
              className="text-xs font-semibold text-[#FF5A5F] hover:underline mt-auto pt-2"
            >
              View Profile →
            </Link>
          </div>
        </div>
      </div>

      {/* Ratings Explanation & Top Podium */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Rating Guide */}
        <div className="bg-white border border-[#EBEBEB] rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <h3 className="text-base font-black text-[#222222]">
            Workplace Index Classification Guide
          </h3>
          <div className="flex flex-col gap-4 text-sm mt-1">
            <div className="flex gap-3">
              <span className="text-rose-600 font-black shrink-0">⭐️⭐️⭐️</span>
              <div className="flex flex-col">
                <span className="font-bold text-[#222222]">3-Star Index (4.5+)</span>
                <span className="text-[#484848] text-xs">
                  Exceptional workplace. Enforces top-tier compensation, healthy boundaries, solid WFH support, and inclusive hiring practices.
                </span>
              </div>
            </div>
            <div className="flex gap-3 border-t border-[#EBEBEB] pt-3">
              <span className="text-amber-600 font-black shrink-0">⭐️⭐️</span>
              <div className="flex flex-col">
                <span className="font-bold text-[#222222]">2-Star Index (4.0 - 4.49)</span>
                <span className="text-[#484848] text-xs">
                  Highly recommended. Solid career growth, reasonable management patterns, and fair compensation ratios.
                </span>
              </div>
            </div>
            <div className="flex gap-3 border-t border-[#EBEBEB] pt-3">
              <span className="text-blue-600 font-black shrink-0">⭐️</span>
              <div className="flex flex-col">
                <span className="font-bold text-[#222222]">1-Star Index (3.5 - 3.99)</span>
                <span className="text-[#484848] text-xs">
                  Recommended. Good local workplace conditions with standard tech benefits and progression models.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Top 3 List */}
        <div className="bg-white border border-[#EBEBEB] rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <h3 className="text-base font-black text-[#222222]">
            Top Rated Workplaces
          </h3>
          <div className="flex flex-col gap-3 mt-1">
            {topRanked.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b border-[#EBEBEB] pb-3 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-[#717171] w-4">
                    #{index + 1}
                  </span>
                  <CompanyLogo
                    name={item.companyName}
                    logoUrl={item.companyLogoUrl}
                    size={32}
                  />
                  <span className="text-sm font-bold text-[#222222]">
                    {item.companyName}
                  </span>
                </div>
                <WorkplaceScoreBadge score={item.overallScore || 0} showScore={false} />
              </div>
            ))}
          </div>
          <Link
            href="/workplace-index/rankings"
            className="text-xs text-center font-extrabold text-white bg-[#FF5A5F] hover:bg-[#ff4449] py-2.5 rounded-lg transition-colors mt-auto text-shadow-none"
          >
            Explore Complete Rankings Table
          </Link>
        </div>
      </div>

      {/* Industries Directory */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-black text-[#222222] border-b border-[#EBEBEB] pb-2">
          Rankings by Industry
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {industries.map((ind) => (
            <Link
              key={ind.slug}
              href={`/workplace-index/${ind.slug}`}
              className="bg-white border border-[#EBEBEB] hover:border-[#FF5A5F] rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col gap-2 group"
            >
              <span className="text-sm font-black text-[#222222] group-hover:text-[#FF5A5F] transition-colors leading-tight">
                {ind.name}
              </span>
              <span className="text-xs text-[#717171] font-semibold">
                {ind.count} {ind.count === 1 ? 'employer' : 'employers'} ranked
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
