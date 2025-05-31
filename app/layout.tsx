import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vibraze - Contadores de Relacionamento Personalizados",
  description:"Conte cada momento especial do seu relacionamento. Crie contadores personalizados para aniversários, marcos importantes e momentos únicos que vocês compartilham.",
  keywords: "contador relacionamento, aniversário, casal, amor, momentos especiais",
  authors: [{ name: "Vibraze" }],
  openGraph: {
    title: "Vibraze - Contadores de Relacionamento Personalizados",
    description: "Conte cada momento especial do seu relacionamento",
    type: "website",
    locale: "pt_BR",
  },
}

export default function RootLayout({
  children,
}: {
  
  children: React.ReactNode
  
}) {
  return (
    <html lang="pt-BR">
        <link rel="icon" href="./vibraze-logo.png" sizes="any" />
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
