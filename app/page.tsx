import Header from '@/components/Header';
import MainNewsBlock from '@/components/MainNewsBlock';
import TrafficTicker from '@/components/TrafficTicker';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6f6f6]">
      {/* 1. Cabeçalho */}
      <Header showExtras={false} />
      
      {/* 2. CONTAINER PRINCIPAL 
         Aqui definimos a largura máxima (max-w-7xl) e centralizamos (mx-auto).
         Tudo aqui dentro respeita as margens.
      */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-8">
        
        {/* === LETREIRO WAZE (Agora respeita a largura do site) === */}
        <section>
          <TrafficTicker />
        </section>

        {/* === BLOCO DE NOTÍCIAS === */}
        <MainNewsBlock />
      
      </div>
      
      <div className="py-10 text-center text-gray-400 text-sm">
        Rodapé Rota 62
      </div>
    </main>
  );
}