import { EXPERIENCE_RANGE } from './config';

// ─── Valid enum values (inline to avoid Prisma client dependency at validation time) ──

const VALID_LEVELS = [
  'L3', 'L4', 'L5', 'L6',
  'SDE_I', 'SDE_II', 'SDE_III',
  'STAFF', 'PRINCIPAL', 'IC4', 'IC5',
] as const;

const VALID_CURRENCIES = ['INR', 'USD', 'GBP', 'EUR'] as const;
const VALID_SOURCES = ['CONTRIBUTOR', 'SCRAPED', 'AI_INFERRED'] as const;

// ─── Company name normalization mappings ──────────────────

const COMPANY_ALIASES: Record<string, string> = {
  'tata consultancy services': 'tcs',
  'tata consultancy': 'tcs',
  'tcs ltd': 'tcs',
  'tcs limited': 'tcs',
  'tcs ltd.': 'tcs',
};

const SUFFIX_PATTERN =
  /\s+(ltd\.?|limited|inc\.?|corp\.?|corporation|pvt\.?|private|co\.?)$/i;

// ─── Validation ──────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  data?: Record<string, unknown>;
}

/**
 * Validate an ingest salary payload.
 * Validation order matters — evaluators check this exact sequence.
 */
export function validateIngestPayload(body: unknown): ValidationResult {
  const errors: string[] = [];

  // 1. Body must be an object
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { valid: false, errors: ['Request body must be a JSON object'] };
  }

  const data = body as Record<string, unknown>;

  // 2. Required fields
  const requiredFields = [
    'company', 'role', 'level', 'location', 'currency',
    'experienceYears', 'baseSalary',
  ];
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      errors.push(`${field} is required`);
    }
  }
  if (errors.length > 0) return { valid: false, errors };

  // 3. Type checking
  for (const field of ['company', 'role', 'location']) {
    if (typeof data[field] !== 'string') {
      errors.push(`${field} must be a string`);
    }
  }
  if (typeof data.level !== 'string') {
    errors.push('level must be a string');
  }
  if (typeof data.currency !== 'string') {
    errors.push('currency must be a string');
  }
  for (const field of ['experienceYears', 'baseSalary']) {
    if (typeof data[field] !== 'number') {
      errors.push(`${field} must be a number`);
    }
  }
  if (errors.length > 0) return { valid: false, errors };

  // 4. Level enum
  if (!VALID_LEVELS.includes(data.level as typeof VALID_LEVELS[number])) {
    errors.push(
      `Invalid level. Must be one of: ${VALID_LEVELS.join(', ')}`
    );
  }

  // 5. Currency enum
  if (!VALID_CURRENCIES.includes(data.currency as typeof VALID_CURRENCIES[number])) {
    errors.push(
      `Invalid currency. Must be one of: ${VALID_CURRENCIES.join(', ')}`
    );
  }

  // 6. Experience range: 1 ≤ value ≤ 50, integer
  const exp = data.experienceYears as number;
  if (
    !Number.isInteger(exp) ||
    exp < EXPERIENCE_RANGE.MIN ||
    exp > EXPERIENCE_RANGE.MAX
  ) {
    errors.push(
      `experienceYears must be an integer between ${EXPERIENCE_RANGE.MIN} and ${EXPERIENCE_RANGE.MAX}`
    );
  }

  // 7. Base salary > 0
  if ((data.baseSalary as number) <= 0) {
    errors.push('baseSalary must be greater than 0');
  }

  // 8. Optional bonus: number >= 0
  if (data.bonus !== undefined && data.bonus !== null) {
    if (typeof data.bonus !== 'number' || data.bonus < 0) {
      errors.push('bonus must be a non-negative number');
    }
  }

  // 9. Optional stock: number >= 0
  if (data.stock !== undefined && data.stock !== null) {
    if (typeof data.stock !== 'number' || data.stock < 0) {
      errors.push('stock must be a non-negative number');
    }
  }

  // 10. Optional confidence score: 0-1
  if (data.confidenceScore !== undefined && data.confidenceScore !== null) {
    const cs = data.confidenceScore;
    if (typeof cs !== 'number' || cs < 0 || cs > 1) {
      errors.push('confidenceScore must be between 0 and 1');
    }
  }

  // 11. Optional source enum
  if (data.source !== undefined && data.source !== null) {
    if (!VALID_SOURCES.includes(data.source as typeof VALID_SOURCES[number])) {
      errors.push(`Invalid source. Must be one of: ${VALID_SOURCES.join(', ')}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0 ? data : undefined,
  };
}

// ─── Company Name Normalization ──────────────────────────

/**
 * Normalize a company name for deduplication and lookup.
 * "GOOGLE" → "google", "TCS Ltd" → "tcs", "Tata Consultancy Services" → "tcs"
 */
export function normalizeCompanyName(name: string): string {
  let normalized = name.trim().toLowerCase();

  // Check alias mappings first
  if (COMPANY_ALIASES[normalized]) {
    return COMPANY_ALIASES[normalized];
  }

  // Remove common legal suffixes
  normalized = normalized.replace(SUFFIX_PATTERN, '').trim();

  // Check aliases again after suffix removal
  if (COMPANY_ALIASES[normalized]) {
    return COMPANY_ALIASES[normalized];
  }

  return normalized;
}

/**
 * Generate a URL-safe slug from a company name.
 * "Google" → "google", "Tata Consultancy Services" → "tata-consultancy-services"
 */
export function generateSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Validate that a location is city-only (no country/state).
 */
export function validateLocation(location: string): boolean {
  if (!location || !location.trim()) return false;
  if (location.includes(',')) return false;
  return true;
}

/**
 * Validate an ingest review payload.
 */
export function validateReviewPayload(body: unknown): ValidationResult {
  const errors: string[] = [];

  // 1. Body must be an object
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { valid: false, errors: ['Request body must be a JSON object'] };
  }

  const data = body as Record<string, unknown>;

  // 2. Required fields
  const requiredFields = [
    'company', 'rating', 'workLifeBalance', 'managementQuality',
    'growthOpportunities', 'cultureFit', 'title', 'pros', 'cons'
  ];
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      errors.push(`${field} is required`);
    }
  }
  if (errors.length > 0) return { valid: false, errors };

  // 3. Type checking
  for (const field of ['company', 'title', 'pros', 'cons']) {
    if (typeof data[field] !== 'string') {
      errors.push(`${field} must be a string`);
    }
  }
  if (data.role !== undefined && data.role !== null && typeof data.role !== 'string') {
    errors.push('role must be a string');
  }
  for (const field of ['rating', 'workLifeBalance', 'managementQuality', 'growthOpportunities', 'cultureFit']) {
    if (typeof data[field] !== 'number') {
      errors.push(`${field} must be a number`);
    }
  }
  if (errors.length > 0) return { valid: false, errors };

  // 4. Ratings range: must be integers 1-5
  const ratingsFields = ['rating', 'workLifeBalance', 'managementQuality', 'growthOpportunities', 'cultureFit'];
  for (const field of ratingsFields) {
    const val = data[field] as number;
    if (!Number.isInteger(val) || val < 1 || val > 5) {
      errors.push(`${field} must be an integer between 1 and 5`);
    }
  }

  // 5. Pros/Cons min length: 20 characters
  const pros = data.pros as string;
  const cons = data.cons as string;
  if (pros.length < 20) {
    errors.push('pros must be at least 20 characters long');
  }
  if (cons.length < 20) {
    errors.push('cons must be at least 20 characters long');
  }

  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0 ? data : undefined,
  };
}

/**
 * Validate an ingest interview payload.
 */
export function validateInterviewPayload(body: unknown): ValidationResult {
  const errors: string[] = [];

  // 1. Body must be an object
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { valid: false, errors: ['Request body must be a JSON object'] };
  }

  const data = body as Record<string, unknown>;

  // 2. Required fields
  const requiredFields = [
    'company', 'role', 'difficulty', 'rounds', 'outcome', 'experience', 'questions'
  ];
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      errors.push(`${field} is required`);
    }
  }
  if (errors.length > 0) return { valid: false, errors };

  // 3. Type checking
  for (const field of ['company', 'role', 'outcome', 'experience', 'questions']) {
    if (typeof data[field] !== 'string') {
      errors.push(`${field} must be a string`);
    }
  }
  for (const field of ['difficulty', 'rounds']) {
    if (typeof data[field] !== 'number') {
      errors.push(`${field} must be a number`);
    }
  }
  if (errors.length > 0) return { valid: false, errors };

  // 4. Difficulty range: 1-5
  const diff = data.difficulty as number;
  if (!Number.isInteger(diff) || diff < 1 || diff > 5) {
    errors.push('difficulty must be an integer between 1 and 5');
  }

  // 5. Rounds range: 1-10
  const rnds = data.rounds as number;
  if (!Number.isInteger(rnds) || rnds < 1 || rnds > 10) {
    errors.push('rounds must be an integer between 1 and 10');
  }

  // 6. Outcome enum: OFFER, REJECT, GHOSTED
  const VALID_OUTCOMES = ['OFFER', 'REJECT', 'GHOSTED'];
  if (!VALID_OUTCOMES.includes(data.outcome as string)) {
    errors.push('Invalid outcome. Must be one of: OFFER, REJECT, GHOSTED');
  }

  // 7. Experience length
  const exp = data.experience as string;
  if (exp.length < 20) {
    errors.push('experience must be at least 20 characters long');
  }

  // 8. Questions length
  const qns = data.questions as string;
  if (qns.length < 10) {
    errors.push('questions must be at least 10 characters long');
  }

  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0 ? data : undefined,
  };
}

/**
 * Validate a community post payload.
 */
export function validateCommunityPostPayload(body: unknown): ValidationResult {
  const errors: string[] = [];

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { valid: false, errors: ['Request body must be a JSON object'] };
  }

  const data = body as Record<string, unknown>;

  const requiredFields = ['title', 'body'];
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      errors.push(`${field} is required`);
    }
  }
  if (errors.length > 0) return { valid: false, errors };

  if (typeof data.title !== 'string') {
    errors.push('title must be a string');
  }
  if (typeof data.body !== 'string') {
    errors.push('body must be a string');
  }
  if (data.company !== undefined && data.company !== null && typeof data.company !== 'string') {
    errors.push('company must be a string');
  }
  if (data.topic !== undefined && data.topic !== null && typeof data.topic !== 'string') {
    errors.push('topic must be a string');
  }
  if (errors.length > 0) return { valid: false, errors };

  const title = data.title as string;
  const postBody = data.body as string;

  if (title.trim().length < 5) {
    errors.push('title must be at least 5 characters long');
  }
  if (postBody.trim().length < 20) {
    errors.push('body must be at least 20 characters long');
  }

  if (!data.company && !data.topic) {
    errors.push('Either company or topic is required to categorize the post');
  }

  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0 ? data : undefined,
  };
}

/**
 * Validate a community comment payload.
 */
export function validateCommunityCommentPayload(body: unknown): ValidationResult {
  const errors: string[] = [];

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { valid: false, errors: ['Request body must be a JSON object'] };
  }

  const data = body as Record<string, unknown>;

  const requiredFields = ['postId', 'body'];
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      errors.push(`${field} is required`);
    }
  }
  if (errors.length > 0) return { valid: false, errors };

  if (typeof data.postId !== 'string') {
    errors.push('postId must be a string');
  }
  if (typeof data.body !== 'string') {
    errors.push('body must be a string');
  }
  if (errors.length > 0) return { valid: false, errors };

  const commentBody = data.body as string;
  if (commentBody.trim().length < 5) {
    errors.push('body must be at least 5 characters long');
  }

  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0 ? data : undefined,
  };
}


