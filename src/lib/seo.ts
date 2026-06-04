import type { Metadata } from 'next';
import { BASE_URL } from './config';
import { formatCurrency } from './formatters';

// ─── Page Metadata Generators ────────────────────────────

export function generateSalaryPageMetadata(): Metadata {
  return {
    title: 'Tech Salary Data & Compensation Insights',
    description:
      'Explore structured compensation data across top tech companies in India and worldwide. Compare salaries by company, role, level, and location.',
    alternates: { canonical: `${BASE_URL}/salaries` },
    openGraph: {
      title: 'Tech Salary Data & Compensation Insights | TalentDash',
      description:
        'Explore structured compensation data across top tech companies in India and worldwide.',
      url: `${BASE_URL}/salaries`,
      siteName: 'TalentDash',
      type: 'website',
    },
    twitter: { card: 'summary_large_image' },
  };
}

export function generateCompanyPageMetadata(
  company: {
    name: string;
    slug: string;
    industry?: string | null;
    headquarters?: string | null;
  },
  stats: { median_tc: number; count: number }
): Metadata {
  const medianFormatted = formatCurrency(stats.median_tc, 'INR');
  return {
    title: `${company.name} Salary Data & Compensation`,
    description: `Explore ${stats.count} salary records at ${company.name}. Median total compensation: ${medianFormatted}. View by level, role, and location.`,
    alternates: { canonical: `${BASE_URL}/companies/${company.slug}` },
    openGraph: {
      title: `${company.name} Salary Data | TalentDash`,
      description: `${stats.count} compensation records at ${company.name}. Median TC: ${medianFormatted}.`,
      url: `${BASE_URL}/companies/${company.slug}`,
      siteName: 'TalentDash',
      type: 'website',
    },
    twitter: { card: 'summary_large_image' },
  };
}

export function generateComparePageMetadata(): Metadata {
  return {
    title: 'Compare Salaries — Side by Side',
    description:
      'Compare compensation packages side by side. Analyze base salary, bonus, stock, and total compensation differences between roles and companies.',
    alternates: { canonical: `${BASE_URL}/compare` },
    openGraph: {
      title: 'Compare Salaries | TalentDash',
      description: 'Compare compensation packages side by side.',
      url: `${BASE_URL}/compare`,
      siteName: 'TalentDash',
      type: 'website',
    },
    twitter: { card: 'summary_large_image' },
  };
}

export function generateHomePageMetadata(): Metadata {
  return {
    title: 'TalentDash — Compensation Intelligence for Tech Careers',
    description:
      'India-first compensation intelligence platform. Structured salary data, company insights, and comparison tools for tech professionals.',
    alternates: { canonical: BASE_URL },
    openGraph: {
      title: 'TalentDash — Compensation Intelligence for Tech Careers',
      description:
        'Structured salary data and comparison tools for tech professionals.',
      url: BASE_URL,
      siteName: 'TalentDash',
      type: 'website',
    },
    twitter: { card: 'summary_large_image' },
  };
}

export function generateReviewsPageMetadata(): Metadata {
  return {
    title: 'Anonymous Employee Reviews & Company Culture Ratings',
    description:
      'Read honest, anonymized employee reviews and ratings on work-life balance, management quality, growth opportunities, and culture fit for tech companies.',
    alternates: { canonical: `${BASE_URL}/reviews` },
    openGraph: {
      title: 'Anonymous Employee Reviews & Company Culture Ratings | TalentDash',
      description:
        'Read honest, anonymized employee reviews and ratings on work-life balance, management, and culture.',
      url: `${BASE_URL}/reviews`,
      siteName: 'TalentDash',
      type: 'website',
    },
    twitter: { card: 'summary_large_image' },
  };
}

export function generateCompanyReviewsPageMetadata(
  company: { name: string; slug: string },
  stats: { count: number }
): Metadata {
  return {
    title: `${company.name} Employee Reviews & Ratings`,
    description: `Read ${stats.count} anonymous reviews, culture scores, and work-life balance ratings for ${company.name} on TalentDash.`,
    alternates: { canonical: `${BASE_URL}/reviews/${company.slug}` },
    openGraph: {
      title: `${company.name} Reviews | TalentDash`,
      description: `Read anonymous reviews and culture ratings for ${company.name}.`,
      url: `${BASE_URL}/reviews/${company.slug}`,
      siteName: 'TalentDash',
      type: 'website',
    },
    twitter: { card: 'summary_large_image' },
  };
}

export function generateCompanyRoleReviewsPageMetadata(
  company: { name: string; slug: string },
  role: string,
  stats: { count: number }
): Metadata {
  return {
    title: `${company.name} ${role} Reviews & Work Environment`,
    description: `Explore reviews from ${role}s working at ${company.name}. Learn about role-specific work-life balance and growth.`,
    alternates: { canonical: `${BASE_URL}/reviews/${company.slug}/${encodeURIComponent(role)}` },
    openGraph: {
      title: `${company.name} ${role} Reviews | TalentDash`,
      description: `Explore reviews from ${role}s working at ${company.name}.`,
      url: `${BASE_URL}/reviews/${company.slug}/${encodeURIComponent(role)}`,
      siteName: 'TalentDash',
      type: 'website',
    },
    twitter: { card: 'summary_large_image' },
  };
}

