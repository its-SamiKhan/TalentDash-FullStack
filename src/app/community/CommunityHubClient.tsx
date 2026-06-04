'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { 
  CommunityPostForDisplay, 
  PaginatedResponse, 
  CommunityPostFilters,
  CommunityPostIngestPayload
} from '@/types';
import { Input, Select, Button } from '@/components/ui';

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
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Search & Actions Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-[#EBEBEB] pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#222222] tracking-tight">
            Professional Community
          </h1>
          <p className="text-sm text-[#717171] mt-1 font-medium">
            Anonymous workplace discussions, company boards, and career topics.
          </p>
        </div>
        <div className="flex w-full md:w-auto items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="flex-1 md:w-80 flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9"
              />
              <span className="absolute left-3 top-3 text-[#717171]">🔍</span>
            </div>
            {searchQuery && (
              <Button type="button" variant="ghost" onClick={handleClearSearch}>
                Clear
              </Button>
            )}
          </form>
          <Button onClick={() => setIsModalOpen(true)} className="bg-[#FF5A5F] hover:bg-[#ff4449]">
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
    </div>
  );
}
