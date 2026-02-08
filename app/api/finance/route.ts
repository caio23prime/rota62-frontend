import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic'; // Garante que não faça cache

export async function GET() {
    try {
        // Busca dados do servidor remoto (igual ao Waze) para funcionar na Vercel
        // O script Python faz upload para o servidor FTP, e a API lê de lá.
        const res = await fetch('https://admin.rota62go.com.br/finance_data.json', {
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
            }
        });

        if (!res.ok) {
            // Se falhar o remoto, tenta local (fallback para dev em localhost)
            const filePath = path.join(process.cwd(), 'finance_data.json');
            try {
                const localData = await fs.readFile(filePath, 'utf-8');
                return NextResponse.json(JSON.parse(localData));
            } catch (err) {
                // Se nem local existir, retorna erro
                throw new Error(`Erro remoto: ${res.status} e local não encontrado.`);
            }
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Erro API Finance:", error);
        return NextResponse.json({
            atualizacao: "Indisponível",
            mercado: []
        }, { status: 500 });
    }
}
