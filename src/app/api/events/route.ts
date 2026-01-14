import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Lista todos os eventos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const upcoming = searchParams.get('upcoming');

    const where: Record<string, unknown> = {};

    if (status) {
      where.status = status;
    }

    // Se upcoming=true, busca apenas eventos futuros
    if (upcoming === 'true') {
      where.date = { gte: new Date() };
      where.status = { in: ['upcoming', 'ongoing'] };
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        stories: {
          select: {
            id: true,
            title: true,
            coverImage: true,
          },
        },
        _count: {
          select: { stories: true },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar eventos' },
      { status: 500 }
    );
  }
}

// POST - Cria novo evento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, location, date, coverImage, createdBy, status } = body;

    const event = await prisma.event.create({
      data: {
        title,
        description,
        location,
        date: new Date(date),
        coverImage,
        createdBy,
        status: status || 'upcoming',
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    return NextResponse.json(
      { error: 'Erro ao criar evento' },
      { status: 500 }
    );
  }
}
