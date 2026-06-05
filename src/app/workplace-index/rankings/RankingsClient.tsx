'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import type { WorkplaceScoreForDisplay } from '@/types';
import { WorkplaceScoreBadge, CompanyLogo, Select, Input } from '@/components/ui';

interface RankingsClientProps {
  initialRankings: WorkplaceScoreForDisplay[];
  industries: { name: string; slug: string; count: number }[];
  selectedIndustrySlug?: string;
}

type SortField =
  | 'overallScore'
  | 'cultureScore'
  | 'compensationFairness'
  | 'careerGrowth'
  | 'workLifeBalance'
  | 'diversityInclusion'
  | 'wfhScore';

function getScoreColorClass(score: number | null | undefined): string {
  if (!score) return 'text-[#717171]';
  if (score >= 4.5) return 'text-emerald-600 font-extrabold';
  if (score >= 4.0) return 'text-emerald-500 font-bold';
  if (score >= 3.5) return 'text-blue-600 font-bold';
  if (score >= 3.0) return 'text-amber-500 font-bold';
  return 'text-rose-500 font-bold';
}

export function RankingsClient({
  initialRankings,
  industries,
  selectedIndustrySlug = 'all',
}: RankingsClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState(selectedIndustrySlug);
  const [sortField, setSortField] = useState<SortField>('overallScore');
  const [sortAsc, setSortAsc] = useState(false);

  // Industry options for dropdown
  const industryOptions = useMemo(() => {
    return [
      { label: 'All Industries', value: 'all' },
      ...industries.map((ind) => ({
        label: `${ind.name} (${ind.count})`,
        value: ind.slug,
      })),
    ];
  }, [industries]);

  // Handle header sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc((prev) => !prev);
    } else {
      setSortField(field);
      setSortAsc(false); // Default to descending
    }
  };

  // Filter and sort scores
  const filteredAndSortedRankings = useMemo(() => {
    let result = [...initialRankings];

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((item) =>
        item.companyName.toLowerCase().includes(q)
      );
    }

    // Filter by Industry
    if (industryFilter !== 'all') {
      result = result.filter(
        (item) =>
          item.companyIndustry &&
          item.companyIndustry.toLowerCase().replace(/[^a-z0-9]+/g, '-') ===
            industryFilter
      );
    }

    // Sort
    result.sort((a, b) => {
      const aVal = a[sortField] ?? 0;
      const bVal = b[sortField] ?? 0;
      return sortAsc ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [initialRankings, searchQuery, industryFilter, sortField, sortAsc]);

  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) return <span className="text-gray-300 ml-1">⇅</span>;
    return sortAsc ? <span className="text-[#FF5A5F] ml-1">▲</span> : <span className="text-[#FF5A5F] ml-1">▼</span>;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border border-[#EBEBEB] rounded-xl p-5 shadow-sm">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="company-search" className="text-xs font-bold text-[#222222]">
            Search by Company
          </label>
          <Input
            id="company-search"
            placeholder="Type company name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="industry-filter" className="text-xs font-bold text-[#222222]">
            Filter by Industry
          </label>
          <Select
            id="industry-filter"
            options={industryOptions}
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Table grid */}
      <div className="bg-white border border-[#EBEBEB] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F7F7] border-b border-[#EBEBEB] text-xs font-black text-[#717171] uppercase tracking-wider">
                <th className="py-4 px-4 font-black">Rank</th>
                <th className="py-4 px-4 font-black">Company</th>
                <th
                  onClick={() => handleSort('overallScore')}
                  className="py-4 px-4 font-black cursor-pointer hover:bg-gray-150 transition-colors select-none text-center"
                >
                  Overall Index {renderSortIndicator('overallScore')}
                </th>
                <th
                  onClick={() => handleSort('cultureScore')}
                  className="py-4 px-4 font-black cursor-pointer hover:bg-gray-150 transition-colors select-none text-center"
                >
                  Culture {renderSortIndicator('cultureScore')}
                </th>
                <th
                  onClick={() => handleSort('compensationFairness')}
                  className="py-4 px-4 font-black cursor-pointer hover:bg-gray-150 transition-colors select-none text-center"
                >
                  Comp Fairness {renderSortIndicator('compensationFairness')}
                </th>
                <th
                  onClick={() => handleSort('careerGrowth')}
                  className="py-4 px-4 font-black cursor-pointer hover:bg-gray-150 transition-colors select-none text-center"
                >
                  Growth {renderSortIndicator('careerGrowth')}
                </th>
                <th
                  onClick={() => handleSort('workLifeBalance')}
                  className="py-4 px-4 font-black cursor-pointer hover:bg-gray-150 transition-colors select-none text-center"
                >
                  WLB {renderSortIndicator('workLifeBalance')}
                </th>
                <th
                  onClick={() => handleSort('diversityInclusion')}
                  className="py-4 px-4 font-black cursor-pointer hover:bg-gray-150 transition-colors select-none text-center"
                >
                  D&I {renderSortIndicator('diversityInclusion')}
                </th>
                <th
                  onClick={() => handleSort('wfhScore')}
                  className="py-4 px-4 font-black cursor-pointer hover:bg-gray-150 transition-colors select-none text-center"
                >
                  WFH Policy {renderSortIndicator('wfhScore')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBEBEB] text-sm">
              {filteredAndSortedRankings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-sm font-semibold text-[#717171]">
                    No companies match your filters. Try search adjustments.
                  </td>
                </tr>
              ) : (
                filteredAndSortedRankings.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#F2F2F2]/50 transition-colors"
                  >
                    {/* Rank */}
                    <td className="py-4 px-4 font-black text-[#717171] w-12 text-center">
                      #{index + 1}
                    </td>

                    {/* Company */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <CompanyLogo
                          name={item.companyName}
                          logoUrl={item.companyLogoUrl}
                          size={32}
                        />
                        <div className="flex flex-col">
                          <Link
                            href={`/companies/${item.companySlug}`}
                            className="font-black text-[#222222] hover:text-[#FF5A5F] hover:underline"
                          >
                            {item.companyName}
                          </Link>
                          <span className="text-[10px] text-[#717171] font-bold">
                            {item.companyIndustry}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Overall Score Badge */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center">
                        <WorkplaceScoreBadge score={item.overallScore || 0} />
                      </div>
                    </td>

                    {/* Culture Score */}
                    <td className={`py-4 px-4 text-center font-bold ${getScoreColorClass(item.cultureScore)}`}>
                      {item.cultureScore?.toFixed(1) || '-'}
                    </td>

                    {/* Comp Fairness */}
                    <td className={`py-4 px-4 text-center font-bold ${getScoreColorClass(item.compensationFairness)}`}>
                      {item.compensationFairness?.toFixed(1) || '-'}
                    </td>

                    {/* Growth */}
                    <td className={`py-4 px-4 text-center font-bold ${getScoreColorClass(item.careerGrowth)}`}>
                      {item.careerGrowth?.toFixed(1) || '-'}
                    </td>

                    {/* WLB */}
                    <td className={`py-4 px-4 text-center font-bold ${getScoreColorClass(item.workLifeBalance)}`}>
                      {item.workLifeBalance?.toFixed(1) || '-'}
                    </td>

                    {/* D&I */}
                    <td className={`py-4 px-4 text-center font-bold ${getScoreColorClass(item.diversityInclusion)}`}>
                      {item.diversityInclusion?.toFixed(1) || '-'}
                    </td>

                    {/* WFH Policy */}
                    <td className={`py-4 px-4 text-center font-bold ${getScoreColorClass(item.wfhScore)}`}>
                      {item.wfhScore?.toFixed(1) || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
