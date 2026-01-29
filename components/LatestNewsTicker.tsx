'use client';
import React, { useState } from 'react';
import Link from 'next/link';

interface Post {
  id: number;
  slug: string;
  title: { rendered: string };
  date: string;
}

interface Theme {
  bg: string; // Ex: bg-[#c4170c]
  text: string;
}

export default function LatestNewsTicker({ posts, theme }: { posts: Post[], theme: Theme }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Se não tiver posts, não mostra nada
  if (!posts || posts.length === 0) return null;

  const currentPost = posts[currentIndex];
  
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % posts.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);
  };

  // Formata a data: "27 de janeiro de 2026"
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="w-full bg-white shadow-sm border border-gray-200 flex flex-col md:flex-row items-stretch overflow-hidden mb-8 h-auto md:h-12">
      
      {/* 1. LABEL (COR DA CATEGORIA) */}
      <div className={`${theme.bg} text-white px-6 py-2 md:py-0 flex items-center justify-center shrink-0`}>
        <div className="flex items-center gap-2">
           {/* Ícone RSS Simples */}
           <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z"/></svg>
           <span className="text-xs md:text-sm font-black uppercase tracking-wider whitespace-nowrap">
             Últimas Notícias
           </span>
        </div>
      </div>

      {/* 2. CONTEÚDO DA NOTÍCIA */}
      <div className="flex-grow flex items-center px-4 py-2 md:py-0 overflow-hidden relative">
          <Link href={`/noticia/${currentPost.slug}`} className="flex flex-col md:flex-row md:items-center gap-2 w-full group">
            <span className="text-sm font-medium text-gray-800 truncate group-hover:text-red-600 transition-colors w-full md:w-auto block" dangerouslySetInnerHTML={{ __html: currentPost.title.rendered }} />
            <span className="hidden md:inline-block text-gray-300 text-xs mx-2">|</span>
            <span className="text-[10px] md:text-xs text-gray-400 whitespace-nowrap">
                {formatDate(currentPost.date)}
            </span>
          </Link>
      </div>

      {/* 3. CONTROLES (SETINHAS) */}
      <div className="flex border-t md:border-t-0 md:border-l border-gray-100 shrink-0">
         <button 
           onClick={handlePrev} 
           className="px-4 py-2 md:py-0 hover:bg-gray-50 flex items-center justify-center border-r border-gray-100 transition-colors"
           aria-label="Anterior"
         >
           <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
         </button>
         <button 
           onClick={handleNext} 
           className="px-4 py-2 md:py-0 hover:bg-gray-50 flex items-center justify-center transition-colors"
           aria-label="Próxima"
         >
           <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
         </button>
      </div>

    </div>
  );
}