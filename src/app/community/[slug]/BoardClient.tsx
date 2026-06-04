'use client';

import React, { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { CommunityPostForDisplay, PaginatedResponse } from '@/types';
import { Button } from '@/components/ui';

interface BoardClientProps {
  boardType: 'company' | 'topic';
  title: string;
  description: string;
  companyName?: string;
  topicLabel?: string;
  postsData: PaginatedResponse<CommunityPostForDisplay>;
  slug: string;
  page: number;
}

export function BoardClient({
  boardType,
  title,
  description,
  postsData,
  slug,
  page,
}: BoardClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handlePagination = (newPage: number) => {
    startTransition(() => {
      router.push(`/community/${slug}?page=${newPage}`);
    });
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      {/* Back Link */}
      <div>
        <Link
          href="/community"
          className="text-xs font-semibold text-[#717171] hover:text-[#222222] transition-colors flex items-center gap-1"
        >
          ← Back to All Discussions
        </Link>
      </div>

      {/* Board Header Banner */}
      <div className="bg-white border border-[#EBEBEB] rounded-xl p-6 shadow-sm flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">
            {boardType === 'company' ? '🏢' : '💬'}
          </span>
          <h1 className="text-2xl font-black text-[#222222] tracking-tight">
            {title}
          </h1>
        </div>
        <p className="text-sm text-[#717171] font-medium leading-relaxed">
          {description}
        </p>
      </div>

      {/* Posts Feed */}
      <div className="flex flex-col gap-4">
        {postsData.data.length === 0 ? (
          <div className="bg-white border border-[#EBEBEB] rounded-xl p-12 text-center shadow-sm">
            <span className="text-3xl">📭</span>
            <h3 className="text-base font-bold text-[#222222] mt-3">No posts yet</h3>
            <p className="text-sm text-[#717171] mt-1">
              Be the first to ask a question or start a discussion on this board!
            </p>
            <Link href="/community">
              <Button className="mt-4 bg-[#FF5A5F] hover:bg-[#ff4449]">
                Go to Hub & Post
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {postsData.data.map((post) => (
              <Link
                key={post.id}
                href={`/community/post/${post.id}`}
                className="bg-white border border-[#EBEBEB] hover:border-[#FF5A5F]/40 rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col gap-3 group"
              >
                <div className="flex items-center gap-2 text-xs text-[#717171] font-semibold">
                  <span>Anonymous Professional</span>
                  <span>•</span>
                  <span>
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

            {/* Pagination */}
            {postsData.meta.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-[#EBEBEB] pt-6 mt-4">
                <Button
                  variant="secondary"
                  disabled={page <= 1 || isPending}
                  onClick={() => handlePagination(page - 1)}
                >
                  Previous
                  </Button>
                <span className="text-sm font-semibold text-[#717171]">
                  Page {page} of {postsData.meta.totalPages}
                </span>
                <Button
                  variant="secondary"
                  disabled={page >= postsData.meta.totalPages || isPending}
                  onClick={() => handlePagination(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
