import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for updating a project
const updateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .optional(),
  contextPrompt: z.string().optional(),
  blocks: z.array(z.any()).optional(),
  isPublic: z.boolean().optional(),
  subdomain: z.string().optional(),
  userId: z.string().min(1, 'User ID is required'), // Required to verify ownership
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/projects/[id]
 * Get a single project by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // Use Prisma query (no raw SQL) for security
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ project }, { status: 200 });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

/**
 * PATCH /api/projects/[id]
 * Update a project
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const body = await request.json();

    // Validate input
    const validationResult = updateProjectSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { userId, ...updateData } = validationResult.data;

    // Verify project exists and user owns it
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (existingProject.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized: You do not own this project' },
        { status: 403 }
      );
    }

    // Check if slug is being changed and if it's already taken
    if (updateData.slug && updateData.slug !== existingProject.slug) {
      const slugExists = await prisma.project.findUnique({
        where: { slug: updateData.slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'A project with this slug already exists' },
          { status: 409 }
        );
      }
    }

    // Check if subdomain is being changed and if it's already taken
    if (updateData.subdomain && updateData.subdomain !== existingProject.subdomain) {
      const subdomainExists = await prisma.project.findFirst({
        where: { subdomain: updateData.subdomain },
      });

      if (subdomainExists) {
        return NextResponse.json({ error: 'This subdomain is already taken' }, { status: 409 });
      }
    }

    // Update project using Prisma (no raw SQL)
    const project = await prisma.project.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ project }, { status: 200 });
  } catch (error) {
    console.error('Error updating project:', error);

    // Handle Prisma-specific errors
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'A project with this slug or subdomain already exists' },
          { status: 409 }
        );
      }
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
    }

    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

/**
 * DELETE /api/projects/[id]
 * Delete a project
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // Get userId from request body or query params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Verify project exists and user owns it
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (existingProject.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized: You do not own this project' },
        { status: 403 }
      );
    }

    // Delete project using Prisma (no raw SQL)
    // Note: Related DeployedSite will be cascade deleted
    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Project deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting project:', error);

    // Handle Prisma-specific errors
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
    }

    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
