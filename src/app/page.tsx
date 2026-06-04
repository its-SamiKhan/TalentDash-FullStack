import { prisma } from '@/lib/prisma';
import { generateHomePageMetadata } from '@/lib/seo';
import { CompanyLogo, Button } from '@/components/ui';
import Link from 'next/link';

export const revalidate = 3600; // ISR cache: revalidate every hour

export async function generateMetadata() {
  return generateHomePageMetadata();
}

export default async function HomePage() {
  // Fetch top 12 companies sorted by their salary submission counts
  const companies = await prisma.company.findMany({
    take: 12,
    include: {
      _count: {
        select: { salaries: true },
      },
    },
    orderBy: {
      salaries: { _count: 'desc' },
    },
  });

  // Fetch quick database counters
  const [
    totalSalaries,
    totalCompanies,
    totalReviews,
    totalInterviews,
    totalPosts,
  ] = await Promise.all([
    prisma.salary.count(),
    prisma.company.count(),
    prisma.review.count(),
    prisma.interview.count(),
    prisma.communityPost.count(),
  ]);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="bg-white border-b border-[#EBEBEB] py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8 flex flex-col items-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#FF5A5F]/10 text-[#FF5A5F] border border-[#FF5A5F]/20">
            India-First Compensation Intelligence
          </span>
          <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight text-[#222222] max-w-3xl leading-tight">
            Convert structured tech salary data into{' '}
            <span className="text-[#FF5A5F]">decision-ready</span> career insights.
          </h1>
          <p className="mt-6 text-base sm:text-lg text-[#484848] max-w-xl leading-relaxed">
            TalentDash is a career intelligence platform built around structured compensation datasets. Search, compare, and analyze packages without paywalls.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 w-full max-w-sm sm:max-w-none">
            <Link href="/salaries" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Explore Salaries
              </Button>
            </Link>
            <Link href="/compare" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Compare Side-by-Side
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Product Blueprint / Value Prop */}
      <section className="py-16 bg-[#F7F7F7]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#222222] tracking-tight">The TalentDash Blueprint</h2>
            <p className="text-sm text-[#717171] mt-2">Why structured career intelligence beats simple crowdsourced salary pages.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-[#EBEBEB] rounded-lg p-6 shadow-xs flex flex-col gap-3">
              <div className="h-10 w-10 bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 rounded-md flex items-center justify-center text-[#FF5A5F] font-bold text-lg">
                1
              </div>
              <h3 className="text-lg font-bold text-[#222222]">Structured Data</h3>
              <p className="text-sm text-[#484848] leading-relaxed">
                We validate and normalize every salary submission. Experience, locations, levels, and equity values are strictly parsed to guarantee high data integrity.
              </p>
            </div>
            <div className="bg-white border border-[#EBEBEB] rounded-lg p-6 shadow-xs flex flex-col gap-3">
              <div className="h-10 w-10 bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 rounded-md flex items-center justify-center text-[#FF5A5F] font-bold text-lg">
                2
              </div>
              <h3 className="text-lg font-bold text-[#222222]">Comparable Format</h3>
              <p className="text-sm text-[#484848] leading-relaxed">
                By standardizing levels (e.g. SDE-I to Staff) and currencies, we let you compare packages side-by-side with clean mathematical deltas.
              </p>
            </div>
            <div className="bg-white border border-[#EBEBEB] rounded-lg p-6 shadow-xs flex flex-col gap-3">
              <div className="h-10 w-10 bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 rounded-md flex items-center justify-center text-[#FF5A5F] font-bold text-lg">
                3
              </div>
              <h3 className="text-lg font-bold text-[#222222]">Decision Ready</h3>
              <p className="text-sm text-[#484848] leading-relaxed">
                Instantly answer complex compensation queries (e.g. Amazon SDE-II pay ranges in Bengaluru) with zero onboarding friction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Programmatic SEO Section: Active Tech Employers */}
      <section className="py-16 bg-white border-t border-b border-[#EBEBEB]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl font-extrabold text-[#222222] tracking-tight">Explore Top Employers</h2>
              <p className="text-sm text-[#717171] mt-1">Browse verified compensation statistics and salary ranges by company.</p>
            </div>
            <Link href="/salaries" className="text-sm font-bold text-[#FF5A5F] hover:text-[#ff4449]">
              View All Salaries →
            </Link>
          </div>

          {companies.length === 0 ? (
            <div className="text-center py-8 text-sm text-[#717171] italic">
              Seeding database... Top companies will display here once seeded.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {companies.map((company) => (
                <Link
                  key={company.id}
                  href={`/companies/${company.slug}`}
                  className="group border border-[#EBEBEB] rounded-lg p-5 flex items-center gap-4 hover:border-[#FF5A5F]/30 hover:shadow-sm transition-all bg-[#F7F7F7]/30"
                >
                  <CompanyLogo name={company.name} logoUrl={company.logoUrl} size={44} />
                  <div className="truncate">
                    <h3 className="text-sm font-bold text-[#222222] group-hover:text-[#FF5A5F] transition-colors truncate">
                      {company.name}
                    </h3>
                    <p className="text-xs text-[#717171] mt-0.5">{company.headquarters || 'Tech HQ'}</p>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded bg-slate-100 border border-[#EBEBEB] text-[10px] font-bold text-slate-700">
                      {company._count.salaries} records
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Summary counters section */}
      <section className="py-16 bg-[#F7F7F7]">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-8">
            <div className="flex flex-col items-center">
              <span className="text-4xl sm:text-5xl font-extrabold text-[#222222] tracking-tight">
                {totalSalaries}
              </span>
              <span className="text-[10px] font-extrabold text-[#717171] uppercase tracking-widest mt-2">
                Salary Submissions
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl sm:text-5xl font-extrabold text-[#222222] tracking-tight">
                {totalCompanies}
              </span>
              <span className="text-[10px] font-extrabold text-[#717171] uppercase tracking-widest mt-2">
                Active Tech Employers
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl sm:text-5xl font-extrabold text-[#222222] tracking-tight">
                {totalReviews}
              </span>
              <span className="text-[10px] font-extrabold text-[#717171] uppercase tracking-widest mt-2">
                Verified Reviews
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl sm:text-5xl font-extrabold text-[#222222] tracking-tight">
                {totalInterviews}
              </span>
              <span className="text-[10px] font-extrabold text-[#717171] uppercase tracking-widest mt-2">
                Candidate Logs
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl sm:text-5xl font-extrabold text-[#222222] tracking-tight">
                {totalPosts}
              </span>
              <span className="text-[10px] font-extrabold text-[#717171] uppercase tracking-widest mt-2">
                Discussion Threads
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
