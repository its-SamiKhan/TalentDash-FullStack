import { Suspense } from 'react';
import { getAllSalariesForCompare } from '@/services/salary.service';
import { generateComparePageMetadata } from '@/lib/seo';
import { ComparePageClient } from './ComparePageClient';

export const revalidate = 86400; // 24 hours ISR caching

export async function generateMetadata() {
  return generateComparePageMetadata();
}

export default async function ComparePage() {
  // Fetch lightweight list of all records to populate selector dropdowns
  const salaries = await getAllSalariesForCompare();

  return (
    <Suspense fallback={
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        <div>
          <div className="h-8 w-48 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-4 w-72 bg-slate-200 rounded animate-pulse mt-2"></div>
        </div>
        <div className="h-32 bg-slate-200 rounded-lg animate-pulse"></div>
        <div className="h-64 bg-slate-200 rounded-lg animate-pulse"></div>
      </div>
    }>
      <ComparePageClient salariesList={salaries} />
    </Suspense>
  );
}
