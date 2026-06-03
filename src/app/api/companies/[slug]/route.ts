import { NextRequest, NextResponse } from 'next/server';
import { getCompanyBySlug, getCompanyStats, getLevelDistribution } from '@/services/company.service';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 });
    }

    const companyData = await getCompanyBySlug(slug);
    if (!companyData) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const stats = await getCompanyStats(companyData.company.id);
    const levelDistribution = await getLevelDistribution(companyData.company.id);

    const response = NextResponse.json({
      company: companyData.company,
      salaries: companyData.salaries,
      stats,
      level_distribution: levelDistribution,
    });

    // Cache-Control header: cached by CDN for 1 hour, served stale while revalidating for up to 24 hours
    response.headers.set('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return response;
  } catch (error) {
    console.error('Error in GET /api/companies/[slug]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
