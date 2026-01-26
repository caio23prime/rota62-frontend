'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';

// --- ÍCONES SOCIAIS (MANTIDOS) ---
const Social = {
    Facebook: () => <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
    Instagram: () => <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.2 4.353 2.62 6.777 6.98 6.977 1.28.057 1.688.072 4.948.072s3.668-.015 4.948-.072c4.351-.2 6.777-2.62 6.977-6.977.058-1.28.072-1.689.072-4.948 0-3.259-.013-3.667-.072-4.947-.196-4.354-2.617-6.78-6.977-6.977C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
    Threads: () => <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M15.428 12.328c.11.413.167.854.167 1.307 0 2.112-1.21 3.57-3.415 3.57-1.47 0-2.47-.79-2.47-1.95 0-1.04.75-1.78 2.06-1.78h3.33v-.17c0-1.16-.54-2.03-2.12-2.03-1.23 0-2.26.47-2.31 2.04H8.47c.05-2.73 2.11-3.69 4.54-3.69 2.91 0 4.1 1.62 4.1 3.82v1.89c0 .76.12 1.4.3 1.93h-2.16c-.09-.27-.14-.65-.16-1h-.06c-.46.75-1.3 1.15-2.5 1.15-2.42 0-3.93-1.57-3.93-3.6 0-2.22 1.69-3.6 4.15-3.6h3.49v-.03c0-.02 0-.05 0-.07zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 21.6c-5.302 0-9.6-4.298-9.6-9.6S6.698 2.4 12 2.4s9.6 4.298 9.6-9.6 9.6-4.298 9.6-9.6 9.6z"/></svg>,
    X: () => <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z"/></svg>,
    YouTube: () => <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
};

// --- ÍCONES DE CLIMA (MANTIDOS) ---
const WeatherIcons = {
    ClearDay: ({ className }: { className?: string }) => (
        <svg viewBox="0 0 64 64" className={`${className || 'w-16 h-16'} drop-shadow-sm`}>
             <circle cx="32" cy="32" r="14" fill="#FDB813" />
             <path d="M32 6v6M32 52v6M6 32h6M52 32h6M14 14l4 4M46 46l4 4M14 50l4-4M46 14l4 4" stroke="#FDB813" strokeWidth="4" strokeLinecap="round" />
        </svg>
    ),
    PartlyCloudyDay: ({ className }: { className?: string }) => (
        <svg viewBox="0 0 64 64" className={`${className || 'w-16 h-16'} drop-shadow-sm`}>
            <circle cx="42" cy="22" r="13" fill="#FDB813" />
            <path d="M46 42c0 6.6-5.4 12-12 12H20c-6.6 0-12-5.4-12-12 0-6.1 4.6-11.1 10.5-11.9.4-4.8 4.4-8.6 9.3-8.6 3.5 0 6.5 1.9 8.3 4.8 1.1-.5 2.4-.8 3.7-.8 5.6 0 10.2 3.7 11.6 8.8 2.6.9 4.6 3.4 4.6 6.3z" fill="#FFFFFF" />
        </svg>
    ),
    ClearNight: ({ className }: { className?: string }) => (
        <svg viewBox="0 0 64 64" className={`${className || 'w-14 h-14'} drop-shadow-sm`}>
            <path d="M36.5 14c-11.9 0-21.5 9.6-21.5 21.5s9.6 21.5 21.5 21.5c4.7 0 9.1-1.5 12.7-4.1-2.9 1.1-6.1 1.7-9.4 1.7-13.5 0-24.5-11-24.5-24.5 0-5.8 2-11.2 5.3-15.5 3.3-2.3 7.3-3.6 11.6-3.6 1.4 0 2.8.1 4.2.4-4.8-2.6-9.1-3.6-9.1-3.6z" fill="#8C9EFF" stroke="#6878CC" strokeWidth="1" />
            <path d="M48 20l2 2-2 2-2-2 2-2zM56 12l2 2-2 2-2-2 2-2zM52 28l1 1-1 1-1-1 1-1z" fill="#FFEB3B" className="animate-pulse" />
        </svg>
    ),
    PartlyCloudyNight: ({ className }: { className?: string }) => (
        <svg viewBox="0 0 64 64" className={`${className || 'w-16 h-16'} drop-shadow-sm`}>
            <path d="M44 18c-7.2 0-13 5.8-13 13s5.8 13 13 13c2.3 0 4.5-.6 6.4-1.6-1.5 4.3-5.6 7.3-10.4 7.3-6.1 0-11-4.9-11-11 0-3.7 1.9-7 4.8-9-3.2-1.1-5.8-3.7-6.8-6.9 1.9-2.9 5.2-4.8 8.9-4.8z" fill="#8C9EFF" />
            <path d="M46 42c0 6.6-5.4 12-12 12H20c-6.6 0-12-5.4-12-12 0-6.1 4.6-11.1 10.5-11.9.4-4.8 4.4-8.6 9.3-8.6 3.5 0 6.5 1.9 8.3 4.8 1.1-.5 2.4-.8 3.7-.8 5.6 0 10.2 3.7 11.6 8.8 2.6.9 4.6 3.4 4.6 6.3z" fill="#FFFFFF" opacity="0.95"/>
        </svg>
    )
};

