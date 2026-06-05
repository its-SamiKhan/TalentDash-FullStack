'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  SearchInput,
  Select,
  EmptyState,
  StarRatingInput,
  Pagination,
  FilterBar,
  InterviewCard,
} from '@/components/ui';
import type { InterviewForDisplay, PaginatedResponse, InterviewFilters } from '@/types';

interface InterviewsPageClientProps {
  initialData: PaginatedResponse<InterviewForDisplay>;
  distinctRoles: string[];
  companiesList: { id: string; name: string; slug: string }[];
  initialFilters: InterviewFilters;
  initialPage: number;
  isSubmitOpenInitial: boolean;
}

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

const HubspotLogo = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="#FF7A59">
    <path d="M18.667 12a2.667 2.667 0 11-5.334 0c0-.395.093-.767.247-1.107L10.24 9.173a2.657 2.657 0 01-1.573 2.16c.093.213.14.453.14.68 0 1.013-.827 1.84-1.84 1.84s-1.84-.827-1.84-1.84.827-1.84 1.84-1.84c.227 0 .467.047.68.14A2.66 2.66 0 019.827 8.76L11.547 6.16a2.656 2.657 0 111.453.96L11.28 9.72c.16.227.28.48.347.76l3.333 1.72c.24-.133.513-.2.8-.2a2.667 2.667 0 012.907 2.667z" />
  </svg>
);

const AmazonLogo = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="#000000">
    <path d="M11.72 5.19c-2.48 0-4.7 1.2-4.7 3.96 0 2.21 1.34 3.2 3.1 3.2 1.48 0 2.65-.67 3.32-1.78v1.39h3.06V7.48c0-3.32-1.92-4.57-4.78-4.57zm1.18 5.7c-.32.73-1.04 1.22-1.89 1.22-.96 0-1.58-.62-1.58-1.57 0-1.12.79-1.71 2.26-1.71h1.21v2.06zm-7.6 5.86c-1.88.94-3.5 1.77-3.5 3.35 0 1.22.95 2.05 2.24 2.05 1.74 0 3.3-1.09 4.14-2.22l-1.13-1.18c-.46.54-1 .96-1.75.96-.54 0-.9-.26-.9-.72 0-.68.66-1.03 1.84-1.57l3.68-1.66V13.8l-4.67 1.95zm11.75 3.65c4.7-2.3 8.35-6.68 8.35-11.83v-.6H20.4v.6c0 4.1-2.9 7.63-6.65 9.47l1.3 2.36z" />
    <path d="M1.37 20.83c3.55 1.95 8.1 3.02 12.63 3.02 5.4 0 10.3-1.53 13.9-4.14l-1.55-2.07c-3.17 2.25-7.44 3.56-12.35 3.56-4.06 0-8.1-.96-11.23-2.67l-1.4 2.3z" fill="#FF9900" />
  </svg>
);

const MetaLogo = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="#0668E1">
    <path d="M16.75 8c-1.54 0-2.92.83-3.79 2.08-.4-.57-.86-1.07-1.39-1.48C10.61 7.82 9.1 7.3 7.5 7.3c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.6 0 3.11-.52 4.07-1.3 1-.82 1.76-1.97 2.18-3.08.42 1.11 1.18 2.26 2.18 3.08.96.78 2.47 1.3 4.07 1.3 3.59 0 6.5-2.91 6.5-6.5s-2.91-6.5-6.5-6.5zm-9.25 9.7c-2.04 0-3.7-1.66-3.7-3.7s1.66-3.7 3.7-3.7c.95 0 1.83.36 2.47 1.01.65.64 1.03 1.54 1.03 2.7s-.38 2.06-1.03 2.7c-.64.64-1.52 1-2.47 1zm9.25 0c-.95 0-1.83-.36-2.47-1-.65-.65-1.03-1.54-1.03-2.7s.38-2.06 1.03-2.7c.64-.64 1.52-1 2.47-1 2.04 0 3.7 1.66 3.7 3.7s-1.66 3.7-3.7 3.7z" />
  </svg>
);

