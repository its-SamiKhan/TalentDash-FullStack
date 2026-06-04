import { EXCHANGE_RATES } from '@/lib/config';

// ─── Standard progressive tax estimation for India (New Tax Regime) ───
export function calculateProgressiveTax(income: number): number {
  if (income <= 0) return 0;
  
  let tax = 0;
  const brackets = [
    { limit: 300000, rate: 0 },
    { limit: 700000, rate: 0.05 },
    { limit: 1000000, rate: 0.10 },
    { limit: 1200000, rate: 0.15 },
    { limit: 1500000, rate: 0.20 },
    { limit: Infinity, rate: 0.30 }
  ];

  let lastLimit = 0;
  for (const bracket of brackets) {
    if (income > bracket.limit) {
      tax += (bracket.limit - lastLimit) * bracket.rate;
      lastLimit = bracket.limit;
    } else {
      tax += (income - lastLimit) * bracket.rate;
      break;
    }
  }
  return tax;
}

/**
 * 1. Salary Calculator Logic
 */
export function calculateSalaryBreakdown(
  base: number,
  bonus: number,
  stock: number,
  taxOption: 'standard' | 'custom',
  customRate: number = 0
) {
  const totalComp = base + bonus + stock;
  const cashSalary = base + bonus;

  let estimatedTax = 0;
  if (taxOption === 'custom') {
    estimatedTax = cashSalary * (customRate / 100);
  } else {
    estimatedTax = calculateProgressiveTax(cashSalary);
  }

  const yearlyTakeHome = cashSalary - estimatedTax + stock;
  const monthlyTakeHome = (cashSalary - estimatedTax) / 12;

  return {
    yearly: {
      base,
      bonus,
      stock,
      totalComp,
      tax: estimatedTax,
      takeHome: yearlyTakeHome,
    },
    monthly: {
      base: base / 12,
      bonus: bonus / 12,
      stock: stock / 12,
      totalComp: totalComp / 12,
      tax: estimatedTax / 12,
      takeHome: monthlyTakeHome,
    },
    ratios: {
      basePercent: totalComp > 0 ? (base / totalComp) * 100 : 0,
      bonusPercent: totalComp > 0 ? (bonus / totalComp) * 100 : 0,
      stockPercent: totalComp > 0 ? (stock / totalComp) * 100 : 0,
    }
  };
}

/**
 * 2. Hike Calculator Logic
 */
export function calculateHikeBreakdown(
  currentBase: number,
  currentBonus: number,
  currentStock: number,
  proposedBase: number,
  proposedBonus: number,
  proposedStock: number
) {
  const currentTC = currentBase + currentBonus + currentStock;
  const proposedTC = proposedBase + proposedBonus + proposedStock;

  const baseDelta = proposedBase - currentBase;
  const bonusDelta = proposedBonus - currentBonus;
  const stockDelta = proposedStock - currentStock;
  const tcDelta = proposedTC - currentTC;

  return {
    current: { base: currentBase, bonus: currentBonus, stock: currentStock, totalComp: currentTC },
    proposed: { base: proposedBase, bonus: proposedBonus, stock: proposedStock, totalComp: proposedTC },
    deltas: {
      base: baseDelta,
      bonus: bonusDelta,
      stock: stockDelta,
      totalComp: tcDelta,
    },
    percentages: {
      base: currentBase > 0 ? (baseDelta / currentBase) * 100 : 0,
      bonus: currentBonus > 0 ? (bonusDelta / currentBonus) * 100 : 0,
      stock: currentStock > 0 ? (stockDelta / currentStock) * 100 : 0,
      totalComp: currentTC > 0 ? (tcDelta / currentTC) * 100 : 0,
    }
  };
}

/**
 * 3. ESOP / Equity Vesting Logic
 */
