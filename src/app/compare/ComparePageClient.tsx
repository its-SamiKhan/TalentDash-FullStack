'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Select,
  WinnerBadge,
  Skeleton,
  CompanyLogo,
  LevelBadge,
} from '@/components/ui';
import { formatCurrency, formatExperience } from '@/lib/formatters';
import type { ComparisonResult } from '@/types';

interface ComparePageClientProps {
  salariesList: Array<{
    id: string;
    companyName: string;
    role: string;
    level: string;
    totalCompensation: number;
    currency: string;
    location: string;
  }>;
}

export function ComparePageClient({ salariesList }: ComparePageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialS1 = searchParams.get('s1') || '';
  const initialS2 = searchParams.get('s2') || '';

  const [s1, setS1] = useState(initialS1);
  const [s2, setS2] = useState(initialS2);

  const [prevInitialS1, setPrevInitialS1] = useState(initialS1);
  const [prevInitialS2, setPrevInitialS2] = useState(initialS2);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ComparisonResult | null>(null);

  // Sync state with URL params during render
  if (initialS1 !== prevInitialS1 || initialS2 !== prevInitialS2) {
    setPrevInitialS1(initialS1);
    setPrevInitialS2(initialS2);
    setS1(initialS1);
    setS2(initialS2);
  }

  // Reset comparison result and errors during render if either baseline or comparison is empty
  if ((!s1 || !s2) && (result !== null || error !== null)) {
    setResult(null);
    setError(null);
  }

  // Set error during render if baseline and comparison are equal
  if (s1 && s2 && s1 === s2 && (error !== 'Cannot compare a record with itself. Please select two different records.' || result !== null)) {
    setError('Cannot compare a record with itself. Please select two different records.');
    setResult(null);
  }

  // Fetch comparison whenever s1 or s2 changes
  useEffect(() => {
    if (!s1 || !s2 || s1 === s2) return;

    const fetchComparison = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/compare?s1=${s1}&s2=${s2}`);
        const data = await res.json();
        
        if (!res.ok) {
          setError(data.error || 'Failed to compare records');
          setResult(null);
        } else {
          setResult(data);
        }
      } catch (err) {
        console.error(err);
        setError('Network error. Failed to load comparison.');
        setResult(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComparison();
  }, [s1, s2]);

  const updateURL = (newS1: string, newS2: string) => {
    const params = new URLSearchParams();
    if (newS1) params.set('s1', newS1);
    if (newS2) params.set('s2', newS2);
    router.push(`/compare?${params.toString()}`);
  };

  const handleS1Change = (val: string) => {
    setS1(val);
    updateURL(val, s2);
  };

  const handleS2Change = (val: string) => {
    setS2(val);
    updateURL(s1, val);
  };

  const handleSwap = () => {
    setS1(s2);
    setS2(s1);
    updateURL(s2, s1);
  };

  const handleClear = () => {
    setS1('');
    setS2('');
    setResult(null);
    setError(null);
    router.push('/compare');
  };

  // Map salaries list to select options format
  const selectOptions = [
    { value: '', label: 'Select a record...' },
    ...salariesList.map((s) => ({
      value: s.id,
      label: `${s.companyName} • ${s.role} (${s.level}) • ${formatCurrency(s.totalCompensation, s.currency)} [${s.location}]`,
    })),
  ];

  // Helper to format deltas nicely (in currency 1)
  const formatDeltaValue = (delta: number, currency: string) => {
    const prefix = delta >= 0 ? '+' : '';
    return `${prefix}${formatCurrency(delta, currency)}`;
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6 bg-white border border-[#EBEBEB] rounded-2xl p-6 shadow-sm">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#222222] tracking-tight">Compare Salaries</h1>
          <p className="text-sm text-[#717171] mt-1">Side-by-side comparison of specific tech compensation records.</p>
        </div>
        <div>
          <Link
            href="/salaries"
            className="inline-flex h-10 items-center justify-center rounded-md bg-[#FF5A5F] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#ff4449] focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]/50 cursor-pointer select-none"
          >
            Browse Salaries
          </Link>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="bg-white border border-[#EBEBEB] rounded-lg p-5 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <Select
            label="Record 1 (Baseline)"
            options={selectOptions}
            value={s1}
            onChange={(e) => handleS1Change(e.target.value)}
          />
        </div>

        <button
          type="button"
          onClick={handleSwap}
          disabled={!s1 && !s2}
          className="text-xs font-bold uppercase tracking-wider text-[#FF5A5F] hover:text-[#ff4449] disabled:text-[#717171] mt-5 px-3 py-2 border border-[#EBEBEB] rounded bg-slate-50 transition-colors cursor-pointer select-none"
          title="Swap baseline and comparison"
        >
          ⇄ Swap
        </button>

        <div className="flex-1 w-full">
          <Select
            label="Record 2 (Comparison)"
            options={selectOptions}
            value={s2}
            onChange={(e) => handleS2Change(e.target.value)}
          />
        </div>

        {(s1 || s2) && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-[#717171] hover:text-[#222222] font-semibold underline mt-5 cursor-pointer"
          >
            Clear Both
          </button>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-[#D93025]/10 border border-[#D93025]/20 rounded-md p-4 text-sm text-[#D93025] font-semibold">
          {error}
        </div>
      )}

      {/* Loading state skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      )}

      {/* Empty / Instruction State */}
      {!isLoading && !error && !result && (
        <div className="text-center py-16 bg-white border border-[#EBEBEB] rounded-lg flex flex-col items-center gap-3">
          <div className="h-12 w-12 text-[#717171] flex items-center justify-center bg-slate-50 border border-[#EBEBEB] rounded-full">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <h2 className="text-base font-bold text-[#222222]">Select Two Records</h2>
          <p className="text-sm text-[#717171] max-w-sm mb-2">
            Choose two salary records from the dropdowns above to perform a detailed side-by-side delta analysis.
          </p>
          <Link
            href="/salaries"
            className="inline-flex h-9 items-center justify-center rounded-md border border-[#EBEBEB] bg-white px-4 text-xs font-semibold text-[#484848] transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 cursor-pointer select-none"
          >
            Or browse all salaries
          </Link>
          <div className="w-full max-w-xs border-t border-[#EBEBEB] mt-2" />
          <p className="text-xs text-[#717171] max-w-sm px-4 leading-relaxed mt-1">
            💡 <strong>Tip:</strong> You can also open any company page and select the comparison checkbox next to salary records to compare them immediately.
          </p>
        </div>
      )}

      {/* Comparison Results Card */}
      {!isLoading && !error && result && (
        <div className="flex flex-col gap-6 mt-4">
          {/* Summary Winner Panel */}
          <div className="bg-white border border-[#EBEBEB] rounded-lg p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Record 1 Header */}
              <div className="flex items-center gap-3">
                <CompanyLogo name={result.record1.companyName} logoUrl={result.record1.companyLogoUrl} size={40} />
                <div>
                  <p className="text-xs text-[#717171]">Baseline</p>
                  <p className="text-sm font-bold text-[#222222]">{result.record1.companyName}</p>
                  <p className="text-[11px] text-[#717171]">{result.record1.role} • {result.record1.level}</p>
                </div>
              </div>

              <div className="text-xl text-[#717171] font-light hidden sm:block">vs</div>

              {/* Record 2 Header */}
              <div className="flex items-center gap-3">
                <CompanyLogo name={result.record2.companyName} logoUrl={result.record2.companyLogoUrl} size={40} />
                <div>
                  <p className="text-xs text-[#717171]">Comparison</p>
                  <p className="text-sm font-bold text-[#222222]">{result.record2.companyName}</p>
                  <p className="text-[11px] text-[#717171]">{result.record2.role} • {result.record2.level}</p>
                </div>
              </div>
            </div>

            {/* Winner Announcement Box */}
            <div className="bg-[#008A05]/5 border border-[#008A05]/20 rounded-md p-4 flex flex-col gap-1 items-end text-right">
              <span className="text-xs uppercase font-bold text-[#717171]">Compensation Winner</span>
              {result.winner.overall === 'tie' ? (
                <span className="text-lg font-extrabold text-[#222222]">It&apos;s a Tie!</span>
              ) : (
                <div className="flex flex-col items-end">
                  <span className="text-lg font-extrabold text-[#008A05]">
                    {result.winner.overall === 'record1' ? result.record1.companyName : result.record2.companyName} wins!
                  </span>
                  <span className="text-xs text-[#717171] mt-0.5">
                    By {formatCurrency(Math.abs(result.delta.tc_delta), result.record1.currency)} in TC
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Breakdown Grid Table */}
          <div className="bg-white border border-[#EBEBEB] rounded-lg overflow-hidden shadow-sm">
            {/* Desktop Side-by-Side Table */}
            <div className="hidden md:block">
              <table className="w-full text-left text-sm text-[#484848] border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-[#EBEBEB] text-xs font-bold uppercase tracking-wider text-[#717171]">
                    <th className="px-6 py-4">Metric</th>
                    <th className="px-6 py-4 text-right">{result.record1.companyName} (Baseline)</th>
                    <th className="px-6 py-4 text-right">{result.record2.companyName} (Comparison)</th>
                    <th className="px-6 py-4 text-right">Delta (in {result.record1.currency})</th>
                    <th className="px-6 py-4 text-center">Winner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBEBEB]">
                  {/* Location */}
                  <tr>
                    <td className="px-6 py-4 font-semibold text-[#222222]">Location</td>
                    <td className="px-6 py-4 text-right">{result.record1.location}</td>
                    <td className="px-6 py-4 text-right">{result.record2.location}</td>
                    <td className="px-6 py-4 text-right text-xs text-[#717171]">N/A</td>
                    <td className="px-6 py-4 text-center text-xs text-[#717171]">—</td>
                  </tr>

                  {/* Level */}
                  <tr>
                    <td className="px-6 py-4 font-semibold text-[#222222]">Level</td>
                    <td className="px-6 py-4 text-right"><LevelBadge level={result.record1.level} /></td>
                    <td className="px-6 py-4 text-right"><LevelBadge level={result.record2.level} /></td>
                    <td className="px-6 py-4 text-right text-xs text-[#717171]">N/A</td>
                    <td className="px-6 py-4 text-center text-xs text-[#717171]">—</td>
                  </tr>

                  {/* Experience */}
                  <tr>
                    <td className="px-6 py-4 font-semibold text-[#222222]">Experience</td>
                    <td className="px-6 py-4 text-right">{formatExperience(result.record1.experienceYears)}</td>
                    <td className="px-6 py-4 text-right">{formatExperience(result.record2.experienceYears)}</td>
                    <td className="px-6 py-4 text-right font-medium">
                      {result.delta.experience_delta >= 0
                        ? `+${result.delta.experience_delta} yrs`
                        : `${result.delta.experience_delta} yrs`}
                    </td>
                    <td className="px-6 py-4 text-center text-xs text-[#717171]">—</td>
                  </tr>

                  {/* Base Salary */}
                  <tr>
                    <td className="px-6 py-4 font-semibold text-[#222222]">Base Salary</td>
                    <td className="px-6 py-4 text-right font-medium">
                      {formatCurrency(result.record1.baseSalary, result.record1.currency)}
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      {formatCurrency(result.record2.baseSalary, result.record2.currency)}
                    </td>
                    <td className={`px-6 py-4 text-right font-bold ${
                      result.delta.base_delta >= 0 ? 'text-[#008A05]' : 'text-[#D93025]'
                    }`}>
                      {formatDeltaValue(result.delta.base_delta, result.record1.currency)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <WinnerBadge winner={result.winner.base} recordName={result.winner.base === 'record1' ? result.record1.companyName : result.record2.companyName} />
                    </td>
                  </tr>

                  {/* Stock / Equity */}
                  <tr>
                    <td className="px-6 py-4 font-semibold text-[#222222]">Stock / Equity</td>
                    <td className="px-6 py-4 text-right font-medium">
                      {formatCurrency(result.record1.stock, result.record1.currency)}
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      {formatCurrency(result.record2.stock, result.record2.currency)}
                    </td>
                    <td className={`px-6 py-4 text-right font-bold ${
                      result.delta.stock_delta >= 0 ? 'text-[#008A05]' : 'text-[#D93025]'
                    }`}>
                      {formatDeltaValue(result.delta.stock_delta, result.record1.currency)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <WinnerBadge winner={result.winner.stock} recordName={result.winner.stock === 'record1' ? result.record1.companyName : result.record2.companyName} />
                    </td>
                  </tr>

                  {/* Bonus */}
                  <tr>
                    <td className="px-6 py-4 font-semibold text-[#222222]">Annual Bonus</td>
                    <td className="px-6 py-4 text-right font-medium">
                      {formatCurrency(result.record1.bonus, result.record1.currency)}
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      {formatCurrency(result.record2.bonus, result.record2.currency)}
                    </td>
                    <td className={`px-6 py-4 text-right font-bold ${
                      result.delta.bonus_delta >= 0 ? 'text-[#008A05]' : 'text-[#D93025]'
                    }`}>
                      {formatDeltaValue(result.delta.bonus_delta, result.record1.currency)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <WinnerBadge winner={result.winner.bonus} recordName={result.winner.bonus === 'record1' ? result.record1.companyName : result.record2.companyName} />
                    </td>
                  </tr>

                  {/* Total Compensation */}
                  <tr className="bg-slate-50 font-bold border-t-2 border-[#EBEBEB]">
                    <td className="px-6 py-5 text-base text-[#222222]">Total Compensation</td>
                    <td className="px-6 py-5 text-right text-base text-[#222222]">
                      {formatCurrency(result.record1.totalCompensation, result.record1.currency)}
                    </td>
                    <td className="px-6 py-5 text-right text-base text-[#222222]">
                      {formatCurrency(result.record2.totalCompensation, result.record2.currency)}
                    </td>
                    <td className={`px-6 py-5 text-right text-base ${
                      result.delta.tc_delta >= 0 ? 'text-[#008A05]' : 'text-[#D93025]'
                    }`}>
                      {formatDeltaValue(result.delta.tc_delta, result.record1.currency)}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <WinnerBadge winner={result.winner.total_compensation} recordName={result.winner.total_compensation === 'record1' ? result.record1.companyName : result.record2.companyName} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked View */}
            <div className="block md:hidden divide-y divide-[#EBEBEB] p-4 bg-white flex flex-col gap-5">
              {/* Experience mobile segment */}
              <div>
                <span className="text-xs uppercase font-bold text-[#717171] tracking-wider block mb-2">Experience</span>
                <div className="flex justify-between text-sm">
                  <span>{result.record1.companyName}: {formatExperience(result.record1.experienceYears)}</span>
                  <span>{result.record2.companyName}: {formatExperience(result.record2.experienceYears)}</span>
                </div>
                <div className="mt-1 text-xs font-semibold text-[#222222] bg-slate-50 p-1.5 rounded text-center">
                  Delta: {result.delta.experience_delta >= 0 ? `+${result.delta.experience_delta}` : result.delta.experience_delta} yrs
                </div>
              </div>

              {/* Base Salary mobile segment */}
              <div className="pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs uppercase font-bold text-[#717171] tracking-wider">Base Salary</span>
                  <WinnerBadge winner={result.winner.base} recordName={result.winner.base === 'record1' ? result.record1.companyName : result.record2.companyName} />
                </div>
                <div className="flex justify-between text-sm">
                  <span>{result.record1.companyName}: {formatCurrency(result.record1.baseSalary, result.record1.currency)}</span>
                  <span>{result.record2.companyName}: {formatCurrency(result.record2.baseSalary, result.record2.currency)}</span>
                </div>
                <div className={`mt-1.5 text-xs font-bold p-1.5 rounded text-center bg-slate-50 ${
                  result.delta.base_delta >= 0 ? 'text-[#008A05]' : 'text-[#D93025]'
                }`}>
                  Delta: {formatDeltaValue(result.delta.base_delta, result.record1.currency)}
                </div>
              </div>

              {/* Stock mobile segment */}
              <div className="pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs uppercase font-bold text-[#717171] tracking-wider">Stock / Equity</span>
                  <WinnerBadge winner={result.winner.stock} recordName={result.winner.stock === 'record1' ? result.record1.companyName : result.record2.companyName} />
                </div>
                <div className="flex justify-between text-sm">
                  <span>{result.record1.companyName}: {formatCurrency(result.record1.stock, result.record1.currency)}</span>
                  <span>{result.record2.companyName}: {formatCurrency(result.record2.stock, result.record2.currency)}</span>
                </div>
                <div className={`mt-1.5 text-xs font-bold p-1.5 rounded text-center bg-slate-50 ${
                  result.delta.stock_delta >= 0 ? 'text-[#008A05]' : 'text-[#D93025]'
                }`}>
                  Delta: {formatDeltaValue(result.delta.stock_delta, result.record1.currency)}
                </div>
              </div>

              {/* Bonus mobile segment */}
              <div className="pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs uppercase font-bold text-[#717171] tracking-wider">Annual Bonus</span>
                  <WinnerBadge winner={result.winner.bonus} recordName={result.winner.bonus === 'record1' ? result.record1.companyName : result.record2.companyName} />
                </div>
                <div className="flex justify-between text-sm">
                  <span>{result.record1.companyName}: {formatCurrency(result.record1.bonus, result.record1.currency)}</span>
                  <span>{result.record2.companyName}: {formatCurrency(result.record2.bonus, result.record2.currency)}</span>
                </div>
                <div className={`mt-1.5 text-xs font-bold p-1.5 rounded text-center bg-slate-50 ${
                  result.delta.bonus_delta >= 0 ? 'text-[#008A05]' : 'text-[#D93025]'
                }`}>
                  Delta: {formatDeltaValue(result.delta.bonus_delta, result.record1.currency)}
                </div>
              </div>

              {/* Total Compensation mobile segment */}
              <div className="pt-4 pb-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs uppercase font-extrabold text-[#717171] tracking-wider">Total Comp</span>
                  <WinnerBadge winner={result.winner.total_compensation} recordName={result.winner.total_compensation === 'record1' ? result.record1.companyName : result.record2.companyName} />
                </div>
                <div className="flex justify-between text-sm font-bold text-[#222222]">
                  <span>{result.record1.companyName}: {formatCurrency(result.record1.totalCompensation, result.record1.currency)}</span>
                  <span>{result.record2.companyName}: {formatCurrency(result.record2.totalCompensation, result.record2.currency)}</span>
                </div>
                <div className={`mt-2 text-sm font-extrabold p-2 rounded text-center ${
                  result.delta.tc_delta >= 0 ? 'bg-[#008A05]/10 text-[#008A05]' : 'bg-[#D93025]/10 text-[#D93025]'
                }`}>
                  Delta: {formatDeltaValue(result.delta.tc_delta, result.record1.currency)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
