import { NextResponse } from 'next/server';
import { createComment } from '@/services/community.service';
import { validateCommunityCommentPayload } from '@/lib/validators';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateCommunityCommentPayload(body);

    if (!validation.valid) {
      return NextResponse.json(
        { errors: validation.errors },
        { status: 400 }
      );
    }

    const { postId, body: commentBody } = validation.data as { postId: string; body: string };
    const comment = await createComment(postId, commentBody);

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error creating community comment:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
