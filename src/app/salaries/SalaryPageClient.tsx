'use client';

import React, { useState } from 'react';
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
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      {/* Header section with CTA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#222222] tracking-tight">Software Engineering Salaries</h1>
          <p className="text-sm text-[#717171] mt-1">Structured, comparable tech compensation insights in India and worldwide.</p>
        </div>
        <Button onClick={handleOpenSubmit} className="shadow-sm">
          Submit Salary
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
              <SalaryCard key={salary.id} salary={salary} />
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

      {/* Ingestion Dialog/Modal */}
      {isSubmitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-lg shadow-xl border border-[#EBEBEB] p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#EBEBEB]">
              <h2 className="text-lg font-bold text-[#222222]">Submit Compensation Record</h2>
              <button
                type="button"
                onClick={handleCloseSubmit}
                className="text-[#717171] hover:text-[#222222] text-xl font-bold p-1 focus:outline-none"
              >
                ×
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-8 text-center flex flex-col items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-[#008A05]/10 border border-[#008A05]/20 flex items-center justify-center text-[#008A05] text-xl font-bold">
                  ✓
                </div>
                <h3 className="text-base font-bold text-[#222222]">Submission Successful!</h3>
                <p className="text-sm text-[#717171]">Thank you for contributing to compensation transparency.</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="mt-4 flex flex-col gap-4">
                {formErrors.length > 0 && (
                  <div className="bg-[#D93025]/10 border border-[#D93025]/20 rounded-md p-3 text-xs text-[#D93025] font-semibold flex flex-col gap-1">
                    {formErrors.map((err, i) => (
                      <p key={i}>• {err}</p>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
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

                  <div className="col-span-2 sm:col-span-1">
                    <Input
                      label="Job Role / Title"
                      name="role"
                      placeholder="e.g. Software Engineer"
                      value={formValues.role}
                      onChange={handleFormChange}
                      required
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
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

                  <div className="col-span-2 sm:col-span-1">
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

                  <div className="col-span-2 sm:col-span-1">
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

                  <div className="col-span-2 sm:col-span-1">
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

                  <div className="col-span-2 sm:col-span-1">
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

                  <div className="col-span-2 sm:col-span-1">
                    <Input
                      label="Annual Bonus (Optional)"
                      name="bonus"
                      type="number"
                      min="0"
                      placeholder="e.g. 200000"
                      value={formValues.bonus}
                      onChange={handleFormChange}
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <Input
                      label="Annual Stock Value (Optional)"
                      name="stock"
                      type="number"
                      min="0"
                      placeholder="e.g. 400000"
                      value={formValues.stock}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>

                {/* Display Computed Total Compensation */}
                <div className="mt-2 bg-[#F7F7F7] border border-[#EBEBEB] rounded-md p-4 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-semibold text-[#717171] uppercase tracking-wider block">Estimated TC</span>
                    <span className="text-xs text-[#717171]">Calculated live from input values</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-[#FF5A5F] tracking-tight">
                      {formatCurrency(liveTC, formValues.currency)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#EBEBEB] flex justify-end gap-3">
                  <Button variant="secondary" type="button" onClick={handleCloseSubmit}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                    Submit Record
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
