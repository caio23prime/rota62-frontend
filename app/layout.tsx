import './globals.css'
import type { Metadata } from 'next'
import { Roboto, Playfair_Display } from 'next/font/google'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  variable: '--font-roboto',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Portal Rota 62',
  description: 'Notícias de Goiânia e Região',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${roboto.variable} ${playfair.variable} font-sans antialiased text-gray-900 bg-[#f6f6f6]`}>
        {children}
      </body>
    </html>
  )
}