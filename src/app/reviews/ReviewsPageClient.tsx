'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Input,
  SearchInput,
  Select,
  EmptyState,
  StarRatingDisplay,
  StarRatingInput,
  Pagination,
  CompanyLogo,
  FilterBar,
} from '@/components/ui';
import type { ReviewForDisplay, PaginatedResponse, ReviewFilters } from '@/types';

interface ReviewsPageClientProps {
  initialData: PaginatedResponse<ReviewForDisplay>;
  distinctRoles: string[];
  companiesList: { id: string; name: string; slug: string }[];
  initialFilters: ReviewFilters;
  initialPage: number;
  isSubmitOpenInitial: boolean;
}

const TOP_RATED_COMPANIES = [
  {
    name: 'Google',
    rating: 4.3,
    reviewsCount: '12.4K',
    workLife: 4.6,
    compBenefits: 4.4,
    culture: 4.2,
    badge: 'Best Work Culture 2026',
    logo: 'google',
  },
  {
    name: 'Microsoft',
    rating: 4.2,
    reviewsCount: '9.8K',
    workLife: 4.4,
    compBenefits: 4.3,
    culture: 4.1,
    badge: 'Top Companies 2026',
    logo: 'microsoft',
  },
  {
    name: 'Apple',
    rating: 4.1,
    reviewsCount: '6.7K',
    workLife: 4.3,
    compBenefits: 4.2,
    culture: 4.0,
    badge: 'Most Loved Workplace',
    logo: 'apple',
  },
  {
    name: 'Amazon',
    rating: 3.8,
    reviewsCount: '14.2K',
    workLife: 3.9,
    compBenefits: 3.8,
    culture: 3.7,
    badge: 'Trending Choice',
    logo: 'amazon',
  },
];

const WHAT_PROFESSIONALS_SAY = [
  'Great work culture', 'Learning & growth', 'Good WLB', 'Supportive management',
  'High compensation', 'Innovative projects', 'Career growth', 'Flexible work',
  'Inclusive environment', 'Strong brand value', 'Job security', 'Work pressure',
  'Long hours', 'Slow promotions', 'Bureaucracy', 'Toxic culture'
];

const HIGHLIGHT_DATA = {
  'Work Life': {
    score: 4.2,
    percentage: '+8% vs last quarter',
    sparkline: 'M0,45 Q15,10 30,35 T60,20 T90,5 T120,25 T150,12',
    positives: [
      { text: 'Flexible work hours', pct: '28%' },
      { text: 'Good work life balance', pct: '24%' },
      { text: 'Supportive team', pct: '18%' },
    ],
    concerns: [
      { text: 'Long working hours', pct: '32%' },
      { text: 'High work pressure', pct: '26%' },
      { text: 'Weekend expectations', pct: '15%' },
    ],
  },
  'Comp & Benefits': {
    score: 4.4,
    percentage: '+12% vs last quarter',
    sparkline: 'M0,50 Q15,40 30,25 T60,15 T90,20 T120,5 T150,8',
    positives: [
      { text: 'Competitive base salary', pct: '34%' },
      { text: 'Health & wellness coverage', pct: '28%' },
      { text: 'Regular stock vests', pct: '22%' },
    ],
    concerns: [
      { text: 'Slow promotion cycles', pct: '29%' },
      { text: 'Performance bonus variance', pct: '24%' },
      { text: 'Limited cash allowances', pct: '18%' },
    ],
  },
  'Culture': {
    score: 4.3,
    percentage: '+6% vs last quarter',
    sparkline: 'M0,35 Q15,20 30,15 T60,25 T90,10 T120,15 T150,5',
    positives: [
      { text: 'Collaborative teams', pct: '36%' },
      { text: 'Inclusive environment', pct: '30%' },
      { text: 'Strong brand reputation', pct: '24%' },
    ],
    concerns: [
      { text: 'Bureaucratic layers', pct: '30%' },
      { text: 'Political navigation', pct: '25%' },
      { text: 'Communication silos', pct: '19%' },
    ],
  },
  'Career Growth': {
    score: 4.0,
    percentage: '+4% vs last quarter',
    sparkline: 'M0,40 Q15,35 30,42 T60,20 T90,25 T120,10 T150,15',
    positives: [
      { text: 'Clear technical ladder', pct: '26%' },
      { text: 'Mentorship programs', pct: '22%' },
      { text: 'Internal mobility paths', pct: '18%' },
    ],
    concerns: [
      { text: 'Quota limitations on promos', pct: '35%' },
      { text: 'Management bias', pct: '28%' },
      { text: 'Lack of training budget', pct: '20%' },
    ],
  },
};

