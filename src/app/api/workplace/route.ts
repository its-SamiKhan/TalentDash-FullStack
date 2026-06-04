import { NextResponse } from 'next/server';
import { getWorkplaceRankings, getWorkplaceStats } from '@/services/workplace.service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const industry = searchParams.get('industry') || undefined;

    const rankings = await getWorkplaceRankings(industry);
    const stats = await getWorkplaceStats();

    return NextResponse.json({ rankings, stats });
  } catch (error) {
    console.error('Error fetching workplace index:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
