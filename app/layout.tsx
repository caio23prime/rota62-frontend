import type { Metadata } from 'next';
import { Roboto } from 'next/font/google'; // Mudamos para Roboto (Padrão Portal de Notícias)
import './globals.css';

// Carregando a Roboto com todos os pesos necessários para nitidez total
const roboto = Roboto({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'], // Light, Normal, Medium, Bold, Black
  style: ['normal', 'italic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Portal Rota 62',
  description: 'Notícias de Goiânia e Região',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      {/* 'antialiased' é o segredo: ele força o navegador a limpar o serrilhado da fonte */}
      <body className={`${roboto.className} antialiased bg-[#f6f6f6]`}>
        {children}
      </body>
    </html>
  );
}