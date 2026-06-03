import { getSalaryById } from './salary.service';
import { convertCurrency } from '@/lib/currency';
import type { ComparisonResult, ComparisonDelta, WinnerResult, WinnerField } from '@/types';

/**
 * Compare two salary records by fetching them, converting currency if needed,
 * and calculating deltas and winners.
 */
export async function compareSalaries(id1: string, id2: string): Promise<ComparisonResult | null> {
  if (id1 === id2) {
    throw new Error('Cannot compare identical records');
  }

  const record1 = await getSalaryById(id1);
  const record2 = await getSalaryById(id2);

  if (!record1 || !record2) {
    return null;
  }

  // Convert record2's values to record1's currency for a fair comparison in record1's currency
  const r2BaseConverted = convertCurrency(record2.baseSalary, record2.currency, record1.currency);
  const r2BonusConverted = convertCurrency(record2.bonus, record2.currency, record1.currency);
  const r2StockConverted = convertCurrency(record2.stock, record2.currency, record1.currency);
  const r2TcConverted = convertCurrency(record2.totalCompensation, record2.currency, record1.currency);

  const delta: ComparisonDelta = {
    base_delta: Number((record1.baseSalary - r2BaseConverted).toFixed(2)),
    bonus_delta: Number((record1.bonus - r2BonusConverted).toFixed(2)),
    stock_delta: Number((record1.stock - r2StockConverted).toFixed(2)),
    tc_delta: Number((record1.totalCompensation - r2TcConverted).toFixed(2)),
    experience_delta: record1.experienceYears - record2.experienceYears,
  };

  const winner: WinnerResult = {
    base: determineWinnerField(record1.baseSalary, r2BaseConverted),
    bonus: determineWinnerField(record1.bonus, r2BonusConverted),
    stock: determineWinnerField(record1.stock, r2StockConverted),
    total_compensation: determineWinnerField(record1.totalCompensation, r2TcConverted),
    overall: determineWinnerField(record1.totalCompensation, r2TcConverted),
  };

  return {
    record1,
    record2,
    delta,
    winner,
  };
}

function determineWinnerField(val1: number, val2: number): WinnerField {
  // Use a small epsilon to avoid floating point precision issues in currency conversion
  const diff = val1 - val2;
  if (diff > 0.01) return 'record1';
  if (diff < -0.01) return 'record2';
  return 'tie';
}
