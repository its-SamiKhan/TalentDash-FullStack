'use client';

import React, { useState, useMemo } from 'react';
import { compareTwoOffers } from '@/lib/calculators';
import { Input, Select, Badge, WinnerBadge } from '@/components/ui';
import { formatCurrency } from '@/lib/formatters';

interface CompanyItem {
  id: string;
  name: string;
  slug: string;
}

interface OfferComparisonProps {
  companiesList: CompanyItem[];
}

export function OfferComparison({ companiesList }: OfferComparisonProps) {
  // Setup dropdown options
  const companyOptions = useMemo(() => {
    return [
      { value: '', label: 'Select a company...' },
      ...companiesList.map((c) => ({ value: c.name, label: c.name })),
      { value: '__custom__', label: 'Other / Custom Company...' },
    ];
  }, [companiesList]);

  // Offer A State
  const [offerA, setOfferA] = useState({
    companyType: 'select',
    companySelect: companiesList[0]?.name || 'Google',
    companyCustom: '',
    base: 1800000,
    bonus: 200000,
    stock: 500000,
    currency: 'INR' as 'INR' | 'USD' | 'GBP' | 'EUR',
  });

  // Offer B State
  const [offerB, setOfferB] = useState({
    companyType: 'select',
    companySelect: companiesList[1]?.name || 'Microsoft',
    companyCustom: '',
    base: 2400000,
    bonus: 300000,
    stock: 800000,
    currency: 'INR' as 'INR' | 'USD' | 'GBP' | 'EUR',
  });

  const [targetCurrency, setTargetCurrency] = useState<'INR' | 'USD' | 'GBP' | 'EUR'>('INR');

  const handleOfferAChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOfferA((prev) => {
      const next = { ...prev, [name]: name === 'currency' || name === 'companySelect' || name === 'companyCustom' ? value : parseFloat(value) || 0 };
      if (name === 'companySelect') {
        if (value === '__custom__') {
          next.companyType = 'custom';
        } else {
          next.companyType = 'select';
        }
      }
      return next;
    });
  };

  const handleOfferBChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOfferB((prev) => {
      const next = { ...prev, [name]: name === 'currency' || name === 'companySelect' || name === 'companyCustom' ? value : parseFloat(value) || 0 };
      if (name === 'companySelect') {
        if (value === '__custom__') {
          next.companyType = 'custom';
        } else {
          next.companyType = 'select';
        }
      }
      return next;
    });
  };

  const results = useMemo(() => {
    const nameA = offerA.companyType === 'custom' ? offerA.companyCustom : offerA.companySelect;
    const nameB = offerB.companyType === 'custom' ? offerB.companyCustom : offerB.companySelect;

    return compareTwoOffers(
      {
        company: nameA.trim() || 'Offer A',
        base: offerA.base,
        bonus: offerA.bonus,
        stock: offerA.stock,
        currency: offerA.currency,
      },
      {
        company: nameB.trim() || 'Offer B',
        base: offerB.base,
        bonus: offerB.bonus,
        stock: offerB.stock,
        currency: offerB.currency,
      },
      targetCurrency
    );
  }, [offerA, offerB, targetCurrency]);

  const renderPercentageBadge = (percentage: number) => {
    if (percentage > 0) {
      return <Badge variant="green">+{percentage.toFixed(1)}%</Badge>;
    } else if (percentage < 0) {
      return <Badge variant="red">{percentage.toFixed(1)}%</Badge>;
    } else {
      return <Badge variant="slate">0.0%</Badge>;
    }
  };

  const offerAName = results.offerA.company;
  const offerBName = results.offerB.company;

  const tcDiff = results.deltas.totalComp;
  const tcPercent = results.percentages.totalComp;

  const compRatios = useMemo(() => {
    const tcA = results.offerA.converted.totalComp;
    const tcB = results.offerB.converted.totalComp;
    return {
      a: {
        base: tcA > 0 ? (results.offerA.converted.base / tcA) * 100 : 0,
        bonus: tcA > 0 ? (results.offerA.converted.bonus / tcA) * 100 : 0,
        stock: tcA > 0 ? (results.offerA.converted.stock / tcA) * 100 : 0,
      },
      b: {
        base: tcB > 0 ? (results.offerB.converted.base / tcB) * 100 : 0,
        bonus: tcB > 0 ? (results.offerB.converted.bonus / tcB) * 100 : 0,
        stock: tcB > 0 ? (results.offerB.converted.stock / tcB) * 100 : 0,
      }
    };
  }, [results]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Inputs Column */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        {/* Target Currency Selector */}
        <div className="bg-white border border-[#EBEBEB] rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <h2 className="text-sm font-bold text-[#222222] border-b border-[#EBEBEB] pb-3">
            Comparison Base
          </h2>
          <Select
            label="Target Comparison Currency"
            name="targetCurrency"
            value={targetCurrency}
            onChange={(e) => setTargetCurrency(e.target.value as 'INR' | 'USD' | 'GBP' | 'EUR')}
            options={[
              { value: 'INR', label: 'INR (₹)' },
              { value: 'USD', label: 'USD ($)' },
              { value: 'GBP', label: 'GBP (£)' },
              { value: 'EUR', label: 'EUR (€)' },
            ]}
          />
        </div>

        {/* Offer A */}
        <div className="bg-white border border-[#EBEBEB] rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <h2 className="text-sm font-bold text-[#222222] border-b border-[#EBEBEB] pb-3 flex items-center justify-between">
            <span>Offer A</span>
            <span className="text-xs text-[#717171]">
              TC: {formatCurrency(results.offerA.localTotalComp, offerA.currency)}
            </span>
          </h2>
          <Select
            label="Company"
            name="companySelect"
            value={offerA.companySelect}
            onChange={handleOfferAChange}
            options={companyOptions}
          />
          {offerA.companyType === 'custom' && (
            <Input
              label="Custom Company Name"
              name="companyCustom"
              type="text"
              value={offerA.companyCustom}
              onChange={handleOfferAChange}
              placeholder="e.g. My Startup"
              required
            />
          )}
          <Select
            label="Currency"
            name="currency"
            value={offerA.currency}
            onChange={handleOfferAChange}
            options={[
              { value: 'INR', label: 'INR (₹)' },
              { value: 'USD', label: 'USD ($)' },
              { value: 'GBP', label: 'GBP (£)' },
              { value: 'EUR', label: 'EUR (€)' },
            ]}
          />
          <Input
            label="Annual Base Salary"
            name="base"
            type="number"
            min="0"
            value={offerA.base}
            onChange={handleOfferAChange}
          />
          <Input
            label="Annual Bonus / Variable"
            name="bonus"
            type="number"
            min="0"
            value={offerA.bonus}
            onChange={handleOfferAChange}
          />
          <Input
            label="Stock Value (Per Year)"
            name="stock"
            type="number"
            min="0"
            value={offerA.stock}
            onChange={handleOfferAChange}
          />
        </div>

        {/* Offer B */}
        <div className="bg-white border border-[#EBEBEB] rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <h2 className="text-sm font-bold text-[#222222] border-b border-[#EBEBEB] pb-3 flex items-center justify-between">
            <span>Offer B</span>
            <span className="text-xs text-[#FF5A5F]">
              TC: {formatCurrency(results.offerB.localTotalComp, offerB.currency)}
            </span>
          </h2>
          <Select
            label="Company"
            name="companySelect"
            value={offerB.companySelect}
            onChange={handleOfferBChange}
            options={companyOptions}
          />
          {offerB.companyType === 'custom' && (
            <Input
              label="Custom Company Name"
              name="companyCustom"
              type="text"
              value={offerB.companyCustom}
              onChange={handleOfferBChange}
              placeholder="e.g. My Startup"
              required
            />
          )}
          <Select
            label="Currency"
            name="currency"
            value={offerB.currency}
            onChange={handleOfferBChange}
            options={[
              { value: 'INR', label: 'INR (₹)' },
              { value: 'USD', label: 'USD ($)' },
              { value: 'GBP', label: 'GBP (£)' },
              { value: 'EUR', label: 'EUR (€)' },
            ]}
          />
          <Input
            label="Annual Base Salary"
            name="base"
            type="number"
            min="0"
            value={offerB.base}
            onChange={handleOfferBChange}
          />
          <Input
            label="Annual Bonus / Variable"
            name="bonus"
            type="number"
            min="0"
            value={offerB.bonus}
            onChange={handleOfferBChange}
          />
          <Input
            label="Stock Value (Per Year)"
            name="stock"
            type="number"
            min="0"
            value={offerB.stock}
            onChange={handleOfferBChange}
          />
        </div>
      </div>

      {/* Outputs Column */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {/* Comparison Header Summary Banner */}
        <div className="bg-[#FF5A5F]/5 border border-[#FF5A5F]/15 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#FF5A5F]">
              Offer Comparison Summary
            </span>
            <h3 className="text-xl font-black text-[#222222] tracking-tight">
              {results.winners.totalComp === 'tie' ? (
                'Both offers are financially identical.'
              ) : (
                <>
                  {results.winners.totalComp === 'offerB' ? offerBName : offerAName} is{' '}
                  <span className="text-[#008A05]">{Math.abs(tcPercent).toFixed(1)}%</span> better!
                </>
              )}
            </h3>
            <p className="text-xs text-[#717171] font-semibold">
              Converted and compared in {targetCurrency}.
            </p>
          </div>
          {results.winners.totalComp !== 'tie' && (
            <div className="bg-white border border-[#EBEBEB] rounded-lg px-4 py-2 flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold text-[#717171]">Margin Delta</span>
              <span className="text-base font-extrabold text-[#008A05]">
                +{formatCurrency(Math.abs(tcDiff), targetCurrency)}
              </span>
            </div>
          )}
        </div>

        {/* Side-by-Side Stacked Chart Component */}
        <div className="bg-white border border-[#EBEBEB] rounded-xl p-6 shadow-sm flex flex-col gap-6">
          <h3 className="text-xs uppercase font-bold text-[#717171] tracking-wider">
            Total Compensation Mix Comparison
          </h3>

          <div className="flex flex-col gap-5">
            {/* Offer A Bar */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-baseline text-xs font-bold">
                <span className="text-[#222222]">{offerAName}</span>
                <span className="text-[#717171]">
                  {formatCurrency(results.offerA.converted.totalComp, targetCurrency)}
                </span>
              </div>
              <div className="w-full h-6 rounded-md overflow-hidden flex border border-[#EBEBEB]">
                {results.offerA.converted.totalComp === 0 ? (
                  <div className="w-full bg-slate-100 flex items-center justify-center text-[10px] text-[#717171]">
                    No values entered.
                  </div>
                ) : (
                  <>
                    {compRatios.a.base > 0 && (
                      <div
                        className="bg-blue-500 h-full flex items-center justify-center text-[9px] font-extrabold text-white transition-all"
                        style={{ width: `${compRatios.a.base}%` }}
                        title={`Base: ${compRatios.a.base.toFixed(1)}%`}
                      >
                        {compRatios.a.base > 15 && 'Base'}
                      </div>
                    )}
                    {compRatios.a.bonus > 0 && (
                      <div
                        className="bg-emerald-500 h-full flex items-center justify-center text-[9px] font-extrabold text-white transition-all"
                        style={{ width: `${compRatios.a.bonus}%` }}
                        title={`Bonus: ${compRatios.a.bonus.toFixed(1)}%`}
                      >
                        {compRatios.a.bonus > 15 && 'Bonus'}
                      </div>
                    )}
                    {compRatios.a.stock > 0 && (
                      <div
                        className="bg-amber-500 h-full flex items-center justify-center text-[9px] font-extrabold text-white transition-all"
                        style={{ width: `${compRatios.a.stock}%` }}
                        title={`Stock: ${compRatios.a.stock.toFixed(1)}%`}
                      >
                        {compRatios.a.stock > 15 && 'Stock'}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Offer B Bar */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-baseline text-xs font-bold">
                <span className="text-[#222222]">{offerBName}</span>
                <span className="text-[#717171]">
                  {formatCurrency(results.offerB.converted.totalComp, targetCurrency)}
                </span>
              </div>
              <div className="w-full h-6 rounded-md overflow-hidden flex border border-[#EBEBEB]">
                {results.offerB.converted.totalComp === 0 ? (
                  <div className="w-full bg-slate-100 flex items-center justify-center text-[10px] text-[#717171]">
                    No values entered.
                  </div>
                ) : (
                  <>
                    {compRatios.b.base > 0 && (
                      <div
                        className="bg-blue-500 h-full flex items-center justify-center text-[9px] font-extrabold text-white transition-all"
                        style={{ width: `${compRatios.b.base}%` }}
                        title={`Base: ${compRatios.b.base.toFixed(1)}%`}
                      >
                        {compRatios.b.base > 15 && 'Base'}
                      </div>
                    )}
                    {compRatios.b.bonus > 0 && (
                      <div
                        className="bg-emerald-500 h-full flex items-center justify-center text-[9px] font-extrabold text-white transition-all"
                        style={{ width: `${compRatios.b.bonus}%` }}
                        title={`Bonus: ${compRatios.b.bonus.toFixed(1)}%`}
                      >
                        {compRatios.b.bonus > 15 && 'Bonus'}
                      </div>
                    )}
                    {compRatios.b.stock > 0 && (
                      <div
                        className="bg-amber-500 h-full flex items-center justify-center text-[9px] font-extrabold text-white transition-all"
                        style={{ width: `${compRatios.b.stock}%` }}
                        title={`Stock: ${compRatios.b.stock.toFixed(1)}%`}
                      >
                        {compRatios.b.stock > 15 && 'Stock'}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-start gap-4 text-xs font-semibold border-t border-[#EBEBEB] pt-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-blue-500 rounded-sm"></span>Base Salary
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-emerald-500 rounded-sm"></span>Bonus / Variable
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-amber-500 rounded-sm"></span>Stock / Equity
            </span>
          </div>
        </div>

        {/* Detailed Side-by-Side Breakdown Table */}
        <div className="bg-white border border-[#EBEBEB] rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#EBEBEB] bg-slate-50/50">
            <h3 className="text-sm font-bold text-[#222222]">
              Side-by-Side Comparison Matrix
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#EBEBEB] text-xs uppercase font-extrabold text-[#717171] bg-slate-50/30">
                  <th className="py-3 px-5">Component</th>
                  <th className="py-3 px-5 text-right">{offerAName} ({offerA.currency})</th>
                  <th className="py-3 px-5 text-right">{offerBName} ({offerB.currency})</th>
                  <th className="py-3 px-5 text-right">Delta ({targetCurrency})</th>
                  <th className="py-3 px-5 text-right">Percent</th>
                  <th className="py-3 px-5 text-center">Winner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBEBEB] text-[#484848] font-medium">
                {/* Base Salary */}
                <tr>
                  <td className="py-4 px-5">Annual Base Salary</td>
                  <td className="py-4 px-5 text-right">
                    {formatCurrency(offerA.base, offerA.currency)}
                  </td>
                  <td className="py-4 px-5 text-right">
                    {formatCurrency(offerB.base, offerB.currency)}
                  </td>
                  <td className="py-4 px-5 text-right font-semibold">
                    {results.deltas.base >= 0 ? '+' : ''}
                    {formatCurrency(results.deltas.base, targetCurrency)}
                  </td>
                  <td className="py-4 px-5 text-right">
                    {renderPercentageBadge(results.percentages.base)}
                  </td>
                  <td className="py-4 px-5 text-center">
                    <WinnerBadge
                      winner={
                        results.winners.base === 'offerA'
                          ? 'record1'
                          : results.winners.base === 'offerB'
                          ? 'record2'
                          : 'tie'
                      }
                      recordName={results.winners.base === 'offerA' ? 'A' : 'B'}
                    />
                  </td>
                </tr>

                {/* Bonus */}
                <tr>
                  <td className="py-4 px-5">Annual Bonus / Variable</td>
                  <td className="py-4 px-5 text-right">
                    {formatCurrency(offerA.bonus, offerA.currency)}
                  </td>
                  <td className="py-4 px-5 text-right">
                    {formatCurrency(offerB.bonus, offerB.currency)}
                  </td>
                  <td className="py-4 px-5 text-right font-semibold">
                    {results.deltas.bonus >= 0 ? '+' : ''}
                    {formatCurrency(results.deltas.bonus, targetCurrency)}
                  </td>
                  <td className="py-4 px-5 text-right">
                    {renderPercentageBadge(results.percentages.bonus)}
                  </td>
                  <td className="py-4 px-5 text-center">
                    <WinnerBadge
                      winner={
                        results.winners.bonus === 'offerA'
                          ? 'record1'
                          : results.winners.bonus === 'offerB'
                          ? 'record2'
                          : 'tie'
                      }
                      recordName={results.winners.bonus === 'offerA' ? 'A' : 'B'}
                    />
                  </td>
                </tr>

                {/* Stock */}
                <tr>
                  <td className="py-4 px-5">Stock Value (Per Year)</td>
                  <td className="py-4 px-5 text-right">
                    {formatCurrency(offerA.stock, offerA.currency)}
                  </td>
                  <td className="py-4 px-5 text-right">
                    {formatCurrency(offerB.stock, offerB.currency)}
                  </td>
                  <td className="py-4 px-5 text-right font-semibold">
                    {results.deltas.stock >= 0 ? '+' : ''}
                    {formatCurrency(results.deltas.stock, targetCurrency)}
                  </td>
                  <td className="py-4 px-5 text-right">
                    {renderPercentageBadge(results.percentages.stock)}
                  </td>
                  <td className="py-4 px-5 text-center">
                    <WinnerBadge
                      winner={
                        results.winners.stock === 'offerA'
                          ? 'record1'
                          : results.winners.stock === 'offerB'
                          ? 'record2'
                          : 'tie'
                      }
                      recordName={results.winners.stock === 'offerA' ? 'A' : 'B'}
                    />
                  </td>
                </tr>

                {/* Total Compensation (TC) */}
                <tr className="border-t-2 border-[#EBEBEB] text-[#222222] font-extrabold bg-slate-50">
                  <td className="py-4 px-5">Total Compensation (TC)</td>
                  <td className="py-4 px-5 text-right">
                    {formatCurrency(results.offerA.localTotalComp, offerA.currency)}
                  </td>
                  <td className="py-4 px-5 text-right">
                    {formatCurrency(results.offerB.localTotalComp, offerB.currency)}
                  </td>
                  <td className="py-4 px-5 text-right text-base font-black text-[#008A05]">
                    {results.deltas.totalComp >= 0 ? '+' : ''}
                    {formatCurrency(results.deltas.totalComp, targetCurrency)}
                  </td>
                  <td className="py-4 px-5 text-right">
                    {renderPercentageBadge(results.percentages.totalComp)}
                  </td>
                  <td className="py-4 px-5 text-center">
                    <WinnerBadge
                      winner={
                        results.winners.totalComp === 'offerA'
                          ? 'record1'
                          : results.winners.totalComp === 'offerB'
                          ? 'record2'
                          : 'tie'
                      }
                      recordName={results.winners.totalComp === 'offerA' ? 'A' : 'B'}
                    />
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
