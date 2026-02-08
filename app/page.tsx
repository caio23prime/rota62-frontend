'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import Header from '@/components/Header';
import TrafficTicker from '@/components/TrafficTicker';
import WeatherWidget from '@/components/WeatherWidget';
import { Search, Menu, User, ChevronRight, PlayCircle, Clock, TrendingUp, TrendingDown, MapPin, AlignJustify, Eye, MessageCircle, Share2, Flame, Cloud, CloudRain, Sun, Wind, Zap, CloudSnow, Bell, Mail, BarChart3, Navigation, AlertTriangle, Facebook, Instagram, Twitter, Youtube, Phone, MapPinIcon, ChevronUp, Linkedin } from 'lucide-react';

// --- CONFIGURAÇÃO VISUAL ---
const THEME = {
  goias: { color: '#c4170c', label: 'Goiás' },
  politica: { color: '#0f216b', label: 'Poder' },
  esporte: { color: '#06aa48', label: 'Esporte' },
  entret: { color: '#f78320', label: 'Entretenimento' },
  policia: { color: '#b91c1c', label: 'Polícia' },
  cidades: { color: '#0891b2', label: 'Cidades' },
  agro: { color: '#166534', label: 'Agro' }
};

// --- IMAGENS REALISTAS (Unsplash) ---
const getNewsImg = (category: string, id: number) => {
  const images: Record<string, string[]> = {
    politica: [
      'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1555421689-d68471e189f2?w=800&h=600&fit=crop'
    ],
    goias: [
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&h=600&fit=crop'
    ],
    esporte: [
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=600&fit=crop'
    ],
    entret: [
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop'
    ],
    agro: [
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&h=600&fit=crop'
    ],
    cidades: [
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=600&fit=crop'
    ]
  };
  const categoryImages = images[category] || images.goias;
  return categoryImages[id % categoryImages.length];
};

