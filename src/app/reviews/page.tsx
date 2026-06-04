import React, { Suspense } from 'react';
import { getReviews } from '@/services/review.service';
import { getDistinctValues } from '@/services/salary.service';
import { getAllCompanies } from '@/services/company.service';
import { ReviewsPageClient } from './ReviewsPageClient';

export const revalidate = 3600; // Cache for 1 hour

interface SearchParams {
  company?: string;
  role?: string;
  page?: string;
  limit?: string;
  submit?: string;
}

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedParams = await searchParams;

  const company = resolvedParams.company || undefined;
  const role = resolvedParams.role || undefined;
  const page = parseInt(resolvedParams.page || '1', 10);
  const limit = parseInt(resolvedParams.limit || '10', 10);
  const isSubmitOpen = resolvedParams.submit === 'true';

  // Fetch reviews based on search parameters
  const result = await getReviews(
    { company, role },
    { page, limit }
  );

  // Fetch unique roles for filters
  const distinctRoles = await getDistinctValues('role');
  const companiesList = await getAllCompanies();

  return (
    <Suspense fallback={
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          <div className="h-40 bg-slate-200 rounded-lg"></div>
        </div>
      </div>
    }>
      <ReviewsPageClient
        initialData={result}
        distinctRoles={distinctRoles}
        companiesList={companiesList}
        initialFilters={{ company, role }}
        initialPage={page}
        isSubmitOpenInitial={isSubmitOpen}
      />
    </Suspense>
  );
}

