import './globals.css'
import type { Metadata } from 'next'
import { cn  } from '@/lib/utils'
import { Inter } from 'next/font/google'
import NavBar from './components/NavBar'
import Providers from './components/providers'

import   "react-loading-skeleton/dist/skeleton.css"
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Providers>
      <body
          className={cn(
            'min-h-screen font-sans antialiased grainy',
            inter.className
          )}>
            <Toaster/>
            <NavBar/>
            {children}
              
            </body>
            </Providers>
    </html>
  )
}
