'use client';
import React, { useState, useEffect } from 'react';

const WeeklyHighlights = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://admin.rota62go.com.br';

  useEffect(() => {
    const loadData = async () => {
      try {
          const res = await fetch(`${WP_URL}/wp-json/wp/v2/posts?_embed&per_page=4&category_name=eventos,sertanejo-e-meio`);
          if (res.ok) {
            const data = await res.json();
            setPosts(data);
          }
      } catch (error) {
          console.error("Erro ao carregar destaques semanais");
      }
    };
    loadData();
  }, [WP_URL]);

  const getImage = (post: any) => post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://placehold.co/400x300/purple/white?text=Rota62';

  if (posts.length === 0) return null;

  return (
    // Mudei py-8 para py-4 para diminuir o espaço em cima e embaixo
    <section className="w-full py-4 border-b border-gray-200">
        <div className="mb-4 flex items-center justify-between border-b-4 border-purple-800 pb-2">
            {/* Texto responsivo: diminui no celular (text-xl) aumenta no PC (text-3xl) */}
            <h2 className="text-xl md:text-3xl font-black text-purple-800 tracking-tight">Rolou na semana</h2>
            <button className="bg-purple-800 text-white text-[10px] md:text-xs font-bold px-3 py-1 md:px-4 md:py-1.5 rounded uppercase hover:bg-purple-900 transition-colors">Veja mais</button>
        </div>

        {/* GRID RESPONSIVO: 
            - grid-cols-1: 1 coluna no celular (um embaixo do outro)
            - sm:grid-cols-2: 2 colunas em tablets
            - lg:grid-cols-4: 4 colunas em PC
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {posts.map((post) => (
                <div key={post.id} className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden flex flex-col h-full">
                    <div className="aspect-[4/3] w-full overflow-hidden relative">
                        <img src={getImage(post)} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                    </div>
                    <div className="p-3 md:p-4 flex-1">
                        <h3 className="text-sm font-bold text-purple-900 leading-snug group-hover:underline line-clamp-3" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                    </div>
                </div>
            ))}
        </div>
    </section>
  );
};

export default WeeklyHighlights;