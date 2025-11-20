import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'PyCase Forge - Test Case Generator',
  description: 'Generate robust Python test scripts powered by Gemini 1.5 Pro',
  generator: 'Next.js',
  icons: {
    icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=pycase',
    apple: 'https://api.dicebear.com/7.x/shapes/svg?seed=pycase',
  },
  openGraph: {
    title: 'PyCase Forge - Test Case Generator',
    description: 'Generate robust Python test scripts powered by Gemini 1.5 Pro',
    images: ['https://api.dicebear.com/7.x/shapes/svg?seed=pycase&size=1200'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PyCase Forge - Test Case Generator',
    description: 'Generate robust Python test scripts powered by Gemini 1.5 Pro',
    images: ['https://api.dicebear.com/7.x/shapes/svg?seed=pycase&size=1200'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
