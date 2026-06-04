import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCompanyBySlug, getAllCompanySlugs } from '@/services/company.service';
import { getCompanyInterviewStats, getInterviews } from '@/services/interview.service';
import { CompanyInterviewsPageClient } from './CompanyInterviewsPageClient';

export const revalidate = 3600; // Cache for 1 hour

interface PageProps {
  params: Promise<{ companySlug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { companySlug } = await params;
  const companyData = await getCompanyBySlug(companySlug);
  if (!companyData) {
    return {
      title: 'Company Interviews',
    };
  }
  return {
    title: `${companyData.company.name} Interview Questions & Difficulty`,
    description: `Read interview difficulty, typical rounds count, questions asked, and candidate outcome rates at ${companyData.company.name}.`,
  };
}


export async function generateStaticParams() {
  const slugs = await getAllCompanySlugs();
  return slugs.map((slug) => ({ companySlug: slug }));
}

export default async function CompanyInterviewsPage({ params }: PageProps) {
  const { companySlug } = await params;
  const companyData = await getCompanyBySlug(companySlug);

  if (!companyData) {
    notFound();
  }

  const { company } = companyData;
  const stats = await getCompanyInterviewStats(company.id);
  const interviewsData = await getInterviews({ company: companySlug }, { page: 1, limit: 100 });

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
      <CompanyInterviewsPageClient
        company={company}
        stats={stats}
        initialInterviews={interviewsData.data}
      />
    </Suspense>
  );
}
