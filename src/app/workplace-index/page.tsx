import React from 'react';
import Link from 'next/link';
import {
  getWorkplaceRankings,
  getIndustriesWithScores,
} from '@/services/workplace.service';
import { WorkplaceScoreBadge, CompanyLogo } from '@/components/ui';
import { generateWorkplaceHubMetadata } from '@/lib/seo';

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
  </svg>
);

const MicrosoftLogo = () => (
  <svg viewBox="0 0 23 23" className="w-4 h-4 shrink-0">
    <rect x="0" y="0" width="11" height="11" fill="#F25022" />
    <rect x="12" y="0" width="11" height="11" fill="#7FBA00" />
    <rect x="0" y="12" width="11" height="11" fill="#00A1F1" />
    <rect x="12" y="12" width="11" height="11" fill="#FFB900" />
  </svg>
);

const AppleLogo = () => (
  <svg viewBox="0 0 170 170" className="w-4 h-4 shrink-0" fill="#000000">
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.22-9.13-1.78-14.37-6.01-3.43-2.77-7.23-7.39-11.41-13.88-8.58-13.31-15.02-28.85-19.32-46.62-2.93-12.07-4.4-23.77-4.4-35.1 0-16.14 3.82-29.41 11.46-39.79 7.64-10.38 17.2-15.68 28.66-15.89 6.58 0 13.14 1.74 19.67 5.21 6.53 3.48 10.87 5.21 13.02 5.21 2.06 0 6.46-1.8 13.2-5.38 6.74-3.59 13.03-5.27 18.88-5.06 14.16.84 25.13 6.07 32.9 15.68-11.53 6.97-17.18 16.31-16.97 28.02.21 9.49 3.82 17.36 10.82 23.6 7 6.24 15.25 9.77 24.75 10.59-2.72 8.04-6.42 16.03-11.11 23.97zm-20.91-118.73c0 7.82-2.83 14.92-8.5 21.31-5.67 6.4-12.44 10.29-20.31 11.68.21-6.87 2.93-13.88 8.16-21.03 5.23-7.14 12.18-11.45 20.85-12.92.83 1.05 1.25 2.21 1.25 3.48" />
  </svg>
);

const NetflixLogo = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="#E50914">
    <path d="M5.5 2h4l4.5 12V2h4v20h-4l-4.5-12v12h-4z" />
  </svg>
);

const NvidiaLogo = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="#76B900">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm-1.5-3.5c-.55 0-1-.45-1-1V9c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1z" />
  </svg>
);

const SpotifyLogo = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="#1DB954">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.58 14.42c-.18.29-.56.38-.85.2-2.37-1.45-5.36-1.78-8.87-.98-.33.07-.66-.14-.74-.47-.07-.33.14-.66.47-.74 3.84-.88 7.14-.5 9.79 1.13.29.18.38.56.2.86zm1.22-2.73c-.22.37-.71.49-1.08.27-2.72-1.67-6.87-2.16-10.08-1.18-.41.13-.85-.1-1-.52-.13-.41.1-.85.52-1 3.66-1.11 8.24-.57 11.37 1.35.37.22.49.71.27 1.08zm.1-2.83C14.65 9.07 9.21 8.89 6.07 9.84c-.5.15-1.03-.13-1.18-.63-.15-.5.13-1.03.63-1.18 3.62-1.1 9.61-.89 13.56 1.45.45.27.6.85.33 1.3-.27.45-.85.6-1.3.33z" />
  </svg>
);

const SalesforceLogo = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="#00A1E0">
    <path d="M17.8 11.2c-.4-.5-.9-.8-1.5-.9-.1-.2-.1-.5-.2-.7-.2-1.3-1.3-2.3-2.6-2.3-.9 0-1.7.5-2.1 1.2-.5-.4-1.1-.6-1.7-.6-1.5 0-2.7 1.1-2.9 2.6-.7-.1-1.3.2-1.8.6C4.3 11.7 4 12.6 4 13.5c0 2 1.6 3.5 3.5 3.5h10c1.7 0 3-1.3 3-3 0-1.1-.7-2.1-1.7-2.5z" />
  </svg>
);

