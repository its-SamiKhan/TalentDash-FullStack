import { prisma } from '@/lib/prisma';
import { bigintToNumber, calculateMedian, calculateMin, calculateMax } from '@/lib/calculations';
import { normalizeCompanyName, generateSlug } from '@/lib/validators';
import type { CompanyStats, LevelDistributionItem, SalaryForDisplay } from '@/types';
import type { Company, Level, Currency, Source } from '@prisma/client';

function salaryToDisplay(
  salary: {
    id: string;
    role: string;
    level: Level;
    location: string;
    currency: Currency;
    experienceYears: number;
    baseSalary: bigint;
    bonus: bigint;
    stock: bigint;
    totalCompensation: bigint;
    source: Source;
    confidenceScore: number;
    isVerified: boolean;
    submittedAt: Date;
  },
  companyName: string,
  companySlug: string,
  companyLogoUrl: string | null
): SalaryForDisplay {
  return {
    id: salary.id,
    companyName,
    companySlug,
    companyLogoUrl,
    role: salary.role,
    level: salary.level,
    location: salary.location,
    currency: salary.currency,
    experienceYears: salary.experienceYears,
    baseSalary: bigintToNumber(salary.baseSalary),
    bonus: bigintToNumber(salary.bonus),
    stock: bigintToNumber(salary.stock),
    totalCompensation: bigintToNumber(salary.totalCompensation),
    source: salary.source,
    confidenceScore: salary.confidenceScore,
    isVerified: salary.isVerified,
    submittedAt: salary.submittedAt.toISOString(),
  };
}

/**
 * Get company details and salaries by slug.
 */
export async function getCompanyBySlug(slug: string) {
  const company = await prisma.company.findUnique({
    where: { slug },
    include: {
      salaries: {
        orderBy: { totalCompensation: 'desc' },
      },
    },
  });

  if (!company) return null;

  const displaySalaries = company.salaries.map((s) =>
    salaryToDisplay(s, company.name, company.slug, company.logoUrl)
  );

  return {
    company: {
      id: company.id,
      name: company.name,
      slug: company.slug,
      industry: company.industry,
      headquarters: company.headquarters,
      foundedYear: company.foundedYear,
      headcountRange: company.headcountRange,
      logoUrl: company.logoUrl,
    },
    salaries: displaySalaries,
  };
}

/**
 * Get salary metrics for a company.
 */
export async function getCompanyStats(companyId: string): Promise<CompanyStats> {
  const salaries = await prisma.salary.findMany({
    where: { companyId },
    select: { totalCompensation: true },
  });

  if (salaries.length === 0) {
    return {
      median_tc: 0,
      min_tc: 0,
      max_tc: 0,
      count: 0,
    };
  }

  const tcValues = salaries.map((s) => bigintToNumber(s.totalCompensation));

  return {
    median_tc: calculateMedian(tcValues),
    min_tc: calculateMin(tcValues),
    max_tc: calculateMax(tcValues),
    count: salaries.length,
  };
}

/**
 * Get level distribution for a company.
 */
export async function getLevelDistribution(companyId: string): Promise<LevelDistributionItem[]> {
  const salaries = await prisma.salary.findMany({
    where: { companyId },
    select: { level: true },
  });

  if (salaries.length === 0) return [];

  const counts: Record<string, number> = {};
  for (const s of salaries) {
    counts[s.level] = (counts[s.level] || 0) + 1;
  }

  const total = salaries.length;
  return Object.entries(counts)
    .map(([level, count]) => ({
      level,
      count,
      percentage: Number(((count / total) * 100).toFixed(2)),
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get all company slugs for static site generation.
 */
export async function getAllCompanySlugs(): Promise<string[]> {
  const companies = await prisma.company.findMany({
    select: { slug: true },
  });
  return companies.map((c) => c.slug);
}

/**
 * Find a company by name (normalized) or create a new one.
 */
export async function getOrCreateCompany(name: string): Promise<Company> {
  const normalized = normalizeCompanyName(name);
  const slug = generateSlug(name);

  const existing = await prisma.company.findFirst({
    where: { normalizedName: normalized },
  });

  if (existing) return existing;

  return prisma.company.create({
    data: {
      name,
      slug,
      normalizedName: normalized,
      logoUrl: `/logos/${slug}.svg`,
    },
  });
}
