import { NextRequest, NextResponse } from 'next/server';
import { ingestSalary } from '@/services/salary.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await ingestSalary(body);

    if (!result.success) {
      return NextResponse.json({ errors: result.errors }, { status: result.status });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/ingest-salary:', error);
    return NextResponse.json(
      { errors: ['Invalid request payload or internal server error'] },
      { status: 500 }
    );
  }
}
