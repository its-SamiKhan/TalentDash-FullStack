import React from 'react';
import { prisma } from '@/lib/prisma';
import { SavedPageClient } from './SavedPageClient';
import { bigintToNumber } from '@/lib/calculations';

export const revalidate = 0; // Don't cache saved list to always reflect user's actions

export default async function SavedPage() {
  // Fetch all companies to map metadata
  const companies = await prisma.company.findMany({
    include: {
      salaries: true,
      reviews: true,
      interviews: true,
    },
  });

  // Fetch all salaries to filter client-side
  const salaries = await prisma.salary.findMany({
    include: {
      company: true,
    },
  });

  const displaySalaries = salaries.map((s) => ({
    id: s.id,
    companyName: s.company.name,
    companySlug: s.company.slug,
    companyLogoUrl: s.company.logoUrl,
    role: s.role,
    level: s.level.toString(),
    location: s.location,
    currency: s.currency.toString(),
    experienceYears: s.experienceYears,
    baseSalary: bigintToNumber(s.baseSalary),
    bonus: bigintToNumber(s.bonus),
    stock: bigintToNumber(s.stock),
    totalCompensation: bigintToNumber(s.totalCompensation),
    submittedAt: s.submittedAt.toISOString(),
  }));

  const displayCompanies = companies.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    industry: c.industry || 'Technology',
    headquarters: c.headquarters || 'Unknown',
    logoUrl: c.logoUrl,
    averageRating: c.reviews.length > 0 ? parseFloat((c.reviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) / c.reviews.length).toFixed(1)) : 0,
    salariesCount: c.salaries.length,
    reviewsCount: c.reviews.length,
    interviewsCount: c.interviews.length,
  }));

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      <SavedPageClient initialSalaries={displaySalaries} initialCompanies={displayCompanies} />
    </div>
  );
}
