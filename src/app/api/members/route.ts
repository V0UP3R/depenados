import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Lista todos os membros
export async function GET() {
  try {
    const members = await prisma.member.findMany({
      include: {
        _count: {
          select: {
            storiesAuthored: true,
            storiesIn: true,
            eventsCreated: true,
            eventsIn: true,
          },
        },
      },
      orderBy: { nickname: 'asc' },
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error('Erro ao buscar membros:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar membros' },
      { status: 500 }
    );
  }
}

// POST - Cria novo membro
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const member = await prisma.member.create({
      data: {
        name: body.name,
        nickname: body.nickname,
        avatar: body.avatar,
        bio: body.bio,
        role: body.role,
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error: unknown) {
    console.error('Erro ao criar membro:', error);
    
    // Check for unique constraint violation
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ja existe um membro com esse apelido' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao criar membro' },
      { status: 500 }
    );
  }
}
