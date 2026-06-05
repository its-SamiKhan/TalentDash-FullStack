'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export function HomeSearchConsole() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'salaries' | 'reviews' | 'interviews' | 'companies' | 'jobs'>('salaries');
  
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');

  const tabs = [
    { id: 'salaries', label: 'Salaries', icon: '💵' },
    { id: 'reviews', label: 'Reviews', icon: '⭐' },
    { id: 'interviews', label: 'Interviews', icon: '📝' },
    { id: 'companies', label: 'Companies', icon: '🏢' },
    { id: 'jobs', label: 'Jobs', icon: '💼' },
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
      router.push(`/reviews?query=${encodeURIComponent(query)}`);
    } else if (activeTab === 'interviews') {
      router.push(`/interviews?query=${encodeURIComponent(query)}`);
    } else if (activeTab === 'companies') {
      const normalizedQuery = query.toLowerCase().trim();
      // Check for exact key match or substring match
      const matchedKey = Object.keys(companySlugMap).find(
        key => normalizedQuery === key || normalizedQuery.includes(key)
      );
      if (matchedKey) {
        router.push(`/companies/${companySlugMap[matchedKey]}`);
      } else {
        router.push(`/salaries?query=${encodeURIComponent(query)}`);
      }
    } else {
      router.push(`/jobs?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`);
    }
  };

  const handleTrendingClick = (term: string) => {
    setQuery(term);
    router.push(`/salaries?query=${encodeURIComponent(term)}`);
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
              <span>{tab.icon}</span>
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
        {/* Input 1: Query */}
        <div className="flex-1 flex items-center gap-3 w-full border-b md:border-b-0 md:border-r border-[#EBEBEB] pb-3 md:pb-0 md:pr-4">
          <span className="text-[#717171]">🔍</span>
          <div className="flex flex-col w-full">
            <label className="text-[10px] font-extrabold text-[#717171] uppercase tracking-wider">
              {activeTab === 'companies' ? 'Company Name' : 'Search by job title, skill or company'}
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                activeTab === 'companies'
                  ? 'e.g. Google, Amazon'
                  : 'e.g. Software Engineer, Data Analyst'
              }
              className="w-full text-sm text-[#222222] font-semibold placeholder:text-[#717171]/60 focus:outline-none mt-0.5 bg-transparent"
            />
          </div>
        </div>

        {/* Input 2: Location */}
        <div className="flex-1 flex items-center gap-3 w-full border-b md:border-b-0 md:border-r border-[#EBEBEB] pb-3 md:pb-0 md:pr-4">
          <span className="text-[#717171]">📍</span>
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
              disabled={activeTab === 'reviews' || activeTab === 'interviews'}
            />
          </div>
        </div>

        {/* Input 3: Experience Dropdown */}
        <div className="flex-1 flex items-center gap-3 w-full border-b md:border-b-0 pb-3 md:pb-0">
          <span className="text-[#717171]">📅</span>
          <div className="flex flex-col w-full">
            <label className="text-[10px] font-extrabold text-[#717171] uppercase tracking-wider">
              Experience
            </label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full text-sm text-[#222222] font-semibold focus:outline-none mt-0.5 bg-transparent cursor-pointer"
              disabled={activeTab === 'reviews' || activeTab === 'interviews' || activeTab === 'companies'}
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
        {['Software Engineer', 'Data Scientist', 'Product Manager', 'Marketing Manager', 'Remote Jobs'].map((term) => (
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
