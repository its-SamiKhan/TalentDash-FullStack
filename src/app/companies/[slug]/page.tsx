import { notFound } from 'next/navigation';
import { getCompanyBySlug, getCompanyStats, getLevelDistribution, getAllCompanySlugs } from '@/services/company.service';
import { generateCompanyPageMetadata, buildOrganizationJsonLd, renderJsonLd } from '@/lib/seo';
import { CompanyPageClient } from './CompanyPageClient';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllCompanySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const companyData = await getCompanyBySlug(slug);
  if (!companyData) return {};

  const stats = await getCompanyStats(companyData.company.id);

  return generateCompanyPageMetadata(
    {
      name: companyData.company.name,
      slug: companyData.company.slug,
      industry: companyData.company.industry,
      headquarters: companyData.company.headquarters,
    },
    {
      median_tc: stats.median_tc,
      count: stats.count,
    }
  );
}

export default async function CompanyPage({ params }: PageProps) {
  const { slug } = await params;
  const companyData = await getCompanyBySlug(slug);

  if (!companyData) {
    notFound();
  }

  const stats = await getCompanyStats(companyData.company.id);
  const levelDistribution = await getLevelDistribution(companyData.company.id);

  const jsonLd = buildOrganizationJsonLd({
    name: companyData.company.name,
    slug: companyData.company.slug,
    headquarters: companyData.company.headquarters || undefined,
    foundedYear: companyData.company.foundedYear || undefined,
    headcountRange: companyData.company.headcountRange || undefined,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(jsonLd) }}
      />
      <CompanyPageClient
        company={companyData.company}
        initialSalaries={companyData.salaries}
        stats={stats}
        levelDistribution={levelDistribution}
      />
    </>
  );
}
