'use client';
import React, { useState, useEffect } from 'react';

const WeeklyHighlights = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://admin.rota62go.com.br';

  useEffect(() => {
    const loadData = async () => {
      // Puxa eventos e sertanejo
      const res = await fetch(`${WP_URL}/wp-json/wp/v2/posts?_embed&per_page=4&categories_exclude=1,10&category_name=eventos,sertanejo-e-meio`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    };
    loadData();
  }, [WP_URL]);

  const getImage = (post: any) => post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://placehold.co/400x300/purple/white?text=Rota62';

  if (posts.length === 0) return null;

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 py-8 border-b border-gray-200">
        <div className="mb-6 flex items-center justify-between border-b-4 border-purple-800 pb-2">
            <h2 className="text-2xl md:text-3xl font-black text-purple-800 tracking-tight">Rolou na semana: você viu?</h2>
            <button className="bg-purple-800 text-white text-xs font-bold px-4 py-1.5 rounded uppercase hover:bg-purple-900">Veja mais</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {posts.map((post) => (
                <div key={post.id} className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden">
                    <div className="aspect-[4/3] overflow-hidden">
                        <img src={getImage(post)} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                    </div>
                    <div className="p-4">
                        <h3 className="text-sm font-bold text-purple-900 leading-snug group-hover:underline" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                    </div>
                </div>
            ))}
        </div>
    </section>
  );
};

export default WeeklyHighlights;