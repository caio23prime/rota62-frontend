import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Garante que não faça cache

export async function GET() {
  try {
    // O Servidor Next.js busca o arquivo lá na Hostinger (Servidor com Servidor não tem trava)
    const res = await fetch('https://admin.rota62go.com.br/waze_data.json', {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    });

    if (!res.ok) {
      throw new Error(`Erro na Hostinger: ${res.status}`);
    }

    const data = await res.json();

    // Devolve os dados para o seu Frontend "limpos"
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Falha ao buscar dados do Waze', details: String(error) },
      { status: 500 }
    );
  }
}