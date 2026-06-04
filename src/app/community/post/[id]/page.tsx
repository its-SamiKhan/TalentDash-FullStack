import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostById } from '@/services/community.service';
import { ThreadClient } from './ThreadClient';
import { generateCommunityThreadMetadata } from '@/lib/seo';

export const revalidate = 0; // Thread replies must load dynamically

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getPostById(id);

  if (!result) {
    return {
      title: 'Thread Not Found | TalentDash',
    };
  }

  return generateCommunityThreadMetadata(
    result.post.title,
    result.post.body.substring(0, 150) + '...',
    id
  );
}

export default async function ThreadPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getPostById(id);

  if (!result) {
    notFound();
  }

  return (
    <ThreadClient
      post={result.post}
      initialComments={result.comments}
    />
  );
}
