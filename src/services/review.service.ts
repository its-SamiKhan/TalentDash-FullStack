import { prisma } from '@/lib/prisma';
import { getOrCreateCompany } from './company.service';
import { revalidatePath } from 'next/cache';
import { validateReviewPayload } from '@/lib/validators';
import type { Prisma } from '@prisma/client';
import type {
  ReviewForDisplay,
  ReviewFilters,
  PaginationParams,
  PaginatedResponse,
  CompanyReviewStats,
  ReviewIngestPayload,
} from '@/types';

function reviewToDisplay(
  review: {
    id: string;
    role: string | null;
    rating: number | null;
    workLifeBalance: number | null;
    managementQuality: number | null;
    growthOpportunities: number | null;
    cultureFit: number | null;
    title: string | null;
    pros: string | null;
    cons: string | null;
    isAnonymous: boolean;
    createdAt: Date;
    company: {
      name: string;
      slug: string;
      logoUrl: string | null;
    };
  }
): ReviewForDisplay {
  return {
    id: review.id,
    companyName: review.company.name,
    companySlug: review.company.slug,
    companyLogoUrl: review.company.logoUrl,
    role: review.role,
    rating: review.rating,
    workLifeBalance: review.workLifeBalance,
    managementQuality: review.managementQuality,
    growthOpportunities: review.growthOpportunities,
    cultureFit: review.cultureFit,
    title: review.title,
    pros: review.pros,
    cons: review.cons,
    isAnonymous: review.isAnonymous,
    createdAt: review.createdAt.toISOString(),
  };
}

export async function getReviews(
  filters: ReviewFilters,
  pagination: PaginationParams
): Promise<PaginatedResponse<ReviewForDisplay>> {
  const { page, limit } = pagination;
  const skip = (page - 1) * limit;

  const where: Prisma.ReviewWhereInput = {};

  if (filters.company) {
    where.company = {
      slug: filters.company,
    };
  }

  if (filters.role) {
    where.role = {
      equals: filters.role,
      mode: 'insensitive',
    };
  }

  const [total, reviews] = await Promise.all([
    prisma.review.count({ where }),
    prisma.review.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        company: {
          select: {
            name: true,
            slug: true,
            logoUrl: true,
          },
        },
      },
    }),
  ]);

  const data = reviews.map(reviewToDisplay);
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  };
}

export async function getCompanyReviewStats(companyId: string): Promise<CompanyReviewStats> {
  const reviews = await prisma.review.findMany({
    where: { companyId },
    select: {
      rating: true,
      workLifeBalance: true,
      managementQuality: true,
      growthOpportunities: true,
      cultureFit: true,
    },
  });

  if (reviews.length === 0) {
    return {
      average_overall: 0,
      average_wlb: 0,
      average_management: 0,
      average_growth: 0,
      average_culture: 0,
      count: 0,
    };
  }

  let totalOverall = 0;
  let totalWlb = 0;
  let totalMgmt = 0;
  let totalGrowth = 0;
  let totalCulture = 0;

  for (const r of reviews) {
    totalOverall += r.rating || 0;
    totalWlb += r.workLifeBalance || 0;
    totalMgmt += r.managementQuality || 0;
    totalGrowth += r.growthOpportunities || 0;
    totalCulture += r.cultureFit || 0;
  }

  const count = reviews.length;
  return {
    average_overall: Number((totalOverall / count).toFixed(1)),
    average_wlb: Number((totalWlb / count).toFixed(1)),
    average_management: Number((totalMgmt / count).toFixed(1)),
    average_growth: Number((totalGrowth / count).toFixed(1)),
    average_culture: Number((totalCulture / count).toFixed(1)),
    count,
  };
}

export async function createReview(payload: ReviewIngestPayload) {
  const company = await getOrCreateCompany(payload.company);

  const review = await prisma.review.create({
    data: {
      companyId: company.id,
      role: payload.role || null,
      rating: payload.rating,
      workLifeBalance: payload.workLifeBalance,
      managementQuality: payload.managementQuality,
      growthOpportunities: payload.growthOpportunities,
      cultureFit: payload.cultureFit,
      title: payload.title,
      pros: payload.pros,
      cons: payload.cons,
      isAnonymous: true,
    },
  });

  // Revalidate routes
  revalidatePath('/reviews');
  revalidatePath(`/companies/${company.slug}`);
  revalidatePath(`/reviews/${company.slug}`);

  return {
    id: review.id,
    companyName: company.name,
    companySlug: company.slug,
    role: review.role,
  };
}

/**
 * Validate and ingest review payloads.
 */
export async function ingestReview(payload: unknown) {
  const validation = validateReviewPayload(payload);
  if (!validation.valid) {
    return { success: false, status: 400, errors: validation.errors };
  }

  const data = validation.data as unknown as ReviewIngestPayload;

  try {
    const result = await createReview(data);
    return { success: true, status: 201, data: result };
  } catch (error) {
    console.error('Error in ingestReview service:', error);
    return { success: false, status: 500, errors: ['Failed to save review in database'] };
  }
}

