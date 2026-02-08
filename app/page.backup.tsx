import Header from '@/components/Header';
import MainNewsBlock from '@/components/MainNewsBlock';
import TrafficTicker from '@/components/TrafficTicker';
import WeeklyHighlights from '@/components/WeeklyHighlights';
import CategoryVerticalLists from '@/components/CategoryVerticalLists';
import ServicesWidgetBlock from '@/components/ServicesWidgetBlock';
import TopNewsNumbered from '@/components/TopNewsNumbered';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6f6f6] font-sans overflow-x-hidden">
      
      {/* 1. Cabeçalho */}
      <Header showExtras={false} />
      
      {/* 2. CONTAINER PRINCIPAL 
          - max-w-7xl: Limita a largura em telas gigantes (não estica infinito)
          - mx-auto: Centraliza o site
          - px-4: Garante margem lateral no celular (para não colar na borda)
      */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 space-y-4">
        
        {/* === LETREIRO WAZE === */}
        <section className="w-full">
          <TrafficTicker />
        </section>

        {/* === BLOCO DE NOTÍCIAS PRINCIPAL === */}
        <section className="w-full">
           <MainNewsBlock />
        </section>

        {/* --- NOVOS BLOCOS (Agora com espaçamento reduzido) --- */}

        {/* Bloco Roxo: Rolou na Semana */}
        <WeeklyHighlights />

        {/* Listas Verticais: Radar, Esporte, Entretenimento */}
        <CategoryVerticalLists />

        {/* Widgets: Games, Agenda, Sertanejo */}
        <ServicesWidgetBlock />

        {/* Top Listas Numeradas */}
        <TopNewsNumbered />
      
      </div>
      
      {/* 3. RODAPÉ */}
      <Footer />

    </main>
  );
}