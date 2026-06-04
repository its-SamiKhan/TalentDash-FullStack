import { prisma } from '@/lib/prisma';
import { getOrCreateCompany } from './company.service';
import { revalidatePath } from 'next/cache';
import { validateInterviewPayload } from '@/lib/validators';
import type { Prisma } from '@prisma/client';
import type {
  InterviewForDisplay,
  InterviewFilters,
  PaginationParams,
  PaginatedResponse,
  CompanyInterviewStats,
  InterviewIngestPayload,
} from '@/types';

function interviewToDisplay(
  interview: {
    id: string;
    role: string | null;
    difficulty: number | null;
    rounds: number | null;
    outcome: string | null;
    experience: string | null;
    questions: string | null;
    isAnonymous: boolean;
    createdAt: Date;
    company: {
      name: string;
      slug: string;
      logoUrl: string | null;
    };
  }
): InterviewForDisplay {
  return {
    id: interview.id,
    companyName: interview.company.name,
    companySlug: interview.company.slug,
    companyLogoUrl: interview.company.logoUrl,
    role: interview.role,
    difficulty: interview.difficulty,
    rounds: interview.rounds,
    outcome: interview.outcome,
    experience: interview.experience,
    questions: interview.questions,
    isAnonymous: interview.isAnonymous,
    createdAt: interview.createdAt.toISOString(),
  };
}

export async function getInterviews(
  filters: InterviewFilters,
  pagination: PaginationParams
): Promise<PaginatedResponse<InterviewForDisplay>> {
  const { page, limit } = pagination;
  const skip = (page - 1) * limit;

  const where: Prisma.InterviewWhereInput = {};

  if (filters.company) {
    const companyExists = await prisma.company.findUnique({
      where: { slug: filters.company },
    });

    if (companyExists) {
      where.company = { slug: filters.company };
    } else {
      where.company = {
        OR: [
          { name: { contains: filters.company, mode: 'insensitive' } },
          { normalizedName: { contains: filters.company.toLowerCase() } },
          { slug: { contains: filters.company.toLowerCase() } },
        ],
      };
    }
  }

  if (filters.role) {
    where.role = {
      equals: filters.role,
      mode: 'insensitive',
    };
  }

  const [total, interviews] = await Promise.all([
    prisma.interview.count({ where }),
    prisma.interview.findMany({
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

  const data = interviews.map(interviewToDisplay);
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

export async function getCompanyInterviewStats(companyId: string): Promise<CompanyInterviewStats> {
  const interviews = await prisma.interview.findMany({
    where: { companyId },
    select: {
      difficulty: true,
      rounds: true,
      outcome: true,
    },
  });

  if (interviews.length === 0) {
    return {
      average_difficulty: 0,
      average_rounds: 0,
      offer_rate: 0,
      reject_rate: 0,
      ghosted_rate: 0,
      count: 0,
    };
  }

  let totalDifficulty = 0;
  let totalRounds = 0;
  let offers = 0;
  let rejects = 0;
  let ghosted = 0;

  for (const i of interviews) {
    totalDifficulty += i.difficulty || 0;
    totalRounds += i.rounds || 0;
    
    if (i.outcome === 'OFFER') offers++;
    else if (i.outcome === 'REJECT') rejects++;
    else if (i.outcome === 'GHOSTED') ghosted++;
  }

  const count = interviews.length;
  return {
    average_difficulty: Number((totalDifficulty / count).toFixed(1)),
    average_rounds: Number((totalRounds / count).toFixed(1)),
    offer_rate: Number(((offers / count) * 100).toFixed(0)),
    reject_rate: Number(((rejects / count) * 100).toFixed(0)),
    ghosted_rate: Number(((ghosted / count) * 100).toFixed(0)),
    count,
  };
}

export async function createInterview(payload: InterviewIngestPayload) {
  const company = await getOrCreateCompany(payload.company);

  const interview = await prisma.interview.create({
    data: {
      companyId: company.id,
      role: payload.role,
      difficulty: payload.difficulty,
      rounds: payload.rounds,
      outcome: payload.outcome,
      experience: payload.experience,
      questions: payload.questions || null,
      isAnonymous: true,
    },
  });

  // Revalidate routes
  revalidatePath('/interviews');
  revalidatePath(`/companies/${company.slug}`);
  revalidatePath(`/interviews/${company.slug}`);

  return {
    id: interview.id,
    companyName: company.name,
    companySlug: company.slug,
    role: interview.role,
  };
}

/**
 * Validate and ingest interview experiences.
 */
export async function ingestInterview(payload: unknown) {
  const validation = validateInterviewPayload(payload);
  if (!validation.valid) {
    return { success: false, status: 400, errors: validation.errors };
  }

  const data = validation.data as unknown as InterviewIngestPayload;

  try {
    const result = await createInterview(data);
    return { success: true, status: 201, data: result };
  } catch (error) {
    console.error('Error in ingestInterview service:', error);
    return { success: false, status: 500, errors: ['Failed to save interview experience in database'] };
  }
}

/**
 * Retrieve interview questions asked for a given role across companies.
 */
export async function getInterviewQuestions(role: string) {
  const interviews = await prisma.interview.findMany({
    where: {
      role: {
        equals: role,
        mode: 'insensitive',
      },
      questions: {
        not: null,
      },
    },
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
  });

  return interviews.map((i) => ({
    id: i.id,
    companyName: i.company.name,
    companySlug: i.company.slug,
    companyLogoUrl: i.company.logoUrl,
    questions: i.questions,
    createdAt: i.createdAt.toISOString(),
  }));
}
