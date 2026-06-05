'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {

  Button,
  Input,
  SearchInput,
  Select,
  MultiSelect,
  LevelBadge,
  EmptyState,
  CurrencyToggle,
  FilterBar,
  DataTable,
  SalaryCard,
  Pagination,
  CompanyLogo,
} from '@/components/ui';
import { formatCurrency, formatExperience } from '@/lib/formatters';
import type { SalaryForDisplay, PaginatedResponse, SortOption, SalaryFilters } from '@/types';

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
  </svg>
);

const MicrosoftLogo = () => (
  <svg viewBox="0 0 23 23" className="w-5 h-5 shrink-0">
    <rect x="0" y="0" width="11" height="11" fill="#F25022" />
    <rect x="12" y="0" width="11" height="11" fill="#7FBA00" />
    <rect x="0" y="12" width="11" height="11" fill="#00A1F1" />
    <rect x="12" y="12" width="11" height="11" fill="#FFB900" />
  </svg>
);

const MetaLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5.5 h-5.5 shrink-0" fill="#0668E1">
    <path d="M16.75 8c-1.54 0-2.92.83-3.79 2.08-.4-.57-.86-1.07-1.39-1.48C10.61 7.82 9.1 7.3 7.5 7.3c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.6 0 3.11-.52 4.07-1.3 1-.82 1.76-1.97 2.18-3.08.42 1.11 1.18 2.26 2.18 3.08.96.78 2.47 1.3 4.07 1.3 3.59 0 6.5-2.91 6.5-6.5s-2.91-6.5-6.5-6.5zm-9.25 9.7c-2.04 0-3.7-1.66-3.7-3.7s1.66-3.7 3.7-3.7c.95 0 1.83.36 2.47 1.01.65.64 1.03 1.54 1.03 2.7s-.38 2.06-1.03 2.7c-.64.64-1.52 1-2.47 1zm9.25 0c-.95 0-1.83-.36-2.47-1-.65-.65-1.03-1.54-1.03-2.7s.38-2.06 1.03-2.7c.64-.64 1.52-1 2.47-1 2.04 0 3.7 1.66 3.7 3.7s-1.66 3.7-3.7 3.7z"/>
  </svg>
);

const AppleLogo = () => (
  <svg viewBox="0 0 170 170" className="w-5 h-5 shrink-0" fill="#000000">
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.22-9.13-1.78-14.37-6.01-3.43-2.77-7.23-7.39-11.41-13.88-8.58-13.31-15.02-28.85-19.32-46.62-2.93-12.07-4.4-23.77-4.4-35.1 0-16.14 3.82-29.41 11.46-39.79 7.64-10.38 17.2-15.68 28.66-15.89 6.58 0 13.14 1.74 19.67 5.21 6.53 3.48 10.87 5.21 13.02 5.21 2.06 0 6.46-1.8 13.2-5.38 6.74-3.59 13.03-5.27 18.88-5.06 14.16.84 25.13 6.07 32.9 15.68-11.53 6.97-17.18 16.31-16.97 28.02.21 9.49 3.82 17.36 10.82 23.6 7 6.24 15.25 9.77 24.75 10.59-2.72 8.04-6.42 16.03-11.11 23.97zm-20.91-118.73c0 7.82-2.83 14.92-8.5 21.31-5.67 6.4-12.44 10.29-20.31 11.68.21-6.87 2.93-13.88 8.16-21.03 5.23-7.14 12.18-11.45 20.85-12.92.83 1.05 1.25 2.21 1.25 3.48" />
  </svg>
);

const AmazonLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="#000000">
    <path d="M11.72 5.19c-2.48 0-4.7 1.2-4.7 3.96 0 2.21 1.34 3.2 3.1 3.2 1.48 0 2.65-.67 3.32-1.78v1.39h3.06V7.48c0-3.32-1.92-4.57-4.78-4.57zm1.18 5.7c-.32.73-1.04 1.22-1.89 1.22-.96 0-1.58-.62-1.58-1.57 0-1.12.79-1.71 2.26-1.71h1.21v2.06zm-7.6 5.86c-1.88.94-3.5 1.77-3.5 3.35 0 1.22.95 2.05 2.24 2.05 1.74 0 3.3-1.09 4.14-2.22l-1.13-1.18c-.46.54-1 .96-1.75.96-.54 0-.9-.26-.9-.72 0-.68.66-1.03 1.84-1.57l3.68-1.66V13.8l-4.67 1.95zm11.75 3.65c4.7-2.3 8.35-6.68 8.35-11.83v-.6H20.4v.6c0 4.1-2.9 7.63-6.65 9.47l1.3 2.36z" />
    <path d="M1.37 20.83c3.55 1.95 8.1 3.02 12.63 3.02 5.4 0 10.3-1.53 13.9-4.14l-1.55-2.07c-3.17 2.25-7.44 3.56-12.35 3.56-4.06 0-8.1-.96-11.23-2.67l-1.4 2.3z" fill="#FF9900" />
  </svg>
);

interface SalaryPageClientProps {
  initialData: PaginatedResponse<SalaryForDisplay>;
  distinctRoles: string[];
  distinctLocations: string[];
  distinctLevels: string[];
  companiesList: { id: string; name: string; slug: string }[];
  initialFilters: SalaryFilters;
  initialSort: SortOption;
  initialPage: number;
  isSubmitOpenInitial: boolean;
  heatmapMatrix: {
    role: string;
    cells: { formatted: string; cat: string; medianINR: number; currency: string }[];
  }[];
  heatmapLocations: string[];
}

