import { NextRequest, NextResponse } from 'next/server';
import { getSalaries } from '@/services/salary.service';
import type { SortOption, Level } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const company = searchParams.get('company') || undefined;
    const role = searchParams.get('role') || undefined;
    
    // Parse levels from multiple parameters (e.g. ?level=L3&level=L4)
    const levelParams = searchParams.getAll('level');
    const level = levelParams.length > 0 ? (levelParams as Level[]) : undefined;
    
    const location = searchParams.get('location') || undefined;
    const currency = searchParams.get('currency') || undefined;
    const sort = (searchParams.get('sort') as SortOption) || 'total_comp_desc';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '25', 10);

    const result = await getSalaries(
      { company, role, level, location, currency },
      sort,
      { page, limit }
    );

    const response = NextResponse.json(result);
    // Cache-Control header: cached by CDN for 5 minutes, served stale while revalidating for up to 1 hour
    response.headers.set('Cache-Control', 's-maxage=300, stale-while-revalidate=3600');
    return response;
  } catch (error) {
    console.error('Error in GET /api/salaries:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
