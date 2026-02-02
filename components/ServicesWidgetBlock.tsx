'use client';
import React, { useState, useEffect } from 'react';

const ServicesWidgetBlock = () => {
  const [gamePost, setGamePost] = useState<any>(null);
  const [eventPost, setEventPost] = useState<any>(null);
  const [sertaPost, setSertaPost] = useState<any>(null);
  
  const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://admin.rota62go.com.br';

  useEffect(() => {
    const loadOne = async (slug: string) => {
        const res = await fetch(`${WP_URL}/wp-json/wp/v2/posts?_embed&per_page=1&category_name=${slug}`);
        const data = await res.json();
        return data[0] || null;
    };

    const load = async () => {
        setGamePost(await loadOne('games'));
        setEventPost(await loadOne('eventos'));
        setSertaPost(await loadOne('sertanejo-e-meio'));
    };
    load();
  }, [WP_URL]);

  const getImage = (post: any) => post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';

  const WidgetCard = ({ title, color, post, label }: any) => (
    <div className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
        <h3 className="font-black text-lg mb-4 pb-2 border-b-2" style={{ color: color, borderColor: color }}>{title}</h3>
        {post ? (
            <div className="flex flex-col gap-3 flex-1">
                {getImage(post) && (
                    <div className="w-full h-32 rounded bg-gray-100 overflow-hidden">
                        <img src={getImage(post)} className="w-full h-full object-cover"/>
                    </div>
                )}
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</span>
                <h4 className="font-bold text-gray-800 leading-snug" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
            </div>
        ) : (
            <div className="text-gray-400 text-sm py-10 text-center">Carregando...</div>
        )}
        <button className="mt-4 w-full py-2 text-xs font-bold text-white rounded uppercase" style={{ backgroundColor: color }}>Ver mais</button>
    </div>
  );

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 py-10 bg-gray-50/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <WidgetCard title="Games & Geek" color="#9c27b0" post={gamePost} label="Destaque Geek" />
            <WidgetCard title="Agenda Cultural" color="#00c853" post={eventPost} label="Próximos Eventos" />
            <WidgetCard title="Sertanejo & 1/2" color="#ff6d00" post={sertaPost} label="Mundo da Música" />
        </div>
    </section>
  );
};

export default ServicesWidgetBlock;