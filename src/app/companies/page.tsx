import React, { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { calculateMedian, bigintToNumber } from '@/lib/calculations';
import { CompaniesPageClient } from './CompaniesPageClient';

export const revalidate = 3600; // Cache for 1 hour

export default async function CompaniesPage() {
  // Query all companies with their associated salaries and reviews
  const companies = await prisma.company.findMany({
    where: {
      NOT: {
        name: {
          startsWith: 'TestCorp',
        },
      },
    },
    include: {
      salaries: {
        select: {
          totalCompensation: true,
        },
      },
      reviews: {
        select: {
          rating: true,
        },
      },
      interviews: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  // Map database companies to UI models calculating stats dynamically
  const displayCompanies = companies.map((c) => {
    const salaries = c.salaries.map((s) => bigintToNumber(s.totalCompensation));
    const ratings = c.reviews.map((r) => r.rating || 0).filter((r) => r > 0);

    const medianSalary = salaries.length > 0 ? calculateMedian(salaries) : 0;
    const averageRating = ratings.length > 0 ? parseFloat((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)) : 0;

    return {
      id: c.id,
      name: c.name,
      slug: c.slug,
      industry: c.industry || 'Technology',
      headquarters: c.headquarters || 'Unknown',
      foundedYear: c.foundedYear || null,
      headcountRange: c.headcountRange || 'Unknown',
      logoUrl: c.logoUrl,
      medianSalary,
      averageRating,
      reviewsCount: c.reviews.length,
      salariesCount: c.salaries.length,
      interviewsCount: c.interviews.length,
    };
  });

  // Get distinct values for filter lists
  const industries = Array.from(new Set(displayCompanies.map((c) => c.industry))).filter(Boolean).sort();
  const headcountRanges = Array.from(new Set(displayCompanies.map((c) => c.headcountRange))).filter(Boolean).sort();

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
      <CompaniesPageClient
        initialCompanies={displayCompanies}
        industries={industries}
        headcountRanges={headcountRanges}
      />
    </Suspense>
  );
}
