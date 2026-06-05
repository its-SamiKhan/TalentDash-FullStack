'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { 
  CommunityPostForDisplay, 
  CommunityCommentForDisplay,
  PaginatedResponse, 
  CommunityPostFilters,
  CommunityPostIngestPayload
} from '@/types';
import { Input, Select, Button } from '@/components/ui';

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

const MetaLogo = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="#0668E1">
    <path d="M16.75 8c-1.54 0-2.92.83-3.79 2.08-.4-.57-.86-1.07-1.39-1.48C10.61 7.82 9.1 7.3 7.5 7.3c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.6 0 3.11-.52 4.07-1.3 1-.82 1.76-1.97 2.18-3.08.42 1.11 1.18 2.26 2.18 3.08.96.78 2.47 1.3 4.07 1.3 3.59 0 6.5-2.91 6.5-6.5s-2.91-6.5-6.5-6.5zm-9.25 9.7c-2.04 0-3.7-1.66-3.7-3.7s1.66-3.7 3.7-3.7c.95 0 1.83.36 2.47 1.01.65.64 1.03 1.54 1.03 2.7s-.38 2.06-1.03 2.7c-.64.64-1.52 1-2.47 1zm9.25 0c-.95 0-1.83-.36-2.47-1-.65-.65-1.03-1.54-1.03-2.7s.38-2.06 1.03-2.7c.64-.64 1.52-1 2.47-1 2.04 0 3.7 1.66 3.7 3.7s-1.66 3.7-3.7 3.7z"/>
  </svg>
);

const AppleLogo = () => (
  <svg viewBox="0 0 170 170" className="w-4 h-4 shrink-0" fill="#000000">
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.22-9.13-1.78-14.37-6.01-3.43-2.77-7.23-7.39-11.41-13.88-8.58-13.31-15.02-28.85-19.32-46.62-2.93-12.07-4.4-23.77-4.4-35.1 0-16.14 3.82-29.41 11.46-39.79 7.64-10.38 17.2-15.68 28.66-15.89 6.58 0 13.14 1.74 19.67 5.21 6.53 3.48 10.87 5.21 13.02 5.21 2.06 0 6.46-1.8 13.2-5.38 6.74-3.59 13.03-5.27 18.88-5.06 14.16.84 25.13 6.07 32.9 15.68-11.53 6.97-17.18 16.31-16.97 28.02.21 9.49 3.82 17.36 10.82 23.6 7 6.24 15.25 9.77 24.75 10.59-2.72 8.04-6.42 16.03-11.11 23.97zm-20.91-118.73c0 7.82-2.83 14.92-8.5 21.31-5.67 6.4-12.44 10.29-20.31 11.68.21-6.87 2.93-13.88 8.16-21.03 5.23-7.14 12.18-11.45 20.85-12.92.83 1.05 1.25 2.21 1.25 3.48" />
  </svg>
);

const AmazonLogo = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="#000000">
    <path d="M11.72 5.19c-2.48 0-4.7 1.2-4.7 3.96 0 2.21 1.34 3.2 3.1 3.2 1.48 0 2.65-.67 3.32-1.78v1.39h3.06V7.48c0-3.32-1.92-4.57-4.78-4.57zm1.18 5.7c-.32.73-1.04 1.22-1.89 1.22-.96 0-1.58-.62-1.58-1.57 0-1.12.79-1.71 2.26-1.71h1.21v2.06zm-7.6 5.86c-1.88.94-3.5 1.77-3.5 3.35 0 1.22.95 2.05 2.24 2.05 1.74 0 3.3-1.09 4.14-2.22l-1.13-1.18c-.46.54-1 .96-1.75.96-.54 0-.9-.26-.9-.72 0-.68.66-1.03 1.84-1.57l3.68-1.66V13.8l-4.67 1.95zm11.75 3.65c4.7-2.3 8.35-6.68 8.35-11.83v-.6H20.4v.6c0 4.1-2.9 7.63-6.65 9.47l1.3 2.36z" />
    <path d="M1.37 20.83c3.55 1.95 8.1 3.02 12.63 3.02 5.4 0 10.3-1.53 13.9-4.14l-1.55-2.07c-3.17 2.25-7.44 3.56-12.35 3.56-4.06 0-8.1-.96-11.23-2.67l-1.4 2.3z" fill="#FF9900" />
  </svg>
);

