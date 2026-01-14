import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Busca evento por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        stories: {
          include: {
            media: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        participants: true,
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Evento não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar evento' },
      { status: 500 }
    );
  }
}

// PUT - Atualiza evento
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, location, date, coverImage, status, participantIds } = body;

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(location !== undefined && { location }),
        ...(date && { date: new Date(date) }),
        ...(coverImage !== undefined && { coverImage }),
        ...(status && { status }),
        ...(participantIds && {
          participants: {
            set: participantIds.map((pid: string) => ({ id: pid })),
          },
        }),
      },
      include: {
        participants: true,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar evento' },
      { status: 500 }
    );
  }
}

// DELETE - Remove evento
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Evento removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover evento:', error);
    return NextResponse.json(
      { error: 'Erro ao remover evento' },
      { status: 500 }
    );
  }
}
