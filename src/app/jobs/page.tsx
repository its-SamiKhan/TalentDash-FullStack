import React from 'react';
import type { Metadata } from 'next';
import { JobsPageClient } from './JobsPageClient';

export const metadata: Metadata = {
  title: 'Tech Jobs & Open Positions — TalentDash',
  description: 'Search and apply to open software engineering, product management, and data science positions at top tech companies in India and remote. Filter by salary, experience, and company.',
};

export default async function JobsPage() {
  return <JobsPageClient />;
}