export function calculateEquityVestingBreakdown(
  optionsCount: number,
  strikePrice: number,
  currentPrice: number,
  vestingYears: number = 4,
  cliffYears: number = 1,
  exitMultiple: number = 1
) {
  const exitPrice = currentPrice * exitMultiple;
  
  const currentValuePerOption = Math.max(0, currentPrice - strikePrice);
  const exitValuePerOption = Math.max(0, exitPrice - strikePrice);

  const totalValueToday = optionsCount * currentValuePerOption;
  const totalValueAtExit = optionsCount * exitValuePerOption;

  const vestingSchedule = [];
  for (let year = 1; year <= vestingYears; year++) {
    let vestedPercent = (year / vestingYears) * 100;
    if (year < cliffYears) {
      vestedPercent = 0;
    }
    const vestedShares = (vestedPercent / 100) * optionsCount;
    const valueToday = vestedShares * currentValuePerOption;
    const valueAtExit = vestedShares * exitValuePerOption;

    vestingSchedule.push({
      year,
      vestedPercent,
      shares: vestedShares,
      valueToday,
      valueAtExit,
    });
  }

  return {
    totalValueToday,
    totalValueAtExit,
    exitPrice,
    vestingSchedule,
  };
}

/**
 * 4. Offer Comparison Logic
 */
export function compareTwoOffers(
  offerA: { company: string; base: number; bonus: number; stock: number; currency: 'INR' | 'USD' | 'GBP' | 'EUR' },
  offerB: { company: string; base: number; bonus: number; stock: number; currency: 'INR' | 'USD' | 'GBP' | 'EUR' },
  targetCurrency: 'INR' | 'USD' | 'GBP' | 'EUR' = 'INR'
) {
  const getExchangeRate = (from: string, to: string): number => {
    const fromInINR = EXCHANGE_RATES[from as keyof typeof EXCHANGE_RATES];
    const toInINR = EXCHANGE_RATES[to as keyof typeof EXCHANGE_RATES];
    return fromInINR / toInINR;
  };

  const convertValue = (amount: number, from: string): number => {
    return amount * getExchangeRate(from, targetCurrency);
  };

  // Convert Offer A to target currency
  const tcA_local = offerA.base + offerA.bonus + offerA.stock;
  const baseA = convertValue(offerA.base, offerA.currency);
  const bonusA = convertValue(offerA.bonus, offerA.currency);
  const stockA = convertValue(offerA.stock, offerA.currency);
  const tcA = baseA + bonusA + stockA;

  // Convert Offer B to target currency
  const tcB_local = offerB.base + offerB.bonus + offerB.stock;
  const baseB = convertValue(offerB.base, offerB.currency);
  const bonusB = convertValue(offerB.bonus, offerB.currency);
  const stockB = convertValue(offerB.stock, offerB.currency);
  const tcB = baseB + bonusB + stockB;

  const baseDelta = baseB - baseA;
  const bonusDelta = bonusB - bonusA;
  const stockDelta = stockB - stockA;
  const tcDelta = tcB - tcA;

  return {
    offerA: {
      ...offerA,
      converted: { base: baseA, bonus: bonusA, stock: stockA, totalComp: tcA },
      localTotalComp: tcA_local
    },
    offerB: {
      ...offerB,
      converted: { base: baseB, bonus: bonusB, stock: stockB, totalComp: tcB },
      localTotalComp: tcB_local
    },
    deltas: {
      base: baseDelta,
      bonus: bonusDelta,
      stock: stockDelta,
      totalComp: tcDelta,
    },
    percentages: {
      base: baseA > 0 ? (baseDelta / baseA) * 100 : 0,
      bonus: bonusA > 0 ? (bonusDelta / bonusA) * 100 : 0,
      stock: stockA > 0 ? (stockDelta / stockA) * 100 : 0,
      totalComp: tcA > 0 ? (tcDelta / tcA) * 100 : 0,
    },
    winners: {
      base: baseB > baseA ? 'offerB' : baseA > baseB ? 'offerA' : 'tie',
      bonus: bonusB > bonusA ? 'offerB' : bonusA > bonusB ? 'offerA' : 'tie',
      stock: stockB > stockA ? 'offerB' : stockA > stockB ? 'offerA' : 'tie',
      totalComp: tcB > tcA ? 'offerB' : tcA > tcB ? 'offerA' : 'tie',
    }
  };
}