const roleTabItems: Record<
  string,
  {
    role: string;
    questionsCount: string;
    latestQuestion: string;
    logos: React.ReactNode[];
    extraLogosCount: number;
    growth: number;
    icon: React.ReactNode;
  }[]
> = {
  'Popular Roles': [
    {
      role: 'Software Engineer',
      questionsCount: '12.4K',
      latestQuestion: 'Implement LRU Cache in O(1) time complexity',
      logos: [<GoogleLogo key="g" />, <AmazonLogo key="a" />, <MicrosoftLogo key="m" />, <MetaLogo key="mt" />],
      extraLogosCount: 3,
      growth: 18,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
    {
      role: 'Product Manager',
      questionsCount: '8.7K',
      latestQuestion: 'How would you launch a new payments feature?',
      logos: [<AmazonLogo key="a" />, <GoogleLogo key="g" />, <MicrosoftLogo key="m" />, <AppleLogo key="ap" />],
      extraLogosCount: 2,
      growth: 14,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      role: 'Data Analyst',
      questionsCount: '6.3K',
      latestQuestion: 'Analyze sales performance and identify trends',
      logos: [<AmazonLogo key="a" />, <MicrosoftLogo key="m" />, <GoogleLogo key="g" />, <AppleLogo key="ap" />],
      extraLogosCount: 2,
      growth: 22,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      role: 'Product Designer',
      questionsCount: '4.1K',
      latestQuestion: 'Improve the checkout flow for better conversion',
      logos: [<GoogleLogo key="g" />, <MetaLogo key="mt" />, <AppleLogo key="ap" />, <NetflixLogo key="n" />],
      extraLogosCount: 2,
      growth: 16,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ],
  'Engineering': [
    {
      role: 'SDE-I',
      questionsCount: '3.2K',
      latestQuestion: 'Reverse a string in place without library methods',
      logos: [<GoogleLogo key="g" />, <MicrosoftLogo key="m" />],
      extraLogosCount: 0,
      growth: 12,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
    {
      role: 'SDE-II',
      questionsCount: '6.8K',
      latestQuestion: 'Design a distributed rate limiter for APIs',
      logos: [<AmazonLogo key="a" />, <MetaLogo key="mt" />, <SpotifyLogo key="s" />],
      extraLogosCount: 4,
      growth: 15,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
    {
      role: 'Tech Lead',
      questionsCount: '2.1K',
      latestQuestion: 'How do you handle technical debt in a fast-paced startup?',
      logos: [<AppleLogo key="ap" />, <NetflixLogo key="n" />],
      extraLogosCount: 1,
      growth: 8,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
  ],
  'Product': [
    {
      role: 'Associate PM',
      questionsCount: '1.5K',
      latestQuestion: 'Design a smart refrigerator for visually impaired users',
      logos: [<MicrosoftLogo key="m" />, <GoogleLogo key="g" />],
      extraLogosCount: 0,
      growth: 10,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      role: 'Director of Product',
      questionsCount: '850',
      latestQuestion: 'How would you pitch Google Maps monetization strategy?',
      logos: [<GoogleLogo key="g" />, <AppleLogo key="ap" />],
      extraLogosCount: 1,
      growth: 5,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
  ],
  'Data': [
    {
      role: 'Data Scientist',
      questionsCount: '4.2K',
      latestQuestion: 'Explain the mathematical formulation of SVM vs Random Forest',
      logos: [<MetaLogo key="mt" />, <GoogleLogo key="g" />, <MicrosoftLogo key="m" />],
      extraLogosCount: 2,
      growth: 11,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      role: 'Data Engineer',
      questionsCount: '3.1K',
      latestQuestion: 'Design an ETL pipeline for petabyte-scale real-time event analytics',
      logos: [<AmazonLogo key="a" />, <AppleLogo key="ap" />],
      extraLogosCount: 3,
      growth: 14,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ],
  'Design': [
    {
      role: 'UI/UX Designer',
      questionsCount: '2.8K',
      latestQuestion: 'Redesign the checkout/payment flow for Uber Eats app',
      logos: [<GoogleLogo key="g" />, <MetaLogo key="mt" />],
      extraLogosCount: 2,
      growth: 9,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ],
  'Sales': [
    {
      role: 'Enterprise AE',
      questionsCount: '1.2K',
      latestQuestion: 'How do you handle budget-cut objections during a contract renewal negotiation?',
      logos: [<SalesforceLogo key="sf" />, <MicrosoftLogo key="m" />],
      extraLogosCount: 1,
      growth: 7,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ],
  'Marketing': [
    {
      role: 'Growth Marketer',
      questionsCount: '980',
      latestQuestion: 'How would you run a low-budget user acquisition campaign for a SaaS product?',
      logos: [<HubspotLogo key="hs" />, <GoogleLogo key="g" />],
      extraLogosCount: 0,
      growth: 13,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      ),
    },
  ],
  'Operations': [
    {
      role: 'Operations Manager',
      questionsCount: '1.4K',
      latestQuestion: 'Explain how you optimize warehouse delivery schedules and minimize route overlap.',
      logos: [<AmazonLogo key="a" />, <NetflixLogo key="n" />],
      extraLogosCount: 2,
      growth: 10,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
  ],
};

export function InterviewsPageClient({
  initialData,
  distinctRoles,
  companiesList,
  initialFilters,
  initialPage,
  isSubmitOpenInitial,
}: InterviewsPageClientProps) {
  const router = useRouter();

  // State sync from URL parameters
  const [companySearch, setCompanySearch] = useState(initialFilters.company || '');
  const [selectedRole, setSelectedRole] = useState(initialFilters.role || '');
  const [page, setPage] = useState(initialPage);
  const [activeRoleTab, setActiveRoleTab] = useState<string>('Popular Roles');

  const [prevFilters, setPrevFilters] = useState(initialFilters);
  const [prevPage, setPrevPage] = useState(initialPage);

  if (
    initialFilters.company !== prevFilters.company ||
    initialFilters.role !== prevFilters.role ||
    initialPage !== prevPage
  ) {
    setPrevFilters(initialFilters);
    setPrevPage(initialPage);
    setCompanySearch(initialFilters.company || '');
    setSelectedRole(initialFilters.role || '');
    setPage(initialPage);
  }

  // Submission Modal State
  const [isSubmitOpen, setIsSubmitOpen] = useState(isSubmitOpenInitial);
  const [prevIsSubmitOpenInitial, setPrevIsSubmitOpenInitial] = useState(isSubmitOpenInitial);

  if (isSubmitOpenInitial !== prevIsSubmitOpenInitial) {
    setPrevIsSubmitOpenInitial(isSubmitOpenInitial);
    setIsSubmitOpen(isSubmitOpenInitial);
  }

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [formValues, setFormValues] = useState({
    company: '',
    role: '',
    difficulty: 3,
    rounds: 3,
    outcome: 'OFFER',
    experience: '',
    questions: '',
  });

  const syncParams = (
    filters: { company: string; role: string },
    newPage: number,
    submitOpenState = isSubmitOpen
  ) => {
    const params = new URLSearchParams();

    if (filters.company) params.set('company', filters.company);
    if (filters.role) params.set('role', filters.role);
    if (newPage > 1) params.set('page', newPage.toString());
    if (submitOpenState) params.set('submit', 'true');

    router.push(`/interviews?${params.toString()}`);
  };

  const handleCompanySearch = (val: string) => {
    setCompanySearch(val);
    setPage(1);
    syncParams({ company: val, role: selectedRole }, 1);
  };

  const handleRoleChange = (val: string) => {
    setSelectedRole(val);
    setPage(1);
    syncParams({ company: companySearch, role: val }, 1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    syncParams({ company: companySearch, role: selectedRole }, newPage);
  };

  const handleOpenSubmit = () => {
    setIsSubmitOpen(true);
    syncParams({ company: companySearch, role: selectedRole }, page, true);
  };

  const handleCloseSubmit = () => {
    setIsSubmitOpen(false);
    setFormErrors([]);
    setSubmitSuccess(false);
    setFormValues({
      company: '',
      role: '',
      difficulty: 3,
      rounds: 3,
      outcome: 'OFFER',
      experience: '',
      questions: '',
    });
    syncParams({ company: companySearch, role: selectedRole }, page, false);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: name === 'difficulty' || name === 'rounds' ? parseInt(value, 10) : value,
    }));
  };

  const handleRatingChange = (name: string, value: number) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors([]);
    setSubmitSuccess(false);

    // Client-side validations
    const errors: string[] = [];
    if (formValues.experience.length < 20) {
      errors.push('Interview process/experience story must be at least 20 characters long.');
    }
    if (formValues.questions.length < 10) {
      errors.push('Questions asked must be at least 10 characters long.');
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await fetch('/api/ingest-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formValues,
          company: formValues.company.trim(),
          role: formValues.role.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setFormErrors(data.errors || ['An unexpected error occurred.']);
      } else {
        setSubmitSuccess(true);
        router.refresh();
        setTimeout(() => {
          handleCloseSubmit();
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setFormErrors(['Network error. Please try again.']);
    }
  };

  const activeFilters = [];
  if (companySearch) {
    activeFilters.push({
      key: 'company',
      label: `Company Slug: "${companySearch}"`,
      value: companySearch,
    });
  }
  if (selectedRole) {
    activeFilters.push({
      key: 'role',
      label: `Role: ${selectedRole}`,
      value: selectedRole,
    });
  }

  const handleRemoveFilter = (key: string) => {
    if (key === 'company') handleCompanySearch('');
    else if (key === 'role') handleRoleChange('');
  };

  const handleClearAllFilters = () => {
    setCompanySearch('');
    setSelectedRole('');
    setPage(1);
    syncParams({ company: '', role: '' }, 1);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-10">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-black text-[#222222] tracking-tight">Interview Experiences</h1>
      </div>

      {/* 1. Interviews Dashboard Header Card */}
      <div className="bg-white border border-[#EBEBEB] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-start gap-4">
          <div className="bg-[#FF5A5F]/10 text-[#FF5A5F] p-3.5 rounded-xl flex items-center justify-center h-12 w-12 shrink-0 shadow-xs shadow-[#FF5A5F]/10">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF5A5F] bg-[#FF5A5F]/10 px-2.5 py-0.5 rounded-full w-fit">
              Interviews
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#222222] tracking-tight mt-1.5 leading-tight">
              Real interview questions from real candidates
            </h2>
            <p className="text-xs sm:text-sm text-[#717171] mt-1 font-semibold">
              Recent interview experiences shared by verified professionals.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            const el = document.getElementById('interviews-feed');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="text-xs sm:text-sm font-extrabold text-[#FF5A5F] border border-[#FF5A5F] hover:bg-[#FF5A5F]/5 transition-colors px-4 py-2 rounded-xl flex items-center gap-1.5 shrink-0 self-start md:self-auto cursor-pointer"
        >
          Explore all interviews <span>→</span>
        </button>
      </div>

      {/* 2. Recent questions asked */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-[#FF5A5F] text-lg">⚡</span>
            <h2 className="text-base font-extrabold text-[#222222]">Recent questions asked</h2>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById('interviews-feed');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-xs font-bold text-[#FF5A5F] hover:text-[#ff4449] cursor-pointer"
          >
            View all
          </button>
        </div>

        <div className="relative flex items-center">
          {/* Left Arrow */}
          <button className="absolute -left-3.5 z-10 bg-white border border-[#EBEBEB] hover:border-[#FF5A5F] hover:text-[#FF5A5F] shadow-xs w-8 h-8 rounded-full flex items-center justify-center text-slate-400 cursor-pointer select-none transition-colors">
            <span className="text-sm font-black">‹</span>
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
            {[
              {
                company: 'Google',
                role: 'Software Engineer',
                time: '2h ago',
                logo: <GoogleLogo />,
                question: 'Given a binary tree, serialize and deserialize it. How would you design the serialization method?',
                tags: ['Algorithms', 'Binary Tree', 'Design'],
                difficulty: 'Easy',
                answers: 128,
              },
              {
                company: 'Microsoft',
                role: 'Product Manager',
                time: '3h ago',
                logo: <MicrosoftLogo />,
                question: 'How would you improve customer retention for Microsoft 365? Walk me through your approach.',
                tags: ['Product Sense', 'Metrics', 'Strategy'],
                difficulty: 'Medium',
                answers: 96,
              },
              {
                company: 'Amazon',
                role: 'SDE II',
                time: '5h ago',
                logo: <AmazonLogo />,
                question: 'Design a rate limiter. How would you handle distributed systems and ensure scalability?',
                tags: ['System Design', 'Scalability', 'API'],
                difficulty: 'Hard',
                answers: 64,
              },
              {
                company: 'Apple',
                role: 'Data Analyst',
                time: '6h ago',
                logo: <AppleLogo />,
                question: 'How would you analyze App Store performance and suggest data-driven improvements?',
                tags: ['SQL', 'Analytics', 'Data Visualization'],
                difficulty: 'Medium',
                answers: 52,
              },
              {
                company: 'Meta',
                role: 'Product Designer',
                time: '7h ago',
                logo: <MetaLogo />,
                question: 'Redesign the Facebook Events creation flow to improve user engagement. What would you do?',
                tags: ['Product Design', 'UX', 'User Research'],
                difficulty: 'Medium',
                answers: 41,
              },
            ].map((q, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#EBEBEB] rounded-xl p-4 flex flex-col justify-between h-[270px] shadow-3xs hover:border-[#FF5A5F]/35 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                      {q.logo}
                    </div>
                    <div className="min-w-0 leading-tight">
                      <p className="text-[10px] font-black text-[#222222] truncate">{q.company}</p>
                      <p className="text-[9px] text-[#717171] font-semibold truncate">
                        {q.role} <span className="text-slate-300">•</span> {q.time}
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#484848] font-bold leading-relaxed line-clamp-4 mt-3">
                    &ldquo;{q.question}&rdquo;
                  </p>
                </div>

                <div className="flex flex-col gap-3 mt-2">
                  <div className="flex flex-wrap gap-1">
                    {q.tags.map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className="bg-slate-100/70 text-[#717171] text-[8px] font-extrabold px-1.5 py-0.5 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-100 pt-2 text-[9px] text-[#717171] font-bold">
                    <span className="flex items-center gap-1.5">
                      {q.difficulty === 'Easy' && (
                        <>
                          <span className="text-[#008A05]">Easy</span>
                          <span className="flex items-center gap-0.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#008A05]"></span>
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-200"></span>
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-200"></span>
                          </span>
                        </>
                      )}
                      {q.difficulty === 'Medium' && (
                        <>
                          <span className="text-[#D97706]">Medium</span>
                          <span className="flex items-center gap-0.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#D97706]"></span>
                            <span className="h-1.5 w-1.5 rounded-full bg-[#D97706]"></span>
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-200"></span>
                          </span>
                        </>
                      )}
                      {q.difficulty === 'Hard' && (
                        <>
                          <span className="text-[#DC2626]">Hard</span>
                          <span className="flex items-center gap-0.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#DC2626]"></span>
                            <span className="h-1.5 w-1.5 rounded-full bg-[#DC2626]"></span>
                            <span className="h-1.5 w-1.5 rounded-full bg-[#DC2626]"></span>
                          </span>
                        </>
                      )}
                    </span>

                    <span className="flex items-center gap-2">
                      <svg className="h-3 w-3 text-slate-300 hover:text-[#FF5A5F] cursor-pointer transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      <span>{q.answers} answers</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button className="absolute -right-3.5 z-10 bg-white border border-[#EBEBEB] hover:border-[#FF5A5F] hover:text-[#FF5A5F] shadow-xs w-8 h-8 rounded-full flex items-center justify-center text-slate-400 cursor-pointer select-none transition-colors">
            <span className="text-sm font-black">›</span>
          </button>
        </div>
      </div>

      {/* 3. Columns Section: Left (Browse) and Right (Topics + Ingest Card) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-2">
        {/* Left Column: Browse questions by role */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-[#EBEBEB] pb-2">
            <h2 className="text-base font-black text-[#222222]">Browse questions by role</h2>
          </div>

          {/* Tab bar */}
          <div className="flex items-center gap-1 border-b border-[#EBEBEB] overflow-x-auto pb-px scrollbar-none">
            {Object.keys(roleTabItems).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveRoleTab(tab)}
                className={`text-xs font-bold px-4 py-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeRoleTab === tab
                    ? 'border-[#FF5A5F] text-[#FF5A5F]'
                    : 'border-transparent text-[#717171] hover:text-[#222222]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Role rows */}
          <div className="flex flex-col gap-3.5">
            {(roleTabItems[activeRoleTab] || []).map((row, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#EBEBEB] rounded-xl p-4 flex items-center justify-between shadow-2xs hover:border-[#FF5A5F]/20 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-[#FF5A5F]/5 text-[#FF5A5F] flex items-center justify-center shrink-0 shadow-3xs">
                    {row.icon}
                  </div>
                  <div className="min-w-0 leading-tight">
                    <p className="text-xs font-black text-[#222222] truncate">{row.role}</p>
                    <p className="text-[10px] text-[#717171] font-semibold mt-0.5">
                      {row.questionsCount} questions
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-4 min-w-0 flex-1 justify-center px-4">
                  <p className="text-[10px] text-[#484848] font-bold truncate max-w-[240px]">
                    <span className="text-[#717171] font-extrabold mr-1">Latest:</span>
                    &ldquo;{row.latestQuestion}&rdquo;
                  </p>
                  
                  <div className="flex -space-x-1.5 overflow-hidden shrink-0 ml-2">
                    {row.logos.map((lg, lgIdx) => (
                      <div
                        key={lgIdx}
                        className="w-5.5 h-5.5 rounded bg-slate-50 border border-white flex items-center justify-center shadow-3xs shrink-0"
                      >
                        {lg}
                      </div>
                    ))}
                    {row.extraLogosCount > 0 && (
                      <div className="text-[8px] font-black text-slate-500 bg-slate-100 flex items-center justify-center w-5.5 h-5.5 rounded border border-white shadow-3xs shrink-0 select-none">
                        +{row.extraLogosCount}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 pl-2">
                  <span className="text-[10px] font-extrabold text-[#008A05] flex items-center gap-0.5">
                    ↗ {row.growth}%
                  </span>
                  <span className="text-[8px] text-[#717171] font-semibold mt-0.5">vs last month</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              const el = document.getElementById('interviews-feed');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-xs font-bold text-[#FF5A5F] hover:text-[#ff4449] self-center flex items-center gap-1 cursor-pointer mt-2"
          >
            View all roles and questions <span>→</span>
          </button>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 flex flex-col gap-6 w-full">
          {/* Trending interview topics */}
          <div className="bg-white border border-[#EBEBEB] rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-[#EBEBEB] pb-2">
              <div className="flex items-center gap-2">
                <span className="text-[#FF5A5F] text-sm">🔥</span>
                <h3 className="text-sm font-black text-[#222222]">Trending interview topics</h3>
              </div>
              <button
                onClick={() => {
                  const el = document.getElementById('interviews-feed');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-[10px] font-bold text-[#FF5A5F] hover:text-[#ff4449] cursor-pointer"
              >
                View all topics
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
              {[
                {
                  title: 'System Design',
                  count: '2.4K',
                  icon: (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  ),
                },
                {
                  title: 'Algorithms',
                  count: '1.8K',
                  icon: (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  ),
                },
                {
                  title: 'SQL',
                  count: '1.6K',
                  icon: (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                    </svg>
                  ),
                },
                {
                  title: 'Behavioral',
                  count: '1.5K',
                  icon: (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  ),
                },
                {
                  title: 'Product Sense',
                  count: '1.2K',
                  icon: (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  ),
                },
                {
                  title: 'Data Structures',
                  count: '987',
                  icon: (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  ),
                },
                {
                  title: 'API Design',
                  count: '876',
                  icon: (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  ),
                },
                {
                  title: 'Case Studies',
                  count: '765',
                  icon: (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  ),
                },
                {
                  title: 'Machine Learning',
                  count: '654',
                  icon: (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  ),
                },
              ].map((topic, tIdx) => (
                <div
                  key={tIdx}
                  className="bg-white border border-[#EBEBEB] rounded-xl p-3 flex items-center gap-3 shadow-3xs hover:border-[#FF5A5F]/20 transition-colors"
                >
                  <div className="bg-[#FF5A5F]/5 text-[#FF5A5F] h-8 w-8 rounded-lg flex items-center justify-center shrink-0">
                    {topic.icon}
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-[#222222] leading-tight">{topic.title}</p>
                    <p className="text-[9px] text-[#717171] font-semibold mt-0.5">{topic.count} questions</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Share your interview experience */}
          <div className="bg-[#FF5A5F]/5 border border-[#FF5A5F]/15 rounded-2xl p-6 shadow-2xs flex flex-col justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-[#FF5A5F]/10 text-[#FF5A5F] flex items-center justify-center shrink-0 shadow-3xs">
                <svg className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-[#222222]">Share your interview experience</h4>
                <p className="text-xs text-[#717171] mt-1 font-semibold leading-relaxed">
                  Help other professionals by sharing the questions you were asked in your interview.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-[#FF5A5F]/10 pt-4">
              <button
                onClick={handleOpenSubmit}
                className="w-full bg-[#FF5A5F] hover:bg-[#ff4449] text-white text-xs font-extrabold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                Submit interview questions <span>→</span>
              </button>

              <div className="flex items-center gap-2">
                <div className="flex -space-x-1.5 overflow-hidden">
                  <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-gradient-to-tr from-amber-400 to-rose-400 flex items-center justify-center text-[8px] font-bold text-white shadow-2xs">JS</div>
                  <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-gradient-to-tr from-blue-400 to-indigo-500 flex items-center justify-center text-[8px] font-bold text-white shadow-2xs">MS</div>
                  <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-[8px] font-bold text-white shadow-2xs">RK</div>
                </div>
                <span className="text-[9px] font-bold text-[#717171]">Join 85K+ professionals contributing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Live Feed Area with Search Console */}
      <div id="interviews-feed" className="border-t border-[#EBEBEB] pt-10 mt-4 flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-black text-[#222222] tracking-tight">All Candidate Interview Experiences</h2>
          <p className="text-xs text-[#717171] mt-1 font-semibold">
            Filter and browse through all logs in the database.
          </p>
        </div>

        {/* Filters Area */}
        <div className="bg-white border border-[#EBEBEB] rounded-2xl p-5 shadow-sm flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchInput
              placeholder="Search company slug (e.g. google, amazon)..."
              value={companySearch}
              onChange={handleCompanySearch}
            />
            <Select
              options={[{ value: '', label: 'All Roles' }, ...distinctRoles.map((r) => ({ value: r, label: r }))]}
              value={selectedRole}
              onChange={(e) => handleRoleChange(e.target.value)}
            />
          </div>
          <div className="border-t border-[#EBEBEB] pt-4 flex justify-between items-center text-xs text-[#717171] font-semibold">
            <span>
              Showing <span className="font-bold text-[#222222]">{initialData.meta.total}</span> interview logs
            </span>
          </div>
        </div>

        {/* Active Filter Pills */}
        <FilterBar
          filters={activeFilters}
          onRemove={handleRemoveFilter}
          onClearAll={handleClearAllFilters}
        />

        {/* Interviews Feed List */}
        {initialData.data.length === 0 ? (
          <EmptyState onReset={handleClearAllFilters} />
        ) : (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-6">
              {initialData.data.map((interview) => (
                <InterviewCard key={interview.id} interview={interview} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={page}
              totalPages={initialData.meta.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Slide-out Contribution Drawer */}
      {/* Backdrop */}
      <div 
        onClick={handleCloseSubmit}
        className={`fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity duration-300 z-50 ${
          isSubmitOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`} 
      />

      {/* Drawer Panel */}
      <div 
        className={`fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl border-l border-[#EBEBEB] z-50 flex flex-col h-full transform transition-transform duration-300 ease-in-out ${
          isSubmitOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-[#EBEBEB]">
          <div className="flex flex-col">
            <h2 className="text-base font-extrabold text-[#222222] tracking-tight">Share Your Experience</h2>
            <p className="text-[10px] text-[#717171] font-semibold mt-0.5">Help others prepare for interviews anonymously</p>
          </div>
          <button
            type="button"
            onClick={handleCloseSubmit}
            className="text-[#717171] hover:text-[#222222] text-2xl font-light p-1 focus:outline-none cursor-pointer"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {submitSuccess ? (
            <div className="py-12 text-center flex flex-col items-center gap-3">
              <div className="h-14 w-14 rounded-full bg-[#008A05]/10 border border-[#008A05]/20 flex items-center justify-center text-[#008A05] text-2xl font-bold">
                ✓
              </div>
              <h3 className="text-base font-extrabold text-[#222222] mt-2">Experience Submitted!</h3>
              <p className="text-xs text-[#717171] font-medium max-w-[240px]">
                Thank you for contributing. The interviews index will refresh shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-5 pb-6">
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
                    onChange={handleFormChange}
                    options={[
                      { value: '', label: 'Select a company...' },
                      ...companiesList.map((c) => ({ value: c.name, label: c.name })),
                    ]}
                    required
                  />
                </div>

                <div>
                  <Select
                    label="Job Role / Title"
                    name="role"
                    value={formValues.role}
                    onChange={handleFormChange}
                    options={[
                      { value: '', label: 'Select a role...' },
                      ...distinctRoles.map((r) => ({ value: r, label: r })),
                    ]}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#717171] mb-1.5">
                      Rounds Count
                    </label>
                    <select
                      name="rounds"
                      value={formValues.rounds}
                      onChange={handleFormChange}
                      className="w-full p-2.5 border border-[#EBEBEB] rounded-md text-sm text-[#222222] bg-white transition-shadow focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]/50 focus:border-[#FF5A5F]"
                      required
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Round' : 'Rounds'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#717171] mb-1.5">
                      Outcome
                    </label>
                    <select
                      name="outcome"
                      value={formValues.outcome}
                      onChange={handleFormChange}
                      className="w-full p-2.5 border border-[#EBEBEB] rounded-md text-sm text-[#222222] bg-white transition-shadow focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]/50 focus:border-[#FF5A5F]"
                      required
                    >
                      <option value="OFFER">Offer</option>
                      <option value="REJECT">Rejected</option>
                      <option value="GHOSTED">Ghosted</option>
                    </select>
                  </div>
                </div>

                <div className="border-y border-[#EBEBEB] py-4 flex flex-col gap-2">
                  <StarRatingInput
                    label="Difficulty Rating"
                    rating={formValues.difficulty}
                    onChange={(val) => handleRatingChange('difficulty', val)}
                  />
                  <span className="text-[10px] text-[#717171] font-semibold mt-0.5">
                    1-2: Easy | 3: Medium | 4-5: Hard
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#717171]">
                    Interview Experience Description
                  </label>
                  <textarea
                    name="experience"
                    rows={3}
                    placeholder="Describe the rounds, interview process, and overall vibe of the candidate experience (Min 20 characters)"
                    value={formValues.experience}
                    onChange={handleFormChange}
                    className="w-full p-3 border border-[#EBEBEB] rounded-md text-sm text-[#222222] bg-white transition-shadow focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]/50 focus:border-[#FF5A5F]"
                    required
                  />
                  <span className="text-[9px] text-right font-semibold text-[#717171] mt-0.5">
                    {formValues.experience.length} / 20 characters minimum
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#717171]">
                    Questions Asked
                  </label>
                  <textarea
                    name="questions"
                    rows={3}
                    placeholder="What technical or behavioral questions were you asked? (Min 10 characters)"
                    value={formValues.questions}
                    onChange={handleFormChange}
                    className="w-full p-3 border border-[#EBEBEB] rounded-md text-sm text-[#222222] bg-white transition-shadow focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]/50 focus:border-[#FF5A5F]"
                    required
                  />
                  <span className="text-[9px] text-right font-semibold text-[#717171] mt-0.5">
                    {formValues.questions.length} / 10 characters minimum
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[#EBEBEB] flex justify-end gap-3">
                <Button variant="secondary" type="button" onClick={handleCloseSubmit} className="cursor-pointer text-xs py-2 px-4 font-bold">
                  Cancel
                </Button>
                <Button variant="primary" type="submit" className="cursor-pointer text-xs py-2 px-5 font-bold">
                  Submit Experience
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
