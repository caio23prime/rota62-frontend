'use client';

import { useState, useEffect } from 'react';

export default function TrafficTicker() {
  const [textos, setTextos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // URL Direta
  const DATA_URL = 'https://admin.rota62go.com.br/waze_data.json';

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${DATA_URL}?t=${Date.now()}`);
        if (!res.ok) return;
        
        const json = await res.json();
        const alertas = json.dados.alertas || [];
        const transito = json.dados.transito || [];

        // Monta as frases para o letreiro
        let frases: string[] = [];

        if (alertas.length === 0 && transito.length === 0) {
          frases.push("✅ Trânsito fluindo normalmente em Goiânia e Aparecida.");
        } else {
          // Adiciona Acidentes
          alertas.forEach((a: any) => {
            let icone = a.categoria_formatada === 'ACIDENTE' ? '💥' : '⚠️';
            frases.push(`${icone} ${a.categoria_formatada}: ${a.street || 'Local em verificação'}`);
          });

          // Adiciona Lentidão
          transito.slice(0, 5).forEach((t: any) => { // Pega só os top 5 lentidões
             frases.push(`🐢 LENTIDÃO: ${t.street} (${Math.round(t.speedKMH)} km/h)`);
          });
        }

        setTextos(frases);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading || textos.length === 0) return null;

  return (
    // Fundo Preto, fixo na parte inferior (bottom-0) ou superior? Mude se quiser.
    // Z-50 garante que fique em cima de tudo.
    <div className="w-full bg-black border-t border-blue-900 text-white h-12 flex items-center overflow-hidden relative z-40">
      
      {/* Etiqueta Azul Fixa (Esquerda) */}
      <div className="bg-blue-600 h-full px-4 flex items-center justify-center font-bold text-sm uppercase tracking-wider shadow-lg z-50 relative">
        Ao Vivo
      </div>

      {/* Área do Texto que Corre */}
      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        <div className="animate-letreiro absolute w-full pl-4 font-mono text-sm md:text-base">
          {/* Repetimos o texto e juntamos com uma bolinha azul entre eles */}
          {textos.join("  🔵  ")} 
        </div>
      </div>
    </div>
  );
}