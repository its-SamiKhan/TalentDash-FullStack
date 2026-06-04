import { NextResponse } from 'next/server';
import { getPosts, createPost } from '@/services/community.service';
import { validateCommunityPostPayload } from '@/lib/validators';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const company = searchParams.get('company') || undefined;
    const topic = searchParams.get('topic') || undefined;
    const query = searchParams.get('query') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const result = await getPosts(
      { company, topic, query },
      { page, limit }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching community posts:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateCommunityPostPayload(body);

    if (!validation.valid) {
      return NextResponse.json(
        { errors: validation.errors },
        { status: 400 }
      );
    }

    const { title, body: postBody, company, topic } = validation.data as {
      title: string;
      body: string;
      company?: string;
      topic?: string;
    };

    const post = await createPost({
      title,
      body: postBody,
      company,
      topic,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating community post:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

