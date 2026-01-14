import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Lista todas as histórias
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};

    if (featured === 'true') {
      where.featured = true;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
        { author: { contains: search } },
      ];
    }

    const stories = await prisma.story.findMany({
      where,
      include: {
        media: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(stories);
  } catch (error) {
    console.error('Erro ao buscar histórias:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar histórias' },
      { status: 500 }
    );
  }
}

// POST - Cria nova história
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, excerpt, coverImage, author, tags, featured, media } = body;

    const story = await prisma.story.create({
      data: {
        title,
        content,
        excerpt,
        coverImage,
        author,
        tags: tags ? JSON.stringify(tags) : null,
        featured: featured || false,
        media: media && media.length > 0 ? {
          create: media.map((m: { type: string; url: string; caption?: string }) => ({
            type: m.type,
            url: m.url,
            caption: m.caption,
          })),
        } : undefined,
      },
      include: {
        media: true,
      },
    });

    return NextResponse.json(story, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar história:', error);
    return NextResponse.json(
      { error: 'Erro ao criar história' },
      { status: 500 }
    );
  }
}
