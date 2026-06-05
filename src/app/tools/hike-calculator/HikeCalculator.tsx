'use client';

import React, { useState, useMemo } from 'react';
import { calculateHikeBreakdown } from '@/lib/calculators';
import { Input, Select, Badge } from '@/components/ui';
import { formatCurrency } from '@/lib/formatters';

export function HikeCalculator() {
  const [formValues, setFormValues] = useState({
    currentBase: 1200000,
    currentBonus: 100000,
    currentStock: 200000,
    proposedBase: 1800000,
    proposedBonus: 200000,
    proposedStock: 400000,
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
    return calculateHikeBreakdown(
      formValues.currentBase,
      formValues.currentBonus,
      formValues.currentStock,
      formValues.proposedBase,
      formValues.proposedBonus,
      formValues.proposedStock
    );
  }, [formValues]);

  const renderPercentageBadge = (percentage: number) => {
    if (percentage > 0) {
      return <Badge variant="green">+{percentage.toFixed(1)}%</Badge>;
    } else if (percentage < 0) {
      return <Badge variant="red">{percentage.toFixed(1)}%</Badge>;
    } else {
      return <Badge variant="slate">0.0%</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Inputs Column */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        <div className="bg-white border border-[#EBEBEB] rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <h2 className="text-sm font-bold text-[#222222] border-b border-[#EBEBEB] pb-3">
            Configuration
          </h2>
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
        </div>

        {/* Current Package */}
        <div className="bg-white border border-[#EBEBEB] rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <h2 className="text-sm font-bold text-[#222222] border-b border-[#EBEBEB] pb-3 flex items-center justify-between">
            <span>Current Package</span>
            <span className="text-xs text-[#717171]">
              TC: {formatCurrency(results.current.totalComp, formValues.currency)}
            </span>
          </h2>
          <div className="flex flex-col gap-2">
            <Input
              label="Annual Base Salary"
              name="currentBase"
              type="number"
              min="0"
              value={formValues.currentBase}
              onChange={handleInputChange}
            />
            <input
              type="range"
              name="currentBase"
              min="100000"
              max="15000000"
              step="50000"
              value={formValues.currentBase}
              onChange={handleInputChange}
              className="w-full h-1.5 bg-[#EBEBEB] rounded-lg appearance-none cursor-pointer accent-[#FF5A5F]"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Input
              label="Annual Bonus / Variable"
              name="currentBonus"
              type="number"
              min="0"
              value={formValues.currentBonus}
              onChange={handleInputChange}
            />
            <input
              type="range"
              name="currentBonus"
              min="0"
              max="5000000"
              step="25000"
              value={formValues.currentBonus}
              onChange={handleInputChange}
              className="w-full h-1.5 bg-[#EBEBEB] rounded-lg appearance-none cursor-pointer accent-[#FF5A5F]"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Input
              label="Stock Value (Per Year)"
              name="currentStock"
              type="number"
              min="0"
              value={formValues.currentStock}
              onChange={handleInputChange}
            />
            <input
              type="range"
              name="currentStock"
              min="0"
              max="10000000"
              step="50000"
              value={formValues.currentStock}
              onChange={handleInputChange}
              className="w-full h-1.5 bg-[#EBEBEB] rounded-lg appearance-none cursor-pointer accent-[#FF5A5F]"
            />
          </div>
        </div>

        {/* Proposed Package */}
        <div className="bg-white border border-[#EBEBEB] rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <h2 className="text-sm font-bold text-[#222222] border-b border-[#EBEBEB] pb-3 flex items-center justify-between">
            <span>Proposed Offer</span>
            <span className="text-xs text-[#FF5A5F]">
              TC: {formatCurrency(results.proposed.totalComp, formValues.currency)}
            </span>
          </h2>
          <div className="flex flex-col gap-2">
            <Input
              label="Annual Base Salary"
              name="proposedBase"
              type="number"
              min="0"
              value={formValues.proposedBase}
              onChange={handleInputChange}
            />
            <input
              type="range"
              name="proposedBase"
              min="100000"
              max="15000000"
              step="50000"
              value={formValues.proposedBase}
              onChange={handleInputChange}
              className="w-full h-1.5 bg-[#EBEBEB] rounded-lg appearance-none cursor-pointer accent-[#FF5A5F]"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Input
              label="Annual Bonus / Variable"
              name="proposedBonus"
              type="number"
              min="0"
              value={formValues.proposedBonus}
              onChange={handleInputChange}
            />
            <input
              type="range"
              name="proposedBonus"
              min="0"
              max="5000000"
              step="25000"
              value={formValues.proposedBonus}
              onChange={handleInputChange}
              className="w-full h-1.5 bg-[#EBEBEB] rounded-lg appearance-none cursor-pointer accent-[#FF5A5F]"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Input
              label="Stock Value (Per Year)"
              name="proposedStock"
              type="number"
              min="0"
              value={formValues.proposedStock}
              onChange={handleInputChange}
            />
            <input
              type="range"
              name="proposedStock"
              min="0"
              max="10000000"
              step="50000"
              value={formValues.proposedStock}
              onChange={handleInputChange}
              className="w-full h-1.5 bg-[#EBEBEB] rounded-lg appearance-none cursor-pointer accent-[#FF5A5F]"
            />
          </div>
        </div>
      </div>

      {/* Outputs Column */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-[#EBEBEB] rounded-xl p-6 shadow-sm flex flex-col gap-1.5 justify-between">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#717171]">
              Overall Total Comp Hike Rate
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-black text-[#FF5A5F] tracking-tight">
                {results.percentages.totalComp.toFixed(1)}%
              </span>
              <span className="text-sm text-[#717171] font-semibold">Increase</span>
            </div>
          </div>

          <div className="bg-white border border-[#EBEBEB] rounded-xl p-6 shadow-sm flex flex-col gap-1.5 justify-between">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#717171]">
              Absolute Annual TC Increase
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-[#008A05] tracking-tight">
                +{formatCurrency(results.deltas.totalComp, formValues.currency)}
              </span>
            </div>
            <span className="text-[10px] text-[#717171]">
              Equates to roughly +{formatCurrency(results.deltas.totalComp / 12, formValues.currency)} more gross per month.
            </span>
          </div>
        </div>

        {/* Detailed Breakdown Comparison Table */}
        <div className="bg-white border border-[#EBEBEB] rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#EBEBEB] bg-slate-50/50">
            <h3 className="text-sm font-bold text-[#222222]">
              Hike Metrics Breakdown
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#EBEBEB] text-xs uppercase font-extrabold text-[#717171] bg-slate-50/30">
                  <th className="py-3 px-5">Compensation Element</th>
                  <th className="py-3 px-5 text-right">Current</th>
                  <th className="py-3 px-5 text-right">Proposed</th>
                  <th className="py-3 px-5 text-right">Absolute Increase</th>
                  <th className="py-3 px-5 text-right">Percentage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBEBEB] text-[#484848] font-medium">
                <tr>
                  <td className="py-4 px-5">Annual Base Salary</td>
                  <td className="py-4 px-5 text-right">{formatCurrency(results.current.base, formValues.currency)}</td>
                  <td className="py-4 px-5 text-right font-semibold text-[#222222]">{formatCurrency(results.proposed.base, formValues.currency)}</td>
                  <td className="py-4 px-5 text-right text-[#008A05] font-bold">+{formatCurrency(results.deltas.base, formValues.currency)}</td>
                  <td className="py-4 px-5 text-right">{renderPercentageBadge(results.percentages.base)}</td>
                </tr>
                <tr>
                  <td className="py-4 px-5">Annual Bonus / Variable</td>
                  <td className="py-4 px-5 text-right">{formatCurrency(results.current.bonus, formValues.currency)}</td>
                  <td className="py-4 px-5 text-right font-semibold text-[#222222]">{formatCurrency(results.proposed.bonus, formValues.currency)}</td>
                  <td className="py-4 px-5 text-right text-[#008A05] font-bold">+{formatCurrency(results.deltas.bonus, formValues.currency)}</td>
                  <td className="py-4 px-5 text-right">{renderPercentageBadge(results.percentages.bonus)}</td>
                </tr>
                <tr>
                  <td className="py-4 px-5">Stock Value (Per Year)</td>
                  <td className="py-4 px-5 text-right">{formatCurrency(results.current.stock, formValues.currency)}</td>
                  <td className="py-4 px-5 text-right font-semibold text-[#222222]">{formatCurrency(results.proposed.stock, formValues.currency)}</td>
                  <td className="py-4 px-5 text-right text-[#008A05] font-bold">+{formatCurrency(results.deltas.stock, formValues.currency)}</td>
                  <td className="py-4 px-5 text-right">{renderPercentageBadge(results.percentages.stock)}</td>
                </tr>
                <tr className="border-t-2 border-[#EBEBEB] text-[#222222] font-extrabold bg-slate-50">
                  <td className="py-4 px-5">Total Compensation (TC)</td>
                  <td className="py-4 px-5 text-right">{formatCurrency(results.current.totalComp, formValues.currency)}</td>
                  <td className="py-4 px-5 text-right">{formatCurrency(results.proposed.totalComp, formValues.currency)}</td>
                  <td className="py-4 px-5 text-right text-[#008A05] text-base">+{formatCurrency(results.deltas.totalComp, formValues.currency)}</td>
                  <td className="py-4 px-5 text-right">{renderPercentageBadge(results.percentages.totalComp)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
