import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="w-full bg-[#06aa48] text-white pt-12 pb-8 mt-10">
      <div className="max-w-[1280px] mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* LOGO */}
        <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center gap-1 group mb-2">
                <span className="text-white font-black text-4xl tracking-tighter italic">ROTA</span>
                <div className="bg-white text-[#06aa48] font-black text-2xl px-2 rounded transform -skew-x-12">62</div>
            </Link>
            <p className="text-sm opacity-80">O seu portal de notícias em tempo real.</p>
        </div>

        {/* LINKS */}
        <div className="flex gap-6 text-xs font-bold uppercase tracking-wider opacity-90">
            <Link href="/politica-de-privacidade" className="hover:underline">Política de Privacidade</Link>
            <Link href="/termos-de-uso" className="hover:underline">Termos de Uso</Link>
            <Link href="/anuncie" className="hover:underline">Anuncie Conosco</Link>
        </div>
      </div>
      
      <div className="max-w-[1280px] mx-auto px-4 mt-8 pt-8 border-t border-white/20 text-center text-[10px] opacity-60">
        © 2026 Portal Rota 62. Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;