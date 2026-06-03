import { NextRequest, NextResponse } from 'next/server';
import { compareSalaries } from '@/services/compare.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const s1 = searchParams.get('s1');
    const s2 = searchParams.get('s2');

    if (!s1 || !s2) {
      return NextResponse.json({ error: 's1 and s2 query parameters are required' }, { status: 400 });
    }

    if (s1 === s2) {
      return NextResponse.json({ error: 'Cannot compare a record with itself' }, { status: 400 });
    }

    const comparison = await compareSalaries(s1, s2);
    if (!comparison) {
      return NextResponse.json({ error: 'One or both salary records not found' }, { status: 404 });
    }

    return NextResponse.json(comparison);
  } catch (error) {
    const err = error as Error;
    console.error('Error in GET /api/compare:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
