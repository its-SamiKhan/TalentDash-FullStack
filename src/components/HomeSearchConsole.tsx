'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MinimalIcons } from '@/components/MinimalIcons';

export function HomeSearchConsole() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'salaries' | 'reviews' | 'interviews' | 'companies' | 'jobs'>('salaries');
  
  // Dynamic search fields states
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');
  
  // Reviews specific states
  const [rating, setRating] = useState('');
  const [reviewSort, setReviewSort] = useState('');
  
  // Interviews specific states
  const [difficulty, setDifficulty] = useState('');
  const [outcome, setOutcome] = useState('');
  
  // Companies specific states
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');
  
  // Jobs specific states
  const [jobType, setJobType] = useState('');

  const tabs = [
    { id: 'salaries', label: 'Salaries', icon: MinimalIcons.salary },
    { id: 'reviews', label: 'Reviews', icon: MinimalIcons.star },
    { id: 'interviews', label: 'Interviews', icon: MinimalIcons.interview },
    { id: 'companies', label: 'Companies', icon: MinimalIcons.building },
    { id: 'jobs', label: 'Jobs', icon: MinimalIcons.briefcase },
  ] as const;

  const companySlugMap: Record<string, string> = {
    google: 'google',
    amazon: 'amazon',
    meta: 'meta',
    facebook: 'meta',
    microsoft: 'microsoft',
    flipkart: 'flipkart',
    meesho: 'meesho',
    nvidia: 'nvidia',
    razorpay: 'razorpay',
    zepto: 'zepto',
    tcs: 'tcs',
    infosys: 'infosys',
    wipro: 'wipro',
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'salaries') {
      router.push(`/salaries?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}${experience ? `&experience=${encodeURIComponent(experience)}` : ''}`);
    } else if (activeTab === 'reviews') {
      router.push(`/reviews?query=${encodeURIComponent(query)}${rating ? `&rating=${encodeURIComponent(rating)}` : ''}${reviewSort ? `&sort=${encodeURIComponent(reviewSort)}` : ''}`);
    } else if (activeTab === 'interviews') {
      router.push(`/interviews?query=${encodeURIComponent(query)}${difficulty ? `&difficulty=${encodeURIComponent(difficulty)}` : ''}${outcome ? `&outcome=${encodeURIComponent(outcome)}` : ''}`);
    } else if (activeTab === 'companies') {
      router.push(`/companies?query=${encodeURIComponent(query)}${industry ? `&industry=${encodeURIComponent(industry)}` : ''}${companySize ? `&size=${encodeURIComponent(companySize)}` : ''}`);
    } else {
      router.push(`/jobs?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}${jobType ? `&jobType=${encodeURIComponent(jobType)}` : ''}`);
    }
  };

  const handleTrendingClick = (term: string) => {
    setQuery(term);
    if (activeTab === 'salaries') {
      router.push(`/salaries?query=${encodeURIComponent(term)}`);
    } else if (activeTab === 'reviews') {
      router.push(`/reviews?query=${encodeURIComponent(term)}`);
    } else if (activeTab === 'interviews') {
      router.push(`/interviews?query=${encodeURIComponent(term)}`);
    } else if (activeTab === 'companies') {
      router.push(`/companies?query=${encodeURIComponent(term)}`);
    } else {
      router.push(`/jobs?query=${encodeURIComponent(term)}`);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 mt-6">
      {/* Tabs */}
      <div className="flex border-b border-[#EBEBEB] w-fit">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                isActive
                  ? 'border-[#FF5A5F] text-[#FF5A5F]'
                  : 'border-transparent text-[#717171] hover:text-[#222222]'
              }`}
            >
              <span className="w-[18px] h-[18px] flex items-center justify-center shrink-0">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Input Box Card */}
      <form
        onSubmit={handleSearch}
        className="bg-white border border-[#EBEBEB] rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center gap-4 w-full"
      >
        {/* ==================== COLUMN 1 ==================== */}
        <div className="flex-1 flex items-center gap-3 w-full border-b md:border-b-0 md:border-r border-[#EBEBEB] pb-3 md:pb-0 md:pr-4">
          <span className="text-[#717171] shrink-0">{MinimalIcons.search}</span>
          <div className="flex flex-col w-full">
            <label className="text-[10px] font-extrabold text-[#717171] uppercase tracking-wider">
              {activeTab === 'companies' || activeTab === 'reviews'
                ? 'Company Name'
                : activeTab === 'jobs'
                ? 'Search by title, skill or keyword'
                : 'Search by job title, skill or company'}
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                activeTab === 'companies' || activeTab === 'reviews'
                  ? 'e.g. Google, Amazon'
                  : activeTab === 'jobs'
                  ? 'e.g. React Developer, Frontend'
                  : 'e.g. Software Engineer, Data Analyst'
              }
              className="w-full text-sm text-[#222222] font-semibold placeholder:text-[#717171]/60 focus:outline-none mt-0.5 bg-transparent"
            />
          </div>
        </div>

        {/* ==================== COLUMN 2 ==================== */}
        <div className="flex-1 flex items-center gap-3 w-full border-b md:border-b-0 md:border-r border-[#EBEBEB] pb-3 md:pb-0 md:pr-4">
          {activeTab === 'reviews' ? (
            <>
              <span className="text-[#717171] shrink-0">{MinimalIcons.star}</span>
              <div className="flex flex-col w-full">
                <label className="text-[10px] font-extrabold text-[#717171] uppercase tracking-wider">
                  Rating
                </label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full text-sm text-[#222222] font-semibold focus:outline-none mt-0.5 bg-transparent cursor-pointer"
                >
                  <option value="">All Ratings</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">Under 3 Stars</option>
                </select>
              </div>
            </>
          ) : activeTab === 'interviews' ? (
            <>
              <span className="text-[#717171] shrink-0">{MinimalIcons.interview}</span>
              <div className="flex flex-col w-full">
                <label className="text-[10px] font-extrabold text-[#717171] uppercase tracking-wider">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full text-sm text-[#222222] font-semibold focus:outline-none mt-0.5 bg-transparent cursor-pointer"
                >
                  <option value="">All Difficulties</option>
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>
            </>
          ) : activeTab === 'companies' ? (
            <>
              <span className="text-[#717171] shrink-0">{MinimalIcons.tag}</span>
              <div className="flex flex-col w-full">
                <label className="text-[10px] font-extrabold text-[#717171] uppercase tracking-wider">
                  Industry
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full text-sm text-[#222222] font-semibold focus:outline-none mt-0.5 bg-transparent cursor-pointer"
                >
                  <option value="">All Industries</option>
                  <option value="technology">Technology</option>
                  <option value="social-media">Social Media</option>
                  <option value="e-commerce">E-commerce</option>
                  <option value="semiconductors">Semiconductors</option>
                  <option value="fintech">FinTech</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <span className="text-[#717171] shrink-0">{MinimalIcons.location}</span>
              <div className="flex flex-col w-full">
                <label className="text-[10px] font-extrabold text-[#717171] uppercase tracking-wider">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bengaluru, India"
                  className="w-full text-sm text-[#222222] font-semibold placeholder:text-[#717171]/60 focus:outline-none mt-0.5 bg-transparent"
                />
              </div>
            </>
          )}
        </div>

        {/* ==================== COLUMN 3 ==================== */}
        <div className="flex-1 flex items-center gap-3 w-full border-b md:border-b-0 pb-3 md:pb-0">
          {activeTab === 'reviews' ? (
            <>
              <span className="text-[#717171] shrink-0">{MinimalIcons.scale}</span>
              <div className="flex flex-col w-full">
                <label className="text-[10px] font-extrabold text-[#717171] uppercase tracking-wider">
                  Sort By
                </label>
                <select
                  value={reviewSort}
                  onChange={(e) => setReviewSort(e.target.value)}
                  className="w-full text-sm text-[#222222] font-semibold focus:outline-none mt-0.5 bg-transparent cursor-pointer"
                >
                  <option value="recent">Recent</option>
                  <option value="highest">Highest Rated</option>
                  <option value="lowest">Lowest Rated</option>
                </select>
              </div>
            </>
          ) : activeTab === 'interviews' ? (
            <>
              <span className="text-[#717171] shrink-0">{MinimalIcons.cap}</span>
              <div className="flex flex-col w-full">
                <label className="text-[10px] font-extrabold text-[#717171] uppercase tracking-wider">
                  Outcome
                </label>
                <select
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  className="w-full text-sm text-[#222222] font-semibold focus:outline-none mt-0.5 bg-transparent cursor-pointer"
                >
                  <option value="">All Outcomes</option>
                  <option value="OFFER">Offered</option>
                  <option value="NO_OFFER">Rejected</option>
                  <option value="GHOSTED">Ghosted</option>
                </select>
              </div>
            </>
          ) : activeTab === 'companies' ? (
            <>
              <span className="text-[#717171] shrink-0">{MinimalIcons.users}</span>
              <div className="flex flex-col w-full">
                <label className="text-[10px] font-extrabold text-[#717171] uppercase tracking-wider">
                  Company Size
                </label>
                <select
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="w-full text-sm text-[#222222] font-semibold focus:outline-none mt-0.5 bg-transparent cursor-pointer"
                >
                  <option value="">All Sizes</option>
                  <option value="10000+">10,000+ employees</option>
                  <option value="5000-10000">5,000 - 10,000</option>
                  <option value="1000-5000">1,000 - 5,000</option>
                  <option value="100-1000">100 - 1,000</option>
                </select>
              </div>
            </>
          ) : activeTab === 'jobs' ? (
            <>
              <span className="text-[#717171] shrink-0">{MinimalIcons.briefcase}</span>
              <div className="flex flex-col w-full">
                <label className="text-[10px] font-extrabold text-[#717171] uppercase tracking-wider">
                  Job Type
                </label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full text-sm text-[#222222] font-semibold focus:outline-none mt-0.5 bg-transparent cursor-pointer"
                >
                  <option value="">All Types</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <span className="text-[#717171] shrink-0">{MinimalIcons.calendar}</span>
              <div className="flex flex-col w-full">
                <label className="text-[10px] font-extrabold text-[#717171] uppercase tracking-wider">
                  Experience
                </label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full text-sm text-[#222222] font-semibold focus:outline-none mt-0.5 bg-transparent cursor-pointer"
                >
                  <option value="">e.g. 0-5 years</option>
                  <option value="0-1">0-1 year (Entry)</option>
                  <option value="1-3">1-3 years (Junior)</option>
                  <option value="3-5">3-5 years (Mid)</option>
                  <option value="5-8">5-8 years (Senior)</option>
                  <option value="8-12">8-12 years (Staff)</option>
                  <option value="12+">12+ years (Principal+)</option>
                </select>
              </div>
            </>
          )}
        </div>

        {/* Search button */}
        <button
          type="submit"
          className="w-full md:w-auto bg-[#FF5A5F] hover:bg-[#ff4449] text-white font-extrabold px-7 py-3.5 rounded-xl transition-all shadow-sm shadow-[#FF5A5F]/20 cursor-pointer select-none"
        >
          Search
        </button>
      </form>

      {/* Trending searches */}
      <div className="flex flex-wrap items-center gap-2.5 mt-2">
        <span className="text-xs font-bold text-[#717171]">Trending searches:</span>
        {['Software Engineer', 'Product Manager', 'Remote Jobs'].map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => handleTrendingClick(term)}
            className="text-xs font-semibold text-[#484848] bg-white border border-[#EBEBEB] hover:border-[#FF5A5F]/40 px-3 py-1 rounded-full transition-colors cursor-pointer"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}
