import { getPostBySlug } from '../../lib/api';
import Link from 'next/link';

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  // ESPIÃO:
  console.log('--- ABRINDO NOTÍCIA ---');
  
  const { slug } = await params;
  console.log('Slug:', slug);

  const post = await getPostBySlug(slug);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <h1 className="text-2xl font-bold text-red-600">Notícia não encontrada</h1>
        <p className="text-gray-600 mb-4">O sistema buscou por: "{slug}"</p>
        <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded">Voltar</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b py-4 px-6 mb-8">
        <Link href="/" className="text-blue-600 font-bold">&larr; Voltar</Link>
      </div>
      <article className="max-w-3xl mx-auto bg-white p-8 rounded shadow">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="prose lg:prose-xl" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </main>
  );
}