'use client';

import { useState, useEffect } from 'react';
import {
    AlertTriangle, CarFront, CloudRain, Ban,
    AlertOctagon, Siren, Megaphone, ThumbsUp,
    Construction, TrendingUp, TrendingDown
} from 'lucide-react';

export default function TrafficTicker() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    const DATA_URL = '/api/waze';
    const TEMPO_EXIBICAO = 5000; // 5 segundos por alerta

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
                        iconProps: { size: 20, className: "text-blue-400" },
                        titulo: "CLIMA",
                        texto: c.desc,
                        corTitulo: "text-blue-400",
                        origem: "VIA GOOGLE",
                        corOrigem: "bg-blue-600",
                        atraso: null,
                        type: "clima"
                    });
                });

                // 2. ALERTAS DO WAZE
                listaMista.forEach((item: any) => {
                    if (!item) return;

                    let Icone = Megaphone;
                    let iconClass = "text-yellow-400";
                    let corTitulo = "text-yellow-400";

                    let labelOrigem = "VIA WAZE";
                    let corOrigem = "bg-[#05C3DE]";

                    switch (item.titulo) {
                        case "Acidente":
                            Icone = AlertOctagon;
                            iconClass = "text-red-500";
                            corTitulo = "text-red-400 font-bold";
                            break;
                        case "Congestionamento":
                            Icone = CarFront;
                            iconClass = "text-red-400";
                            corTitulo = "text-red-400 font-bold";
                            break;
                        case "Perigo":
                            Icone = AlertTriangle;
                            iconClass = "text-orange-400";
                            corTitulo = "text-orange-400 font-bold";
                            break;
                        case "Obra":
                            Icone = Construction;
                            iconClass = "text-orange-500";
                            corTitulo = "text-orange-400 font-bold";
                            break;
                        case "Alagamento":
                            Icone = CloudRain;
                            iconClass = "text-blue-400";
                            corTitulo = "text-blue-400 font-bold";
                            break;
                        default:
                            iconClass = "text-yellow-400";
                            if (item.corTitulo) corTitulo = item.corTitulo;
                    }

                    let atrasoExibir = item.atraso;
                    if (atrasoExibir === "+ Manual" || atrasoExibir === "+0 min") atrasoExibir = null;

                    listaRenderizavel.push({
                        Icon: Icone,
                        iconProps: { size: 20, className: iconClass },
                        titulo: item.titulo?.toUpperCase() || "ALERTA",
                        texto: item.texto,
                        corTitulo: corTitulo,
                        origem: labelOrigem,
                        corOrigem: corOrigem,
                        atraso: atrasoExibir,
                        type: "waze"
                    });
                });

                if (listaRenderizavel.length === 0) {
                    listaRenderizavel.push({
                        Icon: ThumbsUp,
                        iconProps: { size: 20, className: "text-green-400" },
                        texto: 'Trânsito fluindo normalmente.',
                        titulo: 'NORMAL',
                        corTitulo: 'text-green-400',
                        origem: "VIA WAZE",
                        corOrigem: "bg-[#05C3DE]",
                        atraso: null,
                        type: "normal"
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
        const interval = setInterval(fetchData, 60000); // Atualiza a cada 60 segundos
        return () => clearInterval(interval);
    }, []);

    // Rotação automática dos alertas
    useEffect(() => {
        if (items.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % items.length);
        }, TEMPO_EXIBICAO);
        return () => clearInterval(interval);
    }, [items]);

    if (loading) {
        return (
            <div className="bg-black text-white text-sm py-2.5 overflow-hidden relative border-y-2 border-yellow-500">
                <div className="max-w-[1240px] mx-auto px-4 flex items-center justify-center">
                    <span className="text-xs">Carregando alertas...</span>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return null;
    }

    const currentItem = items[currentIndex % items.length];

    return (
        <div className="bg-black text-white text-sm py-3 overflow-hidden relative border-y-2 border-yellow-500">
            <style jsx>{`
            @keyframes pulse-glow {
                0%, 100% { 
                    opacity: 1;
                    transform: scale(1);
                }
                50% { 
                    opacity: 0.8;
                    transform: scale(1.02);
                }
            }
            .animate-pulse-glow {
                animation: pulse-glow 2s ease-in-out infinite;
            }
            @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.3; }
            }
            .animate-blink {
                animation: blink 1s ease-in-out infinite;
            }
            @keyframes slide-in {
                0% { 
                    opacity: 0;
                    transform: translateX(-20px);
                }
                100% { 
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            .animate-slide-in {
                animation: slide-in 0.5s ease-out;
            }
        `}</style>
            <div className="max-w-[1240px] mx-auto px-4 flex items-center gap-4">
                {/* Badge AO VIVO */}
                <div className="flex items-center gap-2 shrink-0 bg-yellow-500 text-black px-3 py-1.5 rounded font-black text-xs uppercase z-10 animate-pulse shadow-lg">
                    <span className="text-red-600 animate-blink text-sm">●</span> AO VIVO
                </div>

                {/* Alerta atual com animação */}
                <div className="flex-1 overflow-hidden relative">
                    <div key={currentIndex} className="flex items-center gap-3 animate-slide-in animate-pulse-glow">
                        {/* Ícone pulsante */}
                        <div className="shrink-0">
                            <currentItem.Icon {...currentItem.iconProps} />
                        </div>

                        {/* Conteúdo do alerta */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className={`font-black text-sm uppercase tracking-wide ${currentItem.corTitulo}`}>
                                {currentItem.titulo}
                            </span>

                            <span className={`${currentItem.corOrigem} text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase`}>
                                {currentItem.origem}
                            </span>

                            {currentItem.atraso && (
                                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm animate-pulse">
                                    {currentItem.atraso}
                                </span>
                            )}

                            <span className="text-white font-semibold text-sm">
                                - {currentItem.texto}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Indicador de progresso */}
                {items.length > 1 && (
                    <div className="hidden md:flex items-center gap-1.5 shrink-0">
                        {items.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex
                                    ? 'bg-yellow-500 scale-125'
                                    : 'bg-gray-600'
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}