import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Busca membro por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        storiesAuthored: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
            media: true,
          },
        },
        storiesIn: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            media: true,
          },
        },
        eventsCreated: {
          orderBy: { date: 'desc' },
          take: 5,
          include: {
            media: true,
          },
        },
        eventsIn: {
          orderBy: { date: 'desc' },
          take: 10,
          include: {
            media: true,
          },
        },
        _count: {
          select: {
            storiesAuthored: true,
            storiesIn: true,
            eventsCreated: true,
            eventsIn: true,
          },
        },
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: 'Membro nao encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error('Erro ao buscar membro:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar membro' },
      { status: 500 }
    );
  }
}

// PUT - Atualiza membro
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const member = await prisma.member.update({
      where: { id },
      data: {
        name: body.name,
        nickname: body.nickname,
        avatar: body.avatar,
        bio: body.bio,
        role: body.role,
      },
    });

    return NextResponse.json(member);
  } catch (error: unknown) {
    console.error('Erro ao atualizar membro:', error);
    
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ja existe um membro com esse apelido' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao atualizar membro' },
      { status: 500 }
    );
  }
}

// DELETE - Remove membro
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.member.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar membro:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar membro' },
      { status: 500 }
    );
  }
}
