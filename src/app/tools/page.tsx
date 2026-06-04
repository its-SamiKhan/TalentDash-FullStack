import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { generateToolsPageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolsPageMetadata();
}

export default function ToolsHubPage() {
  const tools = [
    {
      title: 'Salary & Take-Home Calculator',
      description: 'Compute total compensation, progressive tax deductions, and monthly take-home cash.',
      href: '/tools/salary-calculator',
      icon: '💵',
      badge: 'Popular',
    },
    {
      title: 'Salary Hike Calculator',
      description: 'Evaluate new job offers against your current package to see the absolute and percentage increase.',
      href: '/tools/hike-calculator',
      icon: '📈',
      badge: 'New',
    },
    {
      title: 'ESOP & Equity Calculator',
      description: 'Project vesting value year-by-year and model IPO/acquisition payout multipliers.',
      href: '/tools/equity-calculator',
      icon: '💼',
      badge: 'High Intent',
    },
    {
      title: 'Offer Comparison Tool',
      description: 'Compare two different tech job offers side-by-side with automatic currency conversions.',
      href: '/tools/offer-comparison',
      icon: '📊',
      badge: 'Interactive',
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto flex flex-col gap-3">
        <h1 className="text-4xl font-extrabold text-[#222222] tracking-tight sm:text-5xl">
          Tech Career Calculators
        </h1>
        <p className="text-lg text-[#717171] leading-relaxed">
          Interactive tools designed to help software engineers and tech professionals evaluate offers, project equity value, and make data-driven career choices.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto w-full">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group bg-white border border-[#EBEBEB] hover:border-[#FF5A5F]/40 rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex items-start gap-4"
          >
            <div className="text-4xl bg-slate-50 p-3 rounded-lg group-hover:bg-[#FF5A5F]/5 transition-colors">
              {tool.icon}
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="flex justify-between items-center gap-2">
                <h2 className="text-lg font-bold text-[#222222] group-hover:text-[#FF5A5F] transition-colors">
                  {tool.title}
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                  {tool.badge}
                </span>
              </div>
              <p className="text-sm text-[#717171] leading-relaxed">
                {tool.description}
              </p>
              <span className="text-xs font-bold text-[#FF5A5F] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 mt-2">
                Open Tool →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
