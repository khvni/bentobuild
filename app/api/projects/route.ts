import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for creating a project
const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100)
    .regex(
      /^[a-z0-9-]+$/,
      'Slug must contain only lowercase letters, numbers, and hyphens'
    ),
  contextPrompt: z.string().optional().default(''),
  userId: z.string().min(1, 'User ID is required'),
  blocks: z.array(z.any()).optional().default([]),
  isPublic: z.boolean().optional().default(false),
  subdomain: z.string().optional(),
});

/**
 * GET /api/projects
 * List all projects for a user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Use Prisma query (no raw SQL) for security
    const projects = await prisma.project.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        slug: true,
        contextPrompt: true,
        isPublic: true,
        subdomain: true,
        createdAt: true,
        updatedAt: true,
        // Exclude blocks from list view for performance
      },
    });

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects
 * Create a new project
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = createProjectSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { name, slug, contextPrompt, userId, blocks, isPublic, subdomain } =
      validationResult.data;

    // Check if slug is already taken
    const existingProject = await prisma.project.findUnique({
      where: { slug },
    });

    if (existingProject) {
      return NextResponse.json(
        { error: 'A project with this slug already exists' },
        { status: 409 }
      );
    }

    // Check if subdomain is taken (if provided)
    if (subdomain) {
      const existingSubdomain = await prisma.project.findFirst({
        where: { subdomain },
      });

      if (existingSubdomain) {
        return NextResponse.json(
          { error: 'This subdomain is already taken' },
          { status: 409 }
        );
      }
    }

    // Create project using Prisma (no raw SQL)
    const project = await prisma.project.create({
      data: {
        name,
        slug,
        contextPrompt: contextPrompt || '',
        userId,
        blocks: blocks || [],
        isPublic: isPublic ?? false,
        subdomain: subdomain || null,
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);

    // Handle Prisma-specific errors
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'A project with this slug or subdomain already exists' },
          { status: 409 }
        );
      }
      if (error.code === 'P2003') {
        return NextResponse.json(
          { error: 'Invalid user ID' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
