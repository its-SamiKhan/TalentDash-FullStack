import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getCompanyBySlug, getAllCompanySlugs } from '@/services/company.service';
import { getCompanyReviewStats, getReviews } from '@/services/review.service';
import { CompanyReviewsPageClient } from './CompanyReviewsPageClient';

export const revalidate = 3600; // Cache for 1 hour

interface PageProps {
  params: Promise<{ companySlug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllCompanySlugs();
  return slugs.map((slug) => ({ companySlug: slug }));
}

export default async function CompanyReviewsPage({ params }: PageProps) {
  const { companySlug } = await params;
  const companyData = await getCompanyBySlug(companySlug);

  if (!companyData) {
    notFound();
  }

  const { company } = companyData;
  const stats = await getCompanyReviewStats(company.id);
  const reviewsData = await getReviews({ company: companySlug }, { page: 1, limit: 100 });

  return (
    <Suspense fallback={
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          <div className="h-48 bg-slate-200 rounded-lg"></div>
        </div>
      </div>
    }>
      <CompanyReviewsPageClient
        company={company}
        stats={stats}
        initialReviews={reviewsData.data}
      />
    </Suspense>
  );
}
