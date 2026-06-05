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
      title: 'Salary Calculator',
      description: 'Calculate your in-hand salary & deductions',
      href: '/tools/salary-calculator',
      badge: '120K+ used',
      cta: 'Calculate now',
      iconBg: 'bg-[#008A05]/10 text-[#008A05]',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Salary Hike Calculator',
      description: 'Plan your next hike with confidence',
      href: '/tools/hike-calculator',
      badge: '95K+ used',
      cta: 'Calculate now',
      iconBg: 'bg-blue-50 text-blue-600',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      title: 'Equity Calculator',
      description: 'Calculate RSU/ESOP value & future worth',
      href: '/tools/equity-calculator',
      badge: '80K+ used',
      cta: 'Calculate now',
      iconBg: 'bg-purple-50 text-purple-600',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      ),
    },
    {
      title: 'Offer Comparator',
      description: 'Compare multiple offers side by side',
      href: '/tools/offer-comparison',
      badge: '65K+ used',
      cta: 'Compare now',
      iconBg: 'bg-amber-50 text-[#FFB400]',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      ),
    },
    {
      title: 'Resume Analyzer',
      description: 'Get AI feedback to improve your resume',
      href: '/tools/resume-analyzer',
      badge: '110K+ used',
      cta: 'Analyze now',
      iconBg: 'bg-teal-50 text-teal-600',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: 'Tax Calculator',
      description: 'Estimate your taxes & take-home pay',
      href: '/tools/salary-calculator',
      badge: '90K+ used',
      cta: 'Calculate now',
      iconBg: 'bg-[#008A05]/10 text-[#008A05]',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm9 5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Main Hub Card */}
      <div className="bg-white border border-[#EBEBEB] rounded-2xl p-6 sm:p-8 flex flex-col gap-8 shadow-sm">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#EBEBEB] pb-6 w-full">
          <div className="flex items-start gap-4">
            {/* Tools Box Icon */}
            <div className="bg-[#FF5A5F] text-white p-3 rounded-xl flex items-center justify-center h-12 w-12 shrink-0 shadow-md shadow-[#FF5A5F]/10">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF5A5F] bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 px-2.5 py-0.5 rounded-full w-fit">
                Tools
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#222222] tracking-tight mt-1.5 leading-tight">
                Powerful tools. Smarter career moves.
              </h1>
              <p className="text-xs sm:text-sm text-[#717171] mt-1">
                Accurate calculators and analyzers to help you plan, grow and negotiate better.
              </p>
            </div>
          </div>
          
          <Link
            href="/tools"
            className="text-xs sm:text-sm font-bold text-[#FF5A5F] hover:text-[#ff4449] transition-colors flex items-center gap-1 shrink-0 self-end sm:self-center mr-2 cursor-pointer select-none"
          >
            View all tools <span className="text-base">→</span>
          </Link>
        </div>

        {/* 6-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
          {tools.map((tool, idx) => (
            <Link
              key={idx}
              href={tool.href}
              className="group bg-white border border-[#EBEBEB] hover:border-[#FF5A5F]/40 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col items-start w-full cursor-pointer"
            >
              {/* Circular Icon Wrapper */}
              <div className={`h-10 w-10 rounded-full flex items-center justify-center text-lg shrink-0 ${tool.iconBg}`}>
                {tool.icon}
              </div>
              
              {/* Title */}
              <h2 className="text-sm font-bold text-[#222222] mt-4 group-hover:text-[#FF5A5F] transition-colors line-clamp-1 w-full">
                {tool.title}
              </h2>
              
              {/* Description */}
              <p className="text-xs text-[#717171] leading-relaxed mt-1.5 mb-3 min-h-[48px] line-clamp-3 w-full">
                {tool.description}
              </p>
              
              {/* Used Badge */}
              <span className="text-[9px] font-bold text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md w-fit mb-4">
                {tool.badge}
              </span>
              
              {/* CTA Link */}
              <span className="text-xs font-bold text-[#FF5A5F] group-hover:text-[#ff4449] mt-auto inline-flex items-center gap-1 transition-colors select-none">
                {tool.cta} <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </span>
            </Link>
          ))}
        </div>

        {/* Bottom Verification & Trust Bar */}
        <div className="bg-slate-50 border-t border-[#EBEBEB] p-4 rounded-b-2xl -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 mt-2 flex flex-col sm:flex-row justify-between items-center gap-3">
          {/* Security Guarantee */}
          <div className="text-xs text-[#717171] flex items-center gap-2 font-medium">
            <svg className="h-4 w-4 text-[#008A05] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>All tools are 100% free, secure and based on verified professional data.</span>
          </div>
          
          {/* Social Proof */}
          <div className="flex items-center gap-2.5">
            {/* Avatars */}
            <div className="flex -space-x-1.5 overflow-hidden">
              <div className="inline-block h-5.5 w-5.5 rounded-full ring-1.5 ring-white bg-gradient-to-tr from-amber-400 to-rose-400" />
              <div className="inline-block h-5.5 w-5.5 rounded-full ring-1.5 ring-white bg-gradient-to-tr from-blue-400 to-indigo-500" />
              <div className="inline-block h-5.5 w-5.5 rounded-full ring-1.5 ring-white bg-gradient-to-tr from-emerald-400 to-teal-500" />
              <div className="inline-block h-5.5 w-5.5 rounded-full ring-1.5 ring-white bg-gradient-to-tr from-purple-400 to-pink-500" />
            </div>
            <span className="text-[11px] text-[#717171] font-medium">
              Trusted by <span className="font-bold text-[#222222]">85K+ professionals</span> worldwide
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