type HighlightTab = 'Work Life' | 'Comp & Benefits' | 'Culture' | 'Career Growth';

export function ReviewsPageClient({
  initialData,
  distinctRoles,
  companiesList,
  initialFilters,
  initialPage,
  isSubmitOpenInitial,
}: ReviewsPageClientProps) {
  const router = useRouter();

  // State sync from URL parameters
  const [companySearch, setCompanySearch] = useState(initialFilters.company || '');
  const [selectedRole, setSelectedRole] = useState(initialFilters.role || '');
  const [page, setPage] = useState(initialPage);

  const [prevFilters, setPrevFilters] = useState(initialFilters);
  const [prevPage, setPrevPage] = useState(initialPage);

  if (
    initialFilters.company !== prevFilters.company ||
    initialFilters.role !== prevFilters.role ||
    initialPage !== prevPage
  ) {
    setPrevFilters(initialFilters);
    setPrevPage(initialPage);
    setCompanySearch(initialFilters.company || '');
    setSelectedRole(initialFilters.role || '');
    setPage(initialPage);
  }

  // Active Highlight Tab
  const [activeHighlightTab, setActiveHighlightTab] = useState<HighlightTab>('Work Life');

  // Client quick filter tabs for Latest Reviews
  const [selectedQuickCompany, setSelectedQuickCompany] = useState('All');

  // Submission Modal State
  const [isSubmitOpen, setIsSubmitOpen] = useState(isSubmitOpenInitial);
  const [prevIsSubmitOpenInitial, setPrevIsSubmitOpenInitial] = useState(isSubmitOpenInitial);

  if (isSubmitOpenInitial !== prevIsSubmitOpenInitial) {
    setPrevIsSubmitOpenInitial(isSubmitOpenInitial);
    setIsSubmitOpen(isSubmitOpenInitial);
  }

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [formValues, setFormValues] = useState({
    company: '',
    role: '',
    rating: 5,
    workLifeBalance: 5,
    managementQuality: 5,
    growthOpportunities: 5,
    cultureFit: 5,
    title: '',
    pros: '',
    cons: '',
  });

  const syncParams = (
    filters: { company: string; role: string },
    newPage: number,
    submitOpenState = isSubmitOpen
  ) => {
    const params = new URLSearchParams();

    if (filters.company) params.set('company', filters.company);
    if (filters.role) params.set('role', filters.role);
    if (newPage > 1) params.set('page', newPage.toString());
    if (submitOpenState) params.set('submit', 'true');

    router.push(`/reviews?${params.toString()}`);
  };

  const handleCompanySearch = (val: string) => {
    setCompanySearch(val);
    setPage(1);
    syncParams({ company: val, role: selectedRole }, 1);
  };

  const handleRoleChange = (val: string) => {
    setSelectedRole(val);
    setPage(1);
    syncParams({ company: companySearch, role: val }, 1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    syncParams({ company: companySearch, role: selectedRole }, newPage);
  };

  const handleOpenSubmit = () => {
    setIsSubmitOpen(true);
    syncParams({ company: companySearch, role: selectedRole }, page, true);
  };

  const handleCloseSubmit = () => {
    setIsSubmitOpen(false);
    setFormErrors([]);
    setSubmitSuccess(false);
    setFormValues({
      company: '',
      role: '',
      rating: 5,
      workLifeBalance: 5,
      managementQuality: 5,
      growthOpportunities: 5,
      cultureFit: 5,
      title: '',
      pros: '',
      cons: '',
    });
    syncParams({ company: companySearch, role: selectedRole }, page, false);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (name: string, value: number) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors([]);
    setSubmitSuccess(false);

    const errors: string[] = [];
    if (formValues.pros.length < 20) {
      errors.push('Pros must be at least 20 characters long.');
    }
    if (formValues.cons.length < 20) {
      errors.push('Cons must be at least 20 characters long.');
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await fetch('/api/ingest-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formValues,
          company: formValues.company.trim(),
          role: formValues.role.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setFormErrors(data.errors || ['An unexpected error occurred.']);
      } else {
        setSubmitSuccess(true);
        router.refresh();
        setTimeout(() => {
          handleCloseSubmit();
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setFormErrors(['Network error. Please try again.']);
    }
  };

  // Quick filter local reviews
  const filteredReviews = useMemo(() => {
    if (selectedQuickCompany === 'All') {
      return initialData.data;
    }
    return initialData.data.filter(
      (r) => r.companyName.toLowerCase() === selectedQuickCompany.toLowerCase()
    );
  }, [initialData, selectedQuickCompany]);

  const activeFilters = [];
  if (companySearch) {
    activeFilters.push({
      key: 'company',
      label: `Company Slug: "${companySearch}"`,
      value: companySearch,
    });
  }
  if (selectedRole) {
    activeFilters.push({
      key: 'role',
      label: `Role: ${selectedRole}`,
      value: selectedRole,
    });
  }

  const handleRemoveFilter = (key: string) => {
    if (key === 'company') handleCompanySearch('');
    else if (key === 'role') handleRoleChange('');
  };

  const handleClearAllFilters = () => {
    setCompanySearch('');
    setSelectedRole('');
    setPage(1);
    syncParams({ company: '', role: '' }, 1);
  };

  const currentHighlight = HIGHLIGHT_DATA[activeHighlightTab];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      
      {/* 1. Header Section */}
      <div className="bg-white border border-[#EBEBEB] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-start gap-4 text-left">
          <div className="bg-[#FF5A5F]/10 text-[#FF5A5F] p-3.5 rounded-xl flex items-center justify-center h-12 w-12 shrink-0 shadow-xs shadow-[#FF5A5F]/10">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.371 1.24.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.176 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.98 9.72c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF5A5F] bg-[#FF5A5F]/10 px-2.5 py-0.5 rounded-full w-fit">
              Company Reviews
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#222222] tracking-tight mt-1.5 leading-tight">
              Real reviews from real professionals
            </h2>
            <p className="text-xs sm:text-sm text-[#717171] mt-1 font-semibold">
              Discover honest insights about companies, work culture, salaries, and more.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            const el = document.getElementById('reviews-feed');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="text-xs sm:text-sm font-extrabold text-[#FF5A5F] border border-[#FF5A5F] hover:bg-[#FF5A5F]/5 transition-colors px-4 py-2 rounded-xl flex items-center gap-1.5 shrink-0 self-start md:self-auto cursor-pointer"
        >
          Explore all reviews <span>→</span>
        </button>
      </div>

      {/* 2. Top Summary Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { title: '2.4M+ Reviews', desc: 'from verified professionals', color: 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: '💬' },
          { title: '14.7K+ Companies', desc: 'reviewed across industries', color: 'text-violet-600 bg-violet-50 border-violet-100', icon: '🏢' },
          { title: '4.1★ Satisfaction', desc: 'average across all companies', color: 'text-amber-600 bg-amber-50 border-amber-100', icon: '⭐' },
          { title: '96% Verified', desc: 'reviews from real professionals', color: 'text-blue-600 bg-blue-50 border-blue-100', icon: '🛡️' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white border border-[#EBEBEB] rounded-2xl p-5 shadow-3xs flex items-center gap-4 text-left">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-lg border ${item.color} shrink-0 shadow-3xs`}>
              {item.icon}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-extrabold text-[#222222] truncate">{item.title}</span>
              <span className="text-[10px] text-[#717171] font-semibold mt-0.5 truncate">{item.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Mid Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3 width): Top Rated Companies */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex justify-between items-center pb-1">
            <h3 className="text-sm font-black text-[#222222] uppercase tracking-wider">
              Top Rated Companies
            </h3>
            <div className="flex items-center gap-1">
              <button className="h-6 w-6 rounded-full border border-[#EBEBEB] bg-white flex items-center justify-center text-xs text-[#717171] hover:border-[#FF5A5F] hover:text-[#FF5A5F] cursor-pointer">
                ‹
              </button>
              <button className="h-6 w-6 rounded-full border border-[#EBEBEB] bg-white flex items-center justify-center text-xs text-[#717171] hover:border-[#FF5A5F] hover:text-[#FF5A5F] cursor-pointer">
                ›
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TOP_RATED_COMPANIES.map((company, idx) => (
              <div 
                key={idx}
                className="bg-white border border-[#EBEBEB] rounded-2xl p-5 shadow-3xs flex flex-col justify-between text-left hover:border-[#FF5A5F]/30 transition-all group"
              >
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 border border-slate-100 rounded-lg flex items-center justify-center font-bold text-xs bg-slate-50 uppercase text-[#717171] shadow-3xs">
                        {company.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-extrabold text-[#222222] group-hover:text-[#FF5A5F] transition-colors">{company.name}</span>
                        <div className="flex items-center gap-1 text-[10px] text-[#717171] font-bold mt-0.5">
                          <span className="text-[#FF5A5F]">★</span>
                          <span>{company.rating}</span>
                          <span>({company.reviewsCount})</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-4">
                    {[
                      { label: 'Work Life', val: company.workLife },
                      { label: 'Comp & Benefits', val: company.compBenefits },
                      { label: 'Culture', val: company.culture },
                    ].map((row, rIdx) => (
                      <div key={rIdx} className="flex flex-col gap-1 w-full">
                        <div className="flex justify-between text-[10px] font-bold text-[#717171]">
                          <span>{row.label}</span>
                          <span className="text-[#FF5A5F]">{row.val}</span>
                        </div>
                        <div className="w-full bg-[#F2F2F2] h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-[#FF5A5F] h-full rounded-full transition-all"
                            style={{ width: `${(row.val / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-[#F7F7F7] flex justify-between items-center">
                  <span className="text-[9px] font-extrabold text-[#008A05] bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded uppercase tracking-wider">
                    {company.badge}
                  </span>
                  <span className="text-[10px] font-bold text-[#FF5A5F] hover:underline cursor-pointer">
                    Reviews →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (1/3 width): What Professionals Say */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center pb-1">
            <h3 className="text-sm font-black text-[#222222] uppercase tracking-wider">
              What professionals say
            </h3>
            <div className="flex items-center gap-1">
              <button className="h-6 w-6 rounded-full border border-[#EBEBEB] bg-white flex items-center justify-center text-xs text-[#717171] hover:border-[#FF5A5F] hover:text-[#FF5A5F] cursor-pointer">
                ‹
              </button>
              <button className="h-6 w-6 rounded-full border border-[#EBEBEB] bg-white flex items-center justify-center text-xs text-[#717171] hover:border-[#FF5A5F] hover:text-[#FF5A5F] cursor-pointer">
                ›
              </button>
            </div>
          </div>

          <div className="bg-white border border-[#EBEBEB] rounded-2xl p-5 shadow-sm h-fit flex flex-wrap gap-2 text-left">
            {WHAT_PROFESSIONALS_SAY.map((word, wIdx) => {
              const isNegative = ['Work pressure', 'Long hours', 'Slow promotions', 'Bureaucracy', 'Toxic culture'].includes(word);
              return (
                <span
                  key={wIdx}
                  className={`text-[10px] font-extrabold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    isNegative
                      ? 'bg-rose-50 text-rose-600 border-rose-100 hover:border-rose-400'
                      : 'bg-emerald-50/50 text-emerald-700 border-emerald-100/70 hover:border-emerald-400'
                  }`}
                >
                  {isNegative ? '⚠️ ' : '✓ '}
                  {word}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Bottom Grid Section: Feed + Review Highlights */}
      <div id="reviews-feed" className="scroll-mt-20 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3 width): Latest Reviews with Quick Filters */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#EBEBEB] pb-3">
              <h3 className="text-sm font-black text-[#222222] uppercase tracking-wider">
                Latest Reviews
              </h3>
              
              {/* Quick filter tabs */}
              <div className="flex items-center gap-1 border-b border-[#EBEBEB] sm:border-0 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto">
                {['All', 'Google', 'Microsoft', 'Amazon', 'Apple'].map((co) => (
                  <button
                    key={co}
                    onClick={() => setSelectedQuickCompany(co)}
                    className={`text-[11px] font-bold px-3 py-1 border rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                      selectedQuickCompany === co
                        ? 'bg-[#FF5A5F] border-[#FF5A5F] text-white'
                        : 'border-[#EBEBEB] text-[#717171] hover:text-[#222222]'
                    }`}
                  >
                    {co}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Search Filter console */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/60 border border-[#EBEBEB] rounded-xl p-4">
              <SearchInput
                placeholder="Search company slug..."
                value={companySearch}
                onChange={handleCompanySearch}
              />
              <Select
                options={[{ value: '', label: 'All Roles' }, ...distinctRoles.map((r) => ({ value: r, label: r }))]}
                value={selectedRole}
                onChange={(e) => handleRoleChange(e.target.value)}
              />
            </div>
          </div>

          {activeFilters.length > 0 && (
            <FilterBar
              filters={activeFilters}
              onRemove={handleRemoveFilter}
              onClearAll={handleClearAllFilters}
            />
          )}

          {/* Feed List */}
          {filteredReviews.length === 0 ? (
            <EmptyState onReset={handleClearAllFilters} />
          ) : (
            <div className="flex flex-col gap-6">
              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white border border-[#EBEBEB] rounded-2xl p-6 shadow-xs flex flex-col gap-4 text-left"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3">
                      <CompanyLogo name={review.companyName} logoUrl={review.companyLogoUrl} size={40} />
                      <div className="min-w-0 leading-tight">
                        <h4 className="font-extrabold text-[#222222] truncate text-sm">
                          <a
                            href={`/reviews/${review.companySlug}`}
                            className="hover:text-[#FF5A5F] transition-colors"
                          >
                            {review.companyName}
                          </a>
                        </h4>
                        <p className="text-[10px] text-[#717171] font-semibold mt-0.5 truncate">
                          {review.role || 'Anonymous Employee'} •{' '}
                          {new Date(review.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <StarRatingDisplay rating={review.rating || 0} size="sm" />
                      <span className="text-[9px] text-[#717171] uppercase font-black tracking-wider">
                        Rating: {review.rating} / 5
                      </span>
                    </div>
                  </div>

                  {/* Sub-ratings */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 py-1.5 border-y border-[#F2F2F2] text-[10px] font-bold text-[#484848]">
                    <span className="flex items-center gap-1"><span className="text-[#717171]">Work-Life:</span> <span className="text-[#008A05]">{review.workLifeBalance}★</span></span>
                    <span className="flex items-center gap-1"><span className="text-[#717171]">Management:</span> <span className="text-[#008A05]">{review.managementQuality}★</span></span>
                    <span className="flex items-center gap-1"><span className="text-[#717171]">Growth:</span> <span className="text-[#008A05]">{review.growthOpportunities}★</span></span>
                    <span className="flex items-center gap-1"><span className="text-[#717171]">Culture:</span> <span className="text-[#008A05]">{review.cultureFit}★</span></span>
                  </div>

                  {/* Title and Content */}
                  <div>
                    <h5 className="text-sm font-extrabold text-[#222222] mb-2 leading-snug">
                      &ldquo;{review.title}&rdquo;
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      <div className="bg-[#008A05]/5 border border-[#008A05]/10 rounded-xl p-4 flex flex-col gap-1.5">
                        <span className="text-[9px] uppercase font-extrabold text-[#008A05] tracking-wider">
                          ✓ Pros
                        </span>
                        <p className="text-xs text-[#484848] leading-relaxed whitespace-pre-line">
                          {review.pros}
                        </p>
                      </div>

                      <div className="bg-[#D93025]/5 border border-[#D93025]/10 rounded-xl p-4 flex flex-col gap-1.5">
                        <span className="text-[9px] uppercase font-extrabold text-[#D93025] tracking-wider">
                          ✗ Cons
                        </span>
                        <p className="text-xs text-[#484848] leading-relaxed whitespace-pre-line">
                          {review.cons}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Review Ingest CTA Banner */}
          <div className="bg-[#FF5A5F]/5 border border-[#FF5A5F]/15 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 mt-2">
            <div className="flex items-center gap-4 text-left">
              <span className="text-2xl">✍️</span>
              <div>
                <h4 className="text-sm font-extrabold text-[#222222]">Share your experience and help others</h4>
                <p className="text-[11px] text-[#717171] mt-0.5 font-semibold">Your review is 100% anonymous and helps tech professionals evaluate companies.</p>
              </div>
            </div>
            <Button onClick={handleOpenSubmit} className="bg-[#FF5A5F] hover:bg-[#ff4449] shrink-0 text-xs font-bold py-2.5 px-5 cursor-pointer">
              Write a Review
            </Button>
          </div>

          <div className="mt-4">
            <Pagination
              currentPage={page}
              totalPages={initialData.meta.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        {/* Right Column (1/3 width): Review Highlights */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-black text-[#222222] uppercase tracking-wider text-left">
            Review Highlights
          </h3>

          <div className="bg-white border border-[#EBEBEB] rounded-2xl p-5 shadow-sm flex flex-col gap-5 text-left h-fit">
            {/* Tabs */}
            <div className="flex border-b border-[#EBEBEB] overflow-x-auto pb-px scrollbar-none">
              {(['Work Life', 'Comp & Benefits', 'Culture', 'Career Growth'] as HighlightTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveHighlightTab(tab)}
                  className={`text-[10px] font-extrabold pb-2.5 border-b-2 px-2.5 transition-all cursor-pointer whitespace-nowrap ${
                    activeHighlightTab === tab
                      ? 'border-[#FF5A5F] text-[#FF5A5F]'
                      : 'border-transparent text-[#717171] hover:text-[#222222]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content Display */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-[#222222] tracking-tight">
                      {currentHighlight.score.toFixed(1)}
                    </span>
                    <span className="text-xs text-[#717171] font-semibold">/5</span>
                  </div>
                  <span className="text-[9px] uppercase font-black text-[#717171] tracking-wider mt-1.5">
                    Average Score
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <StarRatingDisplay rating={currentHighlight.score} size="sm" />
                  <span className="text-[9px] font-extrabold text-[#008A05] bg-emerald-50 border border-emerald-100 px-1.5 py-0.2 rounded mt-1.5">
                    {currentHighlight.percentage}
                  </span>
                </div>
              </div>

              {/* Sparkline Graph */}
              <div className="h-14 w-full border border-slate-50 bg-[#F9F9F9]/70 rounded-xl p-2 flex items-center justify-center">
                <svg className="h-full w-full" viewBox="0 0 150 60" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="150" y2="20" stroke="#F0F0F0" strokeWidth="0.5" strokeDasharray="3,3" />
                  <line x1="0" y1="40" x2="150" y2="40" stroke="#F0F0F0" strokeWidth="0.5" strokeDasharray="3,3" />
                  
                  {/* Dynamic Path */}
                  <path
                    d={currentHighlight.sparkline}
                    fill="none"
                    stroke="#FF5A5F"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Top Positives */}
              <div className="flex flex-col gap-2">
                <span className="text-[9px] font-black uppercase text-[#008A05] tracking-wider border-b border-[#F7F7F7] pb-1">
                  ✓ Top Positives
                </span>
                <div className="flex flex-col gap-2.5">
                  {currentHighlight.positives.map((pos, pIdx) => (
                    <div key={pIdx} className="flex justify-between items-center text-xs font-semibold text-[#484848]">
                      <span className="truncate flex items-center gap-1.5">
                        <span className="text-[#008A05] text-xs">✓</span>
                        {pos.text}
                      </span>
                      <span className="text-slate-500 font-bold shrink-0">{pos.pct}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Concerns */}
              <div className="flex flex-col gap-2">
                <span className="text-[9px] font-black uppercase text-[#D93025] tracking-wider border-b border-[#F7F7F7] pb-1">
                  ⚠️ Top Concerns
                </span>
                <div className="flex flex-col gap-2.5">
                  {currentHighlight.concerns.map((con, cIdx) => (
                    <div key={cIdx} className="flex justify-between items-center text-xs font-semibold text-[#484848]">
                      <span className="truncate flex items-center gap-1.5">
                        <span className="text-[#D93025] text-xs">⚠️</span>
                        {con.text}
                      </span>
                      <span className="text-slate-500 font-bold shrink-0">{con.pct}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Slide-out Ingestion Drawer */}
      {/* Backdrop */}
      <div 
        onClick={handleCloseSubmit}
        className={`fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity duration-300 z-50 ${
          isSubmitOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`} 
      />

      {/* Drawer Panel */}
      <div 
        className={`fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl border-l border-[#EBEBEB] z-50 flex flex-col h-full transform transition-transform duration-300 ease-in-out ${
          isSubmitOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-[#EBEBEB]">
          <div className="flex flex-col">
            <h2 className="text-base font-extrabold text-[#222222] tracking-tight">Write an Anonymous Review</h2>
            <p className="text-[10px] text-[#717171] font-semibold mt-0.5">Share your experience to help other tech candidates</p>
          </div>
          <button
            type="button"
            onClick={handleCloseSubmit}
            className="text-[#717171] hover:text-[#222222] text-2xl font-light p-1 focus:outline-none cursor-pointer"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {submitSuccess ? (
            <div className="py-12 text-center flex flex-col items-center gap-3">
              <div className="h-14 w-14 rounded-full bg-[#008A05]/10 border border-[#008A05]/20 flex items-center justify-center text-[#008A05] text-2xl font-bold">
                ✓
              </div>
              <h3 className="text-base font-extrabold text-[#222222] mt-2">Review Submitted!</h3>
              <p className="text-xs text-[#717171] font-medium max-w-[240px]">
                Thank you for contributing to compensation transparency. The reviews feed will refresh shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-5 pb-6 text-left">
              {formErrors.length > 0 && (
                <div className="bg-[#D93025]/10 border border-[#D93025]/20 rounded-md p-3.5 text-xs text-[#D93025] font-semibold flex flex-col gap-1">
                  {formErrors.map((err, i) => (
                    <p key={i}>• {err}</p>
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-4">
                <div>
                  <Select
                    label="Company Name"
                    name="company"
                    value={formValues.company}
                    onChange={handleFormChange}
                    options={[
                      { value: '', label: 'Select a company...' },
                      ...companiesList.map((c) => ({ value: c.name, label: c.name })),
                    ]}
                    required
                  />
                </div>

                <div>
                  <Select
                    label="Job Role / Title (Optional)"
                    name="role"
                    value={formValues.role}
                    onChange={handleFormChange}
                    options={[
                      { value: '', label: 'Select a role (optional)...' },
                      ...distinctRoles.map((r) => ({ value: r, label: r })),
                    ]}
                  />
                </div>

                {/* Star Ratings Grid */}
                <div className="border-y border-[#EBEBEB] py-4 flex flex-col gap-3.5">
                  <StarRatingInput
                    label="Overall Rating"
                    rating={formValues.rating}
                    onChange={(val) => handleRatingChange('rating', val)}
                  />
                  <StarRatingInput
                    label="Work-Life Balance"
                    rating={formValues.workLifeBalance}
                    onChange={(val) => handleRatingChange('workLifeBalance', val)}
                  />
                  <StarRatingInput
                    label="Management Quality"
                    rating={formValues.managementQuality}
                    onChange={(val) => handleRatingChange('managementQuality', val)}
                  />
                  <StarRatingInput
                    label="Growth Opportunities"
                    rating={formValues.growthOpportunities}
                    onChange={(val) => handleRatingChange('growthOpportunities', val)}
                  />
                  <StarRatingInput
                    label="Culture Fit"
                    rating={formValues.cultureFit}
                    onChange={(val) => handleRatingChange('cultureFit', val)}
                  />
                </div>

                <div>
                  <Input
                    label="Review Headline"
                    name="title"
                    placeholder="e.g. Great tech culture, but promo is slow"
                    value={formValues.title}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#717171]">
                    Pros
                  </label>
                  <textarea
                    name="pros"
                    rows={3}
                    placeholder="What are the best parts about working here? (Min 20 characters)"
                    value={formValues.pros}
                    onChange={handleFormChange}
                    className="w-full p-3 border border-[#EBEBEB] rounded-md text-sm text-[#222222] bg-white transition-shadow focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]/50 focus:border-[#FF5A5F]"
                    required
                  />
                  <span className="text-[9px] text-right font-semibold text-[#717171] mt-0.5">
                    {formValues.pros.length} / 20 characters minimum
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#717171]">
                    Cons
                  </label>
                  <textarea
                    name="cons"
                    rows={3}
                    placeholder="What are the drawbacks or challenges of working here? (Min 20 characters)"
                    value={formValues.cons}
                    onChange={handleFormChange}
                    className="w-full p-3 border border-[#EBEBEB] rounded-md text-sm text-[#222222] bg-white transition-shadow focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]/50 focus:border-[#FF5A5F]"
                    required
                  />
                  <span className="text-[9px] text-right font-semibold text-[#717171] mt-0.5">
                    {formValues.cons.length} / 20 characters minimum
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[#EBEBEB] flex justify-end gap-3">
                <Button variant="secondary" type="button" onClick={handleCloseSubmit} className="cursor-pointer text-xs py-2 px-4 font-bold">
                  Cancel
                </Button>
                <Button variant="primary" type="submit" className="cursor-pointer text-xs py-2 px-5 font-bold">
                  Submit Review
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
