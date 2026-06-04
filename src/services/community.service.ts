import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import type { 
  CommunityPostForDisplay, 
  CommunityCommentForDisplay, 
  CommunityPostFilters, 
  PaginationParams, 
  PaginatedResponse 
} from '@/types';
import { getOrCreateCompany } from './company.service';

function postToDisplay(
  post: {
    id: string;
    companyId: string | null;
    company: { name: string; slug: string; logoUrl: string | null } | null;
    topic: string | null;
    title: string;
    body: string;
    createdAt: Date;
    _count?: { comments: number } | null;
    comments?: { id: string; postId: string; body: string; createdAt: Date }[];
  }
): CommunityPostForDisplay {
  return {
    id: post.id,
    companyId: post.companyId,
    companyName: post.company?.name || null,
    companySlug: post.company?.slug || null,
    companyLogoUrl: post.company?.logoUrl || null,
    topic: post.topic,
    title: post.title,
    body: post.body,
    createdAt: post.createdAt.toISOString(),
    commentCount: post._count?.comments ?? post.comments?.length ?? 0,
  };
}

function commentToDisplay(
  comment: {
    id: string;
    postId: string;
    body: string;
    createdAt: Date;
  }
): CommunityCommentForDisplay {
  return {
    id: comment.id,
    postId: comment.postId,
    body: comment.body,
    createdAt: comment.createdAt.toISOString(),
  };
}

/**
 * Get paginated and filtered community posts.
 */
export async function getPosts(
  filters: CommunityPostFilters = {},
  pagination: PaginationParams = { page: 1, limit: 10 }
): Promise<PaginatedResponse<CommunityPostForDisplay>> {
  const { page, limit } = pagination;
  const skip = (page - 1) * limit;

  // Build Prisma where query
  const where: Prisma.CommunityPostWhereInput = {};

  if (filters.company) {
    where.company = {
      slug: filters.company,
    };
  }

  if (filters.topic) {
    where.topic = {
      equals: filters.topic,
      mode: 'insensitive',
    };
  }

  if (filters.query) {
    where.OR = [
      { title: { contains: filters.query, mode: 'insensitive' } },
      { body: { contains: filters.query, mode: 'insensitive' } },
    ];
  }

  const [posts, total] = await Promise.all([
    prisma.communityPost.findMany({
      where,
      include: {
        company: {
          select: {
            name: true,
            slug: true,
            logoUrl: true,
          },
        },
        _count: {
          select: { comments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.communityPost.count({ where }),
  ]);

  const data = posts.map(postToDisplay);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get a single post with comments.
 */
export async function getPostById(id: string) {
  const post = await prisma.communityPost.findUnique({
    where: { id },
    include: {
      company: {
        select: {
          name: true,
          slug: true,
          logoUrl: true,
        },
      },
      comments: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!post) return null;

  return {
    post: postToDisplay(post),
    comments: post.comments.map(commentToDisplay),
  };
}

/**
 * Create a new community post.
 */
export async function createPost(payload: {
  title: string;
  body: string;
  company?: string;
  topic?: string;
}) {
  let companyId: string | null = null;

  if (payload.company) {
    const company = await getOrCreateCompany(payload.company);
    companyId = company.id;
  }

  const post = await prisma.communityPost.create({
    data: {
      title: payload.title,
      body: payload.body,
      companyId,
      topic: payload.topic || null,
    },
    include: {
      company: {
        select: {
          name: true,
          slug: true,
          logoUrl: true,
        },
      },
    },
  });

  return postToDisplay({ ...post, _count: { comments: 0 } });
}

/**
 * Add a comment to a post.
 */
export async function createComment(postId: string, body: string): Promise<CommunityCommentForDisplay> {
  const comment = await prisma.communityComment.create({
    data: {
      postId,
      body,
    },
  });

  return commentToDisplay(comment);
}
