import React from 'react';

const NewsCategoryGrid = () => {
  return (
    <section className="max-w-[1200px] mx-auto my-10 px-4 grid grid-cols-1 md:grid-cols-3 gap-8 font-sans">
      
      {/* --- COLUNA 1: JORNALISMO (Vermelho) --- */}
      <div className="flex flex-col">
        {/* Cabeçalho */}
        <div className="border-b border-gray-200 mb-5">
          <h2 className="text-2xl font-extrabold text-[#d32f2f] border-b-4 border-[#d32f2f] inline-block pb-2 -mb-[2px]">
            Jornalismo
          </h2>
        </div>

        {/* Card Principal (Hero) */}
        <div className="bg-[#d32f2f] rounded-lg overflow-hidden shadow-md mb-6 hover:-translate-y-1 transition-transform duration-200 cursor-pointer">
          <img src="https://placehold.co/600x350/333/fff?text=Neve+nos+EUA" alt="Destaque" className="w-full h-48 object-cover" />
          <div className="p-4 text-white">
            <h3 className="text-lg font-bold leading-tight mb-2">Vídeo mostra casa coberta de neve em chamas nos Estados Unidos; veja</h3>
            <span className="text-xs font-semibold uppercase opacity-90">Mundo • g1</span>
          </div>
        </div>

        {/* Lista de Notícias */}
        <div className="flex flex-col gap-5">
          {/* Item 1 */}
          <div className="flex gap-4 cursor-pointer group">
            <img src="https://placehold.co/150x100/ddd/333" alt="Thumb" className="w-28 h-20 object-cover rounded-md flex-shrink-0" />
            <div className="flex flex-col justify-center">
              <h4 className="text-sm font-bold text-[#b71c1c] leading-snug group-hover:underline">
                Veja quem é o empresário suspeito de sufocar namorada até desmaiar
              </h4>
              <span className="text-[11px] text-gray-500 mt-1">Goiás</span>
            </div>
          </div>
          {/* Item 2 */}
          <div className="flex gap-4 cursor-pointer group">
            <img src="https://placehold.co/150x100/ddd/333" alt="Thumb" className="w-28 h-20 object-cover rounded-md flex-shrink-0" />
            <div className="flex flex-col justify-center">
              <h4 className="text-sm font-bold text-[#b71c1c] leading-snug group-hover:underline">
                Canetas emagrecedoras ilegais cruzam fronteira e expõem riscos
              </h4>
              <span className="text-[11px] text-gray-500 mt-1">Fantástico • g1</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- COLUNA 2: ESPORTE (Verde) --- */}
      <div className="flex flex-col">
        {/* Cabeçalho */}
        <div className="border-b border-gray-200 mb-5">
          <h2 className="text-2xl font-extrabold text-[#00c853] border-b-4 border-[#00c853] inline-block pb-2 -mb-[2px]">
            Esporte
          </h2>
        </div>

        {/* Card Principal (Hero) */}
        <div className="bg-[#00c853] rounded-lg overflow-hidden shadow-md mb-6 hover:-translate-y-1 transition-transform duration-200 cursor-pointer">
          <img src="https://placehold.co/600x350/004d40/fff?text=Futebol" alt="Destaque" className="w-full h-48 object-cover" />
          <div className="p-4 text-white">
            <h3 className="text-lg font-bold leading-tight mb-2">Debaixo de neve, Patriots quebram tabu, vencem Broncos e vão ao Super Bowl</h3>
            <span className="text-xs font-semibold uppercase opacity-90">NFL • ge</span>
          </div>
        </div>

        {/* Lista de Notícias */}
        <div className="flex flex-col gap-5">
          {/* Item 1 */}
          <div className="flex gap-4 cursor-pointer group">
            <img src="https://placehold.co/150x100/ddd/333" alt="Thumb" className="w-28 h-20 object-cover rounded-md flex-shrink-0" />
            <div className="flex flex-col justify-center">
              <h4 className="text-sm font-bold text-[#1b5e20] leading-snug group-hover:underline">
                Sport tem horário da partida mantida para o jogo em Bonito PE
              </h4>
              <span className="text-[11px] text-gray-500 mt-1">✨ Sugestão da IA</span>
            </div>
          </div>
           {/* Item 2 */}
           <div className="flex gap-4 cursor-pointer group">
            <img src="https://placehold.co/150x100/ddd/333" alt="Thumb" className="w-28 h-20 object-cover rounded-md flex-shrink-0" />
            <div className="flex flex-col justify-center">
              <h4 className="text-sm font-bold text-[#1b5e20] leading-snug group-hover:underline">
                Atuações do Vasco: Rojas, Puma e Andrés Gómez são os melhores
              </h4>
              <span className="text-[11px] text-gray-500 mt-1">✨ Sugestão da IA</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- COLUNA 3: ENTRETENIMENTO (Laranja) --- */}
      <div className="flex flex-col">
        {/* Cabeçalho */}
        <div className="border-b border-gray-200 mb-5">
          <h2 className="text-2xl font-extrabold text-[#ff6d00] border-b-4 border-[#ff6d00] inline-block pb-2 -mb-[2px]">
            Entretenimento
          </h2>
        </div>

        {/* Card Principal (Hero) */}
        <div className="bg-[#ff6d00] rounded-lg overflow-hidden shadow-md mb-6 hover:-translate-y-1 transition-transform duration-200 cursor-pointer">
          <img src="https://placehold.co/600x350/ff6f00/fff?text=Famosos" alt="Destaque" className="w-full h-48 object-cover" />
          <div className="p-4 text-white">
            <h3 className="text-lg font-bold leading-tight mb-2">Esposa de CR7, Georgina posa com bolsa de grife rara e mais cara do mundo</h3>
            <span className="text-xs font-semibold uppercase opacity-90">Celebridades • Vogue</span>
          </div>
        </div>

        {/* Lista de Notícias */}
        <div className="flex flex-col gap-5">
          {/* Item 1 */}
          <div className="flex gap-4 cursor-pointer group">
            <img src="https://placehold.co/150x100/ddd/333" alt="Thumb" className="w-28 h-20 object-cover rounded-md flex-shrink-0" />
            <div className="flex flex-col justify-center">
              <h4 className="text-sm font-bold text-[#e65100] leading-snug group-hover:underline">
                Virginia mostra look para último ensaio de rua da Grande Rio
              </h4>
              <span className="text-[11px] text-gray-500 mt-1">2026 • gshow</span>
            </div>
          </div>
          {/* Item 2 */}
          <div className="flex gap-4 cursor-pointer group">
            <img src="https://placehold.co/150x100/ddd/333" alt="Thumb" className="w-28 h-20 object-cover rounded-md flex-shrink-0" />
            <div className="flex flex-col justify-center">
              <h4 className="text-sm font-bold text-[#e65100] leading-snug group-hover:underline">
                Filho de Zezé Di Camargo anuncia que será pai pela 1ª vez
              </h4>
              <span className="text-[11px] text-gray-500 mt-1">Filhos dos Famosos</span>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default NewsCategoryGrid;