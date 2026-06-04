'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Input,
  SearchInput,
  Select,
  EmptyState,
  StarRatingInput,
  Pagination,
  FilterBar,
  InterviewCard,
} from '@/components/ui';
import type { InterviewForDisplay, PaginatedResponse, InterviewFilters } from '@/types';

interface InterviewsPageClientProps {
  initialData: PaginatedResponse<InterviewForDisplay>;
  distinctRoles: string[];
  companiesList: { id: string; name: string; slug: string }[];
  initialFilters: InterviewFilters;
  initialPage: number;
  isSubmitOpenInitial: boolean;
}

export function InterviewsPageClient({
  initialData,
  distinctRoles,
  companiesList,
  initialFilters,
  initialPage,
  isSubmitOpenInitial,
}: InterviewsPageClientProps) {
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
    difficulty: 3,
    rounds: 3,
    outcome: 'OFFER',
    experience: '',
    questions: '',
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

    router.push(`/interviews?${params.toString()}`);
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
      difficulty: 3,
      rounds: 3,
      outcome: 'OFFER',
      experience: '',
      questions: '',
    });
    syncParams({ company: companySearch, role: selectedRole }, page, false);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: name === 'difficulty' || name === 'rounds' ? parseInt(value, 10) : value,
    }));
  };

  const handleRatingChange = (name: string, value: number) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors([]);
    setSubmitSuccess(false);

    // Client-side validations
    const errors: string[] = [];
    if (formValues.experience.length < 20) {
      errors.push('Interview process/experience story must be at least 20 characters long.');
    }
    if (formValues.questions.length < 10) {
      errors.push('Questions asked must be at least 10 characters long.');
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await fetch('/api/ingest-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formValues,
          company: formValues.company.trim(),
          role: formValues.role.trim(),
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
          <h1 className="text-3xl font-extrabold text-[#222222] tracking-tight">Interview Experiences</h1>
          <p className="text-sm text-[#717171] mt-1">
            Read interview questions, difficulty ratings, and outcomes submitted by candidates.
          </p>
        </div>
        <Button onClick={handleOpenSubmit} className="shadow-sm">
          Submit Interview Experience
        </Button>
      </div>

      {/* Filters Area */}
      <div className="bg-white border border-[#EBEBEB] rounded-lg p-5 shadow-sm flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SearchInput
            placeholder="Search company slug (e.g. google, amazon)..."
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
            Showing <span className="font-bold text-[#222222]">{initialData.meta.total}</span> interview logs
          </span>
        </div>
      </div>

      {/* Active Filter Pills */}
      <FilterBar
        filters={activeFilters}
        onRemove={handleRemoveFilter}
        onClearAll={handleClearAllFilters}
      />

      {/* Interviews Feed List */}
      {initialData.data.length === 0 ? (
        <EmptyState onReset={handleClearAllFilters} />
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6">
            {initialData.data.map((interview) => (
              <InterviewCard key={interview.id} interview={interview} />
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
              <h2 className="text-lg font-bold text-[#222222]">Share Your Interview Experience</h2>
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
                <h3 className="text-base font-bold text-[#222222]">Experience Submitted!</h3>
                <p className="text-sm text-[#717171]">Thank you for helping other developers prepare.</p>
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
                      label="Job Role / Title"
                      name="role"
                      placeholder="e.g. SDE-II, Software Engineer"
                      value={formValues.role}
                      onChange={handleFormChange}
                      required
                    />
                  </div>

                  <div className="col-span-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#717171] mb-1.5">
                      Rounds Count
                    </label>
                    <select
                      name="rounds"
                      value={formValues.rounds}
                      onChange={handleFormChange}
                      className="w-full p-2.5 border border-[#EBEBEB] rounded-md text-sm text-[#222222] bg-white transition-shadow focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]/50 focus:border-[#FF5A5F]"
                      required
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Round' : 'Rounds'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#717171] mb-1.5">
                      Outcome
                    </label>
                    <select
                      name="outcome"
                      value={formValues.outcome}
                      onChange={handleFormChange}
                      className="w-full p-2.5 border border-[#EBEBEB] rounded-md text-sm text-[#222222] bg-white transition-shadow focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]/50 focus:border-[#FF5A5F]"
                      required
                    >
                      <option value="OFFER">Offer</option>
                      <option value="REJECT">Rejected</option>
                      <option value="GHOSTED">Ghosted</option>
                    </select>
                  </div>

                  <div className="col-span-2 border-y border-[#EBEBEB] py-4">
                    <StarRatingInput
                      label="Difficulty Rating"
                      rating={formValues.difficulty}
                      onChange={(val) => handleRatingChange('difficulty', val)}
                    />
                    <span className="text-[10px] text-[#717171] mt-1 block">
                      1-2: Easy | 3: Medium | 4-5: Hard
                    </span>
                  </div>

                  <div className="col-span-2 flex flex-col gap-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#717171]">
                      Interview Experience Description
                    </label>
                    <textarea
                      name="experience"
                      rows={3}
                      placeholder="Describe the rounds, interview process, and overall vibe of the candidate experience (Min 20 characters)"
                      value={formValues.experience}
                      onChange={handleFormChange}
                      className="w-full p-3 border border-[#EBEBEB] rounded-md text-sm text-[#222222] bg-white transition-shadow focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]/50 focus:border-[#FF5A5F]"
                      required
                    />
                    <span className="text-[10px] text-right font-semibold text-[#717171]">
                      {formValues.experience.length} / 20 characters minimum
                    </span>
                  </div>

                  <div className="col-span-2 flex flex-col gap-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#717171]">
                      Questions Asked
                    </label>
                    <textarea
                      name="questions"
                      rows={3}
                      placeholder="What technical or behavioral questions were you asked? (Min 10 characters)"
                      value={formValues.questions}
                      onChange={handleFormChange}
                      className="w-full p-3 border border-[#EBEBEB] rounded-md text-sm text-[#222222] bg-white transition-shadow focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]/50 focus:border-[#FF5A5F]"
                      required
                    />
                    <span className="text-[10px] text-right font-semibold text-[#717171]">
                      {formValues.questions.length} / 10 characters minimum
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#EBEBEB] flex justify-end gap-3">
                  <Button variant="secondary" type="button" onClick={handleCloseSubmit}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                    Submit Experience
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
