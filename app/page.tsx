import NewsCategoryGrid from '@/components/NewsCategoryGrid';
import Header from '@/components/Header';
import MainNewsBlock from '@/components/MainNewsBlock';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6f6f6]">
      {/* Cabeçalho Validado (Topo, Redes Sociais, Waze, Clima) */}
      <Header />
      
      {/* Primeiro Bloco de Notícias (Estilo Globo.com) */}
      <MainNewsBlock />
      
      {/* Espaço para os próximos blocos */}
      <div className="py-10 text-center text-gray-400 text-sm">
        [ Próximos Blocos em Construção ]
      </div>
    </main>
  );
}