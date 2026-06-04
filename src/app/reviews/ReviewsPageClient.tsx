'use client';

import React, { useState } from 'react';
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

    // Basic client validation to save API requests
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

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      {/* Header section with CTA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#222222] tracking-tight">Anonymous Employer Reviews</h1>
          <p className="text-sm text-[#717171] mt-1">Authentic work-life balance, growth, and culture ratings in tech companies.</p>
        </div>
        <Button onClick={handleOpenSubmit} className="shadow-sm">
          Write a Review
        </Button>
      </div>

      {/* Filters Area */}
      <div className="bg-white border border-[#EBEBEB] rounded-lg p-5 shadow-sm flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SearchInput
            placeholder="Search company slug (e.g. google, tcs)..."
            value={companySearch}
            onChange={handleCompanySearch}
          />
          <Select
            options={[{ value: '', label: 'All Roles' }, ...distinctRoles.map((r) => ({ value: r, label: r }))]}
            value={selectedRole}
            onChange={(e) => handleRoleChange(e.target.value)}
          />
        </div>
        <div className="border-t border-[#EBEBEB] pt-4 flex justify-between items-center text-xs text-[#717171]">
          <span>
            Showing <span className="font-bold text-[#222222]">{initialData.meta.total}</span> reviews
          </span>
        </div>
      </div>

      {/* Active Filter Pills */}
      <FilterBar
        filters={activeFilters}
        onRemove={handleRemoveFilter}
        onClearAll={handleClearAllFilters}
      />

      {/* Reviews List */}
      {initialData.data.length === 0 ? (
        <EmptyState onReset={handleClearAllFilters} />
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6">
            {initialData.data.map((review) => (
              <div
                key={review.id}
                className="bg-white border border-[#EBEBEB] rounded-lg p-6 shadow-sm flex flex-col gap-4"
              >
                {/* Header */}
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-3">
                    <CompanyLogo name={review.companyName} logoUrl={review.companyLogoUrl} size={40} />
                    <div>
                      <h3 className="font-bold text-[#222222]">
                        <a
                          href={`/reviews/${review.companySlug}`}
                          className="hover:text-[#FF5A5F] transition-colors"
                        >
                          {review.companyName}
                        </a>
                      </h3>
                      <p className="text-xs text-[#717171]">
                        {review.role || 'Anonymous Employee'} •{' '}
                        {new Date(review.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <StarRatingDisplay rating={review.rating || 0} size="md" />
                    <span className="text-[10px] text-[#717171] uppercase font-bold tracking-wider">
                      Overall Rating: {review.rating} / 5
                    </span>
                  </div>
                </div>

                {/* Sub-ratings Breakdown */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 py-2 border-y border-[#EBEBEB] text-xs font-semibold text-[#484848] bg-slate-50/50 px-3 rounded-md">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#717171]">Work-Life:</span>
                    <StarRatingDisplay rating={review.workLifeBalance || 0} size="sm" />
                    <span>({review.workLifeBalance})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#717171]">Management:</span>
                    <StarRatingDisplay rating={review.managementQuality || 0} size="sm" />
                    <span>({review.managementQuality})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#717171]">Growth:</span>
                    <StarRatingDisplay rating={review.growthOpportunities || 0} size="sm" />
                    <span>({review.growthOpportunities})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#717171]">Culture:</span>
                    <StarRatingDisplay rating={review.cultureFit || 0} size="sm" />
                    <span>({review.cultureFit})</span>
                  </div>
                </div>

                {/* Title and Content */}
                <div>
                  <h4 className="text-base font-bold text-[#222222] mb-2">
                    &ldquo;{review.title}&rdquo;
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Pros */}
                    <div className="bg-[#008A05]/5 border border-[#008A05]/10 rounded-md p-4 flex flex-col gap-1.5">
                      <span className="text-xs uppercase font-extrabold text-[#008A05] tracking-wider flex items-center gap-1">
                        ✓ Pros
                      </span>
                      <p className="text-sm text-[#484848] leading-relaxed whitespace-pre-line">
                        {review.pros}
                      </p>
                    </div>

                    {/* Cons */}
                    <div className="bg-[#D93025]/5 border border-[#D93025]/10 rounded-md p-4 flex flex-col gap-1.5">
                      <span className="text-xs uppercase font-extrabold text-[#D93025] tracking-wider flex items-center gap-1">
                        ✗ Cons
                      </span>
                      <p className="text-sm text-[#484848] leading-relaxed whitespace-pre-line">
                        {review.cons}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={initialData.meta.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Submission Dialog/Modal */}
      {isSubmitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-lg shadow-xl border border-[#EBEBEB] p-6 max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#EBEBEB]">
              <h2 className="text-lg font-bold text-[#222222]">Write an Anonymous Review</h2>
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
                <h3 className="text-base font-bold text-[#222222]">Review Submitted!</h3>
                <p className="text-sm text-[#717171]">Thank you for supporting transparency.</p>
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

                  <div className="col-span-2">
                    <Input
                      label="Job Role / Title (Optional)"
                      name="role"
                      placeholder="e.g. Software Engineer"
                      value={formValues.role}
                      onChange={handleFormChange}
                    />
                  </div>

                  {/* Star Ratings Grid */}
                  <div className="col-span-2 border-y border-[#EBEBEB] py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                  <div className="col-span-2">
                    <Input
                      label="Review Headline"
                      name="title"
                      placeholder="e.g. Great tech culture, but promo is slow"
                      value={formValues.title}
                      onChange={handleFormChange}
                      required
                    />
                  </div>

                  <div className="col-span-2 flex flex-col gap-1">
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
                    <span className="text-[10px] text-right font-semibold text-[#717171]">
                      {formValues.pros.length} / 20 characters minimum
                    </span>
                  </div>

                  <div className="col-span-2 flex flex-col gap-1">
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
                    <span className="text-[10px] text-right font-semibold text-[#717171]">
                      {formValues.cons.length} / 20 characters minimum
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#EBEBEB] flex justify-end gap-3">
                  <Button variant="secondary" type="button" onClick={handleCloseSubmit}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                    Submit Review
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