interface CompanyItem {
  id: string;
  name: string;
  slug: string;
}

interface CommunityHubClientProps {
  initialPostsData: PaginatedResponse<CommunityPostForDisplay>;
  companiesList: CompanyItem[];
  initialFilters: CommunityPostFilters;
  initialPage: number;
}

const TOPICS = [
  { value: 'careers', label: '💼 Careers & Advice' },
  { value: 'layoffs', label: '📉 Layoffs & Hiring' },
  { value: 'compensation', label: '💵 Compensation & Salary' },
  { value: 'interview-prep', label: '📚 Interview Prep' },
  { value: 'tech-talk', label: '💻 Tech Talk & Engineering' },
];

export function CommunityHubClient({
  initialPostsData,
  companiesList,
  initialFilters,
  initialPage,
}: CommunityHubClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState(initialFilters.query || '');
  const postsData = initialPostsData;

  // Sliding thread details drawer state
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [activePost, setActivePost] = useState<CommunityPostForDisplay | null>(null);
  const [activeComments, setActiveComments] = useState<CommunityCommentForDisplay[]>([]);
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [commentFormValue, setCommentFormValue] = useState('');
  const [commentFormErrors, setCommentFormErrors] = useState<string[]>([]);
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);

  const handleOpenPost = async (postId: string) => {
    setSelectedPostId(postId);
    setIsLoadingPost(true);
    setActivePost(null);
    setActiveComments([]);
    setCommentFormErrors([]);
    setCommentFormValue('');

    try {
      const res = await fetch(`/api/community?id=${postId}`);
      if (res.ok) {
        const data = await res.json();
        setActivePost(data.post);
        setActiveComments(data.comments || []);
      } else {
        setCommentFormErrors(['Failed to load discussion thread.']);
      }
    } catch (err) {
      console.error('Error fetching post:', err);
      setCommentFormErrors(['A network error occurred. Please try again.']);
    } finally {
      setIsLoadingPost(false);
    }
  };

  const handleClosePost = () => {
    setSelectedPostId(null);
    setActivePost(null);
    setActiveComments([]);
    setCommentFormValue('');
    setCommentFormErrors([]);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPostId || !commentFormValue.trim()) return;
    setIsCommentSubmitting(true);
    setCommentFormErrors([]);
    
    try {
      const res = await fetch('/api/community/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: selectedPostId,
          body: commentFormValue.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCommentFormErrors(data.errors || [data.error || 'Failed to submit comment']);
      } else {
        setActiveComments((prev) => [...prev, data]);
        setCommentFormValue('');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setCommentFormErrors(['A network error occurred. Please try again.']);
    } finally {
      setIsCommentSubmitting(false);
    }
  };

  // New Post Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    title: '',
    body: '',
    postCategory: 'topic', // 'topic' | 'company'
    topicSelect: 'careers',
    companySelect: companiesList[0]?.name || '',
  });
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync route filters to browser query params
  const syncFilters = (newFilters: CommunityPostFilters, newPage: number) => {
    const params = new URLSearchParams();
    if (newFilters.company) params.set('company', newFilters.company);
    if (newFilters.topic) params.set('topic', newFilters.topic);
    if (newFilters.query) params.set('query', newFilters.query);
    if (newPage > 1) params.set('page', String(newPage));

    startTransition(() => {
      router.push(`/community?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    syncFilters({ ...initialFilters, query: searchQuery }, 1);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    syncFilters({ ...initialFilters, query: '' }, 1);
  };

  const handlePagination = (newPage: number) => {
    syncFilters(initialFilters, newPage);
  };

  // Submit new post
  const handleCreatePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors([]);

    const payload: CommunityPostIngestPayload = {
      title: formValues.title,
      body: formValues.body,
    };

    if (formValues.postCategory === 'company') {
      payload.company = formValues.companySelect;
    } else {
      payload.topic = formValues.topicSelect;
    }

    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormErrors(data.errors || [data.error || 'Failed to create post']);
      } else {
        // Success
        setIsModalOpen(false);
        setFormValues({
          title: '',
          body: '',
          postCategory: 'topic',
          topicSelect: 'careers',
          companySelect: companiesList[0]?.name || '',
        });
        // Reload page to show new post at top of feed
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setFormErrors(['A network error occurred. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeTopic = initialFilters.topic;
  const activeCompany = initialFilters.company;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-black text-[#222222] tracking-tight">Communities</h1>
      </div>

      {/* 1. Communities Dashboard Header Card */}
      <div className="bg-white border border-[#EBEBEB] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-start gap-4">
          <div className="bg-[#FF5A5F]/10 text-[#FF5A5F] p-3.5 rounded-xl flex items-center justify-center h-12 w-12 shrink-0 shadow-xs shadow-[#FF5A5F]/10">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF5A5F] bg-[#FF5A5F]/10 px-2.5 py-0.5 rounded-full w-fit">
              Community
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#222222] tracking-tight mt-1.5 leading-tight">
              What professionals are discussing
            </h2>
            <p className="text-xs sm:text-sm text-[#717171] mt-1 font-semibold">
              Real conversations. Real insights. From verified professionals.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            const el = document.getElementById('discussions-feed');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="text-xs sm:text-sm font-extrabold text-[#FF5A5F] border border-[#FF5A5F] hover:bg-[#FF5A5F]/5 transition-colors px-4 py-2 rounded-xl flex items-center gap-1.5 shrink-0 self-start md:self-auto cursor-pointer"
        >
          View all discussions <span>→</span>
        </button>
      </div>

      {/* 2. Discussions Carousel Card List */}
      <div className="relative flex items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3 w-full px-4">
          {[
            {
              logo: <AmazonLogo />,
              title: 'Amazon appraisal discussion 2026',
              badge: '⚡ Trending',
              badgeClass: 'bg-orange-50 text-orange-600 border border-orange-100',
              meta: '312 replies • 2h ago',
              avatars: ['A', 'K', 'S'],
              count: '+309'
            },
            {
              logo: <GoogleLogo />,
              title: 'Google hiring freeze impact on offers?',
              badge: '🔥 Hot',
              badgeClass: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
              meta: '245 replies • 3h ago',
              avatars: ['R', 'P', 'M'],
              count: '+242'
            },
            {
              logo: (
                <div className="bg-blue-50 text-blue-600 p-1 rounded-md shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              ),
              title: 'Best companies for GenAI engineers',
              badge: '🔥 Hot',
              badgeClass: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
              meta: '189 replies • 4h ago',
              avatars: ['V', 'A', 'D'],
              count: '+186'
            },
            {
              logo: (
                <div className="bg-violet-50 text-violet-600 p-1 rounded-md shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
              ),
              title: 'Remote work vs office in 2026',
              badge: '⚡ Trending',
              badgeClass: 'bg-orange-50 text-orange-600 border border-orange-100',
              meta: '156 replies • 6h ago',
              avatars: ['S', 'K', 'R'],
              count: '+153'
            },
            {
              logo: (
                <div className="bg-[#FF5A5F]/10 text-[#FF5A5F] p-1 rounded-md shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 8h6m-6 4h6m-6 4h6M5 10H3a2 2 0 00-2 2v8a2 2 0 002 2h18a2 2 0 002-2v-8a2 2 0 00-2-2h-2m-2-8H7a2 2 0 00-2 2v3h14V4a2 2 0 00-2-2z" />
                  </svg>
                </div>
              ),
              title: '2026 PM salaries in India',
              badge: '🔥 Hot',
              badgeClass: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
              meta: '278 replies • 8h ago',
              avatars: ['P', 'A', 'N'],
              count: '+275'
            },
            {
              logo: (
                <div className="bg-teal-50 text-teal-600 p-1 rounded-md shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              ),
              title: 'Startup layoffs megathread',
              badge: '🔥 Hot',
              badgeClass: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
              meta: '512 replies • 10h ago',
              avatars: ['S', 'G', 'T'],
              count: '+509'
            }
          ].map((disc, idx) => (
            <div key={idx} className="bg-white border border-[#EBEBEB] rounded-xl p-3 flex flex-col justify-between gap-3 text-left h-44 shadow-3xs hover:border-[#FF5A5F]/35 transition-colors">
              <div className="flex justify-between items-start">
                <div className="h-6 w-6 flex items-center justify-center shrink-0">
                  {disc.logo}
                </div>
                <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded ${disc.badgeClass}`}>
                  {disc.badge}
                </span>
              </div>
              <h4 className="text-[11px] font-extrabold text-[#222222] line-clamp-2 leading-snug cursor-pointer hover:text-[#FF5A5F] transition-colors">
                {disc.title}
              </h4>
              <div>
                <p className="text-[9px] font-semibold text-[#717171]">{disc.meta}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="flex -space-x-1 overflow-hidden">
                    {disc.avatars.map((av, avIdx) => (
                      <div key={avIdx} className="inline-block h-4.5 w-4.5 rounded-full ring-1 ring-white bg-slate-100 flex items-center justify-center text-[7px] font-bold text-[#717171] shadow-3xs">
                         {av}
                      </div>
                    ))}
                  </div>
                  <span className="text-[8px] font-extrabold text-[#FF5A5F] bg-[#FF5A5F]/10 px-1 py-0.2 rounded-full">
                    {disc.count}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Three-Column Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Column 1: Trending now */}
        <div className="bg-white border border-[#EBEBEB] rounded-2xl p-5 shadow-sm flex flex-col justify-between group hover:border-[#FF5A5F]/40 transition-colors">
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-extrabold text-[#222222] flex items-center gap-1.5 pb-2 border-b border-[#EBEBEB]">
              <span>⚡</span> Trending now
            </h3>
            
            <div className="flex flex-col gap-3">
              {[
                { logo: <AmazonLogo />, title: 'Amazon SDE-2 salary hike 2026 – What are you expecting?', meta: '189 replies • 1h ago • Amazon', badge: 'Hot', badgeClass: 'bg-emerald-50 text-emerald-600' },
                { logo: <GoogleLogo />, title: 'Google L4 hiring bar – Is it really that high in 2026?', meta: '156 replies • 2h ago • Google', badge: 'Hot', badgeClass: 'bg-emerald-50 text-emerald-600' },
                { logo: <MicrosoftLogo />, title: "Microsoft return to office mandate – How's it going?", meta: '132 replies • 3h ago • Microsoft', badge: 'Trending', badgeClass: 'bg-orange-50 text-orange-600' },
                { logo: <MetaLogo />, title: 'Meta E5 performance review experiences', meta: '98 replies • 4h ago • Meta', badge: 'Trending', badgeClass: 'bg-orange-50 text-orange-600' },
                { logo: <AppleLogo />, title: 'Apple PM salary band leaked – Real numbers?', meta: '87 replies • 5h ago • Apple', badge: 'Hot', badgeClass: 'bg-emerald-50 text-emerald-600' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start justify-between gap-3 py-1.5 border-b border-[#F7F7F7] last:border-0">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="w-4 h-4 shrink-0 flex items-center justify-center mt-0.5">
                      {item.logo}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#222222] hover:text-[#FF5A5F] cursor-pointer transition-colors leading-snug line-clamp-2">{item.title}</p>
                      <p className="text-[9px] text-[#717171] font-semibold mt-1">{item.meta}</p>
                    </div>
                  </div>
                  <span className={`text-[8px] font-extrabold px-1 rounded shrink-0 ${item.badgeClass}`}>
                    {item.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <button
            onClick={() => {
              const el = document.getElementById('discussions-feed');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-[11px] font-extrabold text-[#FF5A5F] hover:text-[#ff4449] mt-4 self-center cursor-pointer select-none"
          >
            View all trending discussions →
          </button>
        </div>

        {/* Column 2: Popular communities */}
        <div className="bg-white border border-[#EBEBEB] rounded-2xl p-5 shadow-sm flex flex-col justify-between group hover:border-[#FF5A5F]/40 transition-colors">
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-extrabold text-[#222222] flex items-center gap-1.5 pb-2 border-b border-[#EBEBEB]">
              <span>⭐</span> Popular communities
            </h3>
            
            <div className="flex flex-col gap-3.5">
              {[
                { icon: '💻', name: 'Software Engineering', members: '128K members' },
                { icon: '📦', name: 'Product Management', members: '98K members' },
                { icon: '📊', name: 'Data Science', members: '76K members' },
                { icon: '💼', name: 'MBA / Business', members: '54K members' },
                { icon: '🚀', name: 'Startups', members: '42K members' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 py-1 border-b border-[#F7F7F7] last:border-0">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-xs font-bold text-[#222222] leading-tight">{item.name}</p>
                      <p className="text-[9px] text-[#717171] font-semibold leading-none mt-0.5">{item.members}</p>
                    </div>
                  </div>
                  <button className="text-[9px] font-extrabold border border-[#EBEBEB] hover:border-[#FF5A5F] hover:text-[#FF5A5F] px-2.5 py-1 rounded-lg transition-colors cursor-pointer select-none">
                    Join
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <button
            onClick={() => {
              const el = document.getElementById('discussions-feed');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-[11px] font-extrabold text-[#FF5A5F] hover:text-[#ff4449] mt-4 self-center cursor-pointer select-none"
          >
            Explore all communities →
          </button>
        </div>

        {/* Column 3: Top contributors */}
        <div className="bg-white border border-[#EBEBEB] rounded-2xl p-5 shadow-sm flex flex-col justify-between group hover:border-[#FF5A5F]/40 transition-colors">
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-extrabold text-[#222222] flex items-center gap-1.5 pb-2 border-b border-[#EBEBEB]">
              <span>🏆</span> Top contributors
            </h3>
            
            <div className="flex flex-col gap-3">
              {[
                { name: 'Arjun R.', tier: 'Top 1%', replies: '2.4K replies', initials: 'AR', bg: 'from-amber-400 to-rose-400' },
                { name: 'Priya S.', tier: 'Top 1%', replies: '1.8K replies', initials: 'PS', bg: 'from-blue-400 to-indigo-500' },
                { name: 'Karthik M.', tier: 'Top 1%', replies: '1.2K replies', initials: 'KM', bg: 'from-emerald-400 to-teal-500' },
                { name: 'Neha T.', tier: 'Top 1%', replies: '980 replies', initials: 'NT', bg: 'from-purple-400 to-pink-500' },
                { name: 'Rohit P.', tier: 'Top 1%', replies: '875 replies', initials: 'RP', bg: 'from-orange-400 to-amber-500' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 py-1.5 border-b border-[#F7F7F7] last:border-0">
                  <div className="flex items-center gap-2.5">
                    <div className={`h-7 w-7 rounded-full bg-gradient-to-tr ${item.bg} flex items-center justify-center text-[9px] font-bold text-white shadow-3xs shrink-0`}>
                      {item.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <p className="text-xs font-bold text-[#222222] leading-tight">{item.name}</p>
                        <span className="text-[7px] font-extrabold text-violet-600 bg-violet-50 px-1 rounded-sm flex items-center gap-0.2">
                          🏆 {item.tier}
                        </span>
                      </div>
                      <p className="text-[9px] text-[#717171] font-semibold leading-none mt-0.5">{item.replies}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button
            onClick={() => {
              const el = document.getElementById('discussions-feed');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-[11px] font-extrabold text-[#FF5A5F] hover:text-[#ff4449] mt-4 self-center cursor-pointer select-none"
          >
            See all contributors →
          </button>
        </div>
      </div>

      {/* 4. Bottom CTA Banner */}
      <div className="bg-[#FF5A5F]/5 border border-[#FF5A5F]/15 rounded-2xl p-6 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-left">
          <div className="h-12 w-12 rounded-xl bg-[#FF5A5F]/10 text-[#FF5A5F] flex items-center justify-center shrink-0 shadow-3xs">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h4 className="text-base font-extrabold text-[#222222]">Share your experience. Help millions make better career decisions.</h4>
            <p className="text-xs text-[#717171] mt-0.5 font-medium">Contribute to the conversation. All posts are entirely anonymous.</p>
          </div>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-[#FF5A5F] hover:bg-[#ff4449] w-full sm:w-auto px-6 py-2.5 text-xs font-bold rounded-xl shadow-sm shadow-[#FF5A5F]/10 shrink-0 cursor-pointer">
          Start a discussion
        </Button>
      </div>

      {/* 5. Live Feed Section Header */}
      <div id="discussions-feed" className="scroll-mt-20 flex flex-col md:flex-row gap-4 items-center justify-between border-b border-[#EBEBEB] pb-6 pt-4 mt-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#222222] tracking-tight">
            Professional Discussions Feed
          </h2>
          <p className="text-xs text-[#717171] mt-0.5">
            Filter the crowdsourced table to find matching entries by company, topic, or search query.
          </p>
        </div>
        <div className="flex w-full md:w-auto items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="flex-1 md:w-80 flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 text-xs"
              />
              <span className="absolute left-3 top-3 text-[#717171] text-xs">🔍</span>
            </div>
            {searchQuery && (
              <Button type="button" variant="ghost" onClick={handleClearSearch} className="text-xs">
                Clear
              </Button>
            )}
          </form>
          <Button onClick={() => setIsModalOpen(true)} className="bg-[#FF5A5F] hover:bg-[#ff4449] text-xs px-4 py-2 shrink-0">
            ✍️ Post Anonymously
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters Column */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* General Topics */}
          <div className="bg-white border border-[#EBEBEB] rounded-xl p-5 shadow-sm">
            <h2 className="text-xs uppercase font-extrabold tracking-wider text-[#717171] mb-3 pb-2 border-b border-[#EBEBEB]">
              General Boards
            </h2>
            <div className="flex flex-col gap-1.5">
              <Link
                href="/community"
                className={`text-sm font-semibold px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                  !activeTopic && !activeCompany
                    ? 'bg-[#FF5A5F]/10 text-[#FF5A5F]'
                    : 'text-[#484848] hover:bg-slate-50'
                }`}
              >
                <span>🌐 All Discussions</span>
              </Link>
              {TOPICS.map((topic) => (
                <Link
                  key={topic.value}
                  href={`/community/${topic.value}`}
                  className={`text-sm font-semibold px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                    activeTopic === topic.value
                      ? 'bg-[#FF5A5F]/10 text-[#FF5A5F]'
                      : 'text-[#484848] hover:bg-slate-50'
                  }`}
                >
                  <span>{topic.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Company Boards */}
          <div className="bg-white border border-[#EBEBEB] rounded-xl p-5 shadow-sm">
            <h2 className="text-xs uppercase font-extrabold tracking-wider text-[#717171] mb-3 pb-2 border-b border-[#EBEBEB]">
              Company Boards
            </h2>
            <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto pr-1">
              {companiesList.map((company) => (
                <Link
                  key={company.slug}
                  href={`/community/${company.slug}`}
                  className={`text-sm font-semibold px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                    activeCompany === company.slug
                      ? 'bg-[#FF5A5F]/10 text-[#FF5A5F]'
                      : 'text-[#484848] hover:bg-slate-50'
                  }`}
                >
                  <span>🏢 {company.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Main Feed Column */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {postsData.data.length === 0 ? (
            <div className="bg-white border border-[#EBEBEB] rounded-xl p-12 text-center shadow-sm">
              <span className="text-4xl">📭</span>
              <h3 className="text-base font-bold text-[#222222] mt-3">No conversations found</h3>
              <p className="text-sm text-[#717171] mt-1">
                Be the first to start an anonymous discussion in this category!
              </p>
              <Button onClick={() => setIsModalOpen(true)} className="mt-4 bg-[#FF5A5F] hover:bg-[#ff4449]">
                Start a Thread
              </Button>
            </div>
          ) : (
            <>
              {postsData.data.map((post) => (
                <Link
                  key={post.id}
                  href={`/community/post/${post.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleOpenPost(post.id);
                  }}
                  className="bg-white border border-[#EBEBEB] hover:border-[#FF5A5F]/40 rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col gap-3 group"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {post.companyName ? (
                      <span className="text-[10px] uppercase font-bold tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-150">
                        🏢 {post.companyName} Board
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase font-bold tracking-wider bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-150">
                        💬 {TOPICS.find((t) => t.value === post.topic)?.label || post.topic}
                      </span>
                    )}
                    <span className="text-xs text-[#717171] font-semibold">
                      {new Date(post.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <h2 className="text-lg font-bold text-[#222222] group-hover:text-[#FF5A5F] transition-colors leading-tight">
                      {post.title}
                    </h2>
                    <p className="text-sm text-[#484848] leading-relaxed line-clamp-2">
                      {post.body}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#717171] font-bold border-t border-[#F7F7F7] pt-3 mt-1">
                    <span>💬</span>
                    <span>{post.commentCount} {post.commentCount === 1 ? 'Comment' : 'Comments'}</span>
                  </div>
                </Link>
              ))}

              {/* Pagination controls */}
              {postsData.meta.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-[#EBEBEB] pt-6 mt-4">
                  <Button
                    variant="secondary"
                    disabled={initialPage <= 1 || isPending}
                    onClick={() => handlePagination(initialPage - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm font-semibold text-[#717171]">
                    Page {initialPage} of {postsData.meta.totalPages}
                  </span>
                  <Button
                    variant="secondary"
                    disabled={initialPage >= postsData.meta.totalPages || isPending}
                    onClick={() => handlePagination(initialPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-[#EBEBEB] rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#EBEBEB] flex items-center justify-between">
              <h3 className="text-base font-bold text-[#222222]">
                Post Anonymously
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-2xl text-[#717171] hover:text-[#222222] transition-colors leading-none"
              >
                &times;
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreatePostSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {formErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-xs font-semibold text-red-700 flex flex-col gap-1">
                  {formErrors.map((err, idx) => (
                    <span key={idx}>• {err}</span>
                  ))}
                </div>
              )}

              {/* Categorization */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#717171]">
                  Where to post?
                </label>
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <button
                    type="button"
                    onClick={() => setFormValues((v) => ({ ...v, postCategory: 'topic' }))}
                    className={`h-10 text-sm font-bold border rounded-lg flex items-center justify-center transition-all ${
                      formValues.postCategory === 'topic'
                        ? 'border-[#FF5A5F] bg-[#FF5A5F]/5 text-[#FF5A5F]'
                        : 'border-[#EBEBEB] text-[#484848] hover:bg-slate-50'
                    }`}
                  >
                    💬 General Topic
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormValues((v) => ({ ...v, postCategory: 'company' }))}
                    className={`h-10 text-sm font-bold border rounded-lg flex items-center justify-center transition-all ${
                      formValues.postCategory === 'company'
                        ? 'border-[#FF5A5F] bg-[#FF5A5F]/5 text-[#FF5A5F]'
                        : 'border-[#EBEBEB] text-[#484848] hover:bg-slate-50'
                    }`}
                  >
                    🏢 Company Board
                  </button>
                </div>

                {formValues.postCategory === 'topic' ? (
                  <Select
                    name="topicSelect"
                    value={formValues.topicSelect}
                    onChange={(e) => setFormValues((v) => ({ ...v, topicSelect: e.target.value }))}
                    options={TOPICS}
                  />
                ) : (
                  <Select
                    name="companySelect"
                    value={formValues.companySelect}
                    onChange={(e) => setFormValues((v) => ({ ...v, companySelect: e.target.value }))}
                    options={companiesList.map((c) => ({ value: c.name, label: c.name }))}
                  />
                )}
              </div>

              {/* Title */}
              <Input
                label="Discussion Title"
                placeholder="What is on your mind?"
                value={formValues.title}
                onChange={(e) => setFormValues((v) => ({ ...v, title: e.target.value }))}
                required
              />

              {/* Body */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#717171]">
                  Body Description
                </label>
                <textarea
                  placeholder="Provide context, ask a question, or share details anonymised..."
                  rows={5}
                  value={formValues.body}
                  onChange={(e) => setFormValues((v) => ({ ...v, body: e.target.value }))}
                  className="w-full p-3 border border-[#EBEBEB] rounded-lg text-sm text-[#222222] bg-white transition-shadow focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]/50 focus:border-[#FF5A5F]"
                  required
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 border-t border-[#EBEBEB] pt-4 mt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#FF5A5F] hover:bg-[#ff4449] min-w-28"
                >
                  {isSubmitting ? 'Posting...' : 'Submit Post'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Slide-out Post Drawer */}
      {/* Backdrop */}
      <div 
        onClick={handleClosePost}
        className={`fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity duration-300 z-50 ${
          selectedPostId !== null ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`} 
      />

      {/* Drawer Panel */}
      <div 
        className={`fixed top-0 right-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl border-l border-[#EBEBEB] z-50 flex flex-col h-full transform transition-transform duration-300 ease-in-out ${
          selectedPostId !== null ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-[#EBEBEB]">
          <div className="flex flex-col">
            <h2 className="text-base font-extrabold text-[#222222] tracking-tight">Discussion Thread</h2>
            <p className="text-[10px] text-[#717171] font-semibold mt-0.5 font-sans">Read replies and share your thoughts anonymously</p>
          </div>
          <button
            type="button"
            onClick={handleClosePost}
            className="text-[#717171] hover:text-[#222222] text-2xl font-light p-1 focus:outline-none cursor-pointer"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {isLoadingPost ? (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-4">
              <div className="h-8 w-8 border-2 border-t-transparent border-[#FF5A5F] rounded-full animate-spin"></div>
              <p className="text-xs text-[#717171] font-semibold">Loading discussion thread...</p>
            </div>
          ) : activePost ? (
            <>
              {/* Post Body */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  {activePost.companyName ? (
                    <span className="text-[10px] uppercase font-bold tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-150">
                      🏢 {activePost.companyName} Board
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase font-bold tracking-wider bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-150">
                      💬 {TOPICS.find((t) => t.value === activePost.topic)?.label || activePost.topic}
                    </span>
                  )}
                  <span className="text-xs text-[#717171] font-semibold">
                    {new Date(activePost.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <h1 className="text-xl font-extrabold text-[#222222] leading-snug">
                  {activePost.title}
                </h1>

                <p className="text-sm text-[#484848] leading-relaxed whitespace-pre-wrap bg-slate-50/50 p-4 rounded-xl border border-[#EBEBEB]">
                  {activePost.body}
                </p>
              </div>

              {/* Comments */}
              <div className="border-t border-[#EBEBEB] pt-6 flex flex-col gap-4">
                <h3 className="text-sm font-black text-[#222222]">
                  Replies ({activeComments.length})
                </h3>

                {activeComments.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50/50 border border-dashed border-[#EBEBEB] rounded-xl flex flex-col items-center justify-center p-6">
                    <span className="text-2xl mb-2">💬</span>
                    <p className="text-xs text-[#717171] font-semibold">No replies yet. Be the first to share your thoughts!</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3.5">
                    {activeComments.map((comment, i) => (
                      <div 
                        key={comment.id}
                        className="bg-white border border-[#EBEBEB] rounded-xl p-4 flex gap-3 shadow-3xs text-left"
                      >
                        <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-[#717171] border border-slate-200 shrink-0">
                          {i + 1}
                        </div>
                        <div className="flex flex-col gap-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-extrabold text-[#222222]">Anonymous Candidate</span>
                            <span className="text-[9px] text-[#717171] font-semibold">
                              {new Date(comment.createdAt).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <p className="text-xs text-[#484848] leading-relaxed whitespace-pre-wrap">
                            {comment.body}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-[#717171] text-xs font-semibold">
              Select a thread to view its details.
            </div>
          )}
        </div>

        {/* Comment Input Form */}
        {activePost && (
          <div className="border-t border-[#EBEBEB] p-6 bg-slate-50/50">
            <form onSubmit={handleCommentSubmit} className="flex flex-col gap-3">
              {commentFormErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs font-semibold text-red-700">
                  {commentFormErrors.map((err, i) => (
                    <p key={i}>• {err}</p>
                  ))}
                </div>
              )}
              
              <div className="flex flex-col gap-1">
                <textarea
                  placeholder="Post an anonymous reply..."
                  rows={3}
                  value={commentFormValue}
                  onChange={(e) => setCommentFormValue(e.target.value)}
                  className="w-full p-3 border border-[#EBEBEB] rounded-lg text-xs text-[#222222] bg-white transition-shadow focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]/50 focus:border-[#FF5A5F]"
                  required
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isCommentSubmitting || !commentFormValue.trim()} 
                  className="bg-[#FF5A5F] hover:bg-[#ff4449] text-xs font-bold py-2 px-5 rounded-lg shadow-sm"
                >
                  {isCommentSubmitting ? 'Posting...' : 'Post Reply'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
