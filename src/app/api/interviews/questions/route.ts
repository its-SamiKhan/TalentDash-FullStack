import { NextRequest, NextResponse } from 'next/server';
import { getInterviewQuestions } from '@/services/interview.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    if (!role) {
      return NextResponse.json({ error: 'role parameter is required' }, { status: 400 });
    }

    const result = await getInterviewQuestions(role);

    const response = NextResponse.json(result);
    // Cache questions: s-maxage=300 (5 mins cache) and stale-while-revalidate for 1 hour
    response.headers.set('Cache-Control', 's-maxage=300, stale-while-revalidate=3600');
    return response;
  } catch (error) {
    console.error('Error in GET /api/interviews/questions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
