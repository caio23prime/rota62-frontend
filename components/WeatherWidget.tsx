'use client';

import { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, Zap, AlertTriangle } from 'lucide-react';

interface WeatherData {
    temp: number;
    feels: number;
    humidity: number;
    wind: number;
    icon: string;
    city: string;
    condition: string;
}

interface DefesaCivilAlert {
    active: boolean;
    level: 'warning' | 'danger' | 'info';
    message: string;
    validUntil?: string;
}

export default function WeatherWidget() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [civilDefenseAlert, setCivilDefenseAlert] = useState<DefesaCivilAlert | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchWeather() {
            try {
                const res = await fetch(`/data/traffic_weather_data.json?t=${Date.now()}`);
                if (!res.ok) throw new Error('Failed to fetch weather');

                const data = await res.json();

                if (data.weather) {
                    setWeather({
                        temp: data.weather.temp || 25,
                        feels: data.weather.feels || 26,
                        humidity: data.weather.humidity || 70,
                        wind: data.weather.wind || 5,
                        icon: data.weather.icon || '☀️',
                        city: data.weather.city || 'GOIÂNIA',
                        condition: getConditionFromIcon(data.weather.icon)
                    });
                }

                // Verifica condições climáticas severas para alerta da Defesa Civil
                if (data.weather.humidity > 85 || data.weather.wind > 30) {
                    setCivilDefenseAlert({
                        active: true,
                        level: 'warning',
                        message: 'Alerta de chuva forte para as próximas horas. Evite áreas de risco de alagamento.',
                        validUntil: new Date(Date.now() + 6 * 60 * 60 * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                    });
                }

            } catch (error) {
                console.error('Erro ao buscar clima:', error);
                setWeather({
                    temp: 25,
                    feels: 26,
                    humidity: 70,
                    wind: 5,
                    icon: '☀️',
                    city: 'GOIÂNIA',
                    condition: 'sun'
                });
            } finally {
                setLoading(false);
            }
        }

        fetchWeather();
        const interval = setInterval(fetchWeather, 300000);
        return () => clearInterval(interval);
    }, []);

    const getConditionFromIcon = (icon: string): string => {
        if (icon.includes('☀') || icon.includes('🌞')) return 'sun';
        if (icon.includes('☁') || icon.includes('🌥')) return 'cloud';
        if (icon.includes('🌧') || icon.includes('💧')) return 'rain';
        if (icon.includes('⛈') || icon.includes('🌩')) return 'storm';
        return 'sun';
    };

    const getWeatherIcon = (condition: string) => {
        const icons: Record<string, any> = {
            sun: <Sun className="w-full h-full text-yellow-300 drop-shadow-lg" />,
            cloud: <Cloud className="w-full h-full text-gray-100 drop-shadow-lg" />,
            rain: <CloudRain className="w-full h-full text-blue-200 drop-shadow-lg" />,
            storm: <Zap className="w-full h-full text-yellow-200 drop-shadow-lg" />
        };
        return icons[condition] || icons.sun;
    };

    const getConditionText = (condition: string): string => {
        const texts: Record<string, string> = {
            sun: 'Ensolarado',
            cloud: 'Nublado',
            rain: 'Chuva',
            storm: 'Tempestade'
        };
        return texts[condition] || 'Ensolarado';
    };

    // Backgrounds animados baseados na condição climática
    const getBackgroundClass = (condition: string): string => {
        const backgrounds: Record<string, string> = {
            sun: 'bg-gradient-to-br from-yellow-400 via-orange-400 to-orange-500',
            cloud: 'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600',
            rain: 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700',
            storm: 'bg-gradient-to-br from-purple-600 via-indigo-700 to-gray-900'
        };
        return backgrounds[condition] || backgrounds.sun;
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl overflow-hidden shadow-lg text-white p-4 animate-pulse">
                <p className="text-sm">Carregando clima...</p>
            </div>
        );
    }

    if (!weather) return null;

    return (
        <div className={`${getBackgroundClass(weather.condition)} rounded-xl overflow-hidden shadow-lg text-white relative`}>
            {/* Animações de fundo baseadas no clima */}
            <style jsx>{`
        @keyframes float-clouds {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(20px) translateY(-10px); }
        }
        @keyframes rain-fall {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        @keyframes lightning {
          0%, 90%, 100% { opacity: 0; }
          95% { opacity: 1; }
        }
        @keyframes sun-rays {
          0%, 100% { transform: rotate(0deg) scale(1); opacity: 0.3; }
          50% { transform: rotate(180deg) scale(1.1); opacity: 0.6; }
        }
        .animate-clouds {
          animation: float-clouds 8s ease-in-out infinite;
        }
        .animate-rain {
          animation: rain-fall 1.5s linear infinite;
        }
        .animate-lightning {
          animation: lightning 4s ease-in-out infinite;
        }
        .animate-sun-rays {
          animation: sun-rays 10s linear infinite;
        }
      `}</style>

            {/* Efeitos visuais por condição */}
            {weather.condition === 'sun' && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-4 right-4 w-32 h-32 bg-yellow-300 rounded-full opacity-20 blur-3xl animate-sun-rays"></div>
                </div>
            )}

            {weather.condition === 'cloud' && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-2 left-10 w-20 h-8 bg-white/10 rounded-full blur-sm animate-clouds"></div>
                    <div className="absolute top-8 right-16 w-24 h-10 bg-white/10 rounded-full blur-sm animate-clouds" style={{ animationDelay: '2s' }}></div>
                </div>
            )}

            {weather.condition === 'rain' && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-0.5 h-8 bg-white/30 animate-rain"
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${1 + Math.random()}s`
                            }}
                        ></div>
                    ))}
                </div>
            )}

            {weather.condition === 'storm' && (
                <>
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {[...Array(20)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-0.5 h-10 bg-blue-200/40 animate-rain"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 2}s`,
                                    animationDuration: `${0.8 + Math.random() * 0.5}s`
                                }}
                            ></div>
                        ))}
                    </div>
                    <div className="absolute inset-0 bg-yellow-200/20 animate-lightning pointer-events-none"></div>
                </>
            )}

            {/* Conteúdo do widget */}
            <div className="p-4 relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-xs font-bold uppercase opacity-90 drop-shadow">Previsão do Tempo</h3>
                        <p className="text-2xl font-black drop-shadow-lg">{weather.city}</p>
                    </div>
                    <div className="w-16 h-16">
                        {getWeatherIcon(weather.condition)}
                    </div>
                </div>

                <div className="text-5xl font-black mb-1 drop-shadow-lg">{weather.temp}°</div>
                <p className="text-xs opacity-90 mb-1 drop-shadow">{getConditionText(weather.condition)}</p>
                <p className="text-xs opacity-80 drop-shadow">Sensação: {weather.feels}°</p>

                <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                    <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
                        <p className="opacity-80">Umidade</p>
                        <p className="font-bold text-lg">{weather.humidity}%</p>
                    </div>
                    <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
                        <p className="opacity-80">Vento</p>
                        <p className="font-bold text-lg">{weather.wind} km/h</p>
                    </div>
                </div>

                {/* ALERTA DA DEFESA CIVIL */}
                {civilDefenseAlert && civilDefenseAlert.active && (
                    <div className={`mt-4 rounded-lg p-3 flex items-start gap-2 animate-pulse ${civilDefenseAlert.level === 'danger' ? 'bg-red-600' :
                            civilDefenseAlert.level === 'warning' ? 'bg-yellow-500 text-yellow-900' :
                                'bg-blue-400 text-blue-900'
                        }`}>
                        <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-[10px] font-black uppercase mb-1">
                                {civilDefenseAlert.level === 'danger' ? '⚠️ ALERTA VERMELHO - DEFESA CIVIL' :
                                    civilDefenseAlert.level === 'warning' ? '⚠️ ALERTA AMARELO - DEFESA CIVIL' :
                                        'ℹ️ AVISO - DEFESA CIVIL'}
                            </p>
                            <p className="text-xs font-bold leading-tight">{civilDefenseAlert.message}</p>
                            {civilDefenseAlert.validUntil && (
                                <p className="text-[9px] opacity-70 mt-1">Válido até {civilDefenseAlert.validUntil}</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
