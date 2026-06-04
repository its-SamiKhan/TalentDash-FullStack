import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCompanyBySlug } from '@/services/company.service';
import { getPosts } from '@/services/community.service';
import { BoardClient } from './BoardClient';
import { generateCommunityBoardMetadata } from '@/lib/seo';

export const revalidate = 0; // Dynamic feed

const VALID_TOPICS = ['careers', 'layoffs', 'compensation', 'interview-prep', 'tech-talk'];

const TOPIC_LABELS: Record<string, string> = {
  careers: 'Careers & Advice',
  layoffs: 'Layoffs & Hiring',
  compensation: 'Compensation & Salary',
  'interview-prep': 'Interview Prep',
  'tech-talk': 'Tech Talk & Engineering',
};

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const companyData = await getCompanyBySlug(slug);

  if (companyData) {
    return generateCommunityBoardMetadata(
      `${companyData.company.name} Board`,
      `Anonymous threads and conversations about working at ${companyData.company.name}.`,
      slug
    );
  }

  if (VALID_TOPICS.includes(slug)) {
    const label = TOPIC_LABELS[slug];
    return generateCommunityBoardMetadata(
      `${label} Board`,
      `Anonymous discussions, questions, and insights relating to ${label.toLowerCase()}.`,
      slug
    );
  }

  return {
    title: 'Board Not Found | TalentDash',
  };
}

export default async function CommunityBoardPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || '1', 10);

  // Check if it's a company board
  const companyData = await getCompanyBySlug(slug);

  if (companyData) {
    const postsData = await getPosts({ company: slug }, { page, limit: 10 });
    return (
      <BoardClient
        boardType="company"
        title={`${companyData.company.name} Board`}
        description={`Anonymous threads and conversations about working at ${companyData.company.name}.`}
        companyName={companyData.company.name}
        postsData={postsData}
        slug={slug}
        page={page}
      />
    );
  }

  // Check if it's a topic board
  if (VALID_TOPICS.includes(slug)) {
    const label = TOPIC_LABELS[slug];
    const postsData = await getPosts({ topic: slug }, { page, limit: 10 });
    return (
      <BoardClient
        boardType="topic"
        title={`${label} Board`}
        description={`Anonymous discussions, questions, and insights relating to ${label.toLowerCase()}.`}
        topicLabel={label}
        postsData={postsData}
        slug={slug}
        page={page}
      />
    );
  }

  // If neither, render 404
  notFound();
}
