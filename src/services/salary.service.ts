import { prisma } from '@/lib/prisma';
import { computeTotalCompensation, bigintToNumber } from '@/lib/calculations';
import {
  validateIngestPayload,
  normalizeCompanyName,
  generateSlug,
} from '@/lib/validators';
import { PAGINATION, DUPLICATE_WINDOW_HOURS, DUPLICATE_SALARY_THRESHOLD } from '@/lib/config';
import type {
  SalaryFilters,
  SortOption,
  PaginationParams,
  PaginatedResponse,
  SalaryForDisplay,
} from '@/types';
import { revalidatePath } from 'next/cache';
import type { Prisma, Level, Currency, Source } from '@prisma/client';

// ─── BigInt → Display Conversion ─────────────────────────

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
    company: {
      name: string;
      slug: string;
      logoUrl: string | null;
    };
  }
): SalaryForDisplay {
  return {
    id: salary.id,
    companyName: salary.company.name,
    companySlug: salary.company.slug,
    companyLogoUrl: salary.company.logoUrl,
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

// ─── Query Builder ───────────────────────────────────────

function buildWhereClause(filters: SalaryFilters): Prisma.SalaryWhereInput {
  const where: Prisma.SalaryWhereInput = {};

  if (filters.company) {
    where.company = {
      normalizedName: { contains: filters.company.toLowerCase() },
    };
  }
  if (filters.role) {
    where.role = { contains: filters.role, mode: 'insensitive' };
  }
  if (filters.level && filters.level.length > 0) {
    where.level = { in: filters.level as Level[] };
  }
  if (filters.location) {
    where.location = { equals: filters.location, mode: 'insensitive' };
  }

  return where;
}

function buildOrderBy(
  sort: SortOption
): Prisma.SalaryOrderByWithRelationInput {
  switch (sort) {
    case 'total_comp_asc':
      return { totalCompensation: 'asc' };
    case 'date_desc':
      return { submittedAt: 'desc' };
    case 'total_comp_desc':
    default:
      return { totalCompensation: 'desc' };
  }
}

// ─── Public API ──────────────────────────────────────────

/**
 * Fetch paginated, filtered, sorted salary records.
 */
export async function getSalaries(
  filters: SalaryFilters = {},
  sort: SortOption = 'total_comp_desc',
  pagination: PaginationParams = {
    page: 1,
    limit: PAGINATION.DEFAULT_LIMIT,
  }
): Promise<PaginatedResponse<SalaryForDisplay>> {
  const page = Math.max(1, pagination.page);
  const limit = Math.min(
    Math.max(1, pagination.limit),
    PAGINATION.MAX_LIMIT
  );
  const skip = (page - 1) * limit;

  const where = buildWhereClause(filters);

  const [salaries, total] = await Promise.all([
    prisma.salary.findMany({
      where,
      orderBy: buildOrderBy(sort),
      skip,
      take: limit,
      include: {
        company: { select: { name: true, slug: true, logoUrl: true } },
      },
    }),
    prisma.salary.count({ where }),
  ]);

  return {
    data: salaries.map(salaryToDisplay),
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Ingest a new salary record.
 * Validates → normalizes company → computes TC → deduplicates → inserts → revalidates.
 */
export async function ingestSalary(payload: unknown) {
  // 1. Validate
  const validation = validateIngestPayload(payload);
  if (!validation.valid) {
    return { success: false, status: 400, errors: validation.errors };
  }

  const data = validation.data!;

  // 2. Normalize company
  const normalized = normalizeCompanyName(data.company as string);
  const slug = generateSlug(data.company as string);

  // 3. Get or create company
  let company = await prisma.company.findFirst({
    where: { normalizedName: normalized },
  });

  if (!company) {
    company = await prisma.company.create({
      data: {
        name: data.company as string,
        slug,
        normalizedName: normalized,
        logoUrl: `/logos/${slug}.svg`,
      },
    });
  }

  // 4. Compute TC (NEVER trust client)
  const baseSalary = BigInt(Math.floor(data.baseSalary as number));
  const bonus = BigInt(Math.floor((data.bonus as number) || 0));
  const stock = BigInt(Math.floor((data.stock as number) || 0));
  const totalCompensation = computeTotalCompensation(baseSalary, bonus, stock);

  // 5. Check duplicate
  const isDuplicate = await checkDuplicate({
    companyId: company.id,
    role: data.role as string,
    level: data.level as string,
    location: data.location as string,
    totalCompensation,
  });

  if (isDuplicate) {
    return {
      success: false,
      status: 409,
      errors: ['Duplicate record detected. A similar salary was submitted recently.'],
    };
  }

  // 6. Insert
  const salary = await prisma.salary.create({
    data: {
      companyId: company.id,
      role: data.role as string, // Stored exactly as entered
      level: data.level as Level,
      location: data.location as string,
      currency: data.currency as Currency,
      experienceYears: data.experienceYears as number,
      baseSalary,
      bonus,
      stock,
      totalCompensation,
      source: (data.source as Source) || 'CONTRIBUTOR',
      confidenceScore: (data.confidenceScore as number) ?? 1.0,
    },
    include: {
      company: { select: { name: true, slug: true, logoUrl: true } },
    },
  });

  // 7. Revalidate cached pages
  revalidatePath('/salaries');
  revalidatePath(`/companies/${company.slug}`);

  return {
    success: true,
    status: 201,
    data: salaryToDisplay(salary),
  };
}

/**
 * Check for duplicate submissions within the dedup window.
 */
async function checkDuplicate(params: {
  companyId: string;
  role: string;
  level: string;
  location: string;
  totalCompensation: bigint;
}): Promise<boolean> {
  const windowStart = new Date();
  windowStart.setHours(windowStart.getHours() - DUPLICATE_WINDOW_HOURS);

  const existing = await prisma.salary.findFirst({
    where: {
      companyId: params.companyId,
      role: { equals: params.role, mode: 'insensitive' },
      level: params.level as Level,
      location: { equals: params.location, mode: 'insensitive' },
      submittedAt: { gte: windowStart },
    },
  });

  if (!existing) return false;

  // Check if TC is within ±threshold
  const existingTC = Number(existing.totalCompensation);
  const newTC = Number(params.totalCompensation);
  const diff = Math.abs(existingTC - newTC) / existingTC;
  return diff <= DUPLICATE_SALARY_THRESHOLD;
}

/**
 * Get a single salary by ID with company data.
 */
export async function getSalaryById(
  id: string
): Promise<SalaryForDisplay | null> {
  const salary = await prisma.salary.findUnique({
    where: { id },
    include: {
      company: { select: { name: true, slug: true, logoUrl: true } },
    },
  });
  return salary ? salaryToDisplay(salary) : null;
}

/**
 * Get distinct values for a given field (for filter dropdowns).
 */
export async function getDistinctValues(
  field: 'role' | 'location' | 'level'
): Promise<string[]> {
  if (field === 'level') {
    const results = await prisma.salary.findMany({
      select: { level: true },
      distinct: ['level'],
      orderBy: { level: 'asc' },
    });
    return results.map((r) => r.level);
  }

  const results = await prisma.salary.findMany({
    select: { [field]: true },
    distinct: [field],
    orderBy: { [field]: 'asc' },
  });
  return results.map((r) => r[field] as string);
}

/**
 * Get lightweight salary list for compare dropdowns.
 */
export async function getAllSalariesForCompare(): Promise<
  Array<{
    id: string;
    companyName: string;
    role: string;
    level: string;
    totalCompensation: number;
    currency: string;
    location: string;
  }>
> {
  const salaries = await prisma.salary.findMany({
    select: {
      id: true,
      role: true,
      level: true,
      totalCompensation: true,
      currency: true,
      location: true,
      company: { select: { name: true } },
    },
    orderBy: { totalCompensation: 'desc' },
  });

  return salaries.map((s) => ({
    id: s.id,
    companyName: s.company.name,
    role: s.role,
    level: s.level,
    totalCompensation: Number(s.totalCompensation),
    currency: s.currency,
    location: s.location,
  }));
}