const MOCK_DATA = {
  hero: {
    id: 1,
    title: "Governo de Goiás anuncia R$ 3 bi para infraestrutura e promete 'maior obra da história'",
    subtitle: "Pacote inclui duplicação de rodovias estaduais e construção de novos hospitais no interior; capital e aparecida terão foco em mobilidade.",
    category: "politica",
    image: getNewsImg('politica', 0),
    author: "Redação",
    time: "Há 10 min",
    slug: "governo-goias-anuncia-3bi-infraestrutura"
  },
  heroSide: [
    { id: 2, title: "Acidente trava T-63: Carro bate em poste e deixa trânsito lento no Bueno", category: "cidades", image: getNewsImg('cidades', 0), slug: "acidente-t63-bueno" },
    { id: 3, title: "Goiás vira sobre o Vila Nova nos acréscimos e lidera o Goianão", category: "esporte", image: getNewsImg('esporte', 0), slug: "goias-vira-vila-nova" },
    { id: 4, title: "Gusttavo Lima anuncia show extra em Goiânia para março", category: "entret", image: getNewsImg('entret', 0), slug: "gusttavo-lima-show-goiania" },
    { id: 5, title: "Safra de soja bate recorde e coloca Goiás no topo do ranking nacional", category: "agro", image: getNewsImg('agro', 0), slug: "safra-soja-recorde" }
  ],
  goias: Array(12).fill(0).map((_, i) => ({
    id: 100 + i,
    title: [
      "Feira Hippie funciona neste feriado; confira os horários especiais",
      "Chuva forte alaga ruas e derruba árvores em Aparecida",
      "Prefeitura inicia recapeamento em 50 ruas da região Norte",
      "Novo parque ambiental é entregue à população no Setor Oeste",
      "Goiânia terá novo terminal de ônibus no Setor Sul",
      "Moradores reclamam de falta d'água em bairros da capital",
      "Obra da Marginal Botafogo deve ser concluída em março",
      "Shopping popular será inaugurado no Centro",
      "Trânsito muda na Av. Goiás a partir de segunda-feira",
      "Parque Vaca Brava recebe melhorias e nova iluminação",
      "Defesa Civil alerta para risco de deslizamentos",
      "Mutirão de limpeza remove 50 toneladas de lixo"
    ][i],
    category: "goias",
    image: getNewsImg('goias', i),
    time: `Há ${i + 1}h`,
    slug: `goias-noticia-${i + 1}`
  })),
  politica: Array(8).fill(0).map((_, i) => ({
    id: 200 + i,
    title: [
      "Câmara aprova isenção de IPVA para motos",
      "Deputados debatem novo plano diretor",
      "Governador visita obras no interior",
      "Secretário de saúde anuncia novos leitos",
      "Reforma administrativa é enviada à assembleia",
      "Oposição questiona gastos com publicidade",
      "Prefeito anuncia concurso público para 2026",
      "Assembleia vota projeto de segurança pública"
    ][i],
    category: "politica",
    image: getNewsImg('politica', i),
    slug: `politica-noticia-${i + 1}`
  })),
  esporte: Array(10).fill(0).map((_, i) => ({
    id: 300 + i,
    title: [
      "Atlético-GO contrata atacante ex-Flamengo",
      "Goiânia Arena recebe final do vôlei nacional",
      "Tabela do Goianão: Veja os próximos jogos",
      "Vila Nova anuncia novo patrocinador master",
      "Goiás treina forte para clássico decisivo",
      "Atlético-GO vence e se aproxima do G-4",
      "Seleção feminina de vôlei treina em Goiânia",
      "Maratona de Goiânia tem recorde de inscritos",
      "Basquete: Goiás Esporte Clube vence rival",
      "Futsal: Final estadual será em Anápolis"
    ][i],
    image: getNewsImg('esporte', i),
    category: "esporte",
    slug: `esporte-noticia-${i + 1}`
  })),
  entret: Array(8).fill(0).map((_, i) => ({
    id: 400 + i,
    title: [
      "Gusttavo Lima anuncia show extra em Goiânia",
      "Festival Villa Mix confirma data para 2026",
      "Roteiro: Onde comer a melhor pamonha",
      "Cinema: Confira as estreias da semana",
      "Teatro: Peça goiana estreia no Centro Cultural",
      "Exposição de arte contemporânea abre hoje",
      "Feira do Cerrado reúne artesanato local",
      "Show de Jorge e Mateus esgota ingressos"
    ][i],
    image: getNewsImg('entret', i),
    category: "entret",
    slug: `entretenimento-noticia-${i + 1}`
  })),
  agro: Array(6).fill(0).map((_, i) => ({
    id: 500 + i,
    title: [
      "Safra de soja em Goiás deve bater recorde histórico",
      "Tecnoshow Comigo espera movimentar R$ 10 bi",
      "Preço da arroba do boi gordo sobe no estado",
      "Produtores investem em irrigação para milho",
      "Exportação de grãos cresce 15% em 2026",
      "Agro goiano lidera ranking nacional de produtividade"
    ][i],
    image: getNewsImg('agro', i),
    category: "agro",
    slug: `agro-noticia-${i + 1}`
  })),
  cidades: Array(8).fill(0).map((_, i) => ({
    id: 600 + i,
    title: [
      "Novo viaduto será construído na Av. T-63",
      "Anápolis inaugura centro de triagem de lixo",
      "Aparecida de Goiânia amplia rede de saúde",
      "Rio Verde bate recorde de arrecadação",
      "Luziânia recebe investimento em segurança",
      "Trindade planeja novo parque ecológico",
      "Senador Canedo expande transporte público",
      "Catalão anuncia obras de saneamento"
    ][i],
    image: getNewsImg('cidades', i),
    category: "cidades",
    slug: `cidades-noticia-${i + 1}`
  })),
  mostRead: Array(5).fill(0).map((_, i) => ({
    id: 700 + i,
    title: [
      "Mega-Sena acumula e prêmio vai a R$ 50 milhões",
      "Vídeo: Cachorro salva criança de afogamento",
      "Previsão: Chuva forte volta a Goiás na próxima semana",
      "Influencer goiana viraliza com vídeo de receita",
      "Polícia prende quadrilha que roubava carros"
    ][i],
    views: `${(i + 1) * 12}k`,
    slug: `mais-lidas-${i + 1}`
  })),
  weather: {
    current: { temp: 29, condition: 'sun', city: 'Goiânia' },
    forecast: [
      { day: 'SEG', high: 31, low: 22, condition: 'sun' },
      { day: 'TER', high: 30, low: 21, condition: 'cloud' },
      { day: 'QUA', high: 28, low: 20, condition: 'rain' },
      { day: 'QUI', high: 27, low: 19, condition: 'storm' },
      { day: 'SEX', high: 29, low: 21, condition: 'cloud' }
    ],
    alert: { active: true, message: "Alerta de chuva forte para amanhã" }
  },
  market: [
    { name: 'Dólar', value: 'R$ 5,02', change: '+0,5%', trend: 'up', graph: [4.95, 4.98, 5.00, 5.02] },
    { name: 'Euro', value: 'R$ 5,45', change: '-0,2%', trend: 'down', graph: [5.50, 5.48, 5.46, 5.45] },
    { name: 'Boi Gordo', value: 'R$ 312/@', change: '+1,2%', trend: 'up', graph: [305, 308, 310, 312] }
  ],
  traffic: [
    { route: 'Av. T-63', status: 'slow', time: '25 min', color: 'red' },
    { route: 'Av. 85', status: 'normal', time: '8 min', color: 'green' },
    { route: 'BR-153', status: 'slow', time: '18 min', color: 'orange' },
    { route: 'Marginal Botafogo', status: 'normal', time: '5 min', color: 'green' }
  ],
  poll: {
    question: "Você aprova a gestão do governador?",
    options: [
      { label: 'Sim', votes: 1240, percentage: 45 },
      { label: 'Não', votes: 1380, percentage: 50 },
      { label: 'Não sei', votes: 140, percentage: 5 }
    ],
    totalVotes: 2760
  }
};

