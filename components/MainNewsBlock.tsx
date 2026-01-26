'use client';
import React, { useState, useEffect } from 'react';

const MainNewsBlock = () => {
  // --- DADOS DINÂMICOS ---

  // Hero Principal (Política)
  const heroSlides = [
    { category: "Política", image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1000&auto=format&fit=crop", title: "Nova trincheira da Avenida 85 será entregue antes do prazo previsto" },
    { category: "Economia", image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000&auto=format&fit=crop", title: "PIB de Goiás surpreende e cresce acima da média nacional no último trimestre" },
  ];

  // Grid Abaixo do Hero (Política - 6 Notícias)
  const politicsGrid = [
    { title: "Timão bate Velo com gol no fim e entra no G-8", desc: "Veja classificação e jogos", image: "https://images.unsplash.com/photo-1628891435255-dd06d1c63673?q=80&w=500" },
    { title: "Puma brilha e Vasco vence Boavista fora", desc: "Náutico atropela o Santa Cruz", image: "https://images.unsplash.com/photo-1517466787929-bc90951d6dbb?q=80&w=500" },
    { title: "Fluminense supera o Flamengo e lidera", desc: "Com Fla em risco, veja tabela", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=500" },
    { title: "'Chega de ordens de Washington', diz líder", desc: "EUA possuem arma secreta?", image: "https://images.unsplash.com/photo-1555881400-74d7acaacd25?q=80&w=500" },
    { title: "Raio atinge grupo antes de marcha no DF", desc: "Vídeo mostra momento exato", image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=500" },
    { title: "Chuva em boa parte do país e calor no Sul", desc: "Mais de 48 mil sem luz em SP", image: "https://images.unsplash.com/photo-1561553873-e8491a564fd0?q=80&w=500" },
  ];

  // Coluna Vertical (Esportes)
  const sportsFeed = [
    { type: 'card', category: "Vila Nova", image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=500", title: "Com golaço de Hulk, Atlético-MG vence o Cruzeiro de virada; veja", bullets: ["Arroyo perde gol incrível", "Lodi provoca Kaio Jorge"] },
    { type: 'text', title: "Marcos Braz não é mais executivo de futebol do Remo; veja detalhes" },
    { type: 'card', category: "Goiás", image: "https://images.unsplash.com/photo-1522778119026-d647f0565c6a?q=80&w=500", title: "Endrick faz três gols e comanda vitória do Lyon" },
    { type: 'card', category: "Atlético-GO", image: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=500", title: "Sem clube, Marinho vê Ba-Vi no meio da torcida", bullets: ["Bahia provoca Vitória após vencer"] },
  ];

  // Coluna Lateral (Divirta-se)
  const funSlides = [
    { category: "Show", image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000", title: "Festival Vaca Brava confirma 3 atrações nacionais para Julho" },
    { category: "Gastronomia", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000", title: "Novo Gastrobar no Setor Oeste aposta em drinks autorais" },
    { category: "Agenda", image: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=1000", title: "Agenda Cultural: Confira os shows deste fim de semana" },
    { category: "Cinema", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000", title: "'Duna: Parte 2' bate recorde de bilheteria na pré-venda em Goiânia" }
  ];

  const [currentHero, setCurrentHero] = useState(0);

  useEffect(() => { const t = setInterval(() => setCurrentHero((p) => (p + 1) % heroSlides.length), 5000); return () => clearInterval(t); }, []);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 pt-6 pb-12 font-sans border-b border-gray-100 antialiased">
      
      {/* --- BLOCO SUPERIOR (POLÍTICA, ESPORTES, LATERAL) --- */}
      <div className="flex flex-col lg:flex-row gap-8 items-start justify-between w-full">
        
        {/* --- WRAPPER ESQUERDA (Política) + CENTRO (Esportes) --- */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
          
          {/* === COLUNA 1: POLÍTICA === */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* HERO CARD */}
            <div className="flex flex-col rounded-lg overflow-hidden shadow-sm bg-white group cursor-pointer">
                <div className="relative w-full h-[320px] md:h-[380px] overflow-hidden">
                    <div className="flex transition-transform duration-700 ease-in-out h-full" style={{ transform: `translateX(-${currentHero * 100}%)` }}>
                        {heroSlides.map((slide, index) => (
                        <div key={index} className="w-full h-full flex-shrink-0 relative">
                            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90"></div>
                            <div className="absolute bottom-0 left-0 p-6 w-full">
                                <h1 className="text-white text-[26px] md:text-[32px] font-black leading-[1.1] drop-shadow-md mb-2">{slide.title}</h1>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
                {/* Rodapé Vermelho do Destaque */}
                <div className="bg-[#c4170c] w-full px-5 py-3 flex flex-col md:flex-row items-center justify-between gap-4 text-white">
                    <div className="flex items-center gap-2 w-full md:w-1/2 border-b md:border-b-0 md:border-r border-white/20 pb-2 md:pb-0 pr-0 md:pr-4">
                        <div className="w-1.5 h-1.5 bg-white rounded-full shrink-0"></div>
                        <p className="text-xs font-bold hover:underline cursor-pointer">Falha de Weverton, lei do ex e Borré decisivo: veja memes</p>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-1/2">
                        <div className="w-1.5 h-1.5 bg-white rounded-full shrink-0"></div>
                        <p className="text-xs font-bold hover:underline cursor-pointer">Confira resultados, próximas partidas e classificação</p>
                    </div>
                </div>
            </div>

            {/* GRID INFERIOR (3 Colunas) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6">
                 {politicsGrid.map((item, i) => (
                    <div key={i} className="group cursor-pointer flex flex-col gap-2">
                        <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden relative shadow-sm">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                        </div>
                        <h3 className="text-[15px] font-black text-[#009c3b] leading-tight group-hover:underline">
                           <span className="text-[#009c3b]">{item.title}</span> 
                        </h3>
                        <div className="flex items-start gap-1.5">
                            <div className="w-1.5 h-1.5 bg-[#009c3b] rounded-full mt-1.5 shrink-0 opacity-60"></div>
                            <p className="text-[11px] text-gray-500 font-medium leading-snug">{item.desc}</p>
                        </div>
                    </div>
                 ))}
            </div>

          </div>

          {/* === COLUNA 2: ESPORTES === */}
          <div className="lg:col-span-1 flex flex-col gap-6 border-l border-gray-100 pl-0 lg:pl-6 pt-6 lg:pt-0 border-t lg:border-t-0">
            <span className="text-[#06aa48] font-black text-[12px] uppercase tracking-wider block border-t-2 border-[#06aa48] pt-2 w-max mb-2">Esportes</span>
            
            <div className="flex flex-col gap-6 divide-y divide-gray-100">
                {sportsFeed.map((item, index) => (
                    <div key={index} className={`flex flex-col gap-2 ${index > 0 ? 'pt-6' : ''}`}>
                        {item.type === 'card' && (
                            <>
                                <div className="w-full aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden shadow-sm group cursor-pointer">
                                    <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                                </div>
                                <h2 className="text-[16px] font-black text-[#06aa48] leading-snug cursor-pointer hover:text-[#048839]">
                                    {item.title}
                                </h2>
                                {item.bullets && item.bullets.map((b, bi) => (
                                    <div key={bi} className="flex items-start gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-[#06aa48] rounded-full mt-1.5 shrink-0 opacity-60"></div>
                                        <p className="text-[11px] text-gray-500 font-medium leading-snug">{b}</p>
                                    </div>
                                ))}
                            </>
                        )}
                        {item.type === 'text' && (
                            <div className="cursor-pointer group">
                                <h2 className="text-[16px] font-black text-[#06aa48] leading-snug group-hover:text-[#048839]">
                                    {item.title}
                                </h2>
                            </div>
                        )}
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* --- DIREITA: DIVIRTA-SE --- */}
        <div className="w-full lg:w-[260px] flex-shrink-0 flex flex-col gap-6 lg:border-l border-gray-100 lg:pl-6 pt-6 lg:pt-0 border-t lg:border-t-0">
          <div>
            <span className="text-[#e07e1f] font-black text-[12px] uppercase tracking-wider block border-t-2 border-[#e07e1f] pt-2 w-max mb-5">Divirta-se</span>
            <div className="flex flex-col gap-5">
                {funSlides.map((item, index) => (
                <div key={index} className="group cursor-pointer flex gap-3 items-start pb-4 border-b border-gray-50 last:border-0">
                    <div className="w-[80px] h-[80px] bg-gray-100 rounded-md overflow-hidden shrink-0 shadow-sm">
                        <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[#e07e1f] text-[9px] font-bold uppercase tracking-wide mb-1">{item.category}</span>
                        <h3 className="text-[13px] font-bold text-gray-900 leading-snug text-left group-hover:text-[#e07e1f] transition-colors">
                        {item.title}
                        </h3>
                    </div>
                </div>
                ))}
            </div>
          </div>

          <div className="mt-auto flex justify-center w-full pt-6"> 
            <div className="w-[223px] h-[242px] bg-gray-50 border border-gray-200 rounded-md flex items-center justify-center relative overflow-hidden group cursor-pointer hover:border-gray-300 transition-colors">
               <span className="text-gray-400 text-[9px] font-bold uppercase absolute top-2 right-2">Publicidade</span>
               <div className="text-center"><p className="text-gray-400 font-extrabold text-lg">ANÚNCIO</p><p className="text-gray-400 font-bold text-sm">223 x 242</p><p className="text-gray-300 text-[10px] mt-1">Sirius Slider</p></div>
            </div>
          </div>
        </div>

      </div>
      
      {/* ========================================================== */}
      {/* NOVO BLOCO ADICIONADO: CATEGORIAS EM GRID ABAIXO      */}
      {/* ========================================================== */}

      <div className="w-full mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 font-sans text-left border-t border-gray-200 pt-10">
      
        {/* --- COLUNA 1: JORNALISMO (Vermelho) --- */}
        <div className="flex flex-col">
          <div className="border-b border-gray-200 mb-5">
            <h2 className="text-2xl font-extrabold text-[#d32f2f] border-b-[3px] border-[#d32f2f] inline-block pb-1 -mb-[1px]">
              Jornalismo
            </h2>
          </div>

          {/* Destaque Principal */}
          <div className="bg-[#d32f2f] rounded-lg overflow-hidden shadow-md mb-6 hover:-translate-y-1 transition-transform duration-200 cursor-pointer group">
            <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=800" alt="Destaque" className="w-full h-48 object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="p-4 text-white">
              <h3 className="text-lg font-bold leading-tight mb-2 group-hover:underline">Vídeo mostra casa coberta de neve em chamas nos Estados Unidos; veja</h3>
              <span className="text-[10px] font-bold uppercase opacity-80 tracking-wide">Mundo • g1</span>
            </div>
          </div>

          {/* Lista Lateral */}
          <div className="flex flex-col gap-5">
            <div className="flex gap-4 cursor-pointer group items-start">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200" alt="Thumb" className="w-[100px] h-[70px] object-cover rounded-md flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-[#b71c1c] leading-snug group-hover:underline line-clamp-2">Veja quem é o empresário suspeito de sufocar namorada</h4>
                <span className="text-[11px] text-gray-500 mt-1 block">Goiás</span>
              </div>
            </div>
            <div className="flex gap-4 cursor-pointer group items-start">
              <img src="https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=200" alt="Thumb" className="w-[100px] h-[70px] object-cover rounded-md flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-[#b71c1c] leading-snug group-hover:underline line-clamp-2">Canetas emagrecedoras ilegais cruzam fronteira e expõem riscos</h4>
                <span className="text-[11px] text-gray-500 mt-1 block">Fantástico • g1</span>
              </div>
            </div>
            <div className="flex gap-4 cursor-pointer group items-start">
              <img src="https://images.unsplash.com/photo-1453873419004-97217594d6e9?q=80&w=200" alt="Thumb" className="w-[100px] h-[70px] object-cover rounded-md flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-[#b71c1c] leading-snug group-hover:underline line-clamp-2">Veja o que se sabe sobre o caso dos gêmeos que morreram</h4>
                <span className="text-[11px] text-gray-500 mt-1 block">Santos e Região</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- COLUNA 2: ESPORTE (Verde) --- */}
        <div className="flex flex-col">
          <div className="border-b border-gray-200 mb-5">
            <h2 className="text-2xl font-extrabold text-[#00c853] border-b-[3px] border-[#00c853] inline-block pb-1 -mb-[1px]">
              Esporte
            </h2>
          </div>

          {/* Destaque Principal */}
          <div className="bg-[#00c853] rounded-lg overflow-hidden shadow-md mb-6 hover:-translate-y-1 transition-transform duration-200 cursor-pointer group">
            <img src="https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=800" alt="Destaque" className="w-full h-48 object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="p-4 text-white">
              <h3 className="text-lg font-bold leading-tight mb-2 group-hover:underline">Debaixo de neve, Patriots quebram tabu e vão ao Super Bowl</h3>
              <span className="text-[10px] font-bold uppercase opacity-80 tracking-wide">NFL • ge</span>
            </div>
          </div>

          {/* Lista Lateral */}
          <div className="flex flex-col gap-5">
            <div className="flex gap-4 cursor-pointer group items-start">
              <img src="https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?q=80&w=200" alt="Thumb" className="w-[100px] h-[70px] object-cover rounded-md flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-[#1b5e20] leading-snug group-hover:underline line-clamp-2">Sport tem horário da partida mantida para o jogo em Bonito PE</h4>
                <span className="text-[11px] text-gray-500 mt-1 block">✨ Sugestão da IA</span>
              </div>
            </div>
            <div className="flex gap-4 cursor-pointer group items-start">
              <img src="https://images.unsplash.com/photo-1522778119026-d647f0565c6a?q=80&w=200" alt="Thumb" className="w-[100px] h-[70px] object-cover rounded-md flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-[#1b5e20] leading-snug group-hover:underline line-clamp-2">Atuações do Vasco: Rojas, Puma e Andrés Gómez são os melhores</h4>
                <span className="text-[11px] text-gray-500 mt-1 block">✨ Sugestão da IA</span>
              </div>
            </div>
            <div className="flex gap-4 cursor-pointer group items-start">
              <img src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=200" alt="Thumb" className="w-[100px] h-[70px] object-cover rounded-md flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-[#1b5e20] leading-snug group-hover:underline line-clamp-2">Fluminense x Flamengo: entrada de Allan deixa marca em Canobbio</h4>
                <span className="text-[11px] text-gray-500 mt-1 block">✨ Sugestão da IA</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- COLUNA 3: ENTRETENIMENTO (Laranja) --- */}
        <div className="flex flex-col">
          <div className="border-b border-gray-200 mb-5">
            <h2 className="text-2xl font-extrabold text-[#ff6d00] border-b-[3px] border-[#ff6d00] inline-block pb-1 -mb-[1px]">
              Entretenimento
            </h2>
          </div>

          {/* Destaque Principal */}
          <div className="bg-[#ff6d00] rounded-lg overflow-hidden shadow-md mb-6 hover:-translate-y-1 transition-transform duration-200 cursor-pointer group">
            <img src="https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=800" alt="Destaque" className="w-full h-48 object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="p-4 text-white">
              <h3 className="text-lg font-bold leading-tight mb-2 group-hover:underline">Esposa de CR7, Georgina posa com bolsa de grife rara</h3>
              <span className="text-[10px] font-bold uppercase opacity-80 tracking-wide">Celebridades • Vogue</span>
            </div>
          </div>

          {/* Lista Lateral */}
          <div className="flex flex-col gap-5">
            <div className="flex gap-4 cursor-pointer group items-start">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200" alt="Thumb" className="w-[100px] h-[70px] object-cover rounded-md flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-[#e65100] leading-snug group-hover:underline line-clamp-2">Virginia mostra look para último ensaio de rua da Grande Rio</h4>
                <span className="text-[11px] text-gray-500 mt-1 block">2026 • gshow</span>
              </div>
            </div>
            <div className="flex gap-4 cursor-pointer group items-start">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200" alt="Thumb" className="w-[100px] h-[70px] object-cover rounded-md flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-[#e65100] leading-snug group-hover:underline line-clamp-2">Filho de Zezé Di Camargo anuncia que será pai pela 1ª vez</h4>
                <span className="text-[11px] text-gray-500 mt-1 block">Filhos dos Famosos</span>
              </div>
            </div>
            <div className="flex gap-4 cursor-pointer group items-start">
              <img src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=200" alt="Thumb" className="w-[100px] h-[70px] object-cover rounded-md flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-[#e65100] leading-snug group-hover:underline line-clamp-2">Juliana Paes surge linda e com decote cavadíssimo em ensaio</h4>
                <span className="text-[11px] text-gray-500 mt-1 block">2026 • gshow</span>
              </div>
            </div>
          </div>
        </div>
        
      </div>
      {/* FIM DO BLOCO NOVO */}

    </section>
  );
};

export default MainNewsBlock;