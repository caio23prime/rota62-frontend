import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import LatestNewsTicker from '@/components/LatestNewsTicker'; // <--- IMPORTADO AQUI

// --- TIPAGEM ---
interface Post {
  id: number;
  date: string;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string; alt_text: string }>;
    'author'?: Array<{ name: string }>;
  };
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

// --- CONFIGURAÇÃO DE CORES (PADRÃO GLOBO.COM) ---
const getTheme = (slug: string) => {
  const s = slug.toLowerCase();

  // GE (Esportes) -> Verde Vibrante
  if (s.includes('esporte') || s.includes('futebol')) {
    return { 
      text: 'text-[#06aa48]', 
      bg: 'bg-[#06aa48]', 
      border: 'border-[#06aa48]', 
      hover: 'hover:text-[#048839]',
      decoration: 'decoration-[#06aa48]'
    };
  }

  // GShow (Entretenimento/Pop) -> Laranja
  if (s.includes('entretenimento') || s.includes('divirta') || s.includes('famosos')) {
    return { 
      text: 'text-[#e65100]', 
      bg: 'bg-[#e65100]', 
      border: 'border-[#e65100]', 
      hover: 'hover:text-[#bf360c]',
      decoration: 'decoration-[#e65100]'
    };
  }

  // Economia -> Azul Sóbrio
  if (s.includes('economia') || s.includes('mercado')) {
    return { 
      text: 'text-[#1565c0]', 
      bg: 'bg-[#1565c0]', 
      border: 'border-[#1565c0]', 
      hover: 'hover:text-[#0d47a1]',
      decoration: 'decoration-[#1565c0]'
    };
  }
  
  // Região Metropolitana -> Roxo/Indigo
  if (s.includes('regiao') || s.includes('cidades') || s.includes('goiania') || s.includes('aparecida') || s.includes('anapolis')) {
    return { 
      text: 'text-[#4b0082]', 
      bg: 'bg-[#4b0082]', 
      border: 'border-[#4b0082]', 
      hover: 'hover:text-[#320056]',
      decoration: 'decoration-[#4b0082]'
    };
  }

  // G1 (Política, Brasil, Mundo, Geral) -> Vermelho Padrão
  return { 
    text: 'text-[#c4170c]', 
    bg: 'bg-[#c4170c]', 
    border: 'border-[#c4170c]', 
    hover: 'hover:text-[#990000]',
    decoration: 'decoration-[#c4170c]'
  };
};

// --- FUNÇÕES DE BUSCA ---
async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const res = await fetch(`https://admin.rota62go.com.br/wp-json/wp/v2/categories?slug=${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const categories = await res.json();
    return categories.length > 0 ? categories[0] : null;
  } catch (error) { return null; }
}

async function getPostsByCategory(categoryId: number): Promise<Post[]> {
  try {
    const res = await fetch(`https://admin.rota62go.com.br/wp-json/wp/v2/posts?categories=${categoryId}&per_page=12&_embed`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch (error) { return []; }
}

