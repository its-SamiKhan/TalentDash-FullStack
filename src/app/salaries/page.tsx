import { getSalaries, getDistinctValues } from '@/services/salary.service';
import { getAllCompanies } from '@/services/company.service';
import { generateSalaryPageMetadata, buildDatasetJsonLd, renderJsonLd } from '@/lib/seo';
import { SalaryPageClient } from './SalaryPageClient';
import type { SortOption, Level } from '@/types';
import { prisma } from '@/lib/prisma';
import { convertToINR, convertFromINR } from '@/lib/currency';
import { calculateMedian } from '@/lib/calculations';

function getHeatmapFallback(role: string, location: string): { medianINR: number; currency: string } {
  let baseINR = 2000000;
  if (role.includes('Manager') || role.includes('Principal') || role.includes('Lead') || role.includes('Engineering Manager')) {
    baseINR = 4200000;
  } else if (role.includes('Senior') || role.includes('III') || role.includes('Staff')) {
    baseINR = 3000000;
  } else if (role.includes('II') || role.includes('SDE II')) {
    baseINR = 2200000;
  } else if (role.includes('I') || role.includes('Software Engineer') || role.includes('Entry')) {
    baseINR = 1400000;
  }

  let mult = 1.0;
  let currency = 'INR';
  if (['San Francisco', 'Seattle', 'Mountain View'].includes(location)) {
    mult = 5.6;
    currency = 'USD';
  } else if (location === 'London') {
    mult = 4.2;
    currency = 'GBP';
  } else if (location === 'Bengaluru') {
    mult = 1.25;
  } else if (location === 'Hyderabad') {
    mult = 1.05;
  } else if (location === 'Mumbai') {
    mult = 1.1;
  }

  return { medianINR: baseINR * mult, currency };
}

function formatHeatmapCell(medianINR: number, currency: string): string {
  if (currency === 'INR') {
    return `₹${(medianINR / 100000).toFixed(0)}L`;
  }
  const symbol = currency === 'USD' ? '$' : currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '';
  const converted = convertFromINR(medianINR, currency);
  return `${symbol}${Math.round(converted / 1000)}K`;
}

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
  const companiesList = await getAllCompanies();

  // Compute dynamic heatmap matrix
  const heatmapRoles = ['Software Engineer', 'SDE II', 'SDE III', 'Product Manager', 'Engineering Manager'];
  const heatmapLocations = ['Bengaluru', 'Hyderabad', 'Mumbai', 'Seattle', 'San Francisco', 'London'];

  const heatmapMatrix = await Promise.all(heatmapRoles.map(async (roleStr) => {
    const cells = await Promise.all(heatmapLocations.map(async (locStr) => {
      const records = await prisma.salary.findMany({
        where: {
          role: { equals: roleStr, mode: 'insensitive' },
          location: { equals: locStr, mode: 'insensitive' }
        },
        select: {
          totalCompensation: true,
          currency: true
        }
      });
      
      let medianINR: number;
      let currency: string;
      
      if (records.length > 0) {
        const inrAmounts = records.map(r => convertToINR(Number(r.totalCompensation), r.currency.toString()));
        medianINR = calculateMedian(inrAmounts);
        currency = records[0].currency.toString();
      } else {
        const fallback = getHeatmapFallback(roleStr, locStr);
        medianINR = fallback.medianINR;
        currency = fallback.currency;
      }
      
      const formatted = formatHeatmapCell(medianINR, currency);
      
      let cat = 'y';
      if (medianINR >= 6000000) cat = 'h';
      else if (medianINR >= 4500000) cat = 'm';
      else if (medianINR >= 3000000) cat = 'l-g';
      else if (medianINR >= 2000000) cat = 'y';
      else if (medianINR >= 1200000) cat = 'o';
      else cat = 'r';

      return {
        formatted,
        cat,
        medianINR,
        currency
      };
    }));
    return {
      role: roleStr,
      cells
    };
  }));

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
        companiesList={companiesList}
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
        heatmapMatrix={heatmapMatrix}
        heatmapLocations={heatmapLocations}
      />
    </>
  );
}

