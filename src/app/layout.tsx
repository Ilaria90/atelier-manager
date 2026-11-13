import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/Sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = { 
  title: "Atelier Manager" 
}

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="it">
      {/* Rimosso flex, mantenuto min-h-screen */}
      <body className={`${inter.className} min-h-screen bg-gray-50 text-gray-900 antialiased`}>
        
        <Sidebar />
        
        {/* Aggiunto ml-16 per lasciare lo spazio esatto della barra chiusa */}
        <main className="ml-16 overflow-y-auto">
          {children}
        </main>
        
      </body>
    </html>
  )
}