'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { JOBS_DATA, Job } from '@/app/jobs/JobsPageClient';
import { SalaryCard, EmptyState, StarRatingDisplay, CompanyLogo } from '@/components/ui';
import type { SalaryForDisplay } from '@/types';

interface DisplayCompany {
  id: string;
  name: string;
  slug: string;
  industry: string;
  headquarters: string;
  logoUrl: string | null;
  averageRating: number;
  salariesCount: number;
  reviewsCount: number;
  interviewsCount: number;
}

interface SavedPageClientProps {
  initialSalaries: SalaryForDisplay[];
  initialCompanies: DisplayCompany[];
}

export function SavedPageClient({ initialSalaries, initialCompanies }: SavedPageClientProps) {
  const [activeTab, setActiveTab] = useState<'jobs' | 'salaries' | 'companies'>('jobs');
  
  // State for localStorage items
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [savedSalaryIds, setSavedSalaryIds] = useState<string[]>([]);
  const [savedCompanyIds, setSavedCompanyIds] = useState<string[]>([]);

  // Load saved lists from localStorage on mount
  useEffect(() => {
    const jobs = localStorage.getItem('saved-jobs');
    const salaries = localStorage.getItem('saved-salaries');
    const companies = localStorage.getItem('saved-companies');

    if (jobs) setSavedJobIds(JSON.parse(jobs));
    if (salaries) setSavedSalaryIds(JSON.parse(salaries));
    
    // For company bookmarks, let's also support bookmarking companies on company list/profile.
    // If empty, let's check localStorage, or initialize empty.
    if (companies) {
      setSavedCompanyIds(JSON.parse(companies));
    } else {
      // Pre-seed some default saved companies/salaries so the page isn't totally blank at first visit
      const defaultCompanies = initialCompanies.slice(0, 2).map((c) => c.id);
      setSavedCompanyIds(defaultCompanies);
      localStorage.setItem('saved-companies', JSON.stringify(defaultCompanies));

      const defaultSalaries = initialSalaries.slice(0, 2).map((s) => s.id);
      setSavedSalaryIds(defaultSalaries);
      localStorage.setItem('saved-salaries', JSON.stringify(defaultSalaries));

      const defaultJobs = JOBS_DATA.slice(0, 2).map((j) => j.id);
      setSavedJobIds(defaultJobs);
      localStorage.setItem('saved-jobs', JSON.stringify(defaultJobs));
    }
  }, [initialCompanies, initialSalaries]);

  // Handler functions to unsave items
  const handleUnsaveJob = (id: string) => {
    const next = savedJobIds.filter((item) => item !== id);
    setSavedJobIds(next);
    localStorage.setItem('saved-jobs', JSON.stringify(next));
  };

  const handleUnsaveSalary = (id: string) => {
    const next = savedSalaryIds.filter((item) => item !== id);
    setSavedSalaryIds(next);
    localStorage.setItem('saved-salaries', JSON.stringify(next));
  };

  const handleUnsaveCompany = (id: string) => {
    const next = savedCompanyIds.filter((item) => item !== id);
    setSavedCompanyIds(next);
    localStorage.setItem('saved-companies', JSON.stringify(next));
  };

  // Filtered lists
  const bookmarkedJobs = JOBS_DATA.filter((job) => savedJobIds.includes(job.id));
  const bookmarkedSalaries = initialSalaries.filter((s) => savedSalaryIds.includes(s.id));
  const bookmarkedCompanies = initialCompanies.filter((c) => savedCompanyIds.includes(c.id));

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Header Section */}
      <div className="text-left">
        <h1 className="text-3xl font-black text-[#222222] tracking-tight">Saved Items</h1>
        <p className="text-sm text-[#717171] mt-1 font-semibold">
          Access your bookmarked job openings, salary records, and company profiles.
        </p>
      </div>

      {/* 2. Tabs Bar */}
      <div className="flex border-b border-[#EBEBEB] gap-6">
        {[
          { id: 'jobs', label: 'Saved Jobs', count: bookmarkedJobs.length },
          { id: 'salaries', label: 'Saved Salaries', count: bookmarkedSalaries.length },
          { id: 'companies', label: 'Saved Companies', count: bookmarkedCompanies.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-4 text-sm font-bold tracking-tight border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === tab.id
                ? 'border-[#FF5A5F] text-[#FF5A5F]'
                : 'border-transparent text-[#717171] hover:text-[#222222]'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
              activeTab === tab.id ? 'bg-[#FF5A5F]/10 text-[#FF5A5F]' : 'bg-slate-100 text-[#717171]'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* 3. Tab Contents */}
      <div className="w-full">
        {/* Saved Jobs Tab */}
        {activeTab === 'jobs' && (
          <div>
            {bookmarkedJobs.length === 0 ? (
              <div className="bg-white border border-[#EBEBEB] rounded-2xl p-10 shadow-3xs">
                <EmptyState
                  onReset={() => (window.location.href = '/jobs')}
                  actionLabel="Browse Jobs"
                  title="No Saved Jobs"
                  description="You haven't bookmarked any job openings yet. Explore the jobs board to find and apply for tech roles."
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                {bookmarkedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white border border-[#EBEBEB] rounded-2xl p-5 shadow-3xs flex flex-col justify-between gap-4 hover:border-[#FF5A5F]/30 transition-all group"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 border border-[#EBEBEB] rounded-xl flex items-center justify-center shrink-0 overflow-hidden bg-slate-50 relative p-1.5">
                          <Image src={job.logoUrl} alt={job.companyName} width={32} height={32} className="object-contain" />
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-[#222222] group-hover:text-[#FF5A5F] transition-colors line-clamp-1">
                            {job.title}
                          </h4>
                          <span className="text-[10px] font-bold text-[#717171]">{job.companyName}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleUnsaveJob(job.id)}
                        className="text-base cursor-pointer hover:scale-110 transition-transform text-[#FF5A5F]"
                        title="Remove bookmark"
                      >
                        ❤️
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      <span className="text-[9px] font-bold text-[#484848] bg-slate-100 px-1.5 py-0.5 rounded">{job.location}</span>
                      <span className="text-[9px] font-bold text-[#484848] bg-slate-100 px-1.5 py-0.5 rounded">{job.type}</span>
                      <span className="text-[9px] font-bold text-[#484848] bg-slate-100 px-1.5 py-0.5 rounded">{job.experience.split(' ')[0]}</span>
                    </div>

                    <div className="flex justify-between items-center border-t border-[#F7F7F7] pt-3 mt-1">
                      <span className="text-[10px] font-extrabold text-[#FF5A5F]">
                        ₹{job.minSalary}L - ₹{job.maxSalary}L
                      </span>
                      <Link
                        href={`/jobs?query=${job.title}`}
                        className="text-[10px] font-bold text-white bg-[#FF5A5F] hover:bg-[#ff4449] px-3 py-1.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                      >
                        Apply Now
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Saved Salaries Tab */}
        {activeTab === 'salaries' && (
          <div>
            {bookmarkedSalaries.length === 0 ? (
              <div className="bg-white border border-[#EBEBEB] rounded-2xl p-10 shadow-3xs">
                <EmptyState
                  onReset={() => (window.location.href = '/salaries')}
                  actionLabel="Browse Salaries"
                  title="No Saved Salaries"
                  description="You haven't bookmarked any compensation records yet. Explore dynamic salary levels and ranges across roles."
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                {bookmarkedSalaries.map((salary) => (
                  <SalaryCard
                    key={salary.id}
                    salary={salary}
                    isSaved={true}
                    onToggleSave={() => handleUnsaveSalary(salary.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Saved Companies Tab */}
        {activeTab === 'companies' && (
          <div>
            {bookmarkedCompanies.length === 0 ? (
              <div className="bg-white border border-[#EBEBEB] rounded-2xl p-10 shadow-3xs">
                <EmptyState
                  onReset={() => (window.location.href = '/companies')}
                  actionLabel="Browse Companies"
                  title="No Saved Companies"
                  description="You haven't bookmarked any company directories yet. Explore employers, rating categories, and cultural metrics."
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
                {bookmarkedCompanies.map((company) => (
                  <div
                    key={company.id}
                    className="bg-white border border-[#EBEBEB] rounded-2xl p-5 shadow-3xs flex flex-col justify-between h-44 hover:border-[#FF5A5F]/30 transition-all group"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex items-center gap-3">
                        <CompanyLogo name={company.name} logoUrl={company.logoUrl} size={40} />
                        <div>
                          <Link
                            href={`/companies/${company.slug}`}
                            className="text-sm font-bold text-[#222222] hover:text-[#FF5A5F] group-hover:text-[#FF5A5F] transition-colors"
                          >
                            {company.name}
                          </Link>
                          <p className="text-[10px] text-[#717171] mt-0.5">{company.industry}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleUnsaveCompany(company.id)}
                        className="text-base cursor-pointer hover:scale-110 transition-transform text-[#FF5A5F]"
                        title="Remove bookmark"
                      >
                        ❤️
                      </button>
                    </div>

                    <div className="flex items-center gap-1 border-t border-b border-[#F7F7F7] py-2">
                      <StarRatingDisplay rating={company.averageRating} size="sm" />
                      <span className="text-[11px] font-black text-[#222222] ml-1">{company.averageRating}★</span>
                      <span className="text-[9px] text-[#717171] font-semibold">({company.reviewsCount} reviews)</span>
                    </div>

                    <div className="flex items-center justify-between mt-1 text-[9px] font-bold text-[#717171]">
                      <span>📍 {company.headquarters}</span>
                      <Link
                        href={`/companies/${company.slug}`}
                        className="text-[#FF5A5F] hover:text-[#ff4449] hover:underline"
                      >
                        View Profile →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