export function SalaryPageClient({
  initialData,
  distinctRoles,
  distinctLocations,
  distinctLevels,
  companiesList,
  initialFilters,
  initialSort,
  initialPage,
  isSubmitOpenInitial,
  heatmapMatrix,
  heatmapLocations,
}: SalaryPageClientProps) {
  const router = useRouter();

  // Filter state
  const [companySearch, setCompanySearch] = useState(initialFilters.company || '');
  const [selectedRole, setSelectedRole] = useState(initialFilters.role || '');
  const [selectedLocation, setSelectedLocation] = useState(initialFilters.location || '');
  const [selectedLevels, setSelectedLevels] = useState<string[]>(initialFilters.level || []);
  const [selectedCurrency, setSelectedCurrency] = useState(initialFilters.currency || '');
  const [sort, setSort] = useState<SortOption>(initialSort);
  const [page, setPage] = useState(initialPage);

  const [heatmapView, setHeatmapView] = useState<'grid' | 'map'>('grid');
  const [hoveredHub, setHoveredHub] = useState<string | null>(null);

  // Saved state for Salaries
  const [savedSalaries, setSavedSalaries] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('saved-salaries');
    if (saved) {
      try {
        setSavedSalaries(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const toggleSaveSalary = (id: string) => {
    setSavedSalaries((prev) => {
      let next;
      if (prev.includes(id)) {
        next = prev.filter((item) => item !== id);
      } else {
        next = [...prev, id];
      }
      localStorage.setItem('saved-salaries', JSON.stringify(next));
      return next;
    });
  };

  const techHubs = [
    { id: 'seattle', name: 'Seattle', country: 'USA', x: 140, y: 80 },
    { id: 'sf', name: 'San Francisco', country: 'USA', x: 130, y: 110 },
    { id: 'london', name: 'London', country: 'UK', x: 390, y: 85 },
    { id: 'mumbai', name: 'Mumbai', country: 'India', x: 550, y: 190 },
    { id: 'hyderabad', name: 'Hyderabad', country: 'India', x: 575, y: 185 },
    { id: 'bengaluru', name: 'Bengaluru', country: 'India', x: 565, y: 210 },
  ];

  // Ingestion Modal State
  const [isSubmitOpen, setIsSubmitOpen] = useState(isSubmitOpenInitial);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [formValues, setFormValues] = useState({
    company: '',
    role: '',
    level: 'SDE_I',
    location: '',
    currency: 'INR',
    experienceYears: '',
    baseSalary: '',
    bonus: '',
    stock: '',
  });

  // Calculate live total compensation for the form
  const base = parseFloat(formValues.baseSalary) || 0;
  const bonus = parseFloat(formValues.bonus) || 0;
  const stock = parseFloat(formValues.stock) || 0;
  const liveTC = base + bonus + stock;

  // Sync states during render if key props change (like when navigating or hitting browser back button)
  const [prevFilters, setPrevFilters] = useState(initialFilters);
  const [prevSort, setPrevSort] = useState(initialSort);
  const [prevPage, setPrevPage] = useState(initialPage);
  const [prevIsSubmitOpenInitial, setPrevIsSubmitOpenInitial] = useState(isSubmitOpenInitial);

  if (
    initialFilters.company !== prevFilters.company ||
    initialFilters.role !== prevFilters.role ||
    initialFilters.location !== prevFilters.location ||
    initialFilters.currency !== prevFilters.currency ||
    JSON.stringify(initialFilters.level) !== JSON.stringify(prevFilters.level) ||
    initialSort !== prevSort ||
    initialPage !== prevPage
  ) {
    setPrevFilters(initialFilters);
    setPrevSort(initialSort);
    setPrevPage(initialPage);
    setCompanySearch(initialFilters.company || '');
    setSelectedRole(initialFilters.role || '');
    setSelectedLocation(initialFilters.location || '');
    setSelectedLevels(initialFilters.level || []);
    setSelectedCurrency(initialFilters.currency || '');
    setSort(initialSort);
    setPage(initialPage);
  }

  if (isSubmitOpenInitial !== prevIsSubmitOpenInitial) {
    setPrevIsSubmitOpenInitial(isSubmitOpenInitial);
    setIsSubmitOpen(isSubmitOpenInitial);
  }

  // Sync state to URL query params
  const syncParams = (
    filters: {
      company: string;
      role: string;
      location: string;
      level: string[];
      currency: string;
    },
    newSort: SortOption,
    newPage: number,
    submitOpenState = isSubmitOpen
  ) => {
    const params = new URLSearchParams();

    if (filters.company) params.set('company', filters.company);
    if (filters.role) params.set('role', filters.role);
    if (filters.location) params.set('location', filters.location);
    if (filters.level && filters.level.length > 0) {
      filters.level.forEach((l) => params.append('level', l));
    }
    if (filters.currency) params.set('currency', filters.currency);
    
    if (newSort !== 'total_comp_desc') params.set('sort', newSort);
    if (newPage > 1) params.set('page', newPage.toString());
    if (submitOpenState) params.set('submit', 'true');

    router.push(`/salaries?${params.toString()}`);
  };

  const handleCompanySearch = (val: string) => {
    setCompanySearch(val);
    setPage(1);
    syncParams(
      {
        company: val,
        role: selectedRole,
        location: selectedLocation,
        level: selectedLevels,
        currency: selectedCurrency,
      },
      sort,
      1
    );
  };

  const handleRoleChange = (val: string) => {
    setSelectedRole(val);
    setPage(1);
    syncParams(
      {
        company: companySearch,
        role: val,
        location: selectedLocation,
        level: selectedLevels,
        currency: selectedCurrency,
      },
      sort,
      1
    );
  };

  const handleLocationChange = (val: string) => {
    setSelectedLocation(val);
    setPage(1);
    syncParams(
      {
        company: companySearch,
        role: selectedRole,
        location: val,
        level: selectedLevels,
        currency: selectedCurrency,
      },
      sort,
      1
    );
  };

  const handleLevelsChange = (val: string[]) => {
    setSelectedLevels(val);
    setPage(1);
    syncParams(
      {
        company: companySearch,
        role: selectedRole,
        location: selectedLocation,
        level: val,
        currency: selectedCurrency,
      },
      sort,
      1
    );
  };

  const handleCurrencyChange = (val: string) => {
    setSelectedCurrency(val);
    setPage(1);
    syncParams(
      {
        company: companySearch,
        role: selectedRole,
        location: selectedLocation,
        level: selectedLevels,
        currency: val,
      },
      sort,
      1
    );
  };

  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort);
    syncParams(
      {
        company: companySearch,
        role: selectedRole,
        location: selectedLocation,
        level: selectedLevels,
        currency: selectedCurrency,
      },
      newSort,
      page
    );
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    syncParams(
      {
        company: companySearch,
        role: selectedRole,
        location: selectedLocation,
        level: selectedLevels,
        currency: selectedCurrency,
      },
      sort,
      newPage
    );
  };

  const handleOpenSubmit = () => {
    setIsSubmitOpen(true);
    syncParams(
      {
        company: companySearch,
        role: selectedRole,
        location: selectedLocation,
        level: selectedLevels,
        currency: selectedCurrency,
      },
      sort,
      page,
      true
    );
  };

  const handleCloseSubmit = () => {
    setIsSubmitOpen(false);
    setFormErrors([]);
    setSubmitSuccess(false);
    setFormValues({
      company: '',
      role: '',
      level: 'SDE_I',
      location: '',
      currency: 'INR',
      experienceYears: '',
      baseSalary: '',
      bonus: '',
      stock: '',
    });
    syncParams(
      {
        company: companySearch,
        role: selectedRole,
        location: selectedLocation,
        level: selectedLevels,
        currency: selectedCurrency,
      },
      sort,
      page,
      false
    );
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors([]);
    setSubmitSuccess(false);

    // Pre-validate location on client to align with city-only rule
    if (formValues.location.includes(',')) {
      setFormErrors(['Location must be city only (e.g. "Bengaluru" instead of "Bengaluru, India")']);
      return;
    }

    const payload = {
      company: formValues.company.trim(),
      role: formValues.role.trim(),
      level: formValues.level,
      location: formValues.location.trim(),
      currency: formValues.currency,
      experienceYears: parseInt(formValues.experienceYears, 10),
      baseSalary: parseFloat(formValues.baseSalary),
      bonus: formValues.bonus ? parseFloat(formValues.bonus) : 0,
      stock: formValues.stock ? parseFloat(formValues.stock) : 0,
    };

    try {
      const response = await fetch('/api/ingest-salary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setFormErrors(data.errors || ['An unexpected error occurred']);
      } else {
        setSubmitSuccess(true);
        // Trigger a data reload
        router.refresh();
        setTimeout(() => {
          handleCloseSubmit();
        }, 1500);
      }
    } catch (error) {
      console.error(error);
      setFormErrors(['Network error. Please try again.']);
    }
  };

  // Build list of active filters for FilterBar
  const activeFilters = [];
  if (companySearch) activeFilters.push({ key: 'company', label: `Search: "${companySearch}"`, value: companySearch });
  if (selectedRole) activeFilters.push({ key: 'role', label: `Role: ${selectedRole}`, value: selectedRole });
  if (selectedLocation) activeFilters.push({ key: 'location', label: `Location: ${selectedLocation}`, value: selectedLocation });
  if (selectedCurrency) activeFilters.push({ key: 'currency', label: `Currency: ${selectedCurrency}`, value: selectedCurrency });
  selectedLevels.forEach((lvl) => {
    activeFilters.push({ key: `level-${lvl}`, label: `Level: ${lvl}`, value: lvl });
  });

  const handleRemoveFilter = (key: string) => {
    if (key === 'company') handleCompanySearch('');
    else if (key === 'role') handleRoleChange('');
    else if (key === 'location') handleLocationChange('');
    else if (key === 'currency') handleCurrencyChange('');
    else if (key.startsWith('level-')) {
      const lvl = key.replace('level-', '');
      handleLevelsChange(selectedLevels.filter((l) => l !== lvl));
    }
  };

  const handleClearAllFilters = () => {
    setCompanySearch('');
    setSelectedRole('');
    setSelectedLocation('');
    setSelectedLevels([]);
    setSelectedCurrency('');
    setPage(1);
    syncParams({ company: '', role: '', location: '', level: [], currency: '' }, sort, 1);
  };

  // Define columns for DataTable (Desktop)
  const columns = [
    {
      key: 'companyName',
      header: 'Company',
      render: (salary: SalaryForDisplay) => (
        <div className="flex items-center gap-3">
          <CompanyLogo name={salary.companyName} logoUrl={salary.companyLogoUrl} size={32} />
          <div className="font-bold text-[#222222]">
            <a href={`/companies/${salary.companySlug}`} className="hover:text-[#FF5A5F] transition-colors">
              {salary.companyName}
            </a>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (salary: SalaryForDisplay) => (
        <span className="font-medium text-[#222222]">{salary.role}</span>
      ),
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
      key: 'totalCompensation',
      header: 'Total Comp',
      sortable: true,
      align: 'right' as const,
      render: (salary: SalaryForDisplay) => (
        <span className="text-[#FF5A5F] font-bold">
          {formatCurrency(salary.totalCompensation, salary.currency)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right' as const,
      render: (salary: SalaryForDisplay) => {
        const isSaved = savedSalaries.includes(salary.id);
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveSalary(salary.id);
            }}
            className={`cursor-pointer hover:scale-110 transition-transform text-sm leading-none ${
              isSaved ? 'text-[#FF5A5F]' : 'text-slate-300 hover:text-[#FF5A5F]'
            }`}
            title={isSaved ? 'Unsave salary' : 'Save salary'}
          >
            {isSaved ? '❤️' : '🤍'}
          </button>
        );
      },
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-10">
      
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-black text-[#222222] tracking-tight">Salaries</h1>
      </div>

      {/* 1. Salaries Dashboard Header Card */}
      <div className="bg-white border border-[#EBEBEB] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-start gap-4">
          <div className="bg-[#FF5A5F]/10 text-[#FF5A5F] p-3.5 rounded-xl flex items-center justify-center h-12 w-12 shrink-0 shadow-xs shadow-[#FF5A5F]/10">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF5A5F] bg-[#FF5A5F]/10 px-2.5 py-0.5 rounded-full w-fit">
              Salaries
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#222222] tracking-tight mt-1.5 leading-tight">
              Real salary insights. Real career growth.
            </h2>
            <p className="text-xs sm:text-sm text-[#717171] mt-1 font-semibold">
              Explore verified compensation data from professionals around the world.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            const el = document.getElementById('search-grid');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="text-xs sm:text-sm font-extrabold text-[#FF5A5F] border border-[#FF5A5F] hover:bg-[#FF5A5F]/5 transition-colors px-4 py-2 rounded-xl flex items-center gap-1.5 shrink-0 self-start md:self-auto cursor-pointer"
        >
          Explore all salaries <span>→</span>
        </button>
      </div>

      {/* 1.5. Five Statistics Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {/* Card 1 */}
        <div className="bg-white border border-[#EBEBEB] rounded-xl p-4 flex items-center gap-3.5 shadow-2xs">
          <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-lg shrink-0">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p className="text-base font-black text-[#222222]">12.8M+</p>
            <p className="text-[10px] text-[#717171] leading-tight font-semibold mt-0.5">Salary data points</p>
            <p className="text-[9px] font-extrabold text-emerald-600 mt-0.5">Updated daily</p>
          </div>
        </div>
        
        {/* Card 2 */}
        <div className="bg-white border border-[#EBEBEB] rounded-xl p-4 flex items-center gap-3.5 shadow-2xs">
          <div className="bg-[#FF5A5F]/10 text-[#FF5A5F] p-2.5 rounded-lg shrink-0">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <p className="text-base font-black text-[#222222]">35K+</p>
            <p className="text-[10px] text-[#717171] leading-tight font-semibold mt-0.5">Companies</p>
            <p className="text-[9px] font-extrabold text-[#717171] mt-0.5">Across 50+ countries</p>
          </div>
        </div>
        
        {/* Card 3 */}
        <div className="bg-white border border-[#EBEBEB] rounded-xl p-4 flex items-center gap-3.5 shadow-2xs">
          <div className="bg-blue-50 text-blue-600 p-2.5 rounded-lg shrink-0">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-base font-black text-[#222222]">900+</p>
            <p className="text-[10px] text-[#717171] leading-tight font-semibold mt-0.5">Job titles</p>
            <p className="text-[9px] font-extrabold text-[#717171] mt-0.5">From entry to executive</p>
          </div>
        </div>
        
        {/* Card 4 */}
        <div className="bg-white border border-[#EBEBEB] rounded-xl p-4 flex items-center gap-3.5 shadow-2xs">
          <div className="bg-orange-50 text-orange-600 p-2.5 rounded-lg shrink-0">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <p className="text-base font-black text-[#222222]">18%</p>
            <p className="text-[10px] text-[#717171] leading-tight font-semibold mt-0.5">YoY salary growth</p>
            <p className="text-[9px] font-extrabold text-[#FF5A5F] mt-0.5">For tech roles globally</p>
          </div>
        </div>
        
        {/* Card 5 */}
        <div className="bg-white border border-[#EBEBEB] rounded-xl p-4 flex items-center gap-3.5 shadow-2xs">
          <div className="bg-green-50 text-green-600 p-2.5 rounded-lg shrink-0">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <p className="text-base font-black text-[#222222]">100%</p>
            <p className="text-[10px] text-[#717171] leading-tight font-semibold mt-0.5">Verified & anonymous</p>
            <p className="text-[9px] font-extrabold text-green-600 mt-0.5">Real professionals only</p>
          </div>
        </div>
      </div>

      {/* 2. Middle Row: Top paying companies & Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top paying companies */}
        <div className="bg-white border border-[#EBEBEB] rounded-2xl p-6 shadow-sm flex flex-col justify-between group hover:border-[#FF5A5F]/40 transition-colors">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-extrabold text-[#222222]">Top paying companies</h3>
              <button
                onClick={() => {
                  const el = document.getElementById('search-grid');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs font-bold text-[#FF5A5F] hover:text-[#ff4449]"
              >
                View all companies →
              </button>
            </div>
            
            <div className="relative flex items-center mt-3">
              {/* Carousel Navigation Left */}
              <button className="absolute -left-3.5 z-10 bg-white border border-[#EBEBEB] hover:border-[#FF5A5F] hover:text-[#FF5A5F] shadow-xs w-8 h-8 rounded-full flex items-center justify-center text-slate-400 cursor-pointer select-none transition-colors">
                <span className="text-sm font-black">‹</span>
              </button>
              
              <div className="grid grid-cols-5 gap-2.5 w-full px-4">
                {[
                  { name: 'Google', lpa: '$186K', logo: <GoogleLogo />, pct: '19%' },
                  { name: 'Microsoft', lpa: '$167K', logo: <MicrosoftLogo />, pct: '16%' },
                  { name: 'Meta', lpa: '$165K', logo: <MetaLogo />, pct: '16%' },
                  { name: 'Apple', lpa: '$164K', logo: <AppleLogo />, pct: '18%' },
                  { name: 'Amazon', lpa: '$146K', logo: <AmazonLogo />, pct: '15%' },
                ].map((co, idx) => (
                  <div key={idx} className="bg-white border border-[#EBEBEB] rounded-xl p-3 flex flex-col items-center justify-between gap-3 text-center h-34 shadow-3xs hover:border-[#FF5A5F]/35 transition-colors">
                    <div className="h-7 w-7 flex items-center justify-center shrink-0">
                      {co.logo}
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold text-[#222222] truncate w-full">{co.name}</p>
                      <p className="text-xs font-black text-[#FF5A5F] mt-0.5">{co.lpa}</p>
                      <p className="text-[9px] font-semibold text-[#717171] leading-none mt-0.5">Avg. total comp</p>
                    </div>
                    <span className="text-[8px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full leading-none flex items-center gap-0.5">
                      ▲ {co.pct} <span className="text-[6px] text-[#717171] font-semibold">YoY</span>
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Carousel Navigation Right */}
              <button className="absolute -right-3.5 z-10 bg-white border border-[#EBEBEB] hover:border-[#FF5A5F] hover:text-[#FF5A5F] shadow-xs w-8 h-8 rounded-full flex items-center justify-center text-slate-400 cursor-pointer select-none transition-colors">
                <span className="text-sm font-black">›</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-4 border-t border-[#EBEBEB] pt-4 mt-6 text-[9px] font-bold text-[#717171]">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-[#FF5A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Includes base, bonus, stocks & benefits
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-[#FF5A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622" />
              </svg>
              Salaries updated daily from verified professionals
            </span>
          </div>
        </div>

        {/* Salary Heatmap */}
        <div className="bg-white border border-[#EBEBEB] rounded-2xl p-6 shadow-sm flex flex-col justify-between group hover:border-[#FF5A5F]/40 transition-colors">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-extrabold text-[#222222]">Salary heatmap & hubs map</h3>
              <div className="flex bg-[#F7F7F7] border border-[#EBEBEB] p-0.5 rounded-lg">
                <button
                  onClick={() => setHeatmapView('grid')}
                  className={`text-[10px] font-extrabold px-3 py-1 rounded-md transition-all cursor-pointer ${
                    heatmapView === 'grid'
                      ? 'bg-white text-[#FF5A5F] shadow-3xs'
                      : 'text-[#717171] hover:text-[#222222]'
                  }`}
                >
                  Grid View
                </button>
                <button
                  onClick={() => setHeatmapView('map')}
                  className={`text-[10px] font-extrabold px-3 py-1 rounded-md transition-all cursor-pointer ${
                    heatmapView === 'map'
                      ? 'bg-white text-[#FF5A5F] shadow-3xs'
                      : 'text-[#717171] hover:text-[#222222]'
                  }`}
                >
                  Map View
                </button>
              </div>
            </div>
            
            {heatmapView === 'grid' ? (
              /* Heatmap Grid */
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#EBEBEB]">
                      <th className="py-2 text-[10px] font-extrabold text-[#717171] uppercase tracking-wider">Role</th>
                      {heatmapLocations.map((loc) => (
                        <th key={loc} className="py-2 text-[9px] font-bold text-[#717171] text-center">
                          {loc}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EBEBEB]/60">
                    {heatmapMatrix.map((row) => (
                      <tr key={row.role}>
                        <td className="py-2.5 text-xs font-bold text-[#484848] truncate max-w-[100px]">{row.role}</td>
                        {row.cells.map((cell, cIdx) => {
                          let bgClass = '';
                          if (cell.cat === 'h') bgClass = 'bg-[#137333] text-white font-black';
                          else if (cell.cat === 'm') bgClass = 'bg-[#1e8e3e] text-white font-black';
                          else if (cell.cat === 'l-g') bgClass = 'bg-[#81c995] text-[#137333] font-black';
                          else if (cell.cat === 'y') bgClass = 'bg-[#fdd663] text-[#b06000] font-black';
                          else if (cell.cat === 'o') bgClass = 'bg-[#ffb74d] text-[#b06000] font-black';
                          else bgClass = 'bg-[#f28b82] text-[#c5221f] font-black';
                          
                          return (
                            <td key={cIdx} className="py-1 px-0.5 text-center">
                              <div className={`text-[10px] py-1 px-1 rounded-md mx-auto w-12 flex items-center justify-center ${bgClass} shadow-3xs`}>
                                {cell.formatted}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* SVG Hubs Map */
              <div className="relative w-full h-[250px] bg-slate-50/50 border border-[#EBEBEB] rounded-xl overflow-hidden mt-3 flex items-center justify-center">
                <svg viewBox="0 0 800 320" className="w-full h-full text-slate-100">
                  {/* Continental paths */}
                  <path d="M 80 40 L 190 30 L 220 80 L 160 160 L 100 130 L 60 70 Z" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="1" />
                  <path d="M 160 160 L 200 190 L 180 320 L 150 240 Z" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="1" />
                  <path d="M 320 50 L 760 50 L 750 220 L 600 220 L 560 160 L 450 160 L 320 120 Z" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="1" />
                  <path d="M 540 160 L 590 160 L 565 210 Z" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="1" />
                  <path d="M 330 130 L 440 140 L 460 210 L 410 290 L 360 210 Z" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="1" />
                  <path d="M 680 230 L 750 230 L 730 290 L 670 280 Z" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="1" />

                  {/* Dotted Connections */}
                  <g stroke="#FF5A5F" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6">
                    <path d="M 140 80 Q 265 40 390 85" fill="none" />
                    <path d="M 130 110 Q 260 50 390 85" fill="none" />
                    <path d="M 390 85 Q 480 150 565 210" fill="none" />
                    <path d="M 130 110 Q 350 220 565 210" fill="none" />
                  </g>

                  {/* Pulsing Nodes */}
                  {techHubs.map((hub) => (
                    <g key={hub.id}>
                      <circle cx={hub.x} cy={hub.y} r="8" className="fill-[#FF5A5F]/20 animate-ping" />
                      <circle cx={hub.x} cy={hub.y} r="4.5" className="fill-[#FF5A5F] stroke-white stroke-2 shadow-sm" />
                      <circle
                        cx={hub.x}
                        cy={hub.y}
                        r="16"
                        className="fill-transparent cursor-pointer"
                        onMouseEnter={() => setHoveredHub(hub.id)}
                        onMouseLeave={() => setHoveredHub(null)}
                        onClick={() => handleLocationChange(hub.name)}
                      />
                    </g>
                  ))}
                </svg>

                {/* Tooltip Overlay */}
                {hoveredHub && (() => {
                  const hub = techHubs.find((h) => h.id === hoveredHub);
                  if (!hub) return null;
                  
                  const locIndex = heatmapLocations.findIndex((l) => l.toLowerCase() === hub.name.toLowerCase());
                  
                  return (
                    <div 
                      className="absolute bg-white border border-[#EBEBEB] rounded-xl p-3 shadow-xl z-20 pointer-events-none min-w-[190px]"
                      style={{
                        left: `${(hub.x / 800) * 100}%`,
                        top: `${(hub.y / 320) * 100}%`,
                        transform: 'translate(-50%, -108%)',
                      }}
                    >
                      <div className="flex justify-between items-start mb-1.5 pb-1 border-b border-[#EBEBEB]">
                        <div>
                          <h4 className="text-[11px] font-black text-[#222222]">{hub.name}</h4>
                          <span className="text-[8px] text-[#717171] font-bold">{hub.country}</span>
                        </div>
                        <span className="text-[8px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Tech Hub
                        </span>
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        {heatmapMatrix.map((row) => {
                          const cell = locIndex !== -1 ? row.cells[locIndex] : null;
                          if (!cell) return null;
                          return (
                            <div key={row.role} className="flex justify-between items-center text-[9px]">
                              <span className="text-[#717171] font-medium truncate max-w-[110px]">{row.role}</span>
                              <span className="font-extrabold text-[#FF5A5F]">{cell.formatted}</span>
                            </div>
                          );
                        })}
                      </div>
                      
                      <p className="text-[7px] text-[#717171] mt-1.5 italic text-center">Click hub to filter database</p>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between border-t border-[#EBEBEB] pt-3 mt-4 text-[9px] font-bold text-[#717171]">
            <div className="flex items-center gap-1.5">
              <span>Highest</span>
              <div className="flex h-2.5 w-24 rounded overflow-hidden border border-[#EBEBEB]">
                <div className="bg-[#137333] flex-1" />
                <div className="bg-[#1e8e3e] flex-1" />
                <div className="bg-[#81c995] flex-1" />
                <div className="bg-[#fdd663] flex-1" />
                <div className="bg-[#ffb74d] flex-1" />
                <div className="bg-[#f28b82] flex-1" />
              </div>
              <span>Lowest</span>
            </div>
            <span>Interactive map with hover data</span>
          </div>
        </div>

      </div>

      {/* 3. Bottom Row: Top Roles, Salary by Experience, Explore By */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Col 1: Top roles */}
        <div className="bg-white border border-[#EBEBEB] rounded-2xl p-6 shadow-sm flex flex-col justify-between group hover:border-[#FF5A5F]/40 transition-colors">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-extrabold text-[#222222]">Top roles by median total compensation</h3>
              <button
                onClick={() => {
                  const el = document.getElementById('search-grid');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs font-bold text-[#FF5A5F] hover:text-[#ff4449]"
              >
                View all roles →
              </button>
            </div>
            
            <div className="flex flex-col gap-3.5 mt-2 w-full">
              {[
                {
                  role: 'Software Engineer',
                  comp: '$124K',
                  yoy: '+ 18%',
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  ),
                  iconBg: 'bg-violet-50 text-violet-600',
                  path: 'M0 15 Q 12 5, 25 12 T 50 2',
                },
                {
                  role: 'Product Manager',
                  comp: '$142K',
                  yoy: '+ 15%',
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  ),
                  iconBg: 'bg-blue-50 text-blue-600',
                  path: 'M0 18 Q 15 12, 28 8 T 50 4',
                },
                {
                  role: 'Data Scientist',
                  comp: '$115K',
                  yoy: '+ 20%',
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  ),
                  iconBg: 'bg-emerald-50 text-emerald-600',
                  path: 'M0 12 Q 10 18, 25 10 T 50 3',
                },
                {
                  role: 'Marketing Manager',
                  comp: '$92K',
                  yoy: '+ 11%',
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                  ),
                  iconBg: 'bg-rose-50 text-rose-600',
                  path: 'M0 16 Q 14 6, 25 15 T 50 6',
                },
                {
                  role: 'Design Manager',
                  comp: '$98K',
                  yoy: '+ 10%',
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  ),
                  iconBg: 'bg-indigo-50 text-indigo-600',
                  path: 'M0 14 Q 12 8, 26 12 T 50 5',
                },
              ].map((role, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs w-full py-1.5 border-b border-[#F7F7F7] last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`${role.iconBg} p-2 rounded-lg flex items-center justify-center shrink-0 shadow-3xs`}>
                      {role.icon}
                    </div>
                    <div>
                      <p className="font-extrabold text-[#222222] leading-tight">{role.role}</p>
                      <p className="text-[9px] text-[#717171] font-semibold leading-none mt-0.5">Median total comp</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <p className="font-black text-[#222222]">{role.comp}</p>
                      <p className="text-[9px] text-emerald-600 font-extrabold leading-none mt-0.5">{role.yoy} YoY</p>
                    </div>
                    <svg className="w-12 h-5 text-emerald-500 shrink-0" viewBox="0 0 50 20" fill="none">
                      <path d={role.path} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button
            onClick={() => {
              const el = document.getElementById('search-grid');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-[11px] font-extrabold text-[#FF5A5F] hover:text-[#ff4449] mt-6 self-center cursor-pointer select-none"
          >
            View all roles & salary trends →
          </button>
        </div>

        {/* Col 2: Salary by experience */}
        <div className="bg-white border border-[#EBEBEB] rounded-2xl p-6 shadow-sm flex flex-col justify-between group hover:border-[#FF5A5F]/40 transition-colors">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-extrabold text-[#222222]">Salary by experience (All roles)</h3>
              <button
                onClick={() => {
                  const el = document.getElementById('search-grid');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs font-bold text-[#FF5A5F] hover:text-[#ff4449]"
              >
                View all insights →
              </button>
            </div>
            
            <div className="flex flex-col gap-4 mt-2 w-full">
              {[
                { label: '0–1 year', comp: '$71K', pct: '35%' },
                { label: '1–3 years', comp: '$98K', pct: '50%' },
                { label: '3–5 years', comp: '$128K', pct: '65%' },
                { label: '5–8 years', comp: '$156K', pct: '80%' },
                { label: '8+ years', comp: '$193K', pct: '100%' },
              ].map((exp, idx) => (
                <div key={idx} className="flex flex-col gap-1.5 w-full">
                  <div className="flex justify-between items-center text-[10px] font-bold text-[#484848] leading-none">
                    <span>{exp.label}</span>
                    <span className="text-[#222222] font-black">{exp.comp}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#FF5A5F] to-[#ff8084] h-full rounded-full transition-all"
                      style={{ width: exp.pct }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-[#FF5A5F]/5 border border-[#FF5A5F]/15 rounded-xl p-3 flex items-start gap-2.5 mt-6">
            <div className="bg-[#FF5A5F]/10 text-[#FF5A5F] p-1.5 rounded-lg shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-[10px] text-[#717171] leading-normal font-semibold">
              Professionals with <strong className="text-[#222222]">5+ years of experience</strong> earn <strong className="text-[#222222]">2.2x</strong> more than those just starting out.
            </p>
          </div>
        </div>

        {/* Col 3: Explore salaries by */}
        <div className="bg-white border border-[#EBEBEB] rounded-2xl p-6 shadow-sm flex flex-col justify-between group hover:border-[#FF5A5F]/40 transition-colors">
          <div className="flex flex-col gap-3">
            <h3 className="text-base font-extrabold text-[#222222]">Explore salaries by</h3>
            
            <div className="grid grid-cols-2 gap-3 mt-2">
              {[
                {
                  title: 'Role',
                  sub: '900+ job titles',
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  ),
                  iconClass: 'bg-emerald-50 text-emerald-600',
                },
                {
                  title: 'Company',
                  sub: '35K+ companies',
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  ),
                  iconClass: 'bg-blue-50 text-blue-600',
                },
                {
                  title: 'Location',
                  sub: '50+ cities',
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ),
                  iconClass: 'bg-violet-50 text-violet-600',
                },
                {
                  title: 'Experience',
                  sub: '5 levels',
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  ),
                  iconClass: 'bg-orange-50 text-orange-600',
                },
                {
                  title: 'Industry',
                  sub: '20+ fields',
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  ),
                  iconClass: 'bg-teal-50 text-teal-600',
                },
                {
                  title: 'Compare',
                  sub: 'Compare offers',
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  ),
                  iconClass: 'bg-[#FF5A5F]/10 text-[#FF5A5F]',
                },
              ].map((item, idx) => {
                const isCompare = item.title === 'Compare';
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (isCompare) {
                        router.push('/compare');
                      } else {
                        const el = document.getElementById('search-grid');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="bg-slate-50 border border-[#EBEBEB] hover:border-[#FF5A5F]/30 hover:bg-slate-50 rounded-xl p-3 flex items-center gap-2.5 text-left transition-colors cursor-pointer select-none"
                  >
                    <div className={`${item.iconClass} p-2 rounded-lg flex items-center justify-center shrink-0 shadow-3xs`}>
                      {item.icon}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-[#222222] leading-tight truncate">{item.title}</p>
                      <p className="text-[9px] text-[#717171] font-semibold truncate leading-none mt-1">{item.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="text-[10px] text-[#717171] font-semibold leading-relaxed border-t border-[#EBEBEB] pt-4 mt-6">
            Search or filter below to find specific roles or location guidelines.
          </div>
        </div>

      </div>

      {/* 4. Submission & Invite Banner */}
      <div className="bg-[#FF5A5F]/5 border border-[#FF5A5F]/15 rounded-2xl p-6 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-left">
          <div className="h-12 w-12 rounded-xl bg-[#FF5A5F]/10 text-[#FF5A5F] flex items-center justify-center shrink-0 shadow-3xs">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h4 className="text-base font-extrabold text-[#222222]">Add your salary & unlock all insights</h4>
            <p className="text-xs text-[#717171] mt-0.5 font-medium">Help thousands of professionals by sharing your salary anonymously.</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto">
          <Button onClick={handleOpenSubmit} className="bg-[#FF5A5F] hover:bg-[#ff4449] w-full sm:w-auto px-6 py-2.5 text-xs cursor-pointer font-bold rounded-xl transition-all shadow-sm shadow-[#FF5A5F]/10">
            Add your salary
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5 overflow-hidden">
              <div className="inline-block h-6.5 w-6.5 rounded-full ring-2 ring-white bg-gradient-to-tr from-amber-400 to-rose-400 flex items-center justify-center text-[9px] font-bold text-white shadow-2xs">AS</div>
              <div className="inline-block h-6.5 w-6.5 rounded-full ring-2 ring-white bg-gradient-to-tr from-blue-400 to-indigo-500 flex items-center justify-center text-[9px] font-bold text-white shadow-2xs">KM</div>
              <div className="inline-block h-6.5 w-6.5 rounded-full ring-2 ring-white bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-[9px] font-bold text-white shadow-2xs">NT</div>
            </div>
            <span className="text-[10px] font-bold text-[#717171] whitespace-nowrap">Join 85K+ professionals contributing data</span>
          </div>
        </div>
      </div>

      {/* 5. Core Search Table & filters grid */}
      <div id="search-grid" className="flex flex-col gap-6 scroll-mt-20">
        
        {/* Header section with CTA */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#EBEBEB] pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-[#222222] tracking-tight">Software Engineering Salary Database</h2>
            <p className="text-xs text-[#717171] mt-0.5">Filter the crowdsourced table to find matching entries by company, level, and location.</p>
          </div>
          <Button onClick={handleOpenSubmit} variant="secondary" className="shadow-xs text-xs">
            Submit Another Salary
          </Button>
        </div>

        {/* Filter panel */}
        <div className="bg-white border border-[#EBEBEB] rounded-lg p-5 shadow-sm flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <SearchInput
              placeholder="Search company..."
              value={companySearch}
              onChange={handleCompanySearch}
            />

            <Select
              options={[{ value: '', label: 'All Roles' }, ...distinctRoles.map(r => ({ value: r, label: r }))]}
              value={selectedRole}
              onChange={(e) => handleRoleChange(e.target.value)}
            />

            <Select
              options={[{ value: '', label: 'All Locations' }, ...distinctLocations.map(l => ({ value: l, label: l }))]}
              value={selectedLocation}
              onChange={(e) => handleLocationChange(e.target.value)}
            />

            <MultiSelect
              options={distinctLevels.map(lvl => ({ value: lvl, label: lvl }))}
              selected={selectedLevels}
              onChange={handleLevelsChange}
              placeholder="All Levels"
            />
          </div>

          <div className="border-t border-[#EBEBEB] pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#717171]">Currency:</span>
              <CurrencyToggle selected={selectedCurrency} onChange={handleCurrencyChange} />
            </div>

            <div className="text-xs text-[#717171]">
              Showing <span className="font-bold text-[#222222]">{initialData.meta.total}</span> records
            </div>
          </div>
        </div>

        {/* Active Filter Bar */}
        <FilterBar
          filters={activeFilters}
          onRemove={handleRemoveFilter}
          onClearAll={handleClearAllFilters}
        />

        {/* Results Display */}
        {initialData.data.length === 0 ? (
          <EmptyState onReset={handleClearAllFilters} />
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <DataTable
                columns={columns}
                data={initialData.data}
                currentSort={sort}
                onSort={handleSortChange}
              />
            </div>

            {/* Mobile Card List View */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {initialData.data.map((salary) => (
                <SalaryCard
                  key={salary.id}
                  salary={salary}
                  isSaved={savedSalaries.includes(salary.id)}
                  onToggleSave={() => toggleSaveSalary(salary.id)}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={page}
              totalPages={initialData.meta.totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
        
      </div>

      {/* Slide-out Contribution Drawer */}
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
            <h2 className="text-base font-extrabold text-[#222222] tracking-tight">Submit Compensation Record</h2>
            <p className="text-[10px] text-[#717171] font-semibold mt-0.5">Help others by sharing your anonymous package details</p>
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
              <h3 className="text-base font-extrabold text-[#222222] mt-2">Submission Successful!</h3>
              <p className="text-xs text-[#717171] font-medium max-w-[240px]">
                Thank you for contributing to compensation transparency. The salary index will refresh shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-5 pb-6">
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
                    label="Job Role / Title"
                    name="role"
                    value={formValues.role}
                    onChange={handleFormChange}
                    options={[
                      { value: '', label: 'Select a role...' },
                      ...distinctRoles.map((r) => ({ value: r, label: r })),
                    ]}
                    required
                  />
                </div>

                <div>
                  <Select
                    label="Standardized Level"
                    name="level"
                    value={formValues.level}
                    onChange={handleFormChange}
                    options={[
                      { value: 'L3', label: 'L3' },
                      { value: 'L4', label: 'L4' },
                      { value: 'L5', label: 'L5' },
                      { value: 'L6', label: 'L6' },
                      { value: 'SDE_I', label: 'SDE-I' },
                      { value: 'SDE_II', label: 'SDE-II' },
                      { value: 'SDE_III', label: 'SDE-III' },
                      { value: 'STAFF', label: 'Staff' },
                      { value: 'PRINCIPAL', label: 'Principal' },
                      { value: 'IC4', label: 'IC4' },
                      { value: 'IC5', label: 'IC5' },
                    ]}
                  />
                </div>

                <div>
                  <Input
                    label="Location (City only)"
                    name="location"
                    placeholder="e.g. Bengaluru, Seattle"
                    value={formValues.location}
                    onChange={handleFormChange}
                    required
                    helperText="Do not add country (e.g. write 'Bengaluru' not 'Bengaluru, India')"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Select
                      label="Currency"
                      name="currency"
                      value={formValues.currency}
                      onChange={handleFormChange}
                      options={[
                        { value: 'INR', label: 'INR' },
                        { value: 'USD', label: 'USD' },
                        { value: 'GBP', label: 'GBP' },
                        { value: 'EUR', label: 'EUR' },
                      ]}
                    />
                  </div>

                  <div>
                    <Input
                      label="Experience (Years)"
                      name="experienceYears"
                      type="number"
                      min="1"
                      max="50"
                      placeholder="e.g. 3"
                      value={formValues.experienceYears}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </div>

                <div className="border-t border-[#EBEBEB]/80 my-2 pt-4">
                  <Input
                    label="Base Salary"
                    name="baseSalary"
                    type="number"
                    min="1"
                    placeholder="e.g. 1800000"
                    value={formValues.baseSalary}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      label="Annual Bonus"
                      name="bonus"
                      type="number"
                      min="0"
                      placeholder="e.g. 200000"
                      value={formValues.bonus}
                      onChange={handleFormChange}
                    />
                  </div>

                  <div>
                    <Input
                      label="Annual Stock Value"
                      name="stock"
                      type="number"
                      min="0"
                      placeholder="e.g. 400000"
                      value={formValues.stock}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>
              </div>

              {/* Display Computed Total Compensation */}
              <div className="mt-2 bg-[#F7F7F7] border border-[#EBEBEB] rounded-xl p-4 flex justify-between items-center shadow-3xs">
                <div>
                  <span className="text-[10px] font-extrabold text-[#717171] uppercase tracking-wider block">Estimated TC</span>
                  <span className="text-[9px] text-[#717171] font-semibold">Calculated live from inputs</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-[#FF5A5F] tracking-tight">
                    {formatCurrency(liveTC, formValues.currency)}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[#EBEBEB] flex justify-end gap-3">
                <Button variant="secondary" type="button" onClick={handleCloseSubmit} className="cursor-pointer text-xs py-2 px-4 font-bold">
                  Cancel
                </Button>
                <Button variant="primary" type="submit" className="cursor-pointer text-xs py-2 px-5 font-bold">
                  Submit Record
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
