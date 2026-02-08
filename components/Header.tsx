'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Menu, X, Search, ChevronRight, User, AlignJustify } from 'lucide-react';
import Logo from './Logo';

// =========================================================
// ATENÇÃO: showExtras define se elementos adicionais aparecem.
// =========================================================
const Header = ({ showExtras = false }: { showExtras?: boolean }) => {
    const [viewData, setViewData] = useState<any>(null);
    const [currentDate, setCurrentDate] = useState<string>("");

    // Estados para Mobile e Busca
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
    const toggleMobileDropdown = (name: string) => setActiveDropdown(activeDropdown === name ? null : name);

    const syncPortal = useCallback(async () => {
        try {
            const res = await fetch('/data/traffic_weather_data.json');
            if (!res.ok) throw new Error("Dados não encontrados");
            const json = await res.json();
            setViewData(json);
        } catch (e) {
            setViewData({
                weather: { temp: 28, humidity: 45, city: "GOIÂNIA" }
            });
        }
    }, []);

    useEffect(() => {
        syncPortal();
        const updateDate = () => {
            const now = new Date();
            const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
            setCurrentDate(now.toLocaleDateString('pt-BR', options).toUpperCase());
        };
        updateDate();
        const timer = setInterval(syncPortal, 300000);
        return () => clearInterval(timer);
    }, [syncPortal]);

    return (
        <div className="flex flex-col w-full shadow-md z-50">
            {/* HEADER COM FUNDO VERDE */}
            <header className="w-full bg-[#009B3A] font-sans border-b-2 border-[#FFD700] relative">
                <div className="max-w-[1240px] mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">

                    {/* LOGO E MENU MOBILE */}
                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
                        <button onClick={toggleMobileMenu} className="p-2 hover:bg-white/10 rounded-full md:hidden text-white">
                            <Menu />
                        </button>
                        <Link href="/">
                            <Logo size="xl" variant="light" />
                        </Link>
                        <div className="md:hidden w-10"></div> {/* Espaçador para centralizar logo no mobile */}
                    </div>

                    {/* BUSCA */}
                    <div className="w-full md:w-1/3 relative hidden md:block">
                        <input
                            type="text"
                            placeholder="Buscar notícias..."
                            className="w-full bg-white/90 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 ring-[#FFD700] transition-all"
                        />
                        <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600" />
                    </div>

                    {/* ACESSO RÁPIDO */}
                    <div className="hidden md:flex items-center gap-4">
                        <button className="text-[10px] font-black text-[#FFD700] hover:text-white transition-colors tracking-tighter">ASSINE POR R$ 1,90</button>
                        <div className="w-px h-4 bg-white/30"></div>
                        <button className="flex items-center gap-1 text-[10px] font-black text-white hover:text-[#FFD700] transition-colors">
                            <User size={14} /> ENTRAR
                        </button>
                    </div>
                </div>

                {/* NAVEGAÇÃO DESKTOP */}
                <nav className="w-full overflow-x-auto no-scrollbar border-t border-white/20 hidden md:block">
                    <div className="max-w-[1240px] mx-auto px-4">
                        <ul className="flex items-center justify-center h-12 gap-6 whitespace-nowrap text-[13px] font-black text-white uppercase tracking-tight">
                            <li className="hover:text-[#FFD700] cursor-pointer flex items-center gap-1 transition-colors">
                                <AlignJustify size={16} /> MENU
                            </li>
                            <li className="hover:text-[#FFD700] cursor-pointer transition-colors">
                                <Link href="/radar-goias">RADAR GOIÁS</Link>
                            </li>
                            <li className="hover:text-[#FFD700] cursor-pointer transition-colors">
                                <Link href="/politica">POLÍTICA</Link>
                            </li>
                            <li className="hover:text-[#FFD700] cursor-pointer transition-colors">
                                <Link href="/esporte">ESPORTE</Link>
                            </li>

                            {/* ENTRETENIMENTO com submenu */}
                            <li className="relative group h-full flex items-center">
                                <button className="hover:text-[#FFD700] cursor-pointer transition-colors flex items-center gap-1 h-full">
                                    ENTRETENIMENTO
                                    <ChevronRight size={14} className="rotate-90 group-hover:rotate-180 transition-transform" />
                                </button>
                                <div className="absolute top-12 left-0 mt-0 bg-white text-gray-900 rounded-b-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[180px] z-50 py-2">
                                    <Link href="/entretenimento" className="block px-4 py-2 hover:bg-[#FFD700] hover:text-black transition-colors font-bold text-xs uppercase">
                                        Ver Tudo
                                    </Link>
                                    <Link href="/entretenimento/eventos" className="block px-4 py-2 hover:bg-[#FFD700] hover:text-black transition-colors text-xs uppercase">
                                        Eventos
                                    </Link>
                                    <Link href="/sertanejo-e-meio" className="block px-4 py-2 hover:bg-[#FFD700] hover:text-black transition-colors rounded-b-lg text-xs uppercase">
                                        Sertanejo & 1/2
                                    </Link>
                                </div>
                            </li>

                            {/* AUTO & TECH com submenu */}
                            <li className="relative group h-full flex items-center">
                                <button className="hover:text-[#FFD700] cursor-pointer transition-colors flex items-center gap-1 h-full">
                                    AUTO & TECH
                                    <ChevronRight size={14} className="rotate-90 group-hover:rotate-180 transition-transform" />
                                </button>
                                <div className="absolute top-12 left-0 mt-0 bg-white text-gray-900 rounded-b-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[180px] z-50 py-2">
                                    <Link href="/auto-tech" className="block px-4 py-2 hover:bg-[#FFD700] hover:text-black transition-colors font-bold text-xs uppercase">
                                        Ver Tudo
                                    </Link>
                                    <Link href="/auto-tech/backstage-geek" className="block px-4 py-2 hover:bg-[#FFD700] hover:text-black transition-colors rounded-b-lg text-xs uppercase">
                                        Backstage Geek
                                    </Link>
                                </div>
                            </li>

                            <li className="hover:text-[#FFD700] cursor-pointer transition-colors">
                                <Link href="/economia">ECONOMIA</Link>
                            </li>
                            <li className="hover:text-[#FFD700] cursor-pointer transition-colors">
                                <Link href="/brasil">BRASIL</Link>
                            </li>
                            <li className="hover:text-[#FFD700] cursor-pointer transition-colors">
                                <Link href="/mundo">MUNDO</Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>

            {/* MENU MOBILE */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black/80 z-[100] md:hidden" onClick={toggleMobileMenu}>
                    <div className="bg-white w-[280px] h-full shadow-2xl p-6 flex flex-col gap-4 animate-slide-in" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center border-b pb-4 mb-4">
                            <Link href="/">
                                <Logo size="md" variant="dark" />
                            </Link>
                            <button onClick={toggleMobileMenu}><X className="text-gray-500" /></button>
                        </div>
                        <Link href="/" className="font-black text-gray-800 hover:text-[#009B3A] uppercase text-sm border-b pb-2">Home</Link>
                        <Link href="/radar-goias" className="font-black text-gray-800 hover:text-[#009B3A] uppercase text-sm border-b pb-2">Radar Goiás</Link>
                        <Link href="/politica" className="font-black text-gray-800 hover:text-[#009B3A] uppercase text-sm border-b pb-2">Política</Link>
                        <Link href="/esporte" className="font-black text-gray-800 hover:text-[#009B3A] uppercase text-sm border-b pb-2">Esporte</Link>
                        <Link href="/entretenimento" className="font-black text-gray-800 hover:text-[#009B3A] uppercase text-sm border-b pb-2">Entretenimento</Link>
                        <Link href="/auto-tech" className="font-black text-gray-800 hover:text-[#009B3A] uppercase text-sm border-b pb-2">Auto & Tech</Link>
                        <Link href="/economia" className="font-black text-gray-800 hover:text-[#009B3A] uppercase text-sm border-b pb-2">Economia</Link>
                        <Link href="/brasil" className="font-black text-gray-800 hover:text-[#009B3A] uppercase text-sm border-b pb-2">Brasil</Link>
                        <Link href="/mundo" className="font-black text-gray-800 hover:text-[#009B3A] uppercase text-sm border-b pb-2">Mundo</Link>
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes slide-in { from { transform: translateX(-100%); } to { transform: translateX(0); } }
                .animate-slide-in { animation: slide-in 0.3s ease-out; }
            `}</style>
        </div>
    );
};

export default Header;
