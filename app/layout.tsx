import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sexta do Empreendedor',
  description: 'A vitrine da comunidade brasileira',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
