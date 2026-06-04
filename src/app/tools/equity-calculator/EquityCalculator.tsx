'use client';

import React, { useState, useMemo } from 'react';
import { calculateEquityVestingBreakdown } from '@/lib/calculators';
import { Input, Select } from '@/components/ui';
import { formatCurrency } from '@/lib/formatters';

export function EquityCalculator() {
  const [formValues, setFormValues] = useState({
    optionsCount: 1000,
    strikePrice: 100,
    currentPrice: 250,
    vestingYears: 4,
    cliffYears: 1,
    exitMultiple: 5,
    currency: 'INR',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: name === 'currency' ? value : parseFloat(value) || 0,
    }));
  };

  const results = useMemo(() => {
    return calculateEquityVestingBreakdown(
      formValues.optionsCount,
      formValues.strikePrice,
      formValues.currentPrice,
      formValues.vestingYears,
      formValues.cliffYears,
      formValues.exitMultiple
    );
  }, [formValues]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Inputs Column */}
      <div className="lg:col-span-1 bg-white border border-[#EBEBEB] rounded-xl p-6 shadow-sm flex flex-col gap-5">
        <h2 className="text-base font-bold text-[#222222] border-b border-[#EBEBEB] pb-3">
          Equity Parameters
        </h2>

        <div className="flex flex-col gap-4">
          <Select
            label="Currency"
            name="currency"
            value={formValues.currency}
            onChange={handleInputChange}
            options={[
              { value: 'INR', label: 'INR (₹)' },
              { value: 'USD', label: 'USD ($)' },
              { value: 'GBP', label: 'GBP (£)' },
              { value: 'EUR', label: 'EUR (€)' },
            ]}
          />

          <Input
            label="Number of Options / Shares"
            name="optionsCount"
            type="number"
            min="1"
            value={formValues.optionsCount}
            onChange={handleInputChange}
            required
          />

          <Input
            label="Strike Price (Grant Price)"
            name="strikePrice"
            type="number"
            min="0"
            value={formValues.strikePrice}
            onChange={handleInputChange}
            required
          />

          <Input
            label="Current Share Price (FMV)"
            name="currentPrice"
            type="number"
            min="0"
            value={formValues.currentPrice}
            onChange={handleInputChange}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Vesting Period"
              name="vestingYears"
              value={formValues.vestingYears}
              onChange={handleInputChange}
              options={[
                { value: '1', label: '1 Year' },
                { value: '2', label: '2 Years' },
                { value: '3', label: '3 Years' },
                { value: '4', label: '4 Years' },
                { value: '5', label: '5 Years' },
              ]}
            />

            <Select
              label="Cliff Period"
              name="cliffYears"
              value={formValues.cliffYears}
              onChange={handleInputChange}
              options={[
                { value: '0', label: 'No Cliff' },
                { value: '1', label: '1 Year' },
                { value: '2', label: '2 Years' },
              ]}
            />
          </div>

          <Select
            label="IPO / Acquisition Exit Value Multiple"
            name="exitMultiple"
            value={formValues.exitMultiple}
            onChange={handleInputChange}
            options={[
              { value: '1', label: '1x (No Growth)' },
              { value: '2', label: '2x exit value' },
              { value: '3', label: '3x exit value' },
              { value: '5', label: '5x exit value' },
              { value: '10', label: '10x exit value' },
              { value: '20', label: '20x exit value' },
            ]}
          />
        </div>
      </div>

      {/* Outputs Column */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-[#EBEBEB] rounded-xl p-6 shadow-sm flex flex-col gap-1.5 justify-between">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#717171]">
              Vested Net Value Today (Gross)
            </span>
            <div className="flex flex-col gap-1 mt-1">
              <span className="text-3xl font-black text-[#222222] tracking-tight">
                {formatCurrency(results.totalValueToday, formValues.currency)}
              </span>
              <span className="text-xs text-[#717171] font-semibold">
                Option Spread: {formatCurrency(Math.max(0, formValues.currentPrice - formValues.strikePrice), formValues.currency)} per share
              </span>
            </div>
          </div>

          <div className="bg-[#FF5A5F]/5 border border-[#FF5A5F]/10 rounded-xl p-6 shadow-sm flex flex-col gap-1.5 justify-between">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#FF5A5F]">
              Projected Value at Exit ({formValues.exitMultiple}x Valuation)
            </span>
            <div className="flex flex-col gap-1 mt-1">
              <span className="text-3xl font-black text-[#FF5A5F] tracking-tight">
                {formatCurrency(results.totalValueAtExit, formValues.currency)}
              </span>
              <span className="text-xs text-[#717171] font-semibold">
                Exit Stock Price: {formatCurrency(results.exitPrice, formValues.currency)} per share
              </span>
            </div>
          </div>
        </div>

        {/* Vesting Schedule Table */}
        <div className="bg-white border border-[#EBEBEB] rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#EBEBEB] bg-slate-50/50">
            <h3 className="text-sm font-bold text-[#222222]">
              Yearly Vesting Payout Schedule
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#EBEBEB] text-xs uppercase font-extrabold text-[#717171] bg-slate-50/30">
                  <th className="py-3 px-5">Vesting Period</th>
                  <th className="py-3 px-5 text-right">Percent Vested</th>
                  <th className="py-3 px-5 text-right">Shares Vested</th>
                  <th className="py-3 px-5 text-right">Value (Current Price)</th>
                  <th className="py-3 px-5 text-right bg-[#FF5A5F]/5 text-[#FF5A5F]">Value (Exit Payout)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBEBEB] text-[#484848] font-medium">
                {results.vestingSchedule.map((row) => (
                  <tr key={row.year} className={row.shares === 0 ? 'bg-slate-50/30 text-slate-400' : ''}>
                    <td className="py-4 px-5">Year {row.year} {row.year === formValues.cliffYears ? <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded ml-1.5 border border-slate-300">Cliff</span> : ''}</td>
                    <td className="py-4 px-5 text-right">{row.vestedPercent.toFixed(0)}%</td>
                    <td className="py-4 px-5 text-right">{row.shares.toLocaleString()} shares</td>
                    <td className="py-4 px-5 text-right">{formatCurrency(row.valueToday, formValues.currency)}</td>
                    <td className="py-4 px-5 text-right bg-[#FF5A5F]/5 font-bold text-[#FF5A5F]">{formatCurrency(row.valueAtExit, formValues.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
