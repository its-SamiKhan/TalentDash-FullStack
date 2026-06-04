import { NextRequest, NextResponse } from 'next/server';
import { getReviews } from '@/services/review.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const company = searchParams.get('company') || undefined;
    const role = searchParams.get('role') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '25', 10);

    const result = await getReviews(
      { company, role },
      { page, limit }
    );

    const response = NextResponse.json(result);
    // Cache reviews: s-maxage=300 (5 mins cache) and stale-while-revalidate for 1 hour
    response.headers.set('Cache-Control', 's-maxage=300, stale-while-revalidate=3600');
    return response;
  } catch (error) {
    console.error('Error in GET /api/reviews:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
