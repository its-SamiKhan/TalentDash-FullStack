'use client';

import React, { useState, useEffect, useMemo } from 'react';
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

  // Dynamic simulation slider states
  const [simBase1, setSimBase1] = useState(0);
  const [simStock1, setSimStock1] = useState(0);
  const [simBonus1, setSimBonus1] = useState(0);

  const [simBase2, setSimBase2] = useState(0);
  const [simStock2, setSimStock2] = useState(0);
  const [simBonus2, setSimBonus2] = useState(0);

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
          // Sync simulation sliders to database baseline values
          setSimBase1(data.record1.baseSalary);
          setSimStock1(data.record1.stock);
          setSimBonus1(data.record1.bonus);

          setSimBase2(data.record2.baseSalary);
          setSimStock2(data.record2.stock);
          setSimBonus2(data.record2.bonus);
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

  // Simulated computations
  const simTotal1 = useMemo(() => simBase1 + simStock1 + simBonus1, [simBase1, simStock1, simBonus1]);
  const simTotal2 = useMemo(() => simBase2 + simStock2 + simBonus2, [simBase2, simStock2, simBonus2]);
  
  const simWinner = useMemo(() => {
    if (simTotal1 > simTotal2) return 'record1';
    if (simTotal2 > simTotal1) return 'record2';
    return 'tie';
  }, [simTotal1, simTotal2]);

  // Determine dynamic slider ranges
  const sliderRanges = useMemo(() => {
    if (!result) return { max1: 1000000, step1: 10000, max2: 1000000, step2: 10000 };
    
    const maxVal1 = Math.max(result.record1.totalCompensation * 1.5, 100000);
    const maxVal2 = Math.max(result.record2.totalCompensation * 1.5, 100000);

    const step1 = result.record1.currency === 'INR' ? 50000 : 2000;
    const step2 = result.record2.currency === 'INR' ? 50000 : 2000;

    return { max1: maxVal1, step1, max2: maxVal2, step2 };
  }, [result]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#F7F7F7] pb-6">
        <div className="text-left">
          <h1 className="text-3xl font-black text-[#222222] tracking-tight">Offer Comparisons & Simulator</h1>
          <p className="text-sm text-[#717171] mt-1 font-semibold">
            Compare compensation components side-by-side and simulate negotiation scenarios.
          </p>
        </div>
        <div>
          <Link
            href="/salaries"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#FF5A5F] px-5 text-xs font-black text-white hover:bg-[#ff4449] transition-all shadow-3xs cursor-pointer select-none"
          >
            Browse Salaries
          </Link>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="bg-white border border-[#EBEBEB] rounded-2xl p-6 shadow-3xs flex flex-col md:flex-row items-center gap-4 text-left">
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
          className="text-xs font-black uppercase tracking-wider text-[#FF5A5F] hover:text-[#ff4449] disabled:text-[#717171] mt-5 px-4 py-2.5 border border-[#EBEBEB] rounded-xl bg-slate-50 transition-all cursor-pointer select-none shrink-0"
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
            className="text-xs text-[#717171] hover:text-[#222222] font-black underline mt-5 cursor-pointer shrink-0"
          >
            Clear Both
          </button>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-[#D93025]/10 border border-[#D93025]/20 rounded-xl p-4 text-sm text-[#D93025] font-extrabold text-left">
          ⚠️ {error}
        </div>
      )}

      {/* Loading state skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <Skeleton className="h-72 rounded-2xl" />
          <Skeleton className="h-72 rounded-2xl" />
        </div>
      )}

      {/* Empty / Instruction State */}
      {!isLoading && !error && !result && (
        <div className="text-center py-20 bg-white border border-[#EBEBEB] rounded-3xl flex flex-col items-center gap-4 shadow-3xs">
          <div className="h-14 w-14 text-[#FF5A5F] flex items-center justify-center bg-[#FF5A5F]/5 border border-[#FF5A5F]/15 rounded-full shadow-3xs">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <h2 className="text-lg font-black text-[#222222]">Select Two Records to Compare</h2>
          <p className="text-xs sm:text-sm text-[#717171] max-w-sm font-semibold leading-relaxed">
            Choose two salary records from the dropdowns above to perform a detailed stacked component analysis and run negotiations.
          </p>
          <Link
            href="/salaries"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#EBEBEB] bg-white px-5 text-xs font-extrabold text-[#484848] transition-all hover:bg-slate-50 shadow-3xs cursor-pointer select-none"
          >
            Or browse all salaries
          </Link>
          <div className="w-full max-w-xs border-t border-[#F2F2F2] mt-4 pt-4 text-center mx-auto px-4">
            <p className="text-[10px] text-[#717171] leading-relaxed font-semibold text-center">
              💡 <strong>Tip:</strong> You can open any company profile page and use the comparison tools directly to analyze specific records side-by-side.
            </p>
          </div>
        </div>
      )}

      {/* Comparison Results Area */}
      {!isLoading && !error && result && (
        <div className="flex flex-col gap-6">
          
          {/* Summary Panel & Stacked bar chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left side: Quick stats comparing Baseline vs Comparison */}
            <div className="lg:col-span-2 bg-white border border-[#EBEBEB] rounded-3xl p-6 shadow-sm flex flex-col gap-6 text-left">
              <div className="flex justify-between items-center border-b border-[#F7F7F7] pb-4">
                <h3 className="text-sm font-black uppercase text-[#717171] tracking-wider">
                  📊 Stacked Pay Component Ratio
                </h3>
                <span className="text-[10px] font-black text-[#FF5A5F] bg-[#FF5A5F]/10 px-2 py-0.5 rounded-md">
                  Original Data
                </span>
              </div>

              {/* Stacked bar visualization */}
              <div className="flex flex-col gap-5">
                {[
                  { rec: result.record1, title: 'Baseline', color: 'bg-violet-500' },
                  { rec: result.record2, title: 'Comparison', color: 'bg-emerald-500' }
                ].map((item, idx) => {
                  const basePct = item.rec.totalCompensation > 0 ? (item.rec.baseSalary / item.rec.totalCompensation) * 100 : 100;
                  const stockPct = item.rec.totalCompensation > 0 ? (item.rec.stock / item.rec.totalCompensation) * 100 : 0;
                  const bonusPct = item.rec.totalCompensation > 0 ? (item.rec.bonus / item.rec.totalCompensation) * 100 : 0;

                  return (
                    <div key={idx} className="flex flex-col gap-2 w-full">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CompanyLogo name={item.rec.companyName} logoUrl={item.rec.companyLogoUrl} size={24} />
                          <span className="text-xs font-black text-[#222222]">{item.rec.companyName}</span>
                          <span className="text-[10px] text-[#717171] font-semibold">({item.title})</span>
                        </div>
                        <span className="text-xs font-black text-[#222222]">
                          {formatCurrency(item.rec.totalCompensation, item.rec.currency)}
                        </span>
                      </div>
                      
                      {/* Bar Stack */}
                      <div className="w-full h-4.5 rounded-full overflow-hidden flex bg-slate-100 border border-slate-200">
                        {basePct > 0 && (
                          <div 
                            style={{ width: `${basePct}%` }}
                            className="bg-violet-500 h-full flex items-center justify-center text-[9px] font-black text-white"
                            title={`Base: ${basePct.toFixed(0)}%`}
                          >
                            {basePct > 15 && 'Base'}
                          </div>
                        )}
                        {stockPct > 0 && (
                          <div 
                            style={{ width: `${stockPct}%` }}
                            className="bg-emerald-500 h-full flex items-center justify-center text-[9px] font-black text-white"
                            title={`Stock: ${stockPct.toFixed(0)}%`}
                          >
                            {stockPct > 15 && 'Stock'}
                          </div>
                        )}
                        {bonusPct > 0 && (
                          <div 
                            style={{ width: `${bonusPct}%` }}
                            className="bg-amber-500 h-full flex items-center justify-center text-[9px] font-black text-white"
                            title={`Bonus: ${bonusPct.toFixed(0)}%`}
                          >
                            {bonusPct > 15 && 'Bonus'}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chart Legend */}
              <div className="flex justify-center items-center gap-6 border-t border-[#F7F7F7] pt-4 mt-2">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#484848]">
                  <span className="h-2.5 w-2.5 rounded-full bg-violet-500 shrink-0" />
                  <span>Base Salary</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#484848]">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>Stock & Equity</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#484848]">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shrink-0" />
                  <span>Annual Bonus</span>
                </div>
              </div>
            </div>

            {/* Right side: Winner announce card */}
            <div className="bg-white border border-[#EBEBEB] rounded-3xl p-6 shadow-sm flex flex-col justify-between text-left h-full">
              <div className="flex flex-col gap-2">
                <span className="text-[9px] font-black uppercase tracking-wider text-[#717171] border-b border-[#F7F7F7] pb-3">
                  🏆 Overall Compensation Winner
                </span>
                
                {result.winner.overall === 'tie' ? (
                  <div className="flex flex-col gap-2 mt-4">
                    <span className="text-2xl font-black text-[#222222]">It&apos;s a Tie!</span>
                    <p className="text-xs text-[#717171] font-semibold leading-relaxed">
                      Both packages offer identical total compensation indexes.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 mt-4">
                    <div className="flex items-center gap-3">
                      <CompanyLogo 
                        name={result.winner.overall === 'record1' ? result.record1.companyName : result.record2.companyName} 
                        logoUrl={result.winner.overall === 'record1' ? result.record1.companyLogoUrl : result.record2.companyLogoUrl} 
                        size={48} 
                      />
                      <div className="flex flex-col leading-tight">
                        <span className="text-2xl font-black text-[#008A05]">
                          {result.winner.overall === 'record1' ? result.record1.companyName : result.record2.companyName}
                        </span>
                        <span className="text-[10px] text-[#717171] font-bold">
                          {result.winner.overall === 'record1' ? result.record1.role : result.record2.role}
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#008A05]/5 border border-[#008A05]/15 p-4 rounded-2xl flex flex-col mt-2">
                      <span className="text-[10px] font-black uppercase text-[#008A05] tracking-wider">
                        Baseline Delta advantage
                      </span>
                      <span className="text-xl font-black text-[#008A05] mt-1.5">
                        +{formatCurrency(Math.abs(result.delta.tc_delta), result.record1.currency)}
                      </span>
                      <span className="text-[9px] font-semibold text-[#717171] mt-0.5">
                        Higher total package value
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="text-[9px] text-[#717171] leading-relaxed font-semibold mt-4">
                * Real comparisons represent calculated totals adjusted to standard currencies. Simulate dynamic negotiations below.
              </div>
            </div>
          </div>

          {/* Interactive Counter-Offer Negotiations Simulator */}
          <div className="bg-white border border-[#EBEBEB] rounded-3xl p-6 shadow-sm text-left">
            <div className="flex justify-between items-center border-b border-[#F7F7F7] pb-4 mb-6">
              <div className="flex flex-col gap-0.5">
                <h3 className="text-base font-black text-[#222222] tracking-tight">
                  ⚖️ Interactive Offer Simulator & Slider
                </h3>
                <p className="text-[11px] text-[#717171] font-semibold">
                  Slide base salary, stock allocations, or signing bonuses to simulate ideal counter-offer negotiations.
                </p>
              </div>
              
              {/* Simulated Winner Badge */}
              <div className="flex items-center gap-2 bg-[#FF5A5F]/5 border border-[#FF5A5F]/15 px-3 py-1.5 rounded-xl shrink-0">
                <span className="text-[10px] font-black text-[#FF5A5F]">Simulated Winner:</span>
                <span className="text-xs font-black text-[#222222]">
                  {simWinner === 'tie' ? 'Tie' : simWinner === 'record1' ? result.record1.companyName : result.record2.companyName}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Simulator Card 1 */}
              <div className="bg-slate-50/50 border border-[#EBEBEB] rounded-2xl p-5 flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-[#EBEBEB] pb-3">
                  <div className="flex items-center gap-2">
                    <CompanyLogo name={result.record1.companyName} logoUrl={result.record1.companyLogoUrl} size={28} />
                    <div className="flex flex-col leading-tight">
                      <span className="text-xs font-black text-[#222222]">{result.record1.companyName}</span>
                      <span className="text-[9px] text-[#717171] font-bold">Offer 1 Simulator</span>
                    </div>
                  </div>
                  <span className="text-lg font-black text-violet-600">
                    {formatCurrency(simTotal1, result.record1.currency)}
                  </span>
                </div>

                {/* Base Salary Slider */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-[#484848]">
                    <span>Base Salary</span>
                    <span className="text-[#FF5A5F]">{formatCurrency(simBase1, result.record1.currency)}</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max={sliderRanges.max1}
                    step={sliderRanges.step1}
                    value={simBase1}
                    onChange={(e) => setSimBase1(Number(e.target.value))}
                    className="w-full accent-violet-600 h-1.5 bg-[#EBEBEB] rounded-lg cursor-pointer"
                  />
                </div>

                {/* Stock Slider */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-[#484848]">
                    <span>Stock & Equity</span>
                    <span className="text-[#FF5A5F]">{formatCurrency(simStock1, result.record1.currency)}</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max={sliderRanges.max1}
                    step={sliderRanges.step1}
                    value={simStock1}
                    onChange={(e) => setSimStock1(Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-[#EBEBEB] rounded-lg cursor-pointer"
                  />
                </div>

                {/* Bonus Slider */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-[#484848]">
                    <span>Annual Bonus</span>
                    <span className="text-[#FF5A5F]">{formatCurrency(simBonus1, result.record1.currency)}</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max={sliderRanges.max1}
                    step={sliderRanges.step1}
                    value={simBonus1}
                    onChange={(e) => setSimBonus1(Number(e.target.value))}
                    className="w-full accent-amber-500 h-1.5 bg-[#EBEBEB] rounded-lg cursor-pointer"
                  />
                </div>

                {/* Reset button for Card 1 */}
                <button
                  onClick={() => {
                    setSimBase1(result.record1.baseSalary);
                    setSimStock1(result.record1.stock);
                    setSimBonus1(result.record1.bonus);
                  }}
                  className="text-[10px] font-black uppercase tracking-wider text-[#717171] hover:text-[#222222] border border-[#EBEBEB] rounded-lg py-1.5 bg-white text-center cursor-pointer"
                >
                  Reset Offer 1 to Baseline
                </button>
              </div>

              {/* Simulator Card 2 */}
              <div className="bg-slate-50/50 border border-[#EBEBEB] rounded-2xl p-5 flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-[#EBEBEB] pb-3">
                  <div className="flex items-center gap-2">
                    <CompanyLogo name={result.record2.companyName} logoUrl={result.record2.companyLogoUrl} size={28} />
                    <div className="flex flex-col leading-tight">
                      <span className="text-xs font-black text-[#222222]">{result.record2.companyName}</span>
                      <span className="text-[9px] text-[#717171] font-bold">Offer 2 Simulator</span>
                    </div>
                  </div>
                  <span className="text-lg font-black text-emerald-600">
                    {formatCurrency(simTotal2, result.record2.currency)}
                  </span>
                </div>

                {/* Base Salary Slider */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-[#484848]">
                    <span>Base Salary</span>
                    <span className="text-[#FF5A5F]">{formatCurrency(simBase2, result.record2.currency)}</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max={sliderRanges.max2}
                    step={sliderRanges.step2}
                    value={simBase2}
                    onChange={(e) => setSimBase2(Number(e.target.value))}
                    className="w-full accent-violet-600 h-1.5 bg-[#EBEBEB] rounded-lg cursor-pointer"
                  />
                </div>

                {/* Stock Slider */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-[#484848]">
                    <span>Stock & Equity</span>
                    <span className="text-[#FF5A5F]">{formatCurrency(simStock2, result.record2.currency)}</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max={sliderRanges.max2}
                    step={sliderRanges.step2}
                    value={simStock2}
                    onChange={(e) => setSimStock2(Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-[#EBEBEB] rounded-lg cursor-pointer"
                  />
                </div>

                {/* Bonus Slider */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-[#484848]">
                    <span>Annual Bonus</span>
                    <span className="text-[#FF5A5F]">{formatCurrency(simBonus2, result.record2.currency)}</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max={sliderRanges.max2}
                    step={sliderRanges.step2}
                    value={simBonus2}
                    onChange={(e) => setSimBonus2(Number(e.target.value))}
                    className="w-full accent-amber-500 h-1.5 bg-[#EBEBEB] rounded-lg cursor-pointer"
                  />
                </div>

                {/* Reset button for Card 2 */}
                <button
                  onClick={() => {
                    setSimBase2(result.record2.baseSalary);
                    setSimStock2(result.record2.stock);
                    setSimBonus2(result.record2.bonus);
                  }}
                  className="text-[10px] font-black uppercase tracking-wider text-[#717171] hover:text-[#222222] border border-[#EBEBEB] rounded-lg py-1.5 bg-white text-center cursor-pointer"
                >
                  Reset Offer 2 to Baseline
                </button>
              </div>
            </div>
          </div>

          {/* Breakdown Grid Table */}
          <div className="bg-white border border-[#EBEBEB] rounded-3xl overflow-hidden shadow-sm">
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
