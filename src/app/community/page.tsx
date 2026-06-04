import React from 'react';
import type { Metadata } from 'next';
import { getPosts } from '@/services/community.service';
import { getAllCompanies } from '@/services/company.service';
import { CommunityHubClient } from './CommunityHubClient';
import { generateCommunityHubMetadata } from '@/lib/seo';

export const revalidate = 0; // Dynamic feed

export async function generateMetadata(): Promise<Metadata> {
  return generateCommunityHubMetadata();
}

interface SearchParams {
  company?: string;
  topic?: string;
  query?: string;
  page?: string;
}

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedParams = await searchParams;
  const company = resolvedParams.company || undefined;
  const topic = resolvedParams.topic || undefined;
  const query = resolvedParams.query || undefined;
  const page = parseInt(resolvedParams.page || '1', 10);

  const postsData = await getPosts(
    { company, topic, query },
    { page, limit: 10 }
  );

  const companiesList = await getAllCompanies();

  return (
    <CommunityHubClient
      initialPostsData={postsData}
      companiesList={companiesList}
      initialFilters={{ company, topic, query }}
      initialPage={page}
    />
  );
}
