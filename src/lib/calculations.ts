/**
 * Compute total compensation. Always server-side, never trust client.
 * Formula: total_compensation = base_salary + bonus + stock
 */
export function computeTotalCompensation(
  base: bigint | number,
  bonus: bigint | number,
  stock: bigint | number
): bigint {
  return BigInt(base) + BigInt(bonus) + BigInt(stock);
}

/**
 * Calculate median of a number array.
 */
export function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

/**
 * Calculate minimum value.
 */
export function calculateMin(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.min(...values);
}

/**
 * Calculate maximum value.
 */
export function calculateMax(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.max(...values);
}

/**
 * Calculate distribution of levels in salary records.
 * Returns sorted array: [{ level, count, percentage }]
 */
export function calculateDistribution(
  salaries: Array<{ level: string }>
): Array<{ level: string; count: number; percentage: number }> {
  const counts: Record<string, number> = {};
  for (const s of salaries) {
    counts[s.level] = (counts[s.level] || 0) + 1;
  }
  const total = salaries.length;
  return Object.entries(counts)
    .map(([level, count]) => ({
      level,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Parse experience range input. "5-8" → midpoint 6. Number → as-is.
 */
export function parseExperienceRange(input: string | number): number {
  if (typeof input === 'number') return Math.round(input);
  const parts = input.split('-').map((p) => parseInt(p.trim(), 10));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return Math.round((parts[0] + parts[1]) / 2);
  }
  const parsed = parseInt(input, 10);
  if (isNaN(parsed)) throw new Error(`Invalid experience value: ${input}`);
  return parsed;
}

/**
 * Safe BigInt → Number conversion.
 */
export function bigintToNumber(value: bigint | number): number {
  return typeof value === 'bigint' ? Number(value) : value;
}
