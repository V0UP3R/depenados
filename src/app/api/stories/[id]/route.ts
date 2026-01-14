import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Busca história por ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const story = await prisma.story.findUnique({
      where: { id },
      include: {
        media: true,
        participants: true,
      },
    });

    if (!story) {
      return NextResponse.json(
        { error: 'História não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(story);
  } catch (error) {
    console.error('Erro ao buscar história:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar história' },
      { status: 500 }
    );
  }
}

// PUT - Atualiza história
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, content, excerpt, coverImage, author, tags, featured, media, participantIds } = body;

    // Primeiro, deletar mídias existentes se novas forem fornecidas
    if (media) {
      await prisma.media.deleteMany({
        where: { storyId: id },
      });
    }

    const story = await prisma.story.update({
      where: { id },
      data: {
        title,
        content,
        excerpt,
        coverImage,
        author,
        tags: tags ? JSON.stringify(tags) : undefined,
        featured,
        media: media && media.length > 0 ? {
          create: media.map((m: { type: string; url: string; caption?: string }) => ({
            type: m.type,
            url: m.url,
            caption: m.caption,
          })),
        } : undefined,
        participants: participantIds ? {
          set: participantIds.map((pid: string) => ({ id: pid })),
        } : undefined,
      },
      include: {
        media: true,
        participants: true,
      },
    });

    return NextResponse.json(story);
  } catch (error) {
    console.error('Erro ao atualizar história:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar história' },
      { status: 500 }
    );
  }
}

// DELETE - Remove história
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    await prisma.story.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'História removida com sucesso' });
  } catch (error) {
    console.error('Erro ao remover história:', error);
    return NextResponse.json(
      { error: 'Erro ao remover história' },
      { status: 500 }
    );
  }
}
