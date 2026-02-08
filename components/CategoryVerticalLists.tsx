'use client';
import React, { useState, useEffect } from 'react';

const CategoryVerticalLists = () => {
  const [goias, setGoias] = useState<any[]>([]);
  const [esporte, setEsporte] = useState<any[]>([]);
  const [entret, setEntret] = useState<any[]>([]);
  
  const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://admin.rota62go.com.br';

  const getCat = async (slug: string) => {
    try {
        // 1. Fetch Category ID by Slug
        const catRes = await fetch(`${WP_URL}/wp-json/wp/v2/categories?slug=${slug}`);
        if (!catRes.ok) return [];
        const catData = await catRes.json();
        
        if (catData.length === 0) return []; 
        
        const catId = catData[0].id;

        // 2. Fetch Posts by Category ID
        const res = await fetch(`${WP_URL}/wp-json/wp/v2/posts?_embed&per_page=5&categories=${catId}`);
        return res.ok ? await res.json() : [];
    } catch { return []; }
  };

  useEffect(() => {
    const load = async () => {
        const [g, e, en] = await Promise.all([
            getCat('radar-goias'),
            getCat('esporte'),
            getCat('entretenimento')
        ]);
        setGoias(g);
        setEsporte(e);
        setEntret(en);
    };
    load();
  }, [WP_URL]);

  const getImage = (post: any) => post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://placehold.co/100x100?text=Foto';

  const Column = ({ title, color, posts }: { title: string, color: string, posts: any[] }) => (
    <div className="flex flex-col gap-4">
        <h3 className={`text-xl font-bold uppercase border-b-2 pb-2 mb-2`} style={{ color: color, borderColor: color }}>{title}</h3>
        {posts.map((post) => (
            <div key={post.id} className="flex gap-3 items-start group cursor-pointer border-b border-gray-50 pb-3 last:border-0">
                <div className="w-24 h-16 bg-gray-100 rounded shrink-0 overflow-hidden">
                    <img src={getImage(post)} className="w-full h-full object-cover group-hover:scale-105 transition-transform"/>
                </div>
                <h4 className="text-sm font-semibold text-gray-800 leading-tight group-hover:text-gray-600 line-clamp-3" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
            </div>
        ))}
    </div>
  );

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 py-10 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <Column title="Radar Goiás" color="#DC2626" posts={goias} />
            <Column title="Esporte" color="#65A30D" posts={esporte} />
            <Column title="Entretenimento" color="#F97316" posts={entret} />
        </div>
    </section>
  );
};

export default CategoryVerticalLists;