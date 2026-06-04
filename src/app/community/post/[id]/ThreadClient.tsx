'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { CommunityPostForDisplay, CommunityCommentForDisplay } from '@/types';
import { Button } from '@/components/ui';

interface ThreadClientProps {
  post: CommunityPostForDisplay;
  initialComments: CommunityCommentForDisplay[];
}

export function ThreadClient({ post, initialComments }: ThreadClientProps) {
  const router = useRouter();
  const [comments, setComments] = useState<CommunityCommentForDisplay[]>(initialComments);
  const [commentBody, setCommentBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentBody.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/community/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: post.id,
          body: commentBody,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.errors?.[0] || data.error || 'Failed to submit comment');
      } else {
        // Append locally
        setComments((prev) => [...prev, data]);
        setCommentBody('');
        // Sync with router state
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError('A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      {/* Back link */}
      <div>
        <Link
          href="/community"
          className="text-xs font-semibold text-[#717171] hover:text-[#222222] transition-colors"
        >
          ← Back to Community
        </Link>
      </div>

      {/* Main Post Card */}
      <div className="bg-white border border-[#EBEBEB] rounded-xl p-6 shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-2">
          {post.companyName ? (
            <Link
              href={`/community/${post.companySlug}`}
              className="text-[10px] uppercase font-bold tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-150 hover:bg-blue-100 transition-colors"
            >
              🏢 {post.companyName} Board
            </Link>
          ) : (
            <Link
              href={`/community/${post.topic}`}
              className="text-[10px] uppercase font-bold tracking-wider bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-150 hover:bg-amber-100 transition-colors"
            >
              💬 {post.topic}
            </Link>
          )}
          <span className="text-xs text-[#717171] font-semibold">
            {new Date(post.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-black text-[#222222] tracking-tight leading-tight">
            {post.title}
          </h1>
          <p className="text-sm text-[#484848] leading-relaxed whitespace-pre-wrap">
            {post.body}
          </p>
        </div>
      </div>

      {/* Comments List */}
      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-bold text-[#222222] border-b border-[#EBEBEB] pb-2">
          Comments ({comments.length})
        </h2>

        {comments.length === 0 ? (
          <div className="bg-white border border-[#EBEBEB] rounded-xl p-8 text-center text-sm text-[#717171] font-medium shadow-sm">
            No comments yet. Start the conversation below!
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {comments.map((comment, index) => (
              <div
                key={comment.id}
                className="bg-white border border-[#EBEBEB] rounded-xl p-5 shadow-sm flex flex-col gap-2.5"
              >
                <div className="flex justify-between items-center text-xs text-[#717171] font-semibold">
                  <span>Anonymous Professional #{index + 1}</span>
                  <span>
                    {new Date(comment.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-sm text-[#484848] leading-relaxed whitespace-pre-wrap">
                  {comment.body}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Comment Form */}
      <div className="bg-white border border-[#EBEBEB] rounded-xl p-6 shadow-sm flex flex-col gap-4">
        <h3 className="text-sm font-bold text-[#222222] border-b border-[#EBEBEB] pb-2">
          Add anonymous comment
        </h3>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmitComment} className="flex flex-col gap-3">
          <textarea
            placeholder="Type your anonymous reply..."
            rows={4}
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
            className="w-full p-3 border border-[#EBEBEB] rounded-lg text-sm text-[#222222] bg-white transition-shadow focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]/50 focus:border-[#FF5A5F]"
            required
            disabled={isSubmitting}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#FF5A5F] hover:bg-[#ff4449] min-w-28 font-bold"
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
