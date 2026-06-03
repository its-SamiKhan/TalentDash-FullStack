import { getSalaries, getDistinctValues } from '@/services/salary.service';
import { generateSalaryPageMetadata, buildDatasetJsonLd, renderJsonLd } from '@/lib/seo';
import { SalaryPageClient } from './SalaryPageClient';
import type { SortOption, Level } from '@/types';

export const revalidate = 3600;

export async function generateMetadata() {
  return generateSalaryPageMetadata();
}

interface SearchParams {
  company?: string;
  role?: string;
  level?: string | string[];
  location?: string;
  currency?: string;
  sort?: string;
  page?: string;
  limit?: string;
  submit?: string;
}

export default async function SalariesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedParams = await searchParams;

  const company = resolvedParams.company || undefined;
  const role = resolvedParams.role || undefined;
  
  let level: Level[] | undefined = undefined;
  if (resolvedParams.level) {
    level = (Array.isArray(resolvedParams.level) 
      ? resolvedParams.level 
      : [resolvedParams.level]) as Level[];
  }

  const location = resolvedParams.location || undefined;
  const currency = resolvedParams.currency || undefined;
  const sort = (resolvedParams.sort as SortOption) || 'total_comp_desc';
  const page = parseInt(resolvedParams.page || '1', 10);
  const limit = parseInt(resolvedParams.limit || '25', 10);
  const isSubmitOpen = resolvedParams.submit === 'true';

  // Fetch filtered and paginated salaries
  const result = await getSalaries(
    { company, role, level, location, currency },
    sort,
    { page, limit }
  );

  // Fetch unique filter choices from DB
  const distinctRoles = await getDistinctValues('role');
  const distinctLocations = await getDistinctValues('location');
  const distinctLevels = await getDistinctValues('level');

  const jsonLd = buildDatasetJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(jsonLd) }}
      />
      <SalaryPageClient
        initialData={result}
        distinctRoles={distinctRoles}
        distinctLocations={distinctLocations}
        distinctLevels={distinctLevels}
        initialFilters={{
          company,
          role,
          level,
          location,
          currency,
        }}
        initialSort={sort}
        initialPage={page}
        isSubmitOpenInitial={isSubmitOpen}
      />
    </>
  );
}
