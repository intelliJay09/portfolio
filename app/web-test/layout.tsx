import type { Metadata } from 'next'
import { Inter, Cormorant_Garamond } from 'next/font/google'
import '../../globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['200', '300', '400', '500', '600'],
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'Alexis Chen - Full-Stack Developer',
  description: 'Crafting exceptional digital experiences through modern web development.',
}

export default function WebTestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="bg-black text-white font-inter antialiased" style={{
        fontFamily: 'var(--font-inter), system-ui, sans-serif'
      }}>
        {children}
      </body>
    </html>
  )
}