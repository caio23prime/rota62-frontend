'use client';
import React, { useState, useEffect } from 'react';

const TopNewsNumbered = () => {
  const [col1, setCol1] = useState<any[]>([]);
  const [col2, setCol2] = useState<any[]>([]);
  const [col3, setCol3] = useState<any[]>([]);
  
  const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://admin.rota62go.com.br';

  const getCat = async (slug: string) => {
    try {
        const res = await fetch(`${WP_URL}/wp-json/wp/v2/posts?_embed&per_page=5&category_name=${slug}`);
        return res.ok ? await res.json() : [];
    } catch { return []; }
  };

  useEffect(() => {
    const load = async () => {
        setCol1(await getCat('politica'));
        setCol2(await getCat('economia'));
        setCol3(await getCat('brasil'));
    };
    load();
  }, [WP_URL]);

  const ListColumn = ({ title, posts }: { title: string, posts: any[] }) => (
    <div className="flex flex-col">
        <h3 className="text-lg font-bold text-gray-400 border-b border-gray-200 pb-2 mb-4">{title}</h3>
        <div className="flex flex-col gap-4">
            {posts.map((post, idx) => (
                <div key={post.id} className="flex gap-4 items-start group cursor-pointer border-b border-gray-50 pb-2 last:border-0">
                    <span className="text-3xl font-light text-gray-200 group-hover:text-blue-600 transition-colors font-sans">{idx + 1}</span>
                    <h4 className="text-sm font-semibold text-gray-700 leading-snug group-hover:text-blue-600 pt-1" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                </div>
            ))}
        </div>
    </div>
  );

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 py-10 mb-10">
        <div className="flex items-center gap-2 mb-8">
            <div className="w-1 h-8 bg-blue-600"></div>
            <h2 className="text-2xl font-black text-blue-600 tracking-tighter">TOP ROTA 62</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <ListColumn title="Política" posts={col1} />
            <ListColumn title="Economia" posts={col2} />
            <ListColumn title="Brasil" posts={col3} />
        </div>
    </section>
  );
};

export default TopNewsNumbered;