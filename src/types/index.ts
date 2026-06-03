// ─── Types & Interfaces for TalentDash ───────────────────

// Re-export Prisma enums for convenience
export type { Company, Salary, Level, Currency, Source } from '@prisma/client';

// ─── Display Mapping ─────────────────────────────────────

export const LEVEL_DISPLAY_MAP: Record<string, string> = {
  L3: 'L3',
  L4: 'L4',
  L5: 'L5',
  L6: 'L6',
  SDE_I: 'SDE-I',
  SDE_II: 'SDE-II',
  SDE_III: 'SDE-III',
  STAFF: 'Staff',
  PRINCIPAL: 'Principal',
  IC4: 'IC4',
  IC5: 'IC5',
} as const;

// ─── Salary Display Type (BigInt → number) ───────────────

export interface SalaryForDisplay {
  id: string;
  companyName: string;
  companySlug: string;
  companyLogoUrl: string | null;
  role: string;
  level: string;
  location: string;
  currency: string;
  experienceYears: number;
  baseSalary: number;
  bonus: number;
  stock: number;
  totalCompensation: number;
  source: string;
  confidenceScore: number;
  isVerified: boolean;
  submittedAt: string;
}

// ─── Filters & Pagination ────────────────────────────────

export interface SalaryFilters {
  company?: string;
  role?: string;
  level?: string[];
  location?: string;
  currency?: string;
}

export type SortOption = 'total_comp_desc' | 'total_comp_asc' | 'date_desc';

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ─── Company Stats ───────────────────────────────────────

export interface CompanyStats {
  median_tc: number;
  min_tc: number;
  max_tc: number;
  count: number;
}

export interface LevelDistributionItem {
  level: string;
  count: number;
  percentage: number;
}

// ─── Comparison ──────────────────────────────────────────

export interface ComparisonDelta {
  base_delta: number;
  bonus_delta: number;
  stock_delta: number;
  tc_delta: number;
  experience_delta: number;
}

export type WinnerField = 'record1' | 'record2' | 'tie';

export interface WinnerResult {
  base: WinnerField;
  bonus: WinnerField;
  stock: WinnerField;
  total_compensation: WinnerField;
  overall: WinnerField;
}

export interface ComparisonResult {
  record1: SalaryForDisplay;
  record2: SalaryForDisplay;
  delta: ComparisonDelta;
  winner: WinnerResult;
}

// ─── Ingestion ───────────────────────────────────────────

export interface IngestPayload {
  company: string;
  role: string;
  level: string;
  location: string;
  currency: string;
  experienceYears: number;
  baseSalary: number;
  bonus?: number;
  stock?: number;
  source?: string;
  confidenceScore?: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  data?: IngestPayload;
}

// ─── API Response Types ──────────────────────────────────

export interface CompanyPageData {
  company: {
    id: string;
    name: string;
    slug: string;
    industry: string | null;
    headquarters: string | null;
    foundedYear: number | null;
    headcountRange: string | null;
    logoUrl: string | null;
  };
  salaries: SalaryForDisplay[];
  stats: CompanyStats;
  level_distribution: LevelDistributionItem[];
}
