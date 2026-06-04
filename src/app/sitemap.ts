import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { BASE_URL } from '@/lib/config';

export const revalidate = 86400; // Regenerate sitemap once every 24 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const companies = await prisma.company.findMany({
    select: { slug: true, updatedAt: true },
  });

  const companyUrls = companies.map((c) => ({
    url: `${BASE_URL}/companies/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const companyReviewsUrls = companies.map((c) => ({
    url: `${BASE_URL}/reviews/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const companyInterviewsUrls = companies.map((c) => ({
    url: `${BASE_URL}/interviews/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const companyCommunityUrls = companies.map((c) => ({
    url: `${BASE_URL}/community/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const topicSlugs = ['careers', 'layoffs', 'compensation', 'interview-prep', 'tech-talk'];
  const topicUrls = topicSlugs.map((topic) => ({
    url: `${BASE_URL}/community/${topic}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Fetch distinct industries with workplace scores
  const rankedCompanies = await prisma.company.findMany({
    where: { workplaceScores: { some: {} } },
    select: { industry: true, updatedAt: true },
  });

  const industrySlugs = Array.from(
    new Set(
      rankedCompanies
        .map((c) => c.industry)
        .filter((ind): ind is string => !!ind)
    )
  );

  const industryUrls = industrySlugs.map((industry) => {
    const slug = industry.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return {
      url: `${BASE_URL}/workplace-index/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    };
  });

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/salaries`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/reviews`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/interviews`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/community`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/workplace-index`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/workplace-index/rankings`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/compare`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/tools`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/tools/salary-calculator`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/tools/hike-calculator`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/tools/equity-calculator`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/tools/offer-comparison`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    ...companyUrls,
    ...companyReviewsUrls,
    ...companyInterviewsUrls,
    ...companyCommunityUrls,
    ...topicUrls,
    ...industryUrls,
  ];
}


