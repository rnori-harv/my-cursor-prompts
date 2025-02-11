import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/ui/navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "Ramp's Cursor Directory",
  description: 'Your one-stop destination for cursor customization',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
