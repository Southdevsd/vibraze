"use client"

import { useEffect, useState } from "react"
import { Heart, Share2, Edit, ArrowLeft, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function CounterPreviewPage() {
  const [timeElapsed, setTimeElapsed] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    // Example: 6 months ago
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - 6)
    startDate.setDate(startDate.getDate() - 10)

    const updateCounter = () => {
      const now = new Date()
      const diff = now.getTime() - startDate.getTime()

      const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365))
      const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30))
      const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeElapsed({ years, months, days, hours, minutes, seconds })
    }

    updateCounter()
    const interval = setInterval(updateCounter, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/create" className="flex items-center text-white hover:text-pink-200 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Editar
          </Link>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Salvar
            </Button>
            <Button variant="secondary" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Counter Card */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-8 text-center">
              {/* Title */}
              <div className="mb-8">
                <Heart className="w-12 h-12 text-pink-500 mx-auto mb-4" fill="currentColor" />
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Nosso Primeiro Encontro</h1>
                <p className="text-gray-600">Desde hoje há 6 meses</p>
              </div>

              {/* Photo Placeholder */}
              <div className="mb-8">
                <div className="w-64 h-48 mx-auto bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg flex items-center justify-center border-2 border-dashed border-pink-300">
                  <div className="text-center">
                    <Heart className="w-12 h-12 text-pink-400 mx-auto mb-2" />
                    <p className="text-pink-600 text-sm">Sua foto aparecerá aqui</p>
                  </div>
                </div>
              </div>

              {/* Counter */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                <div className="bg-pink-50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-pink-600">{timeElapsed.years}</div>
                  <div className="text-sm text-gray-600">Anos</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-purple-600">{timeElapsed.months}</div>
                  <div className="text-sm text-gray-600">Meses</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-blue-600">{timeElapsed.days}</div>
                  <div className="text-sm text-gray-600">Dias</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-green-600">{timeElapsed.hours}</div>
                  <div className="text-sm text-gray-600">Horas</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-yellow-600">{timeElapsed.minutes}</div>
                  <div className="text-sm text-gray-600">Minutos</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-red-600">{timeElapsed.seconds}</div>
                  <div className="text-sm text-gray-600">Segundos</div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <p className="text-gray-700 leading-relaxed">
                  Este é o seu contador personalizado! Aqui você pode adicionar uma descrição especial sobre este
                  momento único que vocês compartilham. Conte a história, os sentimentos e tudo que torna este momento
                  especial para vocês dois. ❤️
                </p>
              </div>

              {/* Watermark (Free Version) */}
              <div className="text-center text-sm text-gray-400 mb-6">Criado com ❤️ no Vibraze</div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/create">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Editar Contador
                  </Button>
                </Link>
                <Link href="/premium">
                  <Button className="bg-purple-500 hover:bg-purple-600 flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Upgrade para Premium
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Premium CTA */}
          <Card className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2">Quer mais recursos?</h3>
              <p className="mb-4">
                Remova a marca d'água, adicione mais fotos e acesse temas exclusivos com o Premium!
              </p>
              <Link href="/premium">
                <Button variant="secondary" size="lg">
                  Ver Planos Premium
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
