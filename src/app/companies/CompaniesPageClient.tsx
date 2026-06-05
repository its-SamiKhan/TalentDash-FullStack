'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Input,
  Select,
  CompanyLogo,
  StarRatingDisplay,
  EmptyState,
} from '@/components/ui';
import { formatCompactCurrency } from '@/lib/formatters';
import { MinimalIcons } from '@/components/MinimalIcons';

interface DisplayCompany {
  id: string;
  name: string;
  slug: string;
  industry: string;
  headquarters: string;
  foundedYear: number | null;
  headcountRange: string;
  logoUrl: string | null;
  medianSalary: number;
  averageRating: number;
  reviewsCount: number;
  salariesCount: number;
  interviewsCount: number;
}

interface CompaniesPageClientProps {
  initialCompanies: DisplayCompany[];
  industries: string[];
  headcountRanges: string[];
}

export function CompaniesPageClient({
  initialCompanies,
  industries,
  headcountRanges,
}: CompaniesPageClientProps) {
  const router = useRouter();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Interactive Map Tooltip State
  const [activeTooltip, setActiveTooltip] = useState<{
    city: string;
    employers: string;
    salaryIndex: string;
    x: number;
    y: number;
  } | null>(null);

  // Stats computation
  const stats = useMemo(() => {
    const totalCount = initialCompanies.length;
    const ratings = initialCompanies.map((c) => c.averageRating).filter((r) => r > 0);
    const avgRating = ratings.length > 0 ? parseFloat((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)) : 0;
    
    // Find highest median salary
    const highestMedian = Math.max(...initialCompanies.map((c) => c.medianSalary), 0);
    
    // Total data points across salaries, reviews, interviews
    const totalDataPoints = initialCompanies.reduce(
      (acc, c) => acc + c.salariesCount + c.reviewsCount + c.interviewsCount,
      0
    );

    return {
      totalCount,
      avgRating,
      highestMedian,
      totalDataPoints,
    };
  }, [initialCompanies]);

  // Industry Concentration calculations for chart
  const industryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    initialCompanies.forEach((c) => {
      counts[c.industry] = (counts[c.industry] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: (count / initialCompanies.length) * 100,
      }))
      .sort((a, b) => b.count - a.count);
  }, [initialCompanies]);

  // Size distribution calculations for chart
  const sizeStats = useMemo(() => {
    const counts: Record<string, number> = {};
    initialCompanies.forEach((c) => {
      counts[c.headcountRange] = (counts[c.headcountRange] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: (count / initialCompanies.length) * 100,
      }))
      .sort((a, b) => b.count - a.count);
  }, [initialCompanies]);

  // Filters logic
  const filteredCompanies = useMemo(() => {
    return initialCompanies.filter((c) => {
      const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchIndustry = selectedIndustry ? c.industry === selectedIndustry : true;
      const matchSize = selectedSize ? c.headcountRange === selectedSize : true;
      return matchSearch && matchIndustry && matchSize;
    });
  }, [initialCompanies, searchQuery, selectedIndustry, selectedSize]);

  // Conversion math for Display Median
  const getDisplayMedian = (median: number) => {
    if (median === 0) return '—';
    const amount = currency === 'USD' ? median / 83.33 : median;
    return formatCompactCurrency(amount, currency);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedIndustry('');
    setSelectedSize('');
  };

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-left">
          <h1 className="text-3xl font-black text-[#222222] tracking-tight">Global Employer Directory</h1>
          <p className="text-sm text-[#717171] mt-1 font-semibold">
            Search, filter, and compare compensation and culture across top tech employers.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-[#F7F7F7] border border-[#EBEBEB] p-1 rounded-xl shrink-0 shadow-3xs select-none">
          <button
            onClick={() => setCurrency('INR')}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              currency === 'INR' ? 'bg-white text-[#FF5A5F] shadow-xs' : 'text-[#717171] hover:text-[#222222]'
            }`}
          >
            INR (₹)
          </button>
          <button
            onClick={() => setCurrency('USD')}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              currency === 'USD' ? 'bg-white text-[#FF5A5F] shadow-xs' : 'text-[#717171] hover:text-[#222222]'
            }`}
          >
            USD ($)
          </button>
        </div>
      </div>

      {/* 2. Top Summary Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { title: `${stats.totalCount} Employers`, desc: 'Active corporate profiles', color: 'text-[#FF5A5F] bg-[#FF5A5F]/5 border-[#FF5A5F]/10', icon: MinimalIcons.building },
          { title: `${stats.avgRating}★ Average`, desc: 'Employee cultural feedback', color: 'text-[#FF5A5F] bg-[#FF5A5F]/5 border-[#FF5A5F]/10', icon: MinimalIcons.star },
          {
            title: getDisplayMedian(stats.highestMedian),
            desc: 'Peak median total comp',
            color: 'text-[#FF5A5F] bg-[#FF5A5F]/5 border-[#FF5A5F]/10',
            icon: MinimalIcons.salary,
          },
          { title: `${stats.totalDataPoints.toLocaleString()}`, desc: 'Aggregated analytics items', color: 'text-[#FF5A5F] bg-[#FF5A5F]/5 border-[#FF5A5F]/10', icon: MinimalIcons.trendingUp },
        ].map((item, idx) => (
          <div key={idx} className="bg-white border border-[#EBEBEB] rounded-2xl p-5 shadow-3xs flex items-center gap-4 text-left">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-sm border ${item.color} shrink-0 shadow-3xs`}>
              {item.icon}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-extrabold text-[#222222] truncate">{item.title}</span>
              <span className="text-[10px] text-[#717171] font-semibold mt-0.5 truncate">{item.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Global SVG Map and Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3 width): Interactive Global Office Map */}
        <div className="lg:col-span-2 bg-white border border-[#EBEBEB] rounded-3xl p-6 shadow-sm flex flex-col gap-4 relative">
          <div className="text-left border-b border-[#F7F7F7] pb-3">
            <h3 className="text-sm font-black text-[#222222] uppercase tracking-wider flex items-center gap-1.5">
              <span>🌐</span> Global Office Hubs & Connections
            </h3>
            <p className="text-[10px] text-[#717171] font-semibold mt-0.5">
              Hover over office hotspots to examine localized salary indices and employers.
            </p>
          </div>

          <div className="relative h-64 w-full bg-white rounded-2xl border border-[#F2F2F2] flex items-center justify-center overflow-hidden">
            {/* SVG Map representation */}
            <svg className="h-full w-full" viewBox="0 0 800 400" fill="none">
              {/* Minimalist World Map Image backdrop */}
              <image href="/images/world-map.png" x="0" y="-200" width="800" height="800" opacity="0.85" />

              {/* Connections Arcs (SF -> Bengaluru & London -> Bengaluru) */}
              <path
                d="M 160 140 Q 360 80 570 220"
                stroke="#FF5A5F"
                strokeWidth="1.5"
                strokeDasharray="4,4"
                fill="none"
                opacity="0.75"
              />
              <path
                d="M 400 110 Q 480 140 570 220"
                stroke="#FF5A5F"
                strokeWidth="1.5"
                strokeDasharray="4,4"
                fill="none"
                opacity="0.75"
              />

              {/* Hotspot Nodes (SF, LDN, BLR, HYD, SGP) */}
              {[
                { label: 'San Francisco (SF)', cx: 160, cy: 140, city: 'San Francisco', employers: 'Google, Microsoft, Meta, Apple', index: 'High ($$$)', align: 'middle', dx: 0, dy: -12 },
                { label: 'London (LDN)', cx: 400, cy: 110, city: 'London', employers: 'Google, Microsoft, Amazon', index: 'Above Average ($$)', align: 'middle', dx: 0, dy: -12 },
                { label: 'Bengaluru (BLR)', cx: 570, cy: 220, city: 'Bengaluru', employers: 'Google, Amazon, Microsoft, Nvidia, TCS, Infosys', index: 'Primary Tech Hub (₹₹₹)', align: 'start', dx: 12, dy: 3 },
                { label: 'Hyderabad (HYD)', cx: 560, cy: 210, city: 'Hyderabad', employers: 'Microsoft, Google, Oracle', index: 'Secondary Hub (₹₹)', align: 'end', dx: -12, dy: 3 },
                { label: 'Singapore (SGP)', cx: 640, cy: 250, city: 'Singapore', employers: 'Meta, Google, ByteDance', index: 'Asia-Pac Index ($$$)', align: 'middle', dx: 0, dy: -12 },
              ].map((node, nIdx) => (
                <g 
                  key={nIdx}
                  className="cursor-pointer group"
                  onMouseEnter={() => {
                    setActiveTooltip({
                      city: node.city,
                      employers: node.employers,
                      salaryIndex: node.index,
                      x: node.cx,
                      y: node.cy - 10,
                    });
                  }}
                  onMouseLeave={() => setActiveTooltip(null)}
                >
                  {/* Pulsing ring outer */}
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r="9"
                    fill="#FF5A5F"
                    className="animate-ping"
                    opacity="0.2"
                  />
                  {/* Outer circle */}
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r="5"
                    fill="white"
                    stroke="#FF5A5F"
                    strokeWidth="1.5"
                  />
                  {/* Center circle */}
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r="2.5"
                    fill="#FF5A5F"
                  />
                  {/* City Text Label */}
                  <text
                    x={node.cx + node.dx}
                    y={node.cy + node.dy}
                    textAnchor={node.align as "inherit" | "middle" | "start" | "end"}
                    fill="#222222"
                    fontSize="9"
                    fontWeight="800"
                    className="select-none pointer-events-none"
                  >
                    {node.city}
                  </text>
                </g>
              ))}
            </svg>

            {/* Map Tooltip popover */}
            {activeTooltip && (
              <div 
                className="absolute z-20 bg-white border border-[#EBEBEB] rounded-xl p-3 shadow-md max-w-xs text-left animate-in fade-in zoom-in-95 duration-100 flex flex-col gap-1 pointer-events-none"
                style={{
                  left: `${(activeTooltip.x / 800) * 100}%`,
                  top: `${(activeTooltip.y / 400) * 100}%`,
                  transform: 'translate(-50%, -100%)',
                }}
              >
                <span className="text-xs font-black text-[#222222] border-b border-[#F7F7F7] pb-1">
                  📍 {activeTooltip.city}
                </span>
                <span className="text-[9px] text-[#717171] font-semibold mt-1">
                  Active Employers:
                </span>
                <span className="text-[10px] text-[#484848] font-bold leading-normal">
                  {activeTooltip.employers}
                </span>
                <div className="flex items-center justify-between border-t border-[#F7F7F7] pt-1 mt-1 text-[9px] font-extrabold">
                  <span className="text-[#717171]">Salary Index:</span>
                  <span className="text-[#FF5A5F]">{activeTooltip.salaryIndex}</span>
                </div>
              </div>
            )}
          </div>

          {/* Map Legend: Headquarters Representation */}
          <div className="border-t border-[#F2F2F2] pt-4 mt-2">
            <h4 className="text-xs font-extrabold text-[#222222] uppercase tracking-wider mb-2 text-left">
              🏢 Corporate Headquarters & Regional Hubs
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 text-left">
              {[
                { city: 'San Francisco (SF)', comp: 'Google, Meta, Apple, Nvidia', desc: 'US Tech Headquarters' },
                { city: 'London (LDN)', comp: 'Amazon, Microsoft', desc: 'EMEA Corporate Hub' },
                { city: 'Bengaluru (BLR)', comp: 'Infosys, TCS, Wipro', desc: 'India Headquarters' },
                { city: 'Hyderabad (HYD)', comp: 'Microsoft, Oracle', desc: 'Major India Dev Hub' },
                { city: 'Singapore (SGP)', comp: 'ByteDance, Google', desc: 'Asia-Pac Headquarters' },
              ].map((h, hIdx) => (
                <div key={hIdx} className="flex flex-col gap-0.5 border border-[#EBEBEB] rounded-lg p-2 bg-slate-50/50">
                  <span className="text-[10px] font-black text-[#222222]">{h.city}</span>
                  <span className="text-[9px] text-[#FF5A5F] font-bold">{h.comp}</span>
                  <span className="text-[8px] text-[#717171] font-semibold">{h.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1/3 width): Analytics Charts */}
        <div className="bg-white border border-[#EBEBEB] rounded-3xl p-6 shadow-sm flex flex-col gap-5 text-left h-fit">
          <h3 className="text-sm font-black text-[#222222] uppercase tracking-wider border-b border-[#F7F7F7] pb-3">
            Employer Distribution
          </h3>

          {/* Industry Concentration Progress Bars */}
          <div className="flex flex-col gap-3">
            <span className="text-[9px] font-black uppercase text-[#717171] tracking-wider">
              Industry Concentration
            </span>
            <div className="flex flex-col gap-2.5">
              {industryStats.slice(0, 4).map((ind, i) => (
                <div key={i} className="flex flex-col gap-1 w-full">
                  <div className="flex justify-between text-xs font-bold text-[#484848]">
                    <span>{ind.name}</span>
                    <span className="text-[#FF5A5F]">{ind.count}</span>
                  </div>
                  <div className="w-full bg-[#F2F2F2] h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#FF5A5F] h-full rounded-full transition-all"
                      style={{ width: `${ind.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Size Distribution Progress Bars */}
          <div className="flex flex-col gap-3 border-t border-[#F7F7F7] pt-4">
            <span className="text-[9px] font-black uppercase text-[#717171] tracking-wider">
              Headcount Profile Size
            </span>
            <div className="flex flex-col gap-2.5">
              {sizeStats.slice(0, 4).map((sz, i) => (
                <div key={i} className="flex flex-col gap-1 w-full">
                  <div className="flex justify-between text-xs font-bold text-[#484848]">
                    <span>{sz.name} Employees</span>
                    <span className="text-[#FF5A5F]">{sz.count}</span>
                  </div>
                  <div className="w-full bg-[#F2F2F2] h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-violet-500 h-full rounded-full transition-all"
                      style={{ width: `${sz.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Search and Filters Console */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white border border-[#EBEBEB] rounded-2xl p-5 shadow-sm text-left">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="comp-search" className="text-xs font-bold text-[#222222] uppercase tracking-wider">
            Search Employer
          </label>
          <Input
            id="comp-search"
            placeholder="Type company name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="industry-sel" className="text-xs font-bold text-[#222222] uppercase tracking-wider">
            Industry Area
          </label>
          <Select
            id="industry-sel"
            options={[{ value: '', label: 'All Industries' }, ...industries.map((ind) => ({ value: ind, label: ind }))]}
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="size-sel" className="text-xs font-bold text-[#222222] uppercase tracking-wider">
            Company Size
          </label>
          <Select
            id="size-sel"
            options={[{ value: '', label: 'All Sizes' }, ...headcountRanges.map((r) => ({ value: r, label: `${r} employees` }))]}
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          />
        </div>
      </div>

      {/* 5. Company Card Grid */}
      {filteredCompanies.length === 0 ? (
        <EmptyState onReset={handleClearFilters} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <div
              key={company.id}
              className="bg-white border border-[#EBEBEB] rounded-2xl p-6 shadow-3xs flex flex-col justify-between text-left hover:border-[#FF5A5F]/35 transition-all group"
            >
              <div>
                {/* Logo & Header info */}
                <div className="flex justify-between items-start gap-4 border-b border-[#F7F7F7] pb-4 min-w-0 w-full">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <CompanyLogo name={company.name} logoUrl={company.logoUrl} size={48} />
                    <div className="min-w-0 leading-tight flex-1">
                      <h4 className="font-extrabold text-[#222222] group-hover:text-[#FF5A5F] transition-colors truncate">
                        {company.name}
                      </h4>
                      <p className="text-[10px] text-[#717171] font-semibold mt-0.5 truncate">
                        🏢 {company.industry} • HQ: {company.headquarters}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0 gap-1 ml-auto">
                    <StarRatingDisplay rating={company.averageRating} size="sm" />
                    <span className="text-[9px] text-[#717171] font-bold">
                      {company.averageRating > 0 ? `${company.averageRating}★ (${company.reviewsCount})` : 'No reviews'}
                    </span>
                  </div>
                </div>

                {/* Corporate Metadata Block */}
                <div className="grid grid-cols-2 gap-3 py-4 text-xs font-semibold text-[#484848] border-b border-[#F7F7F7]">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] text-[#717171] uppercase font-black tracking-wider">Company Size</span>
                    <span>{company.headcountRange} employees</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] text-[#717171] uppercase font-black tracking-wider">Founded Year</span>
                    <span>{company.foundedYear || 'Unknown'}</span>
                  </div>
                </div>

                {/* Salary Overview Block */}
                <div className="flex justify-between items-center py-4 bg-slate-50/40 rounded-xl px-4 mt-4 border border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-[#717171] uppercase font-black tracking-wider">Median Total Comp</span>
                    <span className="text-xl font-black text-[#FF5A5F] tracking-tight">
                      {getDisplayMedian(company.medianSalary)}
                    </span>
                  </div>
                  <div className="flex flex-col items-end text-[10px] text-[#717171] font-bold">
                    <span>{company.salariesCount} reported salary packages</span>
                    <span>{company.interviewsCount} interview logs</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="grid grid-cols-2 gap-3 mt-6 border-t border-[#F7F7F7] pt-4.5">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => router.push(`/salaries?company=${company.slug}`)}
                  className="cursor-pointer text-xs py-2 px-3 font-extrabold w-full text-center"
                >
                  View Salaries
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => router.push(`/reviews/${company.slug}`)}
                  className="cursor-pointer text-xs py-2 px-3 font-extrabold w-full text-center bg-[#FF5A5F] hover:bg-[#ff4449]"
                >
                  Read Reviews
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
