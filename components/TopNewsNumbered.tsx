'use client';
import React, { useState, useEffect } from 'react';

const TopNewsNumbered = () => {
  const [col1, setCol1] = useState<any[]>([]);
  const [col2, setCol2] = useState<any[]>([]);
  const [col3, setCol3] = useState<any[]>([]);

  const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://admin.rota62go.com.br';

  const getCat = async (slug: string) => {
    try {
      const catRes = await fetch(`${WP_URL}/wp-json/wp/v2/categories?slug=${slug}`);
      if (!catRes.ok) return [];
      const catData = await catRes.json();

      if (catData.length === 0) return [];

      const catId = catData[0].id;

      const res = await fetch(`${WP_URL}/wp-json/wp/v2/posts?_embed&per_page=5&categories=${catId}`);
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

  const ListColumn = ({ title, colorClass, borderClass, posts }: { title: string, colorClass: string, borderClass: string, posts: any[] }) => (
    <div className="flex flex-col">
      <h3 className={`text-lg font-bold border-b pb-2 mb-4 ${colorClass} ${borderClass}`}>{title}</h3>
      <div className="flex flex-col gap-4">
        {posts.map((post, idx) => (
          <div key={post.id} className="flex gap-4 items-start group cursor-pointer border-b border-gray-50 pb-2 last:border-0">
            <span className={`text-3xl font-light text-gray-300 group-hover:${colorClass.replace("text-", "text-")} transition-colors font-sans`}>{idx + 1}</span>
            <h4 className={`text-sm font-semibold text-gray-700 leading-snug group-hover:${colorClass.replace("text-", "text-")} pt-1`} dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 py-10 mb-10">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-1 h-8 bg-blue-800"></div>
        <h2 className="text-2xl font-black text-blue-800 tracking-tighter">TOP ROTA 62</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <ListColumn title="Política" colorClass="text-purple-700" borderClass="border-purple-200" posts={col1} />
        <ListColumn title="Economia" colorClass="text-emerald-600" borderClass="border-emerald-200" posts={col2} />
        <ListColumn title="Brasil" colorClass="text-green-700" borderClass="border-green-200" posts={col3} />
      </div>
    </section>
  );
};

export default TopNewsNumbered;