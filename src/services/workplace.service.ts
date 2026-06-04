import { prisma } from '@/lib/prisma';
import type { WorkplaceScoreForDisplay } from '@/types';

/**
 * Slugify an industry name to make it URL-safe.
 * "E-Commerce / Cloud" -> "e-commerce-cloud"
 * "IT Services" -> "it-services"
 */
export function slugifyIndustry(industry: string): string {
  return industry
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Retrieve workplace rankings, optionally filtered by slugified industry.
 */
export async function getWorkplaceRankings(
  industrySlug?: string
): Promise<WorkplaceScoreForDisplay[]> {
  const scores = await prisma.workplaceScore.findMany({
    include: {
      company: true,
    },
    orderBy: {
      overallScore: 'desc',
    },
  });

  const formatted: WorkplaceScoreForDisplay[] = scores.map((s) => ({
    id: s.id,
    companyId: s.companyId,
    companyName: s.company.name,
    companySlug: s.company.slug,
    companyLogoUrl: s.company.logoUrl,
    companyIndustry: s.company.industry,
    compensationFairness: s.compensationFairness,
    careerGrowth: s.careerGrowth,
    workLifeBalance: s.workLifeBalance,
    diversityInclusion: s.diversityInclusion,
    leadershipQuality: s.leadershipQuality,
    cultureScore: s.cultureScore,
    wfhScore: s.wfhScore,
    overallScore: s.overallScore,
  }));

  if (industrySlug) {
    return formatted.filter(
      (s) =>
        s.companyIndustry &&
        slugifyIndustry(s.companyIndustry) === industrySlug.toLowerCase()
    );
  }

  return formatted;
}

/**
 * Compile statistics, including leaders for different key categories.
 */
export async function getWorkplaceStats() {
  const rankings = await getWorkplaceRankings();
  if (rankings.length === 0) {
    return {
      overallLeader: null,
      cultureLeader: null,
      wfhLeader: null,
      compLeader: null,
      count: 0,
    };
  }

  const overallLeader = rankings[0];
  const cultureLeader = [...rankings].sort((a, b) => (b.cultureScore || 0) - (a.cultureScore || 0))[0];
  const wfhLeader = [...rankings].sort((a, b) => (b.wfhScore || 0) - (a.wfhScore || 0))[0];
  const compLeader = [...rankings].sort((a, b) => (b.compensationFairness || 0) - (a.compensationFairness || 0))[0];

  return {
    overallLeader,
    cultureLeader,
    wfhLeader,
    compLeader,
    count: rankings.length,
  };
}

/**
 * Return a list of all distinct industries that have ranked companies.
 */
export async function getIndustriesWithScores(): Promise<{ name: string; slug: string; count: number }[]> {
  const companies = await prisma.company.findMany({
    where: {
      workplaceScores: {
        some: {},
      },
    },
    select: {
      industry: true,
    },
  });

  const counts: Record<string, number> = {};
  for (const c of companies) {
    if (c.industry) {
      counts[c.industry] = (counts[c.industry] || 0) + 1;
    }
  }

  return Object.keys(counts).map((name) => ({
    name,
    slug: slugifyIndustry(name),
    count: counts[name],
  }));
}