// --- COMPONENTE DA PÁGINA ---
export default async function CategoryPage({ params }: { params: Promise<{ categoria: string }> }) {
  const { categoria } = await params;
  const decodedSlug = decodeURIComponent(categoria);
  const categoryData = await getCategoryBySlug(decodedSlug);

  if (!categoryData) notFound();

  const posts = await getPostsByCategory(categoryData.id);
  const theme = getTheme(categoryData.slug);

  if (posts.length === 0) {
    return (
      <main className="min-h-screen bg-[#f6f6f6]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
            <h1 className={`text-3xl font-bold mb-4 ${theme.text}`}>{categoryData.name}</h1>
            <p className="text-gray-500">Nenhuma notícia encontrada nesta categoria.</p>
        </div>
      </main>
    );
  }

  const heroPost = posts[0];
  const mainList = posts.slice(1, 5);
  const sidebarList = posts.slice(5);
  
  // Pegamos as 5 primeiras notícias para passar para o Ticker
  const tickerPosts = posts.slice(0, 5);

  return (
    <main className="min-h-screen bg-[#f9f9f9] font-sans pb-20 pt-8">
      <Header />

      {/* CABEÇALHO DA EDITORIA */}
      <div className="max-w-7xl mx-auto bg-white border-b border-gray-200 py-6 mb-4 shadow-sm">
         <div className="px-4 flex items-center gap-4">
            <h1 className={`text-4xl font-black uppercase tracking-tight border-r pr-6 border-gray-200 ${theme.text}`}>
              {categoryData.name}
            </h1>
            <p className="text-gray-500 text-sm font-medium hidden md:block">
              Acompanhe a cobertura completa e as últimas atualizações.
            </p>
         </div>
      </div>

      {/* --- AQUI ENTRA A BARRA DE ÚLTIMAS NOTÍCIAS --- */}
      <div className="max-w-7xl mx-auto px-4">
          <LatestNewsTicker posts={tickerPosts} theme={theme} />
      </div>
      {/* ----------------------------------------------- */}

      {/* CONTEÚDO PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10 mt-8">
         
         <div className="lg:col-span-8">
            <Link href={`/noticia/${heroPost.slug}`} className="group mb-12 block border-b border-gray-200 pb-12 bg-white p-6 shadow-sm border border-gray-100 hover:border-gray-300 transition-colors">
                {heroPost._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                    <div className="w-full aspect-video overflow-hidden mb-5 relative">
                        <img 
                          src={heroPost._embedded['wp:featuredmedia'][0].source_url} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                )}
                <h2 className={`text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight group-hover:underline ${theme.decoration} ${theme.hover} transition-colors`} 
                    dangerouslySetInnerHTML={{ __html: heroPost.title.rendered }} 
                />
                <div className="text-lg text-gray-600 leading-relaxed line-clamp-3" 
                     dangerouslySetInnerHTML={{ __html: heroPost.excerpt.rendered }} 
                />
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                {mainList.map(post => (
                    <Link key={post.id} href={`/noticia/${post.slug}`} className="group block bg-white p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                        <div className={`w-full h-1 bg-gray-100 mb-4 group-hover:${theme.bg} transition-colors duration-300`}></div>
                        
                        {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                           <div className="w-full h-40 overflow-hidden mb-3">
                              <img src={post._embedded['wp:featuredmedia'][0].source_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform"/>
                           </div>
                        )}

                        <h3 className={`text-xl font-bold text-gray-900 leading-snug group-hover:text-gray-600 transition-colors`} 
                            dangerouslySetInnerHTML={{ __html: post.title.rendered }} 
                        />
                        <p className="text-sm text-gray-500 mt-3 line-clamp-3" 
                           dangerouslySetInnerHTML={{ __html: post.excerpt.rendered.replace(/<[^>]*>?/gm, '') }} 
                        />
                    </Link>
                ))}
            </div>
         </div>

         <div className="lg:col-span-4 border-l border-gray-200 pl-0 lg:pl-10">
            <div className="sticky top-24">
                <h4 className="font-bold uppercase tracking-widest text-xs text-gray-400 mb-6 border-b border-gray-200 pb-2">
                  Em Destaque
                </h4>
                
                <div className="flex flex-col gap-6">
                    {sidebarList.map((post) => (
                        <Link key={post.id} href={`/noticia/${post.slug}`} className="flex gap-4 group bg-white p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all items-start">
                            <span className={`font-bold ${theme.text} text-2xl leading-none mt-[-2px]`}>&bull;</span>
                            
                            <div>
                               <h4 className="text-md font-bold text-gray-800 group-hover:underline leading-snug" 
                                   dangerouslySetInnerHTML={{ __html: post.title.rendered }} 
                               />
                               <span className="text-[10px] uppercase font-bold text-gray-400 mt-2 block">
                                 {new Date(post.date).toLocaleDateString('pt-BR')}
                               </span>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-10 w-full h-[300px] bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-xs font-bold uppercase">
                    [ Publicidade 300x250 ]
                </div>
            </div>
         </div>

      </div>
    </main>
  );
}