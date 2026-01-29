import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';

// --- TIPAGEM ---
interface Post {
  id: number;
  date: string;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string; alt_text: string }>;
    'author'?: Array<{ name: string }>;
    'wp:term'?: Array<Array<{ name: string; slug: string }>>;
  };
}

// --- FUNÇÕES DE BUSCA (DATA FETCHING) ---

// 1. Busca a notícia atual
async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(`https://admin.rota62go.com.br/wp-json/wp/v2/posts?slug=${slug}&_embed`, {
      next: { revalidate: 60 },
    });
    const posts = await res.json();
    return posts.length > 0 ? posts[0] : null;
  } catch (error) {
    return null;
  }
}

// 2. Busca notícias para a Sidebar e "Leia Também"
async function getLatestPosts(excludeId: number): Promise<Post[]> {
  try {
    // Busca 6 posts para ter material para sidebar e rodapé
    const res = await fetch(`https://admin.rota62go.com.br/wp-json/wp/v2/posts?per_page=6&exclude=${excludeId}&_embed`, {
      next: { revalidate: 60 },
    });
    return await res.json();
  } catch (error) {
    return [];
  }
}

// --- COMPONENTE DA PÁGINA ---
export default async function NewsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Busca dados principais
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Busca posts extras (removendo o atual da lista)
  const relatedPosts = await getLatestPosts(post.id);
  
  // Separa: 3 para Sidebar, 3 para "Leia Também" no final
  const sidebarPosts = relatedPosts.slice(0, 3);
  const footerPosts = relatedPosts.slice(3, 6);

  // Dados formatados
  const title = post.title.rendered;
  const content = post.content.rendered;
  const date = new Date(post.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const author = post._embedded?.author?.[0]?.name || 'Redação Rota 62';
  const category = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Notícias';
  const categorySlug = post._embedded?.['wp:term']?.[0]?.[0]?.slug || 'ultimas-noticias';
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;

  return (
    <main className="min-h-screen bg-[#f9f9f9] font-sans pb-20">
      <Header />

      {/* Container Principal */}
      <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* --- COLUNA ESQUERDA: NOTÍCIA (Ocupa 8 de 12 colunas) --- */}
        <article className="lg:col-span-8 bg-white p-6 md:p-10 rounded-xl shadow-sm border border-gray-100">
          
          {/* Breadcrumb */}
          <nav className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider flex items-center gap-2">
            <Link href="/" className="hover:text-red-600 transition-colors">Home</Link> 
            <span>/</span>
            <Link href={`/${categorySlug}`} className="text-red-600 hover:underline">{category}</Link>
          </nav>

          {/* Título e Meta-dados */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4" dangerouslySetInnerHTML={{ __html: title }} />
            
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-gray-100 text-sm text-gray-500">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-lg">
                    {author.charAt(0)}
                 </div>
                 <div className="flex flex-col">
                    <span className="font-bold text-gray-900">{author}</span>
                    <time className="text-xs">{date}</time>
                 </div>
              </div>
              
              {/* Botões Mockup de Compartilhamento */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase mr-2 hidden sm:inline">Compartilhar:</span>
                <button className="bg-[#25D366] text-white p-2 rounded-full hover:opacity-90"><svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.587 1.968.953 3.016.953 3.106 0 5.689-2.587 5.689-5.766 0-3.181-2.583-5.768-5.768-5.768zm9.263 4.98c-.1-1.308-.535-3.86-1.721-5.718-1.076-1.685-3.047-2.912-4.991-3.109C12.396 2.08 7.377 2.08 7.377 2.08s-1.558.053-2.614.364c-2.385.702-4.043 2.15-4.57 2.659L.085 5.207c2.811-3.197 5.922-4.103 8.356-4.209 1.155-.05 7.152-.05 7.152-.05s6.462.062 9.779 4.144c.465.572 1.393 2.019 1.624 3.09l-5.694 2.97z"/></svg></button>
                <button className="bg-[#1877F2] text-white p-2 rounded-full hover:opacity-90"><svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></button>
              </div>
            </div>
          </header>

          {/* Imagem Destacada */}
          {featuredImage && (
            <figure className="mb-10 rounded-lg overflow-hidden relative group">
              <img src={featuredImage} alt={title} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" />
            </figure>
          )}

          {/* CONTEÚDO DA NOTÍCIA */}
          <div 
            className="prose prose-lg max-w-none text-gray-800 leading-relaxed
            prose-headings:font-bold prose-headings:text-gray-900 
            prose-a:text-red-700 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-img:shadow-md prose-img:my-8
            prose-blockquote:border-l-4 prose-blockquote:border-red-600 prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:italic
            [&>p]:mb-6 [&>iframe]:w-full [&>iframe]:rounded-lg [&>iframe]:aspect-video"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          
          {/* Seção "Leia Também" (Abaixo do texto) */}
          <div className="mt-16 pt-10 border-t-2 border-gray-100">
            <h3 className="text-xl font-black uppercase text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-red-600 block"></span>
              Leia Também
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {footerPosts.map(p => (
                 <Link key={p.id} href={`/noticia/${p.slug}`} className="group block">
                    <div className="aspect-video bg-gray-200 rounded-lg mb-3 overflow-hidden">
                       {p._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                         <img src={p._embedded['wp:featuredmedia'][0].source_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                       )}
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-red-600 transition-colors line-clamp-3" dangerouslySetInnerHTML={{ __html: p.title.rendered }} />
                 </Link>
              ))}
            </div>
          </div>

        </article>


        {/* --- COLUNA DIREITA: SIDEBAR (Ocupa 4 de 12 colunas) --- */}
        <aside className="lg:col-span-4 flex flex-col gap-10">
          
          {/* Widget: Publicidade */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[300px] text-center">
             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Publicidade</span>
             <div className="w-full h-full bg-gray-100 rounded border border-dashed border-gray-300 flex items-center justify-center p-10">
                <p className="text-gray-400 font-bold">Espaço para Banner<br/>300x250</p>
             </div>
          </div>

          {/* Widget: Últimas Notícias */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="bg-gray-900 text-white px-6 py-4">
                <h3 className="font-bold uppercase tracking-wider text-sm">Últimas Notícias</h3>
             </div>
             <div className="divide-y divide-gray-100">
                {sidebarPosts.map((post, idx) => (
                   <Link key={post.id} href={`/noticia/${post.slug}`} className="flex gap-4 p-4 hover:bg-gray-50 transition-colors group">
                      <span className="text-2xl font-black text-gray-200 group-hover:text-red-600 transition-colors">{idx + 1}</span>
                      <div className="flex flex-col">
                         <span className="text-[10px] uppercase font-bold text-red-600 mb-1">
                            {post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Geral'}
                         </span>
                         <h4 className="text-sm font-bold text-gray-800 leading-snug group-hover:underline" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                      </div>
                   </Link>
                ))}
             </div>
             <div className="p-4 bg-gray-50 text-center border-t border-gray-100">
                <Link href="/ultimas-noticias" className="text-xs font-bold text-gray-500 hover:text-red-600 uppercase">Ver todas &rarr;</Link>
             </div>
          </div>

        </aside>

      </div>
    </main>
  );
}