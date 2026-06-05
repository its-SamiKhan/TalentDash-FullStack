'use client';

import React, { useState, useMemo } from 'react';
import { Button, Input, Select } from '@/components/ui';
import { validateLocation } from '@/lib/validators';

interface CompanyItem {
  id: string;
  name: string;
  slug: string;
}

interface OfferEvaluationClientProps {
  companiesList: CompanyItem[];
}

export function OfferEvaluationClient({ companiesList }: OfferEvaluationClientProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Score states (updated dynamically upon form submit)
  const [offerScore, setOfferScore] = useState(82);
  const [offerVerdict, setOfferVerdict] = useState('Above Market');
  const [ratings, setRatings] = useState({
    base: 'Above market',
    bonus: 'Average',
    equity: 'Above market',
    benefits: 'Excellent',
  });

  // User input states
  const [formValues, setFormValues] = useState({
    company: companiesList[0]?.name || 'Google',
    role: '',
    base: 1800000,
    bonus: 200000,
    stock: 500000,
    currency: 'INR',
    benefits: 'Excellent',
    location: '',
  });

  const [formErrors, setFormErrors] = useState<string[]>([]);

  const companyOptions = useMemo(() => {
    return [
      { value: '', label: 'Select a company...' },
      ...companiesList.map((c) => ({ value: c.name, label: c.name })),
      { value: '__custom__', label: 'Other / Custom Company...' },
    ];
  }, [companiesList]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: name === 'company' || name === 'role' || name === 'currency' || name === 'benefits' || name === 'location'
        ? value
        : parseFloat(value) || 0,
    }));
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setFormErrors([]);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors([]);

    const errors: string[] = [];

    // Validations
    if (!formValues.role.trim()) {
      errors.push('Job role/title is required.');
    }
    if (formValues.base <= 0) {
      errors.push('Base salary must be greater than 0.');
    }
    if (formValues.bonus < 0) {
      errors.push('Bonus must be a non-negative number.');
    }
    if (formValues.stock < 0) {
      errors.push('Stock value must be a non-negative number.');
    }
    if (!formValues.location.trim()) {
      errors.push('Location is required.');
    } else if (!validateLocation(formValues.location)) {
      errors.push('Location must be a city only (do not include commas, e.g., use "Bengaluru" instead of "Bengaluru, India").');
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsAnalyzing(true);

    // Simulate AI / Scraped data evaluation calculations
    setTimeout(() => {
      // Basic dynamic math to evaluate total compensation relative to standards
      let totalComp = formValues.base + formValues.bonus + formValues.stock;
      if (formValues.currency === 'USD') totalComp *= 83.33; // Normalize to INR for rating logic
      if (formValues.currency === 'GBP') totalComp *= 105.2;
      if (formValues.currency === 'EUR') totalComp *= 90.8;

      let score = 75;
      let baseRate = 'Average';
      let bonusRate = 'Average';
      let equityRate = 'Average';

      if (totalComp >= 4500000) {
        score = 94;
        baseRate = 'Excellent';
        bonusRate = 'Above market';
        equityRate = 'Excellent';
      } else if (totalComp >= 2500000) {
        score = 86;
        baseRate = 'Above market';
        bonusRate = 'Average';
        equityRate = 'Above market';
      } else if (totalComp >= 1500000) {
        score = 78;
        baseRate = 'Average';
        bonusRate = 'Average';
        equityRate = 'Average';
      } else {
        score = 64;
        baseRate = 'Below market';
        bonusRate = 'Below market';
        equityRate = 'Below market';
      }

      // Verdict
      let verdict = 'Market Average';
      if (score >= 90) verdict = 'Top Tier';
      else if (score >= 80) verdict = 'Above Market';
      else if (score < 70) verdict = 'Below Market';

      setOfferScore(score);
      setOfferVerdict(verdict);
      setRatings({
        base: baseRate,
        bonus: bonusRate,
        equity: equityRate,
        benefits: formValues.benefits,
      });

      setIsAnalyzing(false);
      setIsFormOpen(false);
    }, 1500);
  };

  // Circular gauge circle parameters
  const strokeRadius = 45;
  const strokeCircumference = 2 * Math.PI * strokeRadius;
  const strokeDashoffset = strokeCircumference - (strokeCircumference * offerScore) / 100;

  return (
    <div className="flex flex-col gap-10 bg-white border border-[#EBEBEB] rounded-2xl p-6 shadow-sm">
      {/* 1. Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 bg-[#FF5A5F] rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm shadow-[#FF5A5F]/20">
            {/* Gift Box Icon */}
            <svg className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF5A5F] bg-[#FF5A5F]/10 px-2.5 py-0.5 rounded-full w-fit">
              Offers
            </span>
            <h1 className="text-3xl font-black text-[#222222] tracking-tight mt-1">
              Decode your offer. Know your worth.
            </h1>
            <p className="text-sm text-[#717171] font-semibold mt-0.5">
              AI-powered insights to evaluate your total compensation and make confident career decisions.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            title: '280K+ Offers analyzed',
            desc: 'Real offers from professionals',
            color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ),
          },
          {
            title: '35K+ Companies covered',
            desc: 'Updated compensation data',
            color: 'bg-blue-50 text-blue-600 border-blue-100',
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            ),
          },
          {
            title: '18% Higher offers achieved',
            desc: 'With our insights and tools',
            color: 'bg-amber-50 text-amber-600 border-amber-100',
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            ),
          },
          {
            title: '100% Private & secure',
            desc: 'Your data is safe with us',
            color: 'bg-[#FF5A5F]/5 text-[#FF5A5F] border-[#FF5A5F]/10',
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            ),
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white border border-[#EBEBEB] rounded-2xl p-5 shadow-3xs flex flex-col gap-3.5 text-left"
          >
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center border ${item.color} shrink-0 shadow-3xs`}>
              {item.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold text-[#222222] tracking-tight">{item.title}</span>
              <span className="text-[11px] text-[#717171] font-semibold mt-0.5">{item.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Main Call-to-Action Dashboard Container */}
      <div className="bg-gradient-to-r from-[#FF5A5F]/5 to-[#FF5A5F]/2 border border-[#FF5A5F]/10 rounded-3xl p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xs">
        
        {/* Left column: descriptive text and button */}
        <div className="flex flex-col gap-5 text-left max-w-lg">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl md:text-2xl font-black text-[#222222] tracking-tight">
              Evaluate your offer in 2 minutes
            </h2>
            <p className="text-xs md:text-sm text-[#555555] font-semibold leading-relaxed">
              Upload your offer details and get a complete breakdown of your CTC, benefits, equity, and market competitiveness in real-time.
            </p>
          </div>
          
          <Button
            onClick={() => setIsFormOpen(true)}
            className="bg-[#FF5A5F] hover:bg-[#ff4449] text-white font-bold text-xs py-3 px-6 rounded-xl flex items-center gap-1.5 shadow-sm shadow-[#FF5A5F]/10 cursor-pointer self-start"
          >
            Evaluate my offer <span>→</span>
          </Button>

          {/* User social proof avatars */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex -space-x-1.5 overflow-hidden">
              {['AM', 'KP', 'ST', 'JN'].map((init, i) => (
                <div
                  key={i}
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-[#FF5A5F]/5 bg-slate-100 flex items-center justify-center text-[8px] font-bold text-[#717171] shadow-3xs"
                >
                  {init}
                </div>
              ))}
            </div>
            <span className="text-[10px] text-[#717171] font-bold">
              Join 85K+ professionals making smarter decisions
            </span>
          </div>
        </div>

        {/* Right column: Interactive circular gauge and metrics card */}
        <div className="bg-white border border-[#EBEBEB] rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-center gap-6 w-full max-w-md shrink-0">
          
          {/* Gauge Widget */}
          <div className="flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-[#EBEBEB] pb-4 sm:pb-0 sm:pr-6 shrink-0 min-w-32">
            <span className="text-[10px] font-black text-[#717171] uppercase tracking-wider mb-2">
              Your Offer Score
            </span>
            <div className="relative h-28 w-28 flex items-center justify-center">
              <svg className="absolute inset-0 h-full w-full transform -rotate-90">
                {/* Background track circle */}
                <circle
                  cx="56"
                  cy="56"
                  r={strokeRadius}
                  stroke="#EBEBEB"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Colored score segment */}
                <circle
                  cx="56"
                  cy="56"
                  r={strokeRadius}
                  stroke={offerScore >= 90 ? '#008A05' : offerScore >= 75 ? '#10B981' : '#D97706'}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={strokeCircumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="flex flex-col items-center justify-center leading-none">
                <span className="text-3xl font-black text-[#222222] tracking-tight">{offerScore}</span>
                <span className="text-[10px] text-[#717171] font-semibold mt-1">/100</span>
              </div>
            </div>
            <span className={`text-xs font-black mt-3 ${
              offerScore >= 90 ? 'text-emerald-700' : offerScore >= 75 ? 'text-emerald-500' : 'text-amber-500'
            }`}>
              {offerVerdict}
            </span>
          </div>

          {/* Breakdown parameters */}
          <div className="flex flex-col gap-3.5 flex-1 w-full text-left">
            {[
              { label: 'Base Salary', val: ratings.base, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: '💼' },
              { label: 'Bonus', val: ratings.bonus, color: ratings.bonus === 'Average' ? 'text-amber-600 bg-amber-50 border-amber-100' : 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: '🎁' },
              { label: 'Equity', val: ratings.equity, color: ratings.equity === 'Below market' ? 'text-rose-600 bg-rose-50 border-rose-100' : 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: '📈' },
              { label: 'Benefits', val: ratings.benefits, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: '🛡️' },
            ].map((metric, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-[#F7F7F7] last:border-0 pb-1.5 last:pb-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm shrink-0">{metric.icon}</span>
                  <span className="text-xs font-bold text-[#484848]">{metric.label}</span>
                </div>
                <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border tracking-wider ${metric.color}`}>
                  {metric.val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Sliding Contribution Drawer */}
      {/* Backdrop */}
      <div 
        onClick={handleCloseForm}
        className={`fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity duration-300 z-50 ${
          isFormOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`} 
      />

      {/* Drawer Panel */}
      <div 
        className={`fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl border-l border-[#EBEBEB] z-50 flex flex-col h-full transform transition-transform duration-300 ease-in-out ${
          isFormOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-[#EBEBEB]">
          <div className="flex flex-col">
            <h2 className="text-base font-extrabold text-[#222222] tracking-tight">Evaluate Your Job Offer</h2>
            <p className="text-[10px] text-[#717171] font-semibold mt-0.5">Let AI benchmark your CTC and calculate your worth</p>
          </div>
          <button
            type="button"
            onClick={handleCloseForm}
            className="text-[#717171] hover:text-[#222222] text-2xl font-light p-1 focus:outline-none cursor-pointer"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isAnalyzing ? (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-4">
              <div className="h-10 w-10 border-3 border-t-transparent border-[#FF5A5F] rounded-full animate-spin"></div>
              <h3 className="text-sm font-extrabold text-[#222222] mt-2">Analyzing Offer Components...</h3>
              <p className="text-xs text-[#717171] max-w-[240px] leading-relaxed">
                Comparing base, variable structure, and equity parameters against tech market benchmarks.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-5 pb-6 text-left">
              {formErrors.length > 0 && (
                <div className="bg-[#D93025]/10 border border-[#D93025]/20 rounded-md p-3.5 text-xs text-[#D93025] font-semibold flex flex-col gap-1">
                  {formErrors.map((err, i) => (
                    <p key={i}>• {err}</p>
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-4">
                <div>
                  <Select
                    label="Company Name"
                    name="company"
                    value={formValues.company}
                    onChange={handleInputChange}
                    options={companyOptions}
                    required
                  />
                </div>

                <div>
                  <Input
                    label="Job Role / Title"
                    name="role"
                    placeholder="e.g. Senior Software Engineer"
                    value={formValues.role}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Input
                    label="Location (City Only)"
                    name="location"
                    placeholder="e.g. Bengaluru"
                    value={formValues.location}
                    onChange={handleInputChange}
                    helperText="Please input city only (e.g. 'Hyderabad' or 'Pune' without commas)."
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 items-end">
                  <div className="col-span-2">
                    <Input
                      label="Annual Base Salary"
                      name="base"
                      type="number"
                      min="0"
                      value={formValues.base}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
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
                </div>

                <div>
                  <Input
                    label="Annual Bonus / Variable (Annual)"
                    name="bonus"
                    type="number"
                    min="0"
                    value={formValues.bonus}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Input
                    label="Stock / Equity Value (Annual Vest)"
                    name="stock"
                    type="number"
                    min="0"
                    value={formValues.stock}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Select
                    label="Benefits Quality"
                    name="benefits"
                    value={formValues.benefits}
                    onChange={handleInputChange}
                    options={[
                      { value: 'Poor', label: 'Poor (basic insurance only)' },
                      { value: 'Average', label: 'Average (standard perks)' },
                      { value: 'Above market', label: 'Above Market (high coverage)' },
                      { value: 'Excellent', label: 'Excellent (complete family & wellness)' },
                    ]}
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#EBEBEB] flex justify-end gap-3">
                <Button variant="secondary" type="button" onClick={handleCloseForm} className="cursor-pointer text-xs py-2.5 px-4 font-bold">
                  Cancel
                </Button>
                <Button className="bg-[#FF5A5F] hover:bg-[#ff4449] text-white cursor-pointer text-xs py-2.5 px-5 font-bold rounded-lg shadow-sm shadow-[#FF5A5F]/15">
                  Analyze Offer
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
