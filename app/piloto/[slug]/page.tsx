'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, User, Share2, Facebook, Twitter, MessageCircle, Eye } from 'lucide-react';

export default function NewsDetailPage({ params }: { params: { slug: string } }) {
    // Mock data - em produção viria da API
    const article = {
        title: "Governo de Goiás anuncia R$ 3 bi para infraestrutura e promete 'maior obra da história'",
        subtitle: "Pacote inclui duplicação de rodovias estaduais e construção de novos hospitais no interior; capital e aparecida terão foco em mobilidade.",
        author: "João Silva",
        date: "07 de Fevereiro de 2026",
        time: "14h30",
        category: "Política",
        categoryColor: "#0f216b",
        image: "https://placehold.co/1200x675/0f216b/ffffff.png?text=GOVERNO+DE+GOIAS",
        content: `
            <p>O Governo de Goiás anunciou nesta terça-feira (07) um pacote de investimentos de R$ 3 bilhões voltado para infraestrutura no estado. O governador destacou que este será "o maior programa de obras da história de Goiás".</p>
            
            <p>O pacote prevê a duplicação de importantes rodovias estaduais, incluindo a GO-060 e a GO-070, além da construção de novos hospitais regionais em cidades do interior. Na capital e em Aparecida de Goiânia, o foco será em projetos de mobilidade urbana.</p>
            
            <h2>Principais investimentos</h2>
            
            <p>Entre as obras anunciadas, destacam-se:</p>
            <ul>
                <li>Duplicação de 150 km de rodovias estaduais</li>
                <li>Construção de 3 novos hospitais regionais</li>
                <li>Ampliação do sistema de BRT em Goiânia</li>
                <li>Revitalização de 50 escolas estaduais</li>
            </ul>
            
            <p>Segundo o secretário de Infraestrutura, as obras devem gerar cerca de 15 mil empregos diretos e indiretos ao longo dos próximos dois anos.</p>
            
            <h2>Reação da oposição</h2>
            
            <p>A oposição na Assembleia Legislativa questionou a origem dos recursos e pediu transparência na execução das obras. "Queremos ver os editais e garantir que não haja superfaturamento", declarou o líder da oposição.</p>
            
            <p>O governo respondeu afirmando que todos os processos serão públicos e acompanhados por órgãos de controle.</p>
        `,
        views: "12.5k",
        comments: 47
    };

    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Header Simples */}
            <header className="bg-white border-b border-gray-200 py-4 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
                    <Link href="/piloto" className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-[#06aa48] transition-colors">
                        <ArrowLeft size={16} />
                        Voltar
                    </Link>
                    <Link href="/piloto" className="font-black text-2xl text-gray-900">
                        rota<span className="text-[#06aa48]">62</span>
                    </Link>
                    <div className="w-16"></div>
                </div>
            </header>

            {/* Artigo */}
            <article className="max-w-4xl mx-auto px-4 py-8">
                {/* Categoria */}
                <div className="mb-4">
                    <span
                        className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase text-white"
                        style={{ backgroundColor: article.categoryColor }}
                    >
                        {article.category}
                    </span>
                </div>

                {/* Título */}
                <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
                    {article.title}
                </h1>

                {/* Subtítulo */}
                <p className="text-xl text-gray-600 leading-relaxed mb-6">
                    {article.subtitle}
                </p>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <User size={16} />
                        <span className="font-bold">Por {article.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>{article.date} às {article.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Eye size={16} />
                        <span>{article.views} visualizações</span>
                    </div>
                </div>

                {/* Compartilhar */}
                <div className="flex items-center gap-3 mb-8">
                    <span className="text-sm font-bold text-gray-600">Compartilhar:</span>
                    <button className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                        <Facebook size={16} />
                    </button>
                    <button className="p-2 rounded-full bg-sky-500 text-white hover:bg-sky-600 transition-colors">
                        <Twitter size={16} />
                    </button>
                    <button className="p-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors">
                        <MessageCircle size={16} />
                    </button>
                    <button className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">
                        <Share2 size={16} />
                    </button>
                </div>

                {/* Imagem Principal */}
                <figure className="mb-8">
                    <img
                        src={article.image}
                        alt={article.title}
                        className="w-full rounded-lg"
                    />
                    <figcaption className="text-xs text-gray-500 mt-2 italic">
                        Foto: Governo de Goiás / Divulgação
                    </figcaption>
                </figure>

                {/* Conteúdo */}
                <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                    style={{
                        fontSize: '18px',
                        lineHeight: '1.8',
                        color: '#1f2937'
                    }}
                />

                {/* Comentários */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <h3 className="text-2xl font-black mb-6">
                        {article.comments} Comentários
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                        <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="font-bold">Sistema de comentários em desenvolvimento</p>
                    </div>
                </div>
            </article>

            {/* Footer */}
            <footer className="bg-gray-100 py-10 text-center text-xs text-gray-500 font-bold uppercase tracking-widest mt-20">
                Rota 62 - Todos os direitos reservados
            </footer>
        </div>
    );
}
