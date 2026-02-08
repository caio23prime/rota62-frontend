import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
    variant?: 'default' | 'light' | 'dark';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ variant = 'default', size = 'md', className = '' }) => {
    const sizes = {
        sm: { height: 37 },  // 30 * 1.23 = 36.9 ≈ 37
        md: { height: 49 },  // 40 * 1.23 = 49.2 ≈ 49
        lg: { height: 62 },  // 50 * 1.23 = 61.5 ≈ 62
        xl: { height: 74 }   // 60 * 1.23 = 73.8 ≈ 74
    };

    const currentSize = sizes[size];

    // Usa logo-claro.png para variant light, logo-escuro.png para os outros
    const logoSrc = variant === 'light' ? '/logo-claro.png' : '/logo-escuro.png';

    return (
        <Image
            src={logoSrc}
            alt="Rota 62 GO"
            width={currentSize.height * 4} // Proporção aproximada da logo
            height={currentSize.height}
            className={`group-hover:scale-105 transition-transform ${className}`}
            priority
        />
    );
};

export default Logo;