const NewsCard = ({ post, size = 'md' }: { post: any, size?: 'sm' | 'md' | 'lg' }) => (
  <Link href={`/${post.slug}`} className="group cursor-pointer block">
    <div className={`${size === 'lg' ? 'aspect-[16/10]' : size === 'md' ? 'aspect-video' : 'aspect-[4/3]'} rounded-lg overflow-hidden mb-2 relative bg-gray-200`}>
      <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      {post.time && <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[9px] font-bold px-2 py-0.5 rounded">{post.time}</span>}
    </div>
    <h3 className={`${size === 'lg' ? 'text-lg' : size === 'md' ? 'text-sm' : 'text-xs'} font-bold leading-tight group-hover:text-[#06aa48] transition-colors line-clamp-3`}>
      {post.title}
    </h3>
  </Link>
);

// 🚀 SIDEBAR COMPACTA (COM DADOS REAIS)
const CompactSidebar = () => {
  const [pollVoted, setPollVoted] = useState<number | null>(null);
  const [marketData, setMarketData] = useState<any[]>([]);
  const [trafficData, setTrafficData] = useState<any[]>([]);

  useEffect(() => {
    // 1. Buscar Financeiro
    fetch('/api/finance')
      .then(res => res.json())
      .then(data => {
        if (data.mercado) setMarketData(data.mercado);
      })
      .catch(err => console.error("Erro financeiro:", err));

    // 2. Buscar Trânsito (Waze)
    fetch('/api/waze')
      .then(res => res.json())
      .then(data => {
        if (data.dados?.lista_mista) {
          // Pegar os 4 primeiros alertas relevantes
          const alertas = data.dados.lista_mista.slice(0, 5).map((item: any) => ({
            route: item.titulo, // Ex: "ACIDENTE"
            status: item.texto, // Ex: "Marginal Botafogo - Sentido Centro"
            time: item.atraso || "Agora",
            color: item.type === 'waze' ? 'red' : 'green'
          }));
          setTrafficData(alertas);
        }
      })
      .catch(err => console.error("Erro trânsito:", err));
  }, []);

  return (
    <aside className="w-full lg:w-80 shrink-0 space-y-4 sticky top-4">

      {/* PREVISÃO DO TEMPO COM DADOS REAIS E ALERTAS DA DEFESA CIVIL */}
      <WeatherWidget />

      {/* COTAÇÕES (DADOS REAIS OU MOCK SE FALHAR) */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 flex items-center gap-2">
          <BarChart3 size={18} />
          <h3 className="font-black uppercase text-sm">Cotações</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {(marketData.length > 0 ? marketData : MOCK_DATA.market).map((item, i) => (
            <div key={i} className="p-3 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-xs font-bold text-gray-600">{item.name}</p>
                  <p className="text-lg font-black text-gray-900">{item.value}</p>
                </div>
                <span className={`text-xs font-black px-2 py-1 rounded ${item.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {item.change}
                </span>
              </div>
              <div className="flex gap-1 h-8 items-end">
                {item.graph.map((val: number, idx: number) => (
                  <div key={idx} className="flex-1 bg-gray-200 rounded-t relative overflow-hidden">
                    <div
                      className={`absolute bottom-0 w-full ${item.trend === 'up' ? 'bg-green-500' : 'bg-red-500'} transition-all`}
                      style={{ height: `${(val / Math.max(...item.graph)) * 100}%` }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TRÂNSITO (DADOS REAIS WAZE) */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="bg-gray-900 text-white px-4 py-3 flex items-center gap-2">
          <Navigation size={18} />
          <h3 className="font-black uppercase text-sm">Trânsito Agora</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {(trafficData.length > 0 ? trafficData : MOCK_DATA.traffic).map((route, i) => (
            <div key={i} className="p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors">
              <div className={`w-3 h-3 rounded-full shrink-0 ${route.color === 'green' ? 'bg-green-500' :
                route.color === 'orange' ? 'bg-orange-500' :
                  'bg-red-500'
                } animate-pulse`}></div>
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-900 line-clamp-1">{route.route}</p>
                <p className="text-[10px] text-gray-500 line-clamp-2">{route.status}</p>
              </div>
              <span className="text-xs font-black text-gray-600 whitespace-nowrap">{route.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* MAIS LIDAS */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="bg-[#c4170c] text-white px-4 py-3 flex items-center gap-2">
          <Flame size={18} />
          <h3 className="font-black uppercase text-sm">Mais Lidas</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {MOCK_DATA.mostRead.map((item, i) => (
            <Link key={item.id} href={`/${item.slug}`} className="flex gap-3 p-3 hover:bg-gray-50 transition-colors group">
              <span className="text-2xl font-black text-gray-200 w-6">{i + 1}</span>
              <div className="flex-1">
                <h4 className="text-xs font-bold leading-tight group-hover:text-[#c4170c] transition-colors line-clamp-2">{item.title}</h4>
                <div className="flex items-center gap-2 mt-1 text-[9px] text-gray-400">
                  <Eye size={10} /> {item.views}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ENQUETE */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="bg-purple-600 text-white px-4 py-3">
          <h3 className="font-black uppercase text-sm">Enquete</h3>
        </div>
        <div className="p-4">
          <p className="text-sm font-bold text-gray-900 mb-4">{MOCK_DATA.poll.question}</p>
          <div className="space-y-2 mb-3">
            {MOCK_DATA.poll.options.map((option, i) => (
              <button
                key={i}
                onClick={() => setPollVoted(i)}
                disabled={pollVoted !== null}
                className={`w-full text-left p-3 rounded-lg border-2 transition-all relative overflow-hidden ${pollVoted === i ? 'border-purple-600 bg-purple-50' :
                  pollVoted !== null ? 'border-gray-200 bg-gray-50' :
                    'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                  }`}
              >
                {pollVoted !== null && (
                  <div
                    className="absolute inset-0 bg-purple-100 transition-all duration-500"
                    style={{ width: `${option.percentage}%` }}
                  ></div>
                )}
                <div className="relative flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-900">{option.label}</span>
                  {pollVoted !== null && (
                    <span className="text-xs font-black text-purple-700">{option.percentage}%</span>
                  )}
                </div>
              </button>
            ))}
          </div>
          {pollVoted !== null && (
            <p className="text-[10px] text-gray-500 text-center">{MOCK_DATA.poll.totalVotes.toLocaleString()} votos</p>
          )}
        </div>
      </div>

      {/* PUBLICIDADE */}
      <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center text-gray-400 text-sm font-bold border border-gray-200">
        PUBLICIDADE
      </div>

    </aside>
  );
};

// 🦶 RODAPÉ PREMIUM
const PremiumFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white mt-20">
      <div className="max-w-[1240px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

          <div>
            <Link href="/">
              <Logo variant="light" size="md" className="mb-4" />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              O portal de notícias mais completo de Goiás. Informação de qualidade, 24 horas por dia.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#06aa48] transition-colors group">
                <Facebook size={18} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#06aa48] transition-colors group">
                <Instagram size={18} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#06aa48] transition-colors group">
                <Twitter size={18} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#06aa48] transition-colors group">
                <Youtube size={18} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#06aa48] transition-colors group">
                <Linkedin size={18} className="group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase mb-4 text-[#06aa48]">Editorias</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Goiás</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Política</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Esporte</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Entretenimento</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Agro & Negócios</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Cidades</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase mb-4 text-[#06aa48]">Institucional</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Sobre Nós</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Equipe</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Trabalhe Conosco</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Anuncie</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Fale Conosco</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Política de Privacidade</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase mb-4 text-[#06aa48]">Contato</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <Mail size={16} className="shrink-0 mt-0.5 text-[#06aa48]" />
                <a href="mailto:contato@rota62.com.br" className="hover:text-white transition-colors">
                  contato@rota62.com.br
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={16} className="shrink-0 mt-0.5 text-[#06aa48]" />
                <a href="tel:+556233334444" className="hover:text-white transition-colors">
                  (62) 3333-4444
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPinIcon size={16} className="shrink-0 mt-0.5 text-[#06aa48]" />
                <span>
                  Av. Goiás, 1000<br />
                  Setor Central, Goiânia-GO
                </span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-[1240px] mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © 2026 Rota 62. Todos os direitos reservados.
          </p>
          <div className="flex gap-4 text-xs text-gray-500">
            <Link href="#" className="hover:text-white transition-colors">Termos de Uso</Link>
            <span>•</span>
            <Link href="#" className="hover:text-white transition-colors">Política de Privacidade</Link>
            <span>•</span>
            <Link href="#" className="hover:text-white transition-colors">Política de Cookies</Link>
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-xs font-bold text-[#06aa48] hover:text-white transition-colors group"
          >
            <ChevronUp size={16} className="group-hover:-translate-y-1 transition-transform" />
            VOLTAR AO TOPO
          </button>
        </div>
      </div>
    </footer>
  );
};


export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header />
      <TrafficTicker />

      <main className="max-w-[1240px] mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">

        <div className="flex-1 space-y-12">

          {/* HERO */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 group cursor-pointer relative overflow-hidden rounded-lg shadow-lg">
              <Link href={`/${MOCK_DATA.hero.slug}`}>
                <img src={MOCK_DATA.hero.image} alt={MOCK_DATA.hero.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-x-0 bottom-0 pt-20 pb-6 px-6 bg-gradient-to-t from-black/95 to-transparent flex flex-col justify-end">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight mb-2">
                    {MOCK_DATA.hero.title}
                  </h1>
                  <p className="hidden md:block text-gray-200 text-sm line-clamp-2">{MOCK_DATA.hero.subtitle}</p>
                </div>
              </Link>
            </div>
            {MOCK_DATA.heroSide.slice(0, 2).map((post) => (
              <div key={post.id} className="relative group cursor-pointer h-64 lg:h-full rounded-lg overflow-hidden shadow-lg">
                <Link href={`/${post.slug}`}>
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[9px] font-black uppercase bg-[#c4170c] px-2 py-1 rounded mb-2 inline-block shadow-sm">
                      {post.category}
                    </span>
                    <h3 className="text-base font-bold leading-tight shadow-sm">{post.title}</h3>
                  </div>
                </Link>
              </div>
            ))}
          </section>

          {/* DESTAQUES EXTRAS */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_DATA.heroSide.slice(2, 4).map((post) => (
              <div key={post.id} className="relative group cursor-pointer h-64 rounded-lg overflow-hidden shadow-lg">
                <Link href={`/${post.slug}`}>
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] font-black uppercase bg-[#c4170c] px-2 py-1 rounded mb-2 inline-block">
                      {post.category}
                    </span>
                    <h3 className="text-lg font-bold leading-tight">{post.title}</h3>
                  </div>
                </Link>
              </div>
            ))}
          </section>

          {/* RADAR GOIÁS */}
          <section>
            <div className="flex items-center justify-between mb-6 border-b-4 border-[#c4170c] pb-2">
              <h2 className="text-2xl font-black text-[#c4170c] uppercase">Radar Goiás</h2>
              <Link href="/radar-goias" className="text-xs font-bold text-gray-500 hover:text-[#c4170c]">VER TUDO →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_DATA.goias.slice(0, 6).map(post => (
                <NewsCard key={post.id} post={post} size="md" />
              ))}
            </div>
          </section>

          {/* POLÍTICA */}
          <section>
            <div className="flex items-center justify-between mb-6 border-b-4 border-[#0f216b] pb-2">
              <h2 className="text-2xl font-black text-[#0f216b] uppercase">Política</h2>
              <Link href="/politica" className="text-xs font-bold text-gray-500 hover:text-[#0f216b]">VER TUDO →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_DATA.politica.slice(0, 6).map(post => (
                <NewsCard key={post.id} post={post} size="md" />
              ))}
            </div>
          </section>

          {/* ESPORTE */}
          <section className="bg-black text-white rounded-xl overflow-hidden shadow-lg">
            <div className="bg-[#06aa48] px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase">Esporte</h2>
              <Link href="/esporte" className="text-xs font-bold uppercase">Ver Tudo →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {MOCK_DATA.esporte.slice(0, 6).map(post => (
                <Link key={post.id} href={`/${post.slug}`} className="group cursor-pointer">
                  <div className="w-full aspect-video rounded bg-gray-800 mb-3 overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:opacity-90 transition-all" />
                  </div>
                  <h3 className="text-sm font-bold leading-snug text-gray-200 group-hover:text-[#06aa48] line-clamp-2">{post.title}</h3>
                </Link>
              ))}
            </div>
          </section>

          {/* ENTRETENIMENTO */}
          <section>
            <div className="flex items-center justify-between mb-6 border-b-4 border-[#f78320] pb-2">
              <h2 className="text-2xl font-black text-[#f78320] uppercase">Entretenimento</h2>
              <Link href="/entretenimento" className="text-xs font-bold text-gray-500 hover:text-[#f78320]">VER TUDO →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_DATA.entret.slice(0, 6).map(post => (
                <NewsCard key={post.id} post={post} size="md" />
              ))}
            </div>
          </section>


          {/* AUTO & TECH */}
          <section>
            <div className="flex items-center justify-between mb-6 border-b-4 border-[#3b82f6] pb-2">
              <h2 className="text-2xl font-black text-[#3b82f6] uppercase">Auto & Tech</h2>
              <Link href="/auto-tech" className="text-xs font-bold text-gray-500 hover:text-[#3b82f6]">VER TUDO →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_DATA.agro.slice(0, 6).map(post => (
                <NewsCard key={post.id} post={post} size="md" />
              ))}
            </div>
          </section>

          {/* ECONOMIA */}
          <section>
            <div className="flex items-center justify-between mb-6 border-b-4 border-[#166534] pb-2">
              <h2 className="text-2xl font-black text-[#166534] uppercase">Economia</h2>
              <Link href="/economia" className="text-xs font-bold text-gray-500 hover:text-[#166534]">VER TUDO →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_DATA.agro.slice(0, 6).map(post => (
                <NewsCard key={post.id} post={post} size="md" />
              ))}
            </div>
          </section>

          {/* BRASIL */}
          <section>
            <div className="flex items-center justify-between mb-6 border-b-4 border-[#15803d] pb-2">
              <h2 className="text-2xl font-black text-[#15803d] uppercase">Brasil</h2>
              <Link href="/brasil" className="text-xs font-bold text-gray-500 hover:text-[#15803d]">VER TUDO →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_DATA.cidades.slice(0, 6).map(post => (
                <NewsCard key={post.id} post={post} size="md" />
              ))}
            </div>
          </section>

          {/* MUNDO */}
          <section>
            <div className="flex items-center justify-between mb-6 border-b-4 border-[#0891b2] pb-2">
              <h2 className="text-2xl font-black text-[#0891b2] uppercase">Mundo</h2>
              <Link href="/mundo" className="text-xs font-bold text-gray-500 hover:text-[#0891b2]">VER TUDO →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_DATA.cidades.slice(0, 6).map(post => (
                <NewsCard key={post.id} post={post} size="md" />
              ))}
            </div>
          </section>

        </div>

        <CompactSidebar />

      </main>

      <PremiumFooter />
    </div>
  );
}