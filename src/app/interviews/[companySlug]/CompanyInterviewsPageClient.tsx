'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Select,
  EmptyState,
  CompanyLogo,
  Input,
  StarRatingInput,
  InterviewCard,
} from '@/components/ui';
import type { InterviewForDisplay, CompanyInterviewStats } from '@/types';

interface CompanyInterviewsPageClientProps {
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
  stats: CompanyInterviewStats;
  initialInterviews: InterviewForDisplay[];
}

export function CompanyInterviewsPageClient({
  company,
  stats,
  initialInterviews,
}: CompanyInterviewsPageClientProps) {
  const router = useRouter();

  // Filters state
  const [selectedRole, setSelectedRole] = useState('');
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [formValues, setFormValues] = useState({
    company: company.name,
    role: '',
    difficulty: 3,
    rounds: 3,
    outcome: 'OFFER',
    experience: '',
    questions: '',
  });

  // Extract roles for filters
  const roles = Array.from(new Set(initialInterviews.map((i) => i.role).filter(Boolean))) as string[];

  const filteredInterviews = initialInterviews.filter((i) => {
    if (selectedRole && i.role !== selectedRole) return false;
    return true;
  });

  const handleOpenSubmit = () => {
    setIsSubmitOpen(true);
  };

  const handleCloseSubmit = () => {
    setIsSubmitOpen(false);
    setFormErrors([]);
    setSubmitSuccess(false);
    setFormValues({
      company: company.name,
      role: '',
      difficulty: 3,
      rounds: 3,
      outcome: 'OFFER',
      experience: '',
      questions: '',
    });
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
          company: company.name,
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

  // Helper to render linear percentage bars for outcome stats
  const renderProgressBar = (label: string, percentage: number, colorClass: string) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <div className="flex justify-between text-xs font-semibold text-[#484848]">
          <span>{label}</span>
          <span>{percentage}%</span>
        </div>
        <div className="w-full bg-[#EBEBEB] h-2 rounded-full overflow-hidden">
          <div
            className={`${colorClass} h-full rounded-full transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Back button */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/interviews')}
          className="text-[#717171] hover:text-[#222222]"
        >
          ← Back to Interviews
        </Button>
      </div>

      {/* Header section with company metadata */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#EBEBEB]">
        <div className="flex items-center gap-4">
          <CompanyLogo name={company.name} logoUrl={company.logoUrl} size={64} />
          <div>
            <h1 className="text-3xl font-extrabold text-[#222222] tracking-tight">
              {company.name} Interviews
            </h1>
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
        <Button onClick={handleOpenSubmit} className="shadow-sm">
          Submit Interview Experience
        </Button>
      </div>

      {/* Grid: Rating stats + Interviews list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Aggregate statistics overview */}
        <div className="bg-white border border-[#EBEBEB] rounded-lg p-6 shadow-sm h-fit flex flex-col gap-6">
          <h2 className="text-sm uppercase font-extrabold text-[#717171] tracking-wider border-b border-[#EBEBEB] pb-3">
            Interview Insights
          </h2>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="border-r border-[#EBEBEB] py-2 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-[#222222]">
                {stats.average_difficulty > 0 ? stats.average_difficulty : '—'}
              </span>
              <span className="text-[10px] uppercase font-bold text-[#717171] tracking-wider mt-1">
                Avg Difficulty
              </span>
            </div>
            <div className="py-2 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-[#222222]">
                {stats.average_rounds > 0 ? stats.average_rounds : '—'}
              </span>
              <span className="text-[10px] uppercase font-bold text-[#717171] tracking-wider mt-1">
                Avg Rounds
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-[#EBEBEB] pt-4">
            <h3 className="text-xs uppercase font-bold text-[#717171] tracking-wider">
              Outcome Distribution
            </h3>
            {renderProgressBar('Offers Received', stats.offer_rate, 'bg-emerald-500')}
            {renderProgressBar('Rejections', stats.reject_rate, 'bg-red-500')}
            {renderProgressBar('Ghosted / Other', stats.ghosted_rate, 'bg-slate-400')}
            <span className="text-[10px] text-[#717171] font-medium text-center block mt-2">
              Based on {stats.count} reported experiences
            </span>
          </div>
        </div>

        {/* Right column: Filterable list */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white border border-[#EBEBEB] rounded-lg p-4 shadow-sm">
            <Select
              options={[{ value: '', label: 'All Roles' }, ...roles.map((r) => ({ value: r, label: r }))]}
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            />
          </div>

          {filteredInterviews.length === 0 ? (
            <EmptyState onReset={() => setSelectedRole('')} />
          ) : (
            <div className="flex flex-col gap-6">
              {filteredInterviews.map((interview) => (
                <InterviewCard key={interview.id} interview={interview} hideCompany />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Submission Dialog/Modal */}
      {isSubmitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-lg shadow-xl border border-[#EBEBEB] p-6 max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#EBEBEB]">
              <h2 className="text-lg font-bold text-[#222222]">Share {company.name} Interview</h2>
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
                <h3 className="text-base font-bold text-[#222222]">Interview Submitted!</h3>
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
                    <Input
                      label="Company Name"
                      name="company"
                      value={formValues.company}
                      disabled
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
                      Interview Process Description
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
