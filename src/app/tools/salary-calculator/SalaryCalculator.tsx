'use client';

import React, { useState, useMemo } from 'react';
import { calculateSalaryBreakdown } from '@/lib/calculators';
import { Input, Select } from '@/components/ui';
import { formatCurrency } from '@/lib/formatters';

export function SalaryCalculator() {
  const [formValues, setFormValues] = useState({
    base: 1800000,
    bonus: 200000,
    stock: 500000,
    currency: 'INR',
    taxOption: 'standard' as 'standard' | 'custom',
    customRate: 20,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: name === 'currency' || name === 'taxOption' ? value : parseFloat(value) || 0,
    }));
  };

  const results = useMemo(() => {
    return calculateSalaryBreakdown(
      formValues.base,
      formValues.bonus,
      formValues.stock,
      formValues.taxOption,
      formValues.customRate
    );
  }, [formValues]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Form Inputs */}
      <div className="lg:col-span-1 bg-white border border-[#EBEBEB] rounded-xl p-6 shadow-sm flex flex-col gap-5">
        <h2 className="text-base font-bold text-[#222222] border-b border-[#EBEBEB] pb-3">
          Compensation Inputs
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
            label="Base Salary (Annual)"
            name="base"
            type="number"
            min="0"
            value={formValues.base}
            onChange={handleInputChange}
            required
          />

          <Input
            label="Variable / Performance Bonus (Annual)"
            name="bonus"
            type="number"
            min="0"
            value={formValues.bonus}
            onChange={handleInputChange}
          />

          <Input
            label="Stock / Equity Value (Per Year)"
            name="stock"
            type="number"
            min="0"
            value={formValues.stock}
            onChange={handleInputChange}
          />

          <Select
            label="Tax Estimation Model"
            name="taxOption"
            value={formValues.taxOption}
            onChange={handleInputChange}
            options={[
              { value: 'standard', label: 'Standard Progressive Slabs (India)' },
              { value: 'custom', label: 'Custom Tax Percentage' },
            ]}
          />

          {formValues.taxOption === 'custom' && (
            <Input
              label="Custom Tax Rate (%)"
              name="customRate"
              type="number"
              min="0"
              max="100"
              value={formValues.customRate}
              onChange={handleInputChange}
            />
          )}
        </div>
      </div>

      {/* Right Column: Breakdown Results */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-[#EBEBEB] rounded-xl p-6 shadow-sm flex flex-col gap-1.5">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#717171]">
              Total Yearly Compensation
            </span>
            <span className="text-3xl font-black text-[#FF5A5F] tracking-tight">
              {formatCurrency(results.yearly.totalComp, formValues.currency)}
            </span>
          </div>

          <div className="bg-[#008A05]/5 border border-[#008A05]/10 rounded-xl p-6 shadow-sm flex flex-col gap-1.5">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#008A05]">
              Estimated Monthly Take-Home Cash
            </span>
            <span className="text-3xl font-black text-[#008A05] tracking-tight">
              {formatCurrency(results.monthly.takeHome, formValues.currency)}
            </span>
            <span className="text-[10px] text-[#717171]">
              Excludes annual stock vesting cashouts.
            </span>
          </div>
        </div>

        {/* Stacked Comp Bar Chart */}
        <div className="bg-white border border-[#EBEBEB] rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <h3 className="text-xs uppercase font-bold text-[#717171] tracking-wider">
            Compensation Mix Percentage
          </h3>
          <div className="w-full h-8 rounded-lg overflow-hidden flex border border-[#EBEBEB]">
            {results.yearly.totalComp === 0 ? (
              <div className="w-full bg-slate-100 flex items-center justify-center text-xs text-[#717171]">
                No compensation value entered.
              </div>
            ) : (
              <>
                {results.ratios.basePercent > 0 && (
                  <div
                    className="bg-blue-500 h-full flex items-center justify-center text-[10px] font-extrabold text-white transition-all"
                    style={{ width: `${results.ratios.basePercent}%` }}
                    title={`Base: ${results.ratios.basePercent.toFixed(1)}%`}
                  >
                    {results.ratios.basePercent > 12 && 'Base'}
                  </div>
                )}
                {results.ratios.bonusPercent > 0 && (
                  <div
                    className="bg-emerald-500 h-full flex items-center justify-center text-[10px] font-extrabold text-white transition-all"
                    style={{ width: `${results.ratios.bonusPercent}%` }}
                    title={`Bonus: ${results.ratios.bonusPercent.toFixed(1)}%`}
                  >
                    {results.ratios.bonusPercent > 12 && 'Bonus'}
                  </div>
                )}
                {results.ratios.stockPercent > 0 && (
                  <div
                    className="bg-amber-500 h-full flex items-center justify-center text-[10px] font-extrabold text-white transition-all"
                    style={{ width: `${results.ratios.stockPercent}%` }}
                    title={`Stock: ${results.ratios.stockPercent.toFixed(1)}%`}
                  >
                    {results.ratios.stockPercent > 12 && 'Stock'}
                  </div>
                )}
              </>
            )}
          </div>
          {results.yearly.totalComp > 0 && (
            <div className="flex justify-start gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-500 rounded-sm"></span>Base: {results.ratios.basePercent.toFixed(0)}%</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-emerald-500 rounded-sm"></span>Bonus: {results.ratios.bonusPercent.toFixed(0)}%</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-amber-500 rounded-sm"></span>Stock: {results.ratios.stockPercent.toFixed(0)}%</span>
            </div>
          )}
        </div>

        {/* Detailed Slabs Table */}
        <div className="bg-white border border-[#EBEBEB] rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#EBEBEB] bg-slate-50/50">
            <h3 className="text-sm font-bold text-[#222222]">
              Detailed Breakdown
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#EBEBEB] text-xs uppercase font-extrabold text-[#717171] bg-slate-50/30">
                  <th className="py-3 px-5">Component</th>
                  <th className="py-3 px-5 text-right">Yearly</th>
                  <th className="py-3 px-5 text-right">Monthly</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBEBEB] text-[#484848] font-medium">
                <tr>
                  <td className="py-3.5 px-5">Base Salary</td>
                  <td className="py-3.5 px-5 text-right">{formatCurrency(results.yearly.base, formValues.currency)}</td>
                  <td className="py-3.5 px-5 text-right">{formatCurrency(results.monthly.base, formValues.currency)}</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5">Variable / Bonus</td>
                  <td className="py-3.5 px-5 text-right">{formatCurrency(results.yearly.bonus, formValues.currency)}</td>
                  <td className="py-3.5 px-5 text-right">{formatCurrency(results.monthly.bonus, formValues.currency)}</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 text-slate-500">Cash Income Subtotal</td>
                  <td className="py-3.5 px-5 text-right font-semibold text-slate-700">{formatCurrency(results.yearly.base + results.yearly.bonus, formValues.currency)}</td>
                  <td className="py-3.5 px-5 text-right font-semibold text-slate-700">{formatCurrency(results.monthly.base + results.monthly.bonus, formValues.currency)}</td>
                </tr>
                <tr className="bg-red-50/10 text-red-700">
                  <td className="py-3.5 px-5 font-bold">Estimated Income Tax</td>
                  <td className="py-3.5 px-5 text-right font-bold">-{formatCurrency(results.yearly.tax, formValues.currency)}</td>
                  <td className="py-3.5 px-5 text-right font-bold">-{formatCurrency(results.monthly.tax, formValues.currency)}</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="py-3.5 px-5">Stock Vesting</td>
                  <td className="py-3.5 px-5 text-right">{formatCurrency(results.yearly.stock, formValues.currency)}</td>
                  <td className="py-3.5 px-5 text-right">{formatCurrency(results.monthly.stock, formValues.currency)}</td>
                </tr>
                <tr className="border-t-2 border-[#EBEBEB] text-[#222222] font-extrabold bg-[#008A05]/5">
                  <td className="py-4 px-5">Net Take-Home (Including Stock)</td>
                  <td className="py-4 px-5 text-right text-lg text-[#008A05]">
                    {formatCurrency(results.yearly.takeHome, formValues.currency)}
                  </td>
                  <td className="py-4 px-5 text-right text-lg text-[#008A05]">
                    {formatCurrency(results.monthly.takeHome + results.monthly.stock, formValues.currency)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
