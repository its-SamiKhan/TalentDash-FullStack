import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDistinctValues } from '@/services/salary.service';
import { getInterviewQuestions } from '@/services/interview.service';
import { CompanyLogo, Button } from '@/components/ui';
import { formatDate } from '@/lib/formatters';
import Link from 'next/link';
import { generateRoleInterviewQuestionsPageMetadata } from '@/lib/seo';

export const revalidate = 3600; // Cache for 1 hour

interface PageProps {
  params: Promise<{ role: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { role } = await params;
  const decodedRole = decodeURIComponent(role);
  return generateRoleInterviewQuestionsPageMetadata(decodedRole);
}


export async function generateStaticParams() {
  const distinctRoles = await getDistinctValues('role');
  return distinctRoles.map((role) => ({ role: encodeURIComponent(role) }));
}

export default async function InterviewQuestionsPage({ params }: PageProps) {
  const { role } = await params;
  const decodedRole = decodeURIComponent(role);

  const questions = await getInterviewQuestions(decodedRole);

  // If there are no questions but it's a valid role, we can still display the page with an empty state
  const distinctRoles = await getDistinctValues('role');
  const roleExists = distinctRoles.some(
    (r) => r.toLowerCase() === decodedRole.toLowerCase()
  );

  if (!roleExists && questions.length === 0) {
    notFound();
  }

  return (
    <Suspense fallback={
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="h-32 bg-slate-200 rounded-lg"></div>
        </div>
      </div>
    }>
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        {/* Back Link */}
        <div>
          <Link
            href="/interviews"
            className="text-xs font-semibold text-[#717171] hover:text-[#222222] transition-colors flex items-center gap-1"
          >
            ← Back to Interviews Hub
          </Link>
        </div>

        {/* Header */}
        <div className="pb-6 border-b border-[#EBEBEB]">
          <h1 className="text-3xl font-extrabold text-[#222222] tracking-tight">
            {decodedRole} Interview Questions
          </h1>
          <p className="text-sm text-[#717171] mt-1.5 font-medium">
            Real interview questions asked for {decodedRole} candidates in top tech companies.
          </p>
        </div>

        {/* Questions Feed */}
        {questions.length === 0 ? (
          <div className="bg-white border border-[#EBEBEB] rounded-lg p-12 text-center flex flex-col items-center gap-4">
            <div className="h-16 w-16 bg-[#FF5A5F]/5 rounded-full flex items-center justify-center text-[#FF5A5F] text-2xl font-bold">
              💡
            </div>
            <h3 className="text-lg font-bold text-[#222222]">No questions reported yet</h3>
            <p className="text-sm text-[#717171] max-w-md">
              Be the first to share questions asked during your {decodedRole} interview to help the community.
            </p>
            <Link href={`/interviews?submit=true`}>
              <Button>Share Interview Experience</Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {questions.map((q) => (
              <div
                key={q.id}
                className="bg-white border border-[#EBEBEB] rounded-lg p-6 shadow-sm hover:shadow-md transition-all flex flex-col gap-4"
              >
                {/* Meta details */}
                <div className="flex justify-between items-center border-b border-[#EBEBEB] pb-3">
                  <div className="flex items-center gap-2.5">
                    <CompanyLogo name={q.companyName} logoUrl={q.companyLogoUrl} size={32} />
                    <span className="font-bold text-sm text-[#222222]">
                      <Link href={`/interviews/${q.companySlug}`} className="hover:text-[#FF5A5F] transition-colors">
                        {q.companyName}
                      </Link>
                    </span>
                  </div>
                  <span className="text-xs text-[#717171] font-medium">{formatDate(q.createdAt)}</span>
                </div>

                {/* Content */}
                <div className="bg-slate-50/50 p-5 rounded-md border-l-4 border-[#FF5A5F] italic">
                  <p className="text-base text-[#222222] font-semibold leading-relaxed">&ldquo;{q.questions}&rdquo;</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Suspense>
  );
}
