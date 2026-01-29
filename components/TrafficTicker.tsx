'use client';

import { useState, useEffect } from 'react';
import { 
  AlertTriangle, CarFront, CloudRain, Ban, 
  AlertOctagon, Siren, Megaphone, ThumbsUp,
  Construction 
} from 'lucide-react';

export default function TrafficTicker() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const DATA_URL = '/api/waze';
  const TEMPO_EXIBICAO = 5000; 

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${DATA_URL}?t=${Date.now()}`);
        if (!res.ok) return;
        const json = await res.json();
        const listaMista = json.dados?.lista_mista || []; 
        const clima = json.dados?.clima || [];
        
        let listaRenderizavel: any[] = [];

        // 1. CLIMA
        clima.forEach((c: any) => {
            listaRenderizavel.push({
                Icon: CloudRain,
                iconProps: { color: "#60A5FA", fill: "#BFDBFE" },
                titulo: "CLIMA",
                texto: c.desc,
                corTitulo: "text-blue-400",
                origem: "VIA GOOGLE",
                corOrigem: "bg-[#4285F4]", 
                atraso: null
            });
        });

        // 2. ALERTAS
        listaMista.forEach((item: any) => {
            if (!item) return; // Proteção contra item vazio

            let Icone = Megaphone;
            let iconProps = { color: "#FFFFFF", fill: "none" }; 
            let corTitulo = "text-yellow-400"; 
            
            let labelOrigem = "VIA WAZE";
            let corOrigem = "bg-[#05C3DE]"; 

            if (item.titulo && (item.titulo.includes("Defesa Civil") || item.titulo.includes("Clima"))) {
                labelOrigem = "VIA GOOGLE";
                corOrigem = "bg-[#4285F4]"; 
            }

            switch (item.titulo) {
                case "Alerta Defesa Civil":
                    Icone = Siren;
                    iconProps = { color: "#DC2626", fill: "#1E40AF" }; 
                    corTitulo = "text-red-500 font-black";
                    break;
                case "Acidente de carro":
                    Icone = AlertOctagon;
                    iconProps = { color: "#DC2626", fill: "#DC2626" }; 
                    corTitulo = "text-red-500 font-black";
                    break;
                case "Via interditada":
                    Icone = Ban;
                    iconProps = { color: "#DC2626", fill: "#fee2e2" };
                    corTitulo = "text-red-600 font-black";
                    break;
                case "Obras na via":
                    Icone = Construction;
                    iconProps = { color: "#EA580C", fill: "#FDBA74" }; 
                    corTitulo = "text-orange-500 font-black";
                    break;
                case "Trânsito muito intenso": 
                    Icone = CarFront;
                    iconProps = { color: "#DC2626", fill: "#DC2626" }; 
                    corTitulo = "text-red-500 font-black";
                    break;
                case "Trânsito intenso":
                case "Falha no semáforo":
                    Icone = CarFront;
                    iconProps = { color: "#EA580C", fill: "#EA580C" }; 
                    corTitulo = "text-orange-500 font-bold";
                    break;
                case "Trânsito moderado":
                case "Carro parado na via":
                    Icone = CarFront;
                    iconProps = { color: "#EAB308", fill: "#EAB308" }; 
                    corTitulo = "text-yellow-400 font-bold";
                    break;
                case "Perigo na via":
                case "Perigo climático":
                    Icone = AlertTriangle;
                    iconProps = { color: "#D97706", fill: "#FCD34D" };
                    corTitulo = "text-orange-400 font-bold";
                    break;
                case "Alagamento":
                    Icone = CloudRain;
                    iconProps = { color: "#2563EB", fill: "#60A5FA" };
                    corTitulo = "text-blue-400 font-bold";
                    break;
                default:
                    if (item.corTitulo && item.corTitulo.includes("red")) {
                         iconProps = { color: "#DC2626", fill: "#fee2e2" };
                    } else {
                         iconProps = { color: "#EAB308", fill: "none" };
                    }
                    if (item.corTitulo) corTitulo = item.corTitulo;
            }

            let atrasoExibir = item.atraso;
            if (atrasoExibir === "+ Manual" || atrasoExibir === "+0 min") atrasoExibir = null;

            listaRenderizavel.push({
                Icon: Icone,
                iconProps: iconProps,
                titulo: item.titulo?.toUpperCase() || "ALERTA",
                texto: item.texto,
                corTitulo: corTitulo,
                origem: labelOrigem,
                corOrigem: corOrigem,
                atraso: atrasoExibir
            });
        });

        if (listaRenderizavel.length === 0) {
             listaRenderizavel.push({ 
              Icon: ThumbsUp,
              iconProps: { color: "#16A34A", fill: "#16A34A" },
              texto: 'Trânsito fluindo normalmente.', 
              titulo: 'NORMAL',
              corTitulo: 'text-green-400',
              origem: "VIA WAZE",
              corOrigem: "bg-[#05C3DE]",
              atraso: null
            });
        }

        setItems(listaRenderizavel);
      } catch (error) {
        console.error("Erro ticker:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
    const intervaloBusca = setInterval(fetchData, 15000); 
    return () => clearInterval(intervaloBusca);
  }, []);

  // LÓGICA DO SLIDE COM PROTEÇÃO DE ÍNDICE
  useEffect(() => {
    if (items.length <= 1) return;
    const intervaloSlide = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
    }, TEMPO_EXIBICAO);
    return () => clearInterval(intervaloSlide);
  }, [items]); // Reinicia timer se itens mudarem

  // --- BLINDAGEM DE SEGURANÇA ---
  // Se estiver carregando ou sem itens, não mostra nada
  if (loading || items.length === 0) return null;

  // Garante que o item existe. Se currentIndex estiver fora, pega o primeiro (0).
  const item = items[currentIndex] || items[0];

  // Se mesmo assim falhar (array vazio inesperado), retorna nulo para não quebrar a tela
  if (!item) return null; 

  return (
    <div className="w-full h-20 bg-black/95 flex items-center overflow-hidden relative border-y border-gray-800 font-sans mt-0 mb-4 z-50 shadow-lg">
      
      {/* CABEÇALHO LATERAL FIXO */}
      <div className="bg-red-700 h-full w-28 md:w-36 flex items-center justify-center shrink-0 z-20 relative shadow-[5px_0_20px_rgba(0,0,0,0.8)] border-r border-red-900">
        <div className="flex flex-col items-center justify-center leading-tight">
            <div className="flex flex-col items-center gap-1">
                <span className="relative flex h-2.5 w-2.5 mb-0.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                </span>
                <span className="text-white font-black text-[10px] md:text-xs tracking-wide text-center leading-none">
                    TRÂNSITO<br/>AO VIVO
                </span>
            </div>
        </div>
      </div>

      {/* ÁREA DE CONTEÚDO */}
      <div className="flex-1 h-full flex items-center relative overflow-hidden bg-gray-900/50 px-4 md:px-6">
        
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent z-0"></div>

        {/* Adicionei proteção 'item.corTitulo || ""' para evitar crash se vier undefined */}
        <div key={currentIndex} className="animate-slide-up flex items-center w-full z-10 h-full">
            
            {/* ÍCONE */}
            <div className={`mr-4 shrink-0 ${(item.corTitulo || "").includes('red') ? 'animate-pulse' : ''}`}>
                <item.Icon size={38} strokeWidth={1.5} {...item.iconProps} />
            </div>

            {/* CONTAINER FLEXÍVEL */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0 w-full h-full content-center">
                
                {/* BLOCO 1 */}
                <div className="flex items-center gap-2 shrink-0 h-7">
                    <span className={`text-sm font-black uppercase tracking-widest ${item.corTitulo} whitespace-nowrap`}>
                        {item.titulo}
                    </span>
                    
                    <span className={`${item.corOrigem} text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wide whitespace-nowrap`}>
                        {item.origem}
                    </span>

                    {item.atraso && (
                        <span className="bg-red-600/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm animate-pulse whitespace-nowrap">
                            {item.atraso}
                        </span>
                    )}
                </div>

                {/* BLOCO 2 */}
                <span className="text-lg md:text-xl font-bold text-white leading-tight flex-1 min-w-[280px]">
                   <span className="hidden md:inline-block mr-2 text-gray-500 font-light">|</span>
                   {item.texto}
                </span>

            </div>

            {/* CONTADOR DE SLIDES */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-30">
                {items.map((_, idx) => (
                    <div 
                        key={idx} 
                        className={`w-1 h-1 rounded-full transition-colors duration-300 ${idx === currentIndex ? 'bg-white' : 'bg-gray-600'}`}
                    ></div>
                ))}
            </div>

        </div>
      </div>
    </div>
  );
}