const SapLogo = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="#008FD3">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14H8v-2h5v2zm0-4H8V8h5v4z" />
  </svg>
);

const HubspotLogo = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="#FF7A59">
    <path d="M18.667 12a2.667 2.667 0 11-5.334 0c0-.395.093-.767.247-1.107L10.24 9.173a2.657 2.657 0 01-1.573 2.16c.093.213.14.453.14.68 0 1.013-.827 1.84-1.84 1.84s-1.84-.827-1.84-1.84.827-1.84 1.84-1.84c.227 0 .467.047.68.14A2.66 2.66 0 019.827 8.76L11.547 6.16a2.656 2.657 0 111.453.96L11.28 9.72c.16.227.28.48.347.76l3.333 1.72c.24-.133.513-.2.8-.2a2.667 2.667 0 012.907 2.667z" />
  </svg>
);

const IntuitLogo = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="#0077C5">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2 14h-4V8h4v8z" />
  </svg>
);

const AmazonLogo = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="#000000">
    <path d="M11.72 5.19c-2.48 0-4.7 1.2-4.7 3.96 0 2.21 1.34 3.2 3.1 3.2 1.48 0 2.65-.67 3.32-1.78v1.39h3.06V7.48c0-3.32-1.92-4.57-4.78-4.57zm1.18 5.7c-.32.73-1.04 1.22-1.89 1.22-.96 0-1.58-.62-1.58-1.57 0-1.12.79-1.71 2.26-1.71h1.21v2.06zm-7.6 5.86c-1.88.94-3.5 1.77-3.5 3.35 0 1.22.95 2.05 2.24 2.05 1.74 0 3.3-1.09 4.14-2.22l-1.13-1.18c-.46.54-1 .96-1.75.96-.54 0-.9-.26-.9-.72 0-.68.66-1.03 1.84-1.57l3.68-1.66V13.8l-4.67 1.95zm11.75 3.65c4.7-2.3 8.35-6.68 8.35-11.83v-.6H20.4v.6c0 4.1-2.9 7.63-6.65 9.47l1.3 2.36z" />
    <path d="M1.37 20.83c3.55 1.95 8.1 3.02 12.63 3.02 5.4 0 10.3-1.53 13.9-4.14l-1.55-2.07c-3.17 2.25-7.44 3.56-12.35 3.56-4.06 0-8.1-.96-11.23-2.67l-1.4 2.3z" fill="#FF9900" />
  </svg>
);

import { prisma } from '@/lib/prisma';

export const revalidate = 3600; // Cache for 1 hour

export async function generateMetadata() {
  return generateWorkplaceHubMetadata();
}

