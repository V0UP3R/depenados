import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Retorna os contadores atuais
export async function GET() {
  try {
    // Busca ou cria o contador principal
    let counter = await prisma.counter.findUnique({
      where: { id: 'main' },
    });

    if (!counter) {
      counter = await prisma.counter.create({
        data: { id: 'main' },
      });
    }

    return NextResponse.json(counter);
  } catch (error) {
    console.error('Erro ao buscar contadores:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar contadores' },
      { status: 500 }
    );
  }
}

// PATCH - Incrementa um contador específico
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, action = 'increment' } = body;

    if (!['brigas', 'acidentes', 'pts'].includes(type)) {
      return NextResponse.json(
        { error: 'Tipo de contador inválido' },
        { status: 400 }
      );
    }

    // Garante que o contador existe
    const existing = await prisma.counter.findUnique({
      where: { id: 'main' },
    });

    if (!existing) {
      await prisma.counter.create({
        data: { id: 'main' },
      });
    }

    // Incrementa ou decrementa o contador
    const increment = action === 'decrement' ? -1 : 1;

    const counter = await prisma.counter.update({
      where: { id: 'main' },
      data: {
        [type]: {
          increment,
        },
      },
    });

    return NextResponse.json(counter);
  } catch (error) {
    console.error('Erro ao atualizar contador:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar contador' },
      { status: 500 }
    );
  }
}

// PUT - Define valores específicos para os contadores
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { brigas, acidentes, pts } = body;

    const counter = await prisma.counter.upsert({
      where: { id: 'main' },
      update: {
        ...(brigas !== undefined && { brigas }),
        ...(acidentes !== undefined && { acidentes }),
        ...(pts !== undefined && { pts }),
      },
      create: {
        id: 'main',
        brigas: brigas || 0,
        acidentes: acidentes || 0,
        pts: pts || 0,
      },
    });

    return NextResponse.json(counter);
  } catch (error) {
    console.error('Erro ao definir contadores:', error);
    return NextResponse.json(
      { error: 'Erro ao definir contadores' },
      { status: 500 }
    );
  }
}
