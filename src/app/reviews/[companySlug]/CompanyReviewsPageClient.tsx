'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Select,
  EmptyState,
  StarRatingDisplay,
  StarRatingInput,
  CompanyLogo,
  Input,
} from '@/components/ui';
import type { ReviewForDisplay, CompanyReviewStats } from '@/types';

interface CompanyReviewsPageClientProps {
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
  stats: CompanyReviewStats;
  initialReviews: ReviewForDisplay[];
}

export function CompanyReviewsPageClient({
  company,
  stats,
  initialReviews,
}: CompanyReviewsPageClientProps) {
  const router = useRouter();

  // Filters state
  const [selectedRole, setSelectedRole] = useState('');
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [formValues, setFormValues] = useState({
    company: company.name,
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

  // Extract roles for filters
  const roles = Array.from(new Set(initialReviews.map((r) => r.role).filter(Boolean))) as string[];

  const filteredReviews = initialReviews.filter((r) => {
    if (selectedRole && r.role !== selectedRole) return false;
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
      rating: 5,
      workLifeBalance: 5,
      managementQuality: 5,
      growthOpportunities: 5,
      cultureFit: 5,
      title: '',
      pros: '',
      cons: '',
    });
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
          company: company.name,
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

  // Helper to render linear percentage bars for sub-ratings
  const renderRatingBar = (label: string, value: number) => {
    const percentage = (value / 5) * 100;
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <div className="flex justify-between text-xs font-semibold text-[#484848]">
          <span>{label}</span>
          <span className="text-[#FF5A5F]">{value} / 5.0</span>
        </div>
        <div className="w-full bg-[#EBEBEB] h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#FF5A5F] h-full rounded-full transition-all duration-500"
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
        <Button variant="ghost" size="sm" onClick={() => router.push('/reviews')} className="text-[#717171] hover:text-[#222222]">
          ← Back to Reviews
        </Button>
      </div>

      {/* Header section with company metadata */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#EBEBEB]">
        <div className="flex items-center gap-4">
          <CompanyLogo name={company.name} logoUrl={company.logoUrl} size={64} />
          <div>
            <h1 className="text-3xl font-extrabold text-[#222222] tracking-tight">{company.name} Reviews</h1>
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
          Write a Review
        </Button>
      </div>

      {/* Grid: Rating stats + Review list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Aggregate statistics overview */}
        <div className="bg-white border border-[#EBEBEB] rounded-lg p-6 shadow-sm h-fit flex flex-col gap-6">
          <div className="text-center py-4 border-b border-[#EBEBEB] flex flex-col items-center gap-2">
            <span className="text-5xl font-extrabold text-[#222222] tracking-tight">
              {stats.average_overall > 0 ? stats.average_overall : '—'}
            </span>
            <StarRatingDisplay rating={stats.average_overall} size="lg" />
            <span className="text-xs text-[#717171] font-medium">
              Based on {stats.count} employee reviews
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-xs uppercase font-bold text-[#717171] tracking-wider">
              Category Scores
            </h3>
            {renderRatingBar('Work-Life Balance', stats.average_wlb)}
            {renderRatingBar('Management Quality', stats.average_management)}
            {renderRatingBar('Growth Opportunities', stats.average_growth)}
            {renderRatingBar('Culture Fit', stats.average_culture)}
          </div>
        </div>

        {/* Right column: Filterable reviews list */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white border border-[#EBEBEB] rounded-lg p-4 shadow-sm">
            <Select
              options={[{ value: '', label: 'All Roles' }, ...roles.map((r) => ({ value: r, label: r }))]}
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            />
          </div>

          {filteredReviews.length === 0 ? (
            <EmptyState onReset={() => setSelectedRole('')} />
          ) : (
            <div className="flex flex-col gap-6">
              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white border border-[#EBEBEB] rounded-lg p-6 shadow-sm flex flex-col gap-4"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="text-base font-bold text-[#222222]">
                        &ldquo;{review.title}&rdquo;
                      </h4>
                      <p className="text-xs text-[#717171] mt-1">
                        {review.role || 'Anonymous Employee'} •{' '}
                        {new Date(review.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <StarRatingDisplay rating={review.rating || 0} size="md" />
                      <span className="text-[10px] text-[#717171] uppercase font-bold tracking-wider">
                        Score: {review.rating} / 5
                      </span>
                    </div>
                  </div>

                  {/* Sub-ratings Breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2 border-y border-[#EBEBEB] text-xs font-semibold text-[#484848] bg-slate-50/50 px-3 rounded-md">
                    <div>WLB: {review.workLifeBalance}★</div>
                    <div>Mgmt: {review.managementQuality}★</div>
                    <div>Growth: {review.growthOpportunities}★</div>
                    <div>Culture: {review.cultureFit}★</div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#008A05]/5 border border-[#008A05]/10 rounded-md p-4 flex flex-col gap-1">
                      <span className="text-xs uppercase font-extrabold text-[#008A05] tracking-wider">
                        Pros
                      </span>
                      <p className="text-sm text-[#484848] leading-relaxed whitespace-pre-line">
                        {review.pros}
                      </p>
                    </div>
                    <div className="bg-[#D93025]/5 border border-[#D93025]/10 rounded-md p-4 flex flex-col gap-1">
                      <span className="text-xs uppercase font-extrabold text-[#D93025] tracking-wider">
                        Cons
                      </span>
                      <p className="text-sm text-[#484848] leading-relaxed whitespace-pre-line">
                        {review.cons}
                      </p>
                    </div>
                  </div>
                </div>
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
              <h2 className="text-lg font-bold text-[#222222]">Review {company.name}</h2>
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
                      label="Job Role / Title (Optional)"
                      name="role"
                      placeholder="e.g. Software Engineer"
                      value={formValues.role}
                      onChange={handleFormChange}
                    />
                  </div>

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
