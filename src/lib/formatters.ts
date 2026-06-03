import { LEVEL_DISPLAY_MAP } from '@/types';

/**
 * Convert BigInt to Number safely.
 */
export function bigintToNumber(value: bigint | number): number {
  return typeof value === 'bigint' ? Number(value) : value;
}

/**
 * Format a number using the Indian numbering system.
 * 4200000 → "42,00,000"
 */
export function formatIndianNumber(num: number | bigint): string {
  const n = bigintToNumber(num);
  const str = Math.floor(Math.abs(n)).toString();
  if (str.length <= 3) return (n < 0 ? '-' : '') + str;

  let result = str.slice(-3);
  let remaining = str.slice(0, -3);
  while (remaining.length > 0) {
    result = remaining.slice(-2) + ',' + result;
    remaining = remaining.slice(0, -2);
  }
  return (n < 0 ? '-' : '') + result;
}

/**
 * Format salary amount in compact form.
 * INR: ₹42.0L (lakhs), ₹4.2Cr (crores)
 * USD: $50.4K (thousands), $1.2M (millions)
 */
export function formatCurrency(
  amount: number | bigint,
  currency: string
): string {
  const n = bigintToNumber(amount);
  const abs = Math.abs(n);

  if (currency === 'INR') {
    if (abs >= 10000000) {
      return `₹${(n / 10000000).toFixed(1)}Cr`;
    }
    if (abs >= 100000) {
      return `₹${(n / 100000).toFixed(1)}L`;
    }
    if (abs >= 1000) {
      return `₹${(n / 1000).toFixed(1)}K`;
    }
    return `₹${n.toLocaleString('en-IN')}`;
  }

  const symbol =
    currency === 'USD' ? '$' : currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '';

  if (abs >= 1000000) {
    return `${symbol}${(n / 1000000).toFixed(1)}M`;
  }
  if (abs >= 1000) {
    return `${symbol}${(n / 1000).toFixed(0)}K`;
  }
  return `${symbol}${n.toLocaleString('en-US')}`;
}

/**
 * Ultra-compact format for table cells.
 */
export function formatCompactCurrency(
  amount: number | bigint,
  currency: string
): string {
  return formatCurrency(amount, currency);
}

/**
 * Format a Prisma Level enum value for display.
 * SDE_I → "SDE-I", STAFF → "Staff", L5 → "L5"
 */
export function formatLevel(level: string): string {
  return LEVEL_DISPLAY_MAP[level] || level;
}

/**
 * Format experience years. 5 → "5 yrs", 1 → "1 yr"
 */
export function formatExperience(years: number): string {
  return years === 1 ? '1 yr' : `${years} yrs`;
}

/**
 * Format a date for display. Returns "Jan 15, 2025" format.
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
