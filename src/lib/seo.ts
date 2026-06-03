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
