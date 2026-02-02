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
    <main className="min-h-screen bg-[#f6f6f6] font-sans">
      
      {/* 1. Cabeçalho (Sem a barra de trânsito embutida, conforme seu pedido) */}
      <Header showExtras={false} />
      
      {/* 2. CONTAINER PRINCIPAL 
          Mantendo sua estrutura de largura máxima e margens
      */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-8">
        
        {/* === LETREIRO WAZE (Componente separado que funciona) === */}
        <section>
          <TrafficTicker />
        </section>

        {/* === BLOCO DE NOTÍCIAS PRINCIPAL === */}
        <MainNewsBlock />

        {/* --- NOVOS BLOCOS (Adicionados abaixo, dentro do mesmo alinhamento) --- */}

        {/* Bloco Roxo: Rolou na Semana */}
        <WeeklyHighlights />

        {/* Listas Verticais: Radar, Esporte, Entretenimento */}
        <CategoryVerticalLists />

        {/* Widgets: Games, Agenda, Sertanejo */}
        <ServicesWidgetBlock />

        {/* Top Listas Numeradas */}
        <TopNewsNumbered />
      
      </div>
      
      {/* 3. RODAPÉ VERDE (Substituindo o texto simples pelo componente real) */}
      <Footer />

    </main>
  );
}