export default async function WorkplaceIndexHubPage() {
  const [
    totalCompaniesRanked,
    salariesCount,
    reviewsCount,
    interviewsCount,
    distinctHeadquarters,
    distinctIndustries,
    industries,
    topRanked
  ] = await Promise.all([
    prisma.company.count({
      where: {
        NOT: {
          name: {
            startsWith: 'TestCorp',
          },
        },
      },
    }),
    prisma.salary.count({
      where: {
        company: {
          NOT: {
            name: {
              startsWith: 'TestCorp',
            },
          },
        },
      },
    }),
    prisma.review.count({
      where: {
        company: {
          NOT: {
            name: {
              startsWith: 'TestCorp',
            },
          },
        },
      },
    }),
    prisma.interview.count({
      where: {
        company: {
          NOT: {
            name: {
              startsWith: 'TestCorp',
            },
          },
        },
      },
    }),
    prisma.company.findMany({
      select: { headquarters: true },
      distinct: ['headquarters'],
      where: {
        NOT: {
          name: {
            startsWith: 'TestCorp',
          },
        },
        headquarters: { not: null, notIn: ['Unknown', ''] }
      }
    }),
    prisma.company.findMany({
      select: { industry: true },
      distinct: ['industry'],
      where: {
        NOT: {
          name: {
            startsWith: 'TestCorp',
          },
        },
        industry: { not: null, notIn: ['Unknown', ''] }
      }
    }),
    getIndustriesWithScores(),
    getWorkplaceRankings().then(list => list.slice(0, 3))
  ]);

  const totalDataPoints = salariesCount + reviewsCount + interviewsCount;
  const locationsCount = distinctHeadquarters.length;
  const industriesCount = distinctIndustries.length;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-10">
      
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-black text-[#222222] tracking-tight">Workplace Index</h1>
      </div>

      {/* 1. Workplace Index Dashboard Header Card */}
      <div className="bg-white border border-[#EBEBEB] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-start gap-4">
          <div className="bg-[#FF5A5F]/10 text-[#FF5A5F] p-3.5 rounded-xl flex items-center justify-center h-12 w-12 shrink-0 shadow-xs shadow-[#FF5A5F]/10">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF5A5F] bg-[#FF5A5F]/10 px-2.5 py-0.5 rounded-full w-fit">
              Workplace Index
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#222222] tracking-tight mt-1.5 leading-tight">
              TalentDash Workplace Index
            </h2>
            <p className="text-xs sm:text-sm text-[#717171] mt-1 font-semibold">
              Data-driven rankings of companies, industries and workplaces based on what professionals value the most.
            </p>
          </div>
        </div>
        <Link
          href="/workplace-index/rankings"
          className="text-xs sm:text-sm font-extrabold text-[#FF5A5F] border border-[#FF5A5F] hover:bg-[#FF5A5F]/5 transition-colors px-4 py-2 rounded-xl flex items-center gap-1.5 shrink-0 self-start md:self-auto cursor-pointer"
        >
          Explore all rankings <span>→</span>
        </Link>
      </div>

      {/* 1.5. Four Statistics Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white border border-[#EBEBEB] rounded-xl p-4 flex items-center gap-3.5 shadow-2xs">
          <div className="bg-blue-50 text-blue-600 p-2.5 rounded-lg shrink-0">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <p className="text-base font-black text-[#222222]">{totalCompaniesRanked}</p>
            <p className="text-[10px] text-[#717171] leading-tight font-semibold mt-0.5">Companies ranked</p>
            <p className="text-[9px] font-extrabold text-[#717171] mt-0.5">Across {locationsCount} locations</p>
          </div>
        </div>
        
        {/* Card 2 */}
        <div className="bg-white border border-[#EBEBEB] rounded-xl p-4 flex items-center gap-3.5 shadow-2xs">
          <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-lg shrink-0">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622" />
            </svg>
          </div>
          <div>
            <p className="text-base font-black text-[#222222]">{totalDataPoints.toLocaleString()}</p>
            <p className="text-[10px] text-[#717171] leading-tight font-semibold mt-0.5">Verified data points</p>
            <p className="text-[9px] font-extrabold text-emerald-600 mt-0.5">From real professionals</p>
          </div>
        </div>
        
        {/* Card 3 */}
        <div className="bg-white border border-[#EBEBEB] rounded-xl p-4 flex items-center gap-3.5 shadow-2xs">
          <div className="bg-orange-50 text-orange-600 p-2.5 rounded-lg shrink-0">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.906a1 1 0 00.95-.69l1.519-4.674z" />
            </svg>
          </div>
          <div>
            <p className="text-base font-black text-[#222222]">{industriesCount}</p>
            <p className="text-[10px] text-[#717171] leading-tight font-semibold mt-0.5">Ranking categories</p>
            <p className="text-[9px] font-extrabold text-orange-600 mt-0.5">Updated monthly</p>
          </div>
        </div>
        
        {/* Card 4 */}
        <div className="bg-white border border-[#EBEBEB] rounded-xl p-4 flex items-center gap-3.5 shadow-2xs">
          <div className="bg-cyan-50 text-cyan-600 p-2.5 rounded-lg shrink-0">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <p className="text-base font-black text-[#222222]">100%</p>
            <p className="text-[10px] text-[#717171] leading-tight font-semibold mt-0.5">Transparent methodology</p>
            <p className="text-[9px] font-extrabold text-cyan-600 mt-0.5">No paid placements</p>
          </div>
        </div>
      </div>

      {/* 2. Popular Ranking Lists Section */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-extrabold text-[#222222]">Popular ranking lists</h2>
          <Link href="/workplace-index/rankings" className="text-xs font-bold text-[#FF5A5F] hover:text-[#ff4449]">
            View all rankings →
          </Link>
        </div>
        
        <div className="flex items-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3.5 w-full">
            {[
              {
                title: 'Top 100 Companies',
                sub: 'Overall',
                icon: '💼',
                iconBg: 'bg-emerald-50 text-emerald-600',
                items: [
                  { name: 'Google', logo: <GoogleLogo /> },
                  { name: 'Microsoft', logo: <MicrosoftLogo /> },
                  { name: 'Apple', logo: <AppleLogo /> }
                ]
              },
              {
                title: 'Top 100 Companies',
                sub: 'for Millennials',
                icon: '👥',
                iconBg: 'bg-rose-50 text-rose-600',
                items: [
                  { name: 'Google', logo: <GoogleLogo /> },
                  { name: 'Microsoft', logo: <MicrosoftLogo /> },
                  { name: 'Netflix', logo: <NetflixLogo /> }
                ]
              },
              {
                title: 'Top 100 Companies',
                sub: 'for Gen Z',
                icon: '🚀',
                iconBg: 'bg-purple-50 text-purple-600',
                items: [
                  { name: 'NVIDIA', logo: <NvidiaLogo /> },
                  { name: 'Google', logo: <GoogleLogo /> },
                  { name: 'Spotify', logo: <SpotifyLogo /> }
                ]
              },
              {
                title: 'Top 100 Best Paying',
                sub: 'Companies',
                icon: '💳',
                iconBg: 'bg-orange-50 text-orange-600',
                items: [
                  { name: 'NVIDIA', logo: <NvidiaLogo /> },
                  { name: 'Google', logo: <GoogleLogo /> },
                  { name: 'Microsoft', logo: <MicrosoftLogo /> }
                ]
              },
              {
                title: 'Top 100 for',
                sub: 'Work-Life Balance',
                icon: '⚖️',
                iconBg: 'bg-blue-50 text-blue-600',
                items: [
                  { name: 'Salesforce', logo: <SalesforceLogo /> },
                  { name: 'Microsoft', logo: <MicrosoftLogo /> },
                  { name: 'SAP', logo: <SapLogo /> }
                ]
              },
              {
                title: 'Top 100 Most Loved',
                sub: 'Workplaces',
                icon: '💖',
                iconBg: 'bg-pink-50 text-pink-600',
                items: [
                  { name: 'Salesforce', logo: <SalesforceLogo /> },
                  { name: 'HubSpot', logo: <HubspotLogo /> },
                  { name: 'Intuit', logo: <IntuitLogo /> }
                ]
              }
            ].map((col, idx) => (
              <div key={idx} className="bg-white border border-[#EBEBEB] rounded-xl p-4 flex flex-col justify-between h-56 shadow-3xs hover:border-[#FF5A5F]/35 transition-colors">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className={`${col.iconBg} h-7 w-7 rounded-full flex items-center justify-center text-xs shrink-0 shadow-3xs`}>
                      {col.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black text-[#222222] truncate leading-tight">{col.title}</p>
                      <p className="text-[9px] font-semibold text-[#717171] leading-none mt-0.5">{col.sub}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 mt-1">
                    {col.items.map((it, itIdx) => (
                      <div key={itIdx} className="flex items-center gap-2 text-[10px] font-bold text-[#484848] leading-none py-0.5">
                        <span className="text-[#717171] text-[8px] font-extrabold w-2">#{itIdx + 1}</span>
                        <div className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                          {it.logo}
                        </div>
                        <span className="truncate">{it.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Link
                  href="/workplace-index/rankings"
                  className="bg-[#FF5A5F]/5 hover:bg-[#FF5A5F]/10 text-[#FF5A5F] h-7 w-7 rounded-lg flex items-center justify-center self-end transition-colors cursor-pointer"
                >
                  <span className="text-xs font-black">→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Explore By Industry Section */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-extrabold text-[#222222]">Explore by industry</h2>
          <Link href="/workplace-index/rankings" className="text-xs font-bold text-[#FF5A5F] hover:text-[#ff4449]">
            View all industries →
          </Link>
        </div>
        
        <div className="flex items-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-8 gap-2.5 w-full">
            {[
              {
                name: 'IT Services',
                slug: 'it-services',
                logos: [<GoogleLogo key="google" />, <MicrosoftLogo key="microsoft" />, <AppleLogo key="apple" />]
              },
              {
                name: 'BFSI',
                slug: 'fintech',
                logos: [
                  <div key="s" className="bg-blue-600 text-white rounded flex items-center justify-center text-[7px] font-black w-3.5 h-3.5 shrink-0 shadow-3xs">S</div>,
                  <div key="h" className="bg-blue-900 text-white rounded flex items-center justify-center text-[7px] font-black w-3.5 h-3.5 shrink-0 shadow-3xs">H</div>,
                  <div key="i" className="bg-orange-600 text-white rounded flex items-center justify-center text-[7px] font-black w-3.5 h-3.5 shrink-0 shadow-3xs">I</div>
                ]
              },
              {
                name: 'FMCG',
                slug: 'technology',
                logos: [
                  <div key="n" className="bg-red-700 text-white rounded flex items-center justify-center text-[7px] font-black w-3.5 h-3.5 shrink-0 shadow-3xs">N</div>,
                  <div key="p" className="bg-blue-500 text-white rounded flex items-center justify-center text-[7px] font-black w-3.5 h-3.5 shrink-0 shadow-3xs">P</div>,
                  <div key="u" className="bg-blue-700 text-white rounded flex items-center justify-center text-[7px] font-black w-3.5 h-3.5 shrink-0 shadow-3xs">U</div>
                ]
              },
              {
                name: 'Consumer Services',
                slug: 'quick-commerce',
                logos: [
                  <div key="z" className="bg-rose-600 text-white rounded flex items-center justify-center text-[7px] font-black w-3.5 h-3.5 shrink-0 shadow-3xs">Z</div>,
                  <div key="s" className="bg-orange-500 text-white rounded flex items-center justify-center text-[7px] font-black w-3.5 h-3.5 shrink-0 shadow-3xs">S</div>,
                  <div key="m" className="bg-pink-600 text-white rounded flex items-center justify-center text-[7px] font-black w-3.5 h-3.5 shrink-0 shadow-3xs">M</div>
                ]
              },
              {
                name: 'E-Commerce',
                slug: 'e-commerce',
                logos: [<AmazonLogo key="amazon" />, <div key="f" className="bg-blue-500 text-white rounded flex items-center justify-center text-[7px] font-black w-3.5 h-3.5 shrink-0 shadow-3xs">F</div>, <div key="m" className="bg-pink-500 text-white rounded flex items-center justify-center text-[7px] font-black w-3.5 h-3.5 shrink-0 shadow-3xs">M</div>]
              },
              {
                name: 'Healthcare',
                slug: 'technology',
                logos: [
                  <div key="a" className="bg-teal-600 text-white rounded flex items-center justify-center text-[7px] font-black w-3.5 h-3.5 shrink-0 shadow-3xs">A</div>,
                  <div key="f" className="bg-blue-600 text-white rounded flex items-center justify-center text-[7px] font-black w-3.5 h-3.5 shrink-0 shadow-3xs">F</div>,
                  <div key="m" className="bg-purple-600 text-white rounded flex items-center justify-center text-[7px] font-black w-3.5 h-3.5 shrink-0 shadow-3xs">M</div>
                ]
              },
              {
                name: 'Travel & Hospitality',
                slug: 'social-media',
                logos: [
                  <div key="a" className="bg-rose-500 text-white rounded flex items-center justify-center text-[7px] font-black w-3.5 h-3.5 shrink-0 shadow-3xs">A</div>,
                  <div key="m" className="bg-orange-600 text-white rounded flex items-center justify-center text-[7px] font-black w-3.5 h-3.5 shrink-0 shadow-3xs">M</div>,
                  <div key="i" className="bg-blue-800 text-white rounded flex items-center justify-center text-[7px] font-black w-3.5 h-3.5 shrink-0 shadow-3xs">I</div>
                ]
              },
              {
                name: 'Manufacturing',
                slug: 'semiconductors',
                logos: [
                  <div key="t" className="bg-blue-900 text-white rounded flex items-center justify-center text-[7px] font-black w-3.5 h-3.5 shrink-0 shadow-3xs">T</div>,
                  <div key="m" className="bg-red-600 text-white rounded flex items-center justify-center text-[7px] font-black w-3.5 h-3.5 shrink-0 shadow-3xs">M</div>,
                  <div key="j" className="bg-blue-600 text-white rounded flex items-center justify-center text-[7px] font-black w-3.5 h-3.5 shrink-0 shadow-3xs">J</div>
                ]
              }
            ].map((ind, idx) => (
              <div key={idx} className="bg-white border border-[#EBEBEB] rounded-xl p-3 flex flex-col justify-between h-42 shadow-3xs hover:border-[#FF5A5F]/35 transition-colors">
                <div>
                  <p className="text-[10px] font-black text-[#222222] leading-tight line-clamp-2">{ind.name}</p>
                  <p className="text-[8px] font-semibold text-[#717171] leading-none mt-1">Top companies</p>
                  
                  <div className="flex items-center gap-1.5 mt-3">
                    {ind.logos.map((lg, lgIdx) => (
                      <div key={lgIdx} className="w-5.5 h-5.5 rounded bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                        {lg}
                      </div>
                    ))}
                  </div>
                </div>
                
                <Link
                  href={`/workplace-index/${ind.slug}`}
                  className="bg-[#FF5A5F]/5 hover:bg-[#FF5A5F]/10 text-[#FF5A5F] h-6 w-6 rounded-md flex items-center justify-center self-end transition-colors cursor-pointer"
                >
                  <span className="text-[10px] font-black">→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Bottom Trust Banner */}
      <div className="bg-[#FF5A5F]/5 border border-[#FF5A5F]/15 rounded-2xl p-6 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-left">
          <div className="h-12 w-12 rounded-xl bg-[#FF5A5F]/10 text-[#FF5A5F] flex items-center justify-center shrink-0 shadow-3xs">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622" />
            </svg>
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="text-base font-extrabold text-[#222222]">Rankings you can trust</h4>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-semibold text-[#717171]">
              <span className="flex items-center gap-1">✓ Verified data only</span>
              <span className="flex items-center gap-1">✓ No paid placements</span>
              <span className="flex items-center gap-1">✓ Updated monthly</span>
              <span className="flex items-center gap-1">✓ Transparent methodology</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex -space-x-1.5 overflow-hidden">
            <div className="inline-block h-6.5 w-6.5 rounded-full ring-2 ring-white bg-gradient-to-tr from-amber-400 to-rose-400 flex items-center justify-center text-[9px] font-bold text-white shadow-2xs">AS</div>
            <div className="inline-block h-6.5 w-6.5 rounded-full ring-2 ring-white bg-gradient-to-tr from-blue-400 to-indigo-500 flex items-center justify-center text-[9px] font-bold text-white shadow-2xs">KM</div>
            <div className="inline-block h-6.5 w-6.5 rounded-full ring-2 ring-white bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-[9px] font-bold text-white shadow-2xs">NT</div>
          </div>
          <span className="text-[10px] font-bold text-[#717171] whitespace-nowrap">Backed by 15M+ verified professionals</span>
        </div>
      </div>

      {/* 5. Ratings Explanation & Top Podium (Live Database Connected) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mt-2">
        {/* Rating Guide */}
        <div className="bg-white border border-[#EBEBEB] rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <h3 className="text-base font-black text-[#222222]">
            Workplace Index Classification Guide
          </h3>
          <div className="flex flex-col gap-4 text-sm mt-1">
            <div className="flex gap-3">
              <span className="text-rose-600 font-black shrink-0">⭐️⭐️⭐️</span>
              <div className="flex flex-col">
                <span className="font-bold text-[#222222]">3-Star Index (4.5+)</span>
                <span className="text-[#484848] text-xs font-semibold">
                  Exceptional workplace. Enforces top-tier compensation, healthy boundaries, solid WFH support, and inclusive hiring practices.
                </span>
              </div>
            </div>
            <div className="flex gap-3 border-t border-[#EBEBEB] pt-3">
              <span className="text-amber-600 font-black shrink-0">⭐️⭐️</span>
              <div className="flex flex-col">
                <span className="font-bold text-[#222222]">2-Star Index (4.0 - 4.49)</span>
                <span className="text-[#484848] text-xs font-semibold">
                  Highly recommended. Solid career growth, reasonable management patterns, and fair compensation ratios.
                </span>
              </div>
            </div>
            <div className="flex gap-3 border-t border-[#EBEBEB] pt-3">
              <span className="text-blue-600 font-black shrink-0">⭐️</span>
              <div className="flex flex-col">
                <span className="font-bold text-[#222222]">1-Star Index (3.5 - 3.99)</span>
                <span className="text-[#484848] text-xs font-semibold">
                  Recommended. Good local workplace conditions with standard tech benefits and progression models.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Top 3 List */}
        <div className="bg-white border border-[#EBEBEB] rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <h3 className="text-base font-black text-[#222222]">
            Top Rated Workplaces
          </h3>
          <div className="flex flex-col gap-3 mt-1">
            {topRanked.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b border-[#EBEBEB] pb-3 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-[#717171] w-4">
                    #{index + 1}
                  </span>
                  <CompanyLogo
                    name={item.companyName}
                    logoUrl={item.companyLogoUrl}
                    size={32}
                  />
                  <span className="text-sm font-bold text-[#222222]">
                    {item.companyName}
                  </span>
                </div>
                <WorkplaceScoreBadge score={item.overallScore || 0} showScore={false} />
              </div>
            ))}
          </div>
          <Link
            href="/workplace-index/rankings"
            className="text-xs text-center font-extrabold text-white bg-[#FF5A5F] hover:bg-[#ff4449] py-2.5 rounded-lg transition-colors mt-auto text-shadow-none cursor-pointer"
          >
            Explore Complete Rankings Table
          </Link>
        </div>
      </div>

      {/* Industries Directory (Live Database Connected) */}
      <div className="flex flex-col gap-4">
        <h2 className="text-base font-black text-[#222222] border-b border-[#EBEBEB] pb-2">
          Rankings Directory by Industry
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {industries.map((ind) => (
            <Link
              key={ind.slug}
              href={`/workplace-index/${ind.slug}`}
              className="bg-white border border-[#EBEBEB] hover:border-[#FF5A5F] rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col gap-2 group"
            >
              <span className="text-sm font-black text-[#222222] group-hover:text-[#FF5A5F] transition-colors leading-tight">
                {ind.name}
              </span>
              <span className="text-xs text-[#717171] font-semibold">
                {ind.count} {ind.count === 1 ? 'employer' : 'employers'} ranked
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
