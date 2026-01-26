const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL as string;

async function fetchAPI(query: string, { variables }: any = {}) {
  const headers = { 'Content-Type': 'application/json' };
  
  // Log para sabermos o que está sendo pedido
  console.log(`[API] Buscando dados... URL: ${API_URL}`);

  const res = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });

  // AQUI É A TRAVA DE SEGURANÇA:
  // Antes de tentar ler como JSON, pegamos como texto para verificar
  const text = await res.text();

  // Tenta converter para JSON. Se falhar, mostra o erro real.
  try {
    const json = JSON.parse(text);
    
    if (json.errors) {
      console.error('[API] Erro retornado pelo GraphQL:', json.errors);
      throw new Error('Erro no GraphQL');
    }
    return json.data;
  } catch (error) {
    console.error('\n!!! ERRO GRAVE DE API !!!');
    console.error('O WordPress não retornou JSON. Ele retornou isto:');
    console.error(text.substring(0, 500)); // Mostra os primeiros 500 caracteres do erro
    console.error('-------------------------\n');
    throw new Error('API retornou HTML inválido (Verifique o terminal)');
  }
}

// Busca todos os posts (Para a Home)
export async function getPosts() {
  const data = await fetchAPI(`
    query GetPosts {
      posts(first: 20) {
        nodes {
          slug
          title
          excerpt
          featuredImage {
            node {
              sourceUrl
            }
          }
        }
      }
    }
  `);
  return data?.posts?.nodes || [];
}

// Busca um post único (Para a Página Interna)
export async function getPostBySlug(slug: string) {
  const data = await fetchAPI(
    `
    query GetPostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        title
        content
        date
        author {
          node {
            name
          }
        }
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  `,
    { variables: { slug } }
  );
  return data?.post;
}