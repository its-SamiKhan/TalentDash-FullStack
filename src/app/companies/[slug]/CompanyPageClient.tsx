'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  LevelBadge,
  StatCard,
  BarChart,
  CompanyLogo,
  DataTable,
  SalaryCard,
  EmptyState,
  Select,
} from '@/components/ui';
import { formatCurrency, formatExperience } from '@/lib/formatters';
import type { SalaryForDisplay, CompanyStats, LevelDistributionItem } from '@/types';

interface CompanyPageClientProps {
  company: {
    id: string;
    name: string;
    slug: string;
    industry: string | null;
    headquarters: string | null;
    foundedYear: number | null;
    headcountRange: string | null;
    logoUrl: string | null;
  };
  initialSalaries: SalaryForDisplay[];
  stats: CompanyStats;
  levelDistribution: LevelDistributionItem[];
}

export function CompanyPageClient({
  company,
  initialSalaries,
  stats,
  levelDistribution,
}: CompanyPageClientProps) {
  const router = useRouter();

  // Filters state
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  // Checklist for side-by-side compare
  const [compareList, setCompareList] = useState<string[]>([]);

  // Unique lists for filters
  const roles = Array.from(new Set(initialSalaries.map((s) => s.role))).sort();
  const locations = Array.from(new Set(initialSalaries.map((s) => s.location))).sort();
  const levels = Array.from(new Set(initialSalaries.map((s) => s.level))).sort();

  // Filter salaries
  const filteredSalaries = initialSalaries.filter((s) => {
    if (selectedRole && s.role !== selectedRole) return false;
    if (selectedLocation && s.location !== selectedLocation) return false;
    if (selectedLevel && s.level !== selectedLevel) return false;
    return true;
  });

  const handleCompareToggle = (id: string) => {
    if (compareList.includes(id)) {
      setCompareList(compareList.filter((x) => x !== id));
    } else {
      if (compareList.length >= 2) {
        // Replace the oldest selection to keep max 2 selected
        setCompareList([compareList[1], id]);
      } else {
        setCompareList([...compareList, id]);
      }
    }
  };

  const handleGoCompare = () => {
    if (compareList.length === 2) {
      router.push(`/compare?s1=${compareList[0]}&s2=${compareList[1]}`);
    }
  };

  // Build columns for DataTable
  const columns = [
    {
      key: 'compare',
      header: 'Compare',
      align: 'center' as const,
      render: (salary: SalaryForDisplay) => (
        <input
          type="checkbox"
          checked={compareList.includes(salary.id)}
          onChange={() => handleCompareToggle(salary.id)}
          className="rounded border-[#EBEBEB] text-[#FF5A5F] focus:ring-[#FF5A5F] h-4 w-4 cursor-pointer"
        />
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (salary: SalaryForDisplay) => <span className="font-semibold text-[#222222]">{salary.role}</span>,
    },
    {
      key: 'level',
      header: 'Level',
      render: (salary: SalaryForDisplay) => <LevelBadge level={salary.level} />,
    },
    {
      key: 'location',
      header: 'Location',
    },
    {
      key: 'experienceYears',
      header: 'Experience',
      render: (salary: SalaryForDisplay) => formatExperience(salary.experienceYears),
    },
    {
      key: 'baseSalary',
      header: 'Base Salary',
      align: 'right' as const,
      render: (salary: SalaryForDisplay) => formatCurrency(salary.baseSalary, salary.currency),
    },
    {
      key: 'stock',
      header: 'Stock / Equity',
      align: 'right' as const,
      render: (salary: SalaryForDisplay) => formatCurrency(salary.stock, salary.currency),
    },
    {
      key: 'bonus',
      header: 'Bonus',
      align: 'right' as const,
      render: (salary: SalaryForDisplay) => formatCurrency(salary.bonus, salary.currency),
    },
    {
      key: 'totalCompensation',
      header: 'Total Comp',
      align: 'right' as const,
      render: (salary: SalaryForDisplay) => (
        <span className="text-[#FF5A5F] font-bold">
          {formatCurrency(salary.totalCompensation, salary.currency)}
        </span>
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Back button */}
      <div>
        <Button variant="ghost" size="sm" onClick={() => router.push('/salaries')} className="text-[#717171] hover:text-[#222222]">
          ← Back to Salaries
        </Button>
      </div>

      {/* Header section with metadata */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#EBEBEB]">
        <div className="flex items-center gap-4">
          <CompanyLogo name={company.name} logoUrl={company.logoUrl} size={64} />
          <div>
            <h1 className="text-3xl font-extrabold text-[#222222] tracking-tight">{company.name}</h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-[#717171] font-medium">
              {company.industry && <span>{company.industry}</span>}
              {company.industry && <span className="text-slate-300">•</span>}
              {company.headquarters && <span>HQ: {company.headquarters}</span>}
              {company.headquarters && <span className="text-slate-300">•</span>}
              {company.foundedYear && <span>Founded: {company.foundedYear}</span>}
              {company.foundedYear && <span className="text-slate-300">•</span>}
              {company.headcountRange && <span>Size: {company.headcountRange}</span>}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => router.push(`/reviews/${company.slug}`)}
            className="text-xs shrink-0"
          >
            ★ Read Reviews
          </Button>

          {/* Floating Compare trigger bar */}
          {compareList.length > 0 && (
            <div className="flex items-center gap-3 bg-[#FF5A5F]/5 border border-[#FF5A5F]/20 rounded-md p-3">
              <span className="text-xs font-semibold text-[#484848]">
                Comparing <span className="text-[#FF5A5F] font-bold">{compareList.length}</span> of 2 records
              </span>
              <Button
                variant="primary"
                size="sm"
                disabled={compareList.length < 2}
                onClick={handleGoCompare}
                className="text-xs"
              >
                Compare Side-by-Side
              </Button>
              <button
                onClick={() => setCompareList([])}
                className="text-xs text-[#717171] hover:text-[#222222] font-semibold underline ml-1"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Median Total Comp"
          value={stats.median_tc > 0 ? formatCurrency(stats.median_tc, 'INR') : '—'}
          subValue="India values normalized in INR"
        />
        <StatCard
          title="Min Total Comp"
          value={stats.min_tc > 0 ? formatCurrency(stats.min_tc, 'INR') : '—'}
        />
        <StatCard
          title="Max Total Comp"
          value={stats.max_tc > 0 ? formatCurrency(stats.max_tc, 'INR') : '—'}
        />
        <StatCard
          title="Total Submissions"
          value={stats.count}
          subValue="Verified career records"
        />
      </div>

      {/* Grid: Level distribution + Salary list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Level distribution chart */}
        <div className="bg-white border border-[#EBEBEB] rounded-lg p-6 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-[#222222] mb-1">Level Distribution</h2>
          <p className="text-xs text-[#717171] mb-6">Standardized level counts based on submissions</p>
          {levelDistribution.length === 0 ? (
            <p className="text-sm text-[#717171] italic text-center py-4">No level distribution data available</p>
          ) : (
            <BarChart items={levelDistribution.map(item => ({ label: item.level, value: item.count, percentage: item.percentage }))} />
          )}
        </div>

        {/* Right column: Filterable salaries list */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-white border border-[#EBEBEB] rounded-lg p-4 shadow-sm flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Select
                options={[{ value: '', label: 'All Roles' }, ...roles.map(r => ({ value: r, label: r }))]}
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Select
                options={[{ value: '', label: 'All Locations' }, ...locations.map(l => ({ value: l, label: l }))]}
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Select
                options={[{ value: '', label: 'All Levels' }, ...levels.map(l => ({ value: l, label: l }))]}
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              />
            </div>
          </div>

          {filteredSalaries.length === 0 ? (
            <EmptyState
              onReset={() => {
                setSelectedRole('');
                setSelectedLocation('');
                setSelectedLevel('');
              }}
            />
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <DataTable
                  columns={columns}
                  data={filteredSalaries}
                  currentSort="total_comp_desc"
                  onSort={() => {}}
                />
              </div>

              {/* Mobile Cards View */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {filteredSalaries.map((salary) => (
                  <div key={salary.id} className="relative">
                    <SalaryCard salary={salary} />
                    <label className="absolute top-4 right-4 flex items-center gap-1.5 bg-white border border-[#EBEBEB] px-2 py-1 rounded shadow-sm text-xs font-semibold text-[#484848] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={compareList.includes(salary.id)}
                        onChange={() => handleCompareToggle(salary.id)}
                        className="rounded border-[#EBEBEB] text-[#FF5A5F] focus:ring-[#FF5A5F] h-3.5 w-3.5"
                      />
                      Compare
                    </label>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