export function generateInterviewsPageMetadata(): Metadata {
  return {
    title: 'Tech Interview Questions & Experiences',
    description:
      'Explore interview questions, rounds count, difficulty ratings, and outcomes for tech companies. Prepare for your next interview.',
    alternates: { canonical: `${BASE_URL}/interviews` },
    openGraph: {
      title: 'Tech Interview Questions & Experiences | TalentDash',
      description:
        'Explore interview questions, rounds count, difficulty ratings, and outcomes for tech companies.',
      url: `${BASE_URL}/interviews`,
      siteName: 'TalentDash',
      type: 'website',
    },
    twitter: { card: 'summary_large_image' },
  };
}

export function generateCompanyInterviewsPageMetadata(
  company: { name: string; slug: string },
  stats: { count: number }
): Metadata {
  return {
    title: `${company.name} Interview Questions & Difficulty`,
    description: `Read interview difficulty, typical rounds count, questions asked, and candidate outcome rates at ${company.name}.`,
    alternates: { canonical: `${BASE_URL}/interviews/${company.slug}` },
    openGraph: {
      title: `${company.name} Interviews | TalentDash`,
      description: `Read interview difficulty, typical rounds count, questions asked, and candidate outcome rates at ${company.name}.`,
      url: `${BASE_URL}/interviews/${company.slug}`,
      siteName: 'TalentDash',
      type: 'website',
    },
    twitter: { card: 'summary_large_image' },
  };
}

export function generateCompanyRoleInterviewsPageMetadata(
  company: { name: string; slug: string },
  role: string,
  stats: { count: number }
): Metadata {
  return {
    title: `${company.name} ${role} Interview Questions`,
    description: `Learn about the interview process, rounds, questions, and difficulty for a ${role} role at ${company.name}.`,
    alternates: { canonical: `${BASE_URL}/interviews/${company.slug}/${encodeURIComponent(role)}` },
    openGraph: {
      title: `${company.name} ${role} Interviews | TalentDash`,
      description: `Learn about the interview process, rounds, questions, and difficulty for a ${role} role at ${company.name}.`,
      url: `${BASE_URL}/interviews/${company.slug}/${encodeURIComponent(role)}`,
      siteName: 'TalentDash',
      type: 'website',
    },
    twitter: { card: 'summary_large_image' },
  };
}

export function generateRoleInterviewQuestionsPageMetadata(role: string): Metadata {
  return {
    title: `Real Tech Interview Questions for ${role} Roles`,
    description: `Prepare with real technical interview questions asked for ${role} roles across top tech companies.`,
    alternates: { canonical: `${BASE_URL}/profiles/${encodeURIComponent(role)}/interview-questions` },
    openGraph: {
      title: `${role} Interview Questions | TalentDash`,
      description: `Prepare with real technical interview questions asked for ${role} roles across top tech companies.`,
      url: `${BASE_URL}/profiles/${encodeURIComponent(role)}/interview-questions`,
      siteName: 'TalentDash',
      type: 'website',
    },
    twitter: { card: 'summary_large_image' },
  };
}

export function generateToolsPageMetadata(): Metadata {
  return {
    title: 'Developer Career Tools & Calculators | TalentDash',
    description:
      'Free tools for tech professionals: calculate tax & take-home pay, hike increments, ESOP vesting valuations, and compare side-by-side offer packages.',
    alternates: { canonical: `${BASE_URL}/tools` },
    openGraph: {
      title: 'Developer Career Tools & Calculators | TalentDash',
      description:
        'Free tools for tech professionals: calculate tax & take-home pay, hike increments, ESOP vesting valuations, and compare side-by-side offer packages.',
      url: `${BASE_URL}/tools`,
      siteName: 'TalentDash',
      type: 'website',
    },
    twitter: { card: 'summary_large_image' },
  };
}

export function generateToolPageMetadata(
  toolSlug: string,
  title: string,
  description: string
): Metadata {
  return {
    title: `${title} | TalentDash`,
    description,
    alternates: { canonical: `${BASE_URL}/tools/${toolSlug}` },
    openGraph: {
      title: `${title} | TalentDash`,
      description,
      url: `${BASE_URL}/tools/${toolSlug}`,
      siteName: 'TalentDash',
      type: 'website',
    },
    twitter: { card: 'summary_large_image' },
  };
}

// ─── JSON-LD Structured Data ─────────────────────────────

export function buildDatasetJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'TalentDash Salary Database',
    description:
      'Structured compensation data across tech companies in India and worldwide',
    url: `${BASE_URL}/salaries`,
    keywords: ['salary', 'compensation', 'tech', 'India', 'software engineer'],
    creator: {
      '@type': 'Organization',
      name: 'TalentDash',
    },
  };
}

export function buildOrganizationJsonLd(company: {
  name: string;
  slug: string;
  headquarters?: string | null;
  foundedYear?: number | null;
  headcountRange?: string | null;
}) {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.name,
    url: `${BASE_URL}/companies/${company.slug}`,
  };

  if (company.foundedYear) {
    jsonLd.foundingDate = String(company.foundedYear);
  }

  if (company.headcountRange) {
    jsonLd.numberOfEmployees = {
      '@type': 'QuantitativeValue',
      value: company.headcountRange,
    };
  }

  if (company.headquarters) {
    jsonLd.address = {
      '@type': 'PostalAddress',
      addressLocality: company.headquarters,
    };
  }

  return jsonLd;
}

/**
 * Render JSON-LD to a safe string for dangerouslySetInnerHTML.
 * Prevents XSS by escaping < characters.
 */
export function renderJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