const Header = () => {
    const [viewData, setViewData] = useState<any>(null);
    const [currentDate, setCurrentDate] = useState<string>(""); // Estado para data dinâmica
    const categories = ['home', 'últimas notícias', 'blogs', 'brasil', 'cidades', 'divirta-se', 'esportes', 'política'];

    const getDist = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
        return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
    };

    const syncPortal = useCallback(async () => {
        try {
            const res = await fetch('/data/traffic_weather_data.json');
            const json = await res.json();
            navigator.geolocation.getCurrentPosition(async (pos) => {
                const { latitude, longitude } = pos.coords;
                const pool = json.alerts_pool || [];
                const filtered = pool.filter((a: any) => getDist(latitude, longitude, a.lat, a.lon) <= 10);
                const gRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const gData = await gRes.json();
                setViewData({
                    weather: { ...json.weather, city: (gData.address.city || "GOIÂNIA").toUpperCase() },
                    alerts: filtered.length > 0 ? filtered : pool.slice(0, 10)
                });
            }, () => setViewData({ weather: json.weather, alerts: json.alerts_pool.slice(0, 10) }), { enableHighAccuracy: true });
        } catch (e) { 
            console.log("Aguardando motor...");
            setViewData({
                weather: { temp: 24, feels: 26, wind: 12, humidity: 45, city: "Aparecida de Goiânia" },
                alerts: []
            });
        }
    }, []);

    useEffect(() => {
        syncPortal();
        
        // --- DATA DINÂMICA EM PORTUGUÊS ---
        const updateDate = () => {
            const now = new Date();
            const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
            setCurrentDate(now.toLocaleDateString('pt-BR', options).toUpperCase());
        };
        
        updateDate(); // Executa ao carregar
        
        const timer = setInterval(syncPortal, 300000);
        return () => clearInterval(timer);
    }, [syncPortal]);

    if (!viewData) return <div className="text-center p-20 font-black text-[#168a1a] uppercase tracking-widest">Sincronizando Rota 62...</div>;

    const renderWeatherIcon = (sizeClass: string) => {
        const hour = new Date().getHours();
        const isNight = hour >= 18 || hour < 6;
        const isCloudy = viewData.weather.humidity > 60;
        if (isNight) return isCloudy ? <WeatherIcons.PartlyCloudyNight className={sizeClass} /> : <WeatherIcons.ClearNight className={sizeClass} />;
        return isCloudy ? <WeatherIcons.PartlyCloudyDay className={sizeClass} /> : <WeatherIcons.ClearDay className={sizeClass} />;
    };

    return (
        <div className="w-full flex flex-col font-sans bg-[#f6f6f6] overflow-x-hidden">
            <Head><link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap" rel="stylesheet" /></Head>
            
            {/* --- BARRA DE TOPO (VERDE) COM DATA DINÂMICA --- */}
            <div className="w-full bg-[#127015] py-2 text-white border-b border-white/5 flex justify-center items-center gap-4">
                {/* Data Dinâmica */}
                <span className="text-[11px] font-black uppercase tracking-widest leading-none">
                    {currentDate || "CARREGANDO..."}
                </span>
                
                {/* Divisor */}
                <div className="h-3 w-px bg-white/30"></div>

                {/* Info de Clima */}
                <div className="flex items-center gap-2">
                    <div className="shrink-0">
                        {renderWeatherIcon("w-5 h-5")}
                    </div>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-[12px] font-black leading-none">{viewData.weather.temp}°C</span>
                        <span className="text-[10px] font-medium opacity-90 uppercase leading-none truncate max-w-[150px]">
                            {viewData.weather.city}
                        </span>
                    </div>
                </div>
            </div>

            <header className="w-full bg-[#168a1a] text-white py-10 shadow-md">
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-between relative">
                    <div className="flex items-center space-x-8 z-40 relative">
                        <svg className="w-8 h-8 cursor-pointer fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="3"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
                        <svg className="w-7 h-7 cursor-pointer fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="3"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 z-30"><img src="/logo-claro.png" alt="Rota 62" className="h-24 md:h-28 w-auto object-contain" /></div>
                    <div className="hidden lg:flex items-center space-x-5 z-40 relative">
                        <Social.Facebook /><Social.Instagram /><Social.Threads /><Social.X /><Social.YouTube />
                    </div>
                </div>
            </header>

            <nav className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 flex justify-center py-4"><ul className="flex space-x-12">{categories.map((c) => (<li key={c} className="text-[14px] font-black uppercase text-gray-800 hover:text-[#168a1a] cursor-pointer whitespace-nowrap">{c}</li>))}</ul></div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 mt-6 w-full relative">
                <div className="w-full bg-black rounded-xl overflow-hidden flex items-stretch h-10 shadow-xl border border-white/5 relative">
                    <div className="absolute left-0 top-0 bottom-0 flex items-center gap-2 bg-[#33CCFF] text-white px-5 text-[11px] font-black uppercase z-20 rounded-r-xl shadow-[10px_0_20px_rgba(0,0,0,0.5)]">
                        <span className="leading-none mt-[1px]">Trânsito ao vivo</span>
                        <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.8)] border border-white/20"></div>
                    </div>
                    <div className="flex items-center h-full w-full overflow-hidden">
                        <div className="flex animate-ticker-fast items-center h-full whitespace-nowrap pl-[200px]">
                            {viewData.alerts.map((a: any, i: number) => (
                                <div key={i} className="inline-flex items-center mx-10 animate-pulse-strong">
                                    <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill={a.category === "ACIDENTE" ? "#FF5C5C" : "#FFB900"}><path d="M12 2L1 21h22L12 2zm0 3.99L20.53 19H3.47L12 5.99z"/></svg>
                                    <span className={`ml-3 text-[13px] font-black ${a.important ? 'text-[#FFB900]' : 'text-white'}`}>{a.category}: {a.street} ({a.city}) - {a.desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 pt-6 pb-2 flex w-full">
                <div className="w-full h-[100px] bg-white border border-gray-200 flex items-center justify-center text-gray-300 font-black rounded-2xl uppercase text-[10px] shadow-sm">
                    [ ANÚNCIO - RESPONSIVO - 100% WIDTH ]
                </div>
            </div>

            <style jsx global>{`
                @keyframes ticker-fast { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                .animate-ticker-fast { animation: ticker-fast 50s linear infinite; }
                @keyframes pulse-strong { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.95); } }
                .animate-pulse-strong { animation: pulse-strong 1.4s ease-in-out infinite; }
                @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
                .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

export default Header;