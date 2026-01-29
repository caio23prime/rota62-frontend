'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Tipagem para os dados vindos do WordPress
interface WpPost {
  id: number;
  date: string;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string }>;
    'wp:term'?: Array<Array<{ name: string; slug: string }>>;
  };
}

// Tipagem para os dados formatados
interface FormattedPost {
  id: number;
  title: string;
  image: string;
  category: string;
  desc: string;
  slug: string;
  date: string;
}

const MainNewsBlock = () => {
  const [heroSlides, setHeroSlides] = useState<FormattedPost[]>([]);
  const [politicsGrid, setPoliticsGrid] = useState<FormattedPost[]>([]);
  const [sportsFeed, setSportsFeed] = useState<FormattedPost[]>([]);
  const [funSlides, setFunSlides] = useState<FormattedPost[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentHero, setCurrentHero] = useState(0);

  const formatPostData = (post: WpPost): FormattedPost => {
    return {
      id: post.id,
      title: post.title.rendered,
      image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://via.placeholder.com/800x600?text=Sem+Imagem', 
      category: post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Geral',
      desc: post.excerpt.rendered.replace(/<[^>]*>?/gm, '').slice(0, 100) + '...',
      slug: post.slug,
      date: new Date(post.date).toLocaleDateString('pt-BR')
    };
  };

  useEffect(() => {
    async function fetchAllData() {
      try {
        const generalRes = await fetch('https://admin.rota62go.com.br/wp-json/wp/v2/posts?per_page=10&_embed');
        const generalData: WpPost[] = await generalRes.json();
        
        let sportsData: WpPost[] = [];
        try {
            const catRes = await fetch('https://admin.rota62go.com.br/wp-json/wp/v2/categories?slug=esporte');
            const catData = await catRes.json();
            if (catData.length > 0) {
            const sportsRes = await fetch(`https://admin.rota62go.com.br/wp-json/wp/v2/posts?categories=${catData[0].id}&per_page=4&_embed`);
            sportsData = await sportsRes.json();
            }
        } catch (e) { console.log('Erro ao buscar esportes', e); }

        let funData: WpPost[] = [];
        try {
            const funCatRes = await fetch('https://admin.rota62go.com.br/wp-json/wp/v2/categories?slug=entretenimento');
            const funCatData = await funCatRes.json();
            if (funCatData.length > 0) {
                const funRes = await fetch(`https://admin.rota62go.com.br/wp-json/wp/v2/posts?categories=${funCatData[0].id}&per_page=4&_embed`);
                funData = await funRes.json();
            }
        } catch (e) { console.log('Erro ao buscar entretenimento', e); }

        if (generalData.length > 0) {
            setHeroSlides(generalData.slice(0, 2).map(formatPostData));
            setPoliticsGrid(generalData.slice(2, 8).map(formatPostData));
        }

        if (sportsData.length > 0) {
            setSportsFeed(sportsData.map(formatPostData));
        }

        if (funData.length > 0) {
            setFunSlides(funData.map(formatPostData));
        }

      } catch (error) {
        console.error("Erro ao carregar notícias:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllData();
  }, []);

  useEffect(() => { 
      const t = setInterval(() => setCurrentHero((p) => (p + 1) % (heroSlides.length || 1)), 5000); 
      return () => clearInterval(t); 
  }, [heroSlides.length]);

  if (loading) {
      return <div className="w-full h-96 flex items-center justify-center text-gray-400">Carregando notícias...</div>;
  }

  if (heroSlides.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 pt-6 pb-12 font-sans border-b border-gray-100 antialiased">
      
      <div className="flex flex-col lg:flex-row gap-8 items-start justify-between w-full">
        
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
          
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            <div className="flex flex-col rounded-lg overflow-hidden shadow-sm bg-white group cursor-pointer">
                <div className="relative w-full h-[320px] md:h-[380px] overflow-hidden">
                    <div className="flex transition-transform duration-700 ease-in-out h-full" style={{ transform: `translateX(-${currentHero * 100}%)` }}>
                        {heroSlides.map((slide, index) => (
                        <div key={slide.id} className="w-full h-full flex-shrink-0 relative">
                            <Link href={`/noticia/${slide.slug}`} className="w-full h-full block">
                                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90"></div>
                                <div className="absolute bottom-0 left-0 p-6 w-full">
                                    <h1 className="text-white text-[26px] md:text-[32px] font-black leading-[1.1] drop-shadow-md mb-2" dangerouslySetInnerHTML={{ __html: slide.title }}></h1>
                                </div>
                            </Link>
                        </div>
                        ))}
                    </div>
                </div>
                <div className="bg-[#c4170c] w-full px-5 py-3 flex flex-col md:flex-row items-center justify-between gap-4 text-white">
                    <div className="flex items-center gap-2 w-full md:w-1/2 border-b md:border-b-0 md:border-r border-white/20 pb-2 md:pb-0 pr-0 md:pr-4">
                        <div className="w-1.5 h-1.5 bg-white rounded-full shrink-0"></div>
                        <p className="text-xs font-bold hover:underline cursor-pointer truncate">
                             {heroSlides[currentHero]?.desc || "Leia mais sobre este destaque"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6">
                 {politicsGrid.map((item) => (
                    <Link key={item.id} href={`/noticia/${item.slug}`} className="group cursor-pointer flex flex-col gap-2">
                        <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden relative shadow-sm">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                        </div>
                        <h3 className="text-[15px] font-black text-[#009c3b] leading-tight group-hover:underline">
                           <span className="text-[#009c3b]" dangerouslySetInnerHTML={{ __html: item.title }}></span> 
                        </h3>
                        <div className="flex items-start gap-1.5">
                            <div className="w-1.5 h-1.5 bg-[#009c3b] rounded-full mt-1.5 shrink-0 opacity-60"></div>
                            <p className="text-[11px] text-gray-500 font-medium leading-snug line-clamp-2" dangerouslySetInnerHTML={{ __html: item.desc }}></p>
                        </div>
                    </Link>
                 ))}
            </div>

          </div>

          <div className="lg:col-span-1 flex flex-col gap-6 border-l border-gray-100 pl-0 lg:pl-6 pt-6 lg:pt-0 border-t lg:border-t-0">
            <span className="text-[#06aa48] font-black text-[12px] uppercase tracking-wider block border-t-2 border-[#06aa48] pt-2 w-max mb-2">Esportes</span>
            
            <div className="flex flex-col gap-6 divide-y divide-gray-100">
                {sportsFeed.map((item, index) => (
                    <Link key={item.id} href={`/noticia/${item.slug}`} className={`flex flex-col gap-2 ${index > 0 ? 'pt-6' : ''}`}>
                         {item.image && !item.image.includes('placeholder') ? (
                            <>
                                <div className="w-full aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden shadow-sm group cursor-pointer">
                                    <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                                </div>
                                <h2 className="text-[16px] font-black text-[#06aa48] leading-snug cursor-pointer hover:text-[#048839]" dangerouslySetInnerHTML={{ __html: item.title }}></h2>
                            </>
                         ) : (
                            <div className="cursor-pointer group">
                                <h2 className="text-[16px] font-black text-[#06aa48] leading-snug group-hover:text-[#048839]" dangerouslySetInnerHTML={{ __html: item.title }}></h2>
                            </div>
                         )}
                    </Link>
                ))}
                {sportsFeed.length === 0 && <p className="text-gray-400 text-xs">Sem notícias de esporte.</p>}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[260px] flex-shrink-0 flex flex-col gap-6 lg:border-l border-gray-100 lg:pl-6 pt-6 lg:pt-0 border-t lg:border-t-0">
          <div>
            {/* --- MUDANÇA AQUI: Título Atualizado para Entretenimento --- */}
            <span className="text-[#e07e1f] font-black text-[12px] uppercase tracking-wider block border-t-2 border-[#e07e1f] pt-2 w-max mb-5">Entretenimento</span>
            <div className="flex flex-col gap-5">
                {funSlides.map((item) => (
                <Link key={item.id} href={`/noticia/${item.slug}`} className="group cursor-pointer flex gap-3 items-start pb-4 border-b border-gray-50 last:border-0">
                    <div className="w-[80px] h-[80px] bg-gray-100 rounded-md overflow-hidden shrink-0 shadow-sm">
                        <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[#e07e1f] text-[9px] font-bold uppercase tracking-wide mb-1 line-clamp-1">{item.category}</span>
                        <h3 className="text-[13px] font-bold text-gray-900 leading-snug text-left group-hover:text-[#e07e1f] transition-colors line-clamp-3" dangerouslySetInnerHTML={{ __html: item.title }}></h3>
                    </div>
                </Link>
                ))}
                {funSlides.length === 0 && <p className="text-gray-400 text-xs">Sem notícias de entretenimento.</p>}
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

    </section>
  );
};

export default MainNewsBlock;