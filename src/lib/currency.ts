import { EXCHANGE_RATES } from './config';

type CurrencyCode = keyof typeof EXCHANGE_RATES;

/**
 * Convert an amount from any supported currency to INR.
 */
export function convertToINR(amount: number, fromCurrency: string): number {
  const rate = EXCHANGE_RATES[fromCurrency as CurrencyCode];
  if (!rate) return amount;
  return amount * rate;
}

/**
 * Convert an INR amount to a target currency.
 */
export function convertFromINR(amount: number, toCurrency: string): number {
  const rate = EXCHANGE_RATES[toCurrency as CurrencyCode];
  if (!rate) return amount;
  return amount / rate;
}

/**
 * Convert between any two supported currencies via INR.
 * Example: convertCurrency(50000, 'USD', 'INR') → 4166500
 */
export function convertCurrency(
  amount: number,
  from: string,
  to: string
): number {
  if (from === to) return amount;
  const inINR = convertToINR(amount, from);
  return convertFromINR(inINR, to);
}
