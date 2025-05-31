import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'vibraze App',
  description: 'Created with vibraze',
  generator: 'vibraze',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
