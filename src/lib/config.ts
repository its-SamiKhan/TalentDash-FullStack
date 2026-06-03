// ─── TalentDash Configuration ────────────────────────────
// Single source of truth. Never hardcode these values in components.

/** Exchange rates relative to INR. 1 USD = 83.33 INR, etc. */
export const EXCHANGE_RATES = {
  INR: 1,
  USD: 83.33,
  GBP: 105.2,
  EUR: 90.8,
} as const;

export const INR_TO_USD = 83.33;

export const PAGINATION = {
  DEFAULT_LIMIT: 25,
  MAX_LIMIT: 100,
} as const;

export const DUPLICATE_WINDOW_HOURS = 48;
export const DUPLICATE_SALARY_THRESHOLD = 0.1; // 10%

export const EXPERIENCE_RANGE = {
  MIN: 1,
  MAX: 50,
} as const;

export const CONFIDENCE_THRESHOLDS = {
  VERIFIED: 0.95,
  VALIDATED_SCRAPE: 0.75,
  AI_INFERRED: 0.6,
  FLAGGED: 0.4,
} as const;

export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
