"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { CounterPreview } from "@/components/counter-preview"

export default function DemoPage() {
  const [currentDemo, setCurrentDemo] = useState(0)

  const demos = [
    {
      title: "Nosso Primeiro Encontro",
      names: { person1: "Ana", person2: "Carlos" },
      startDate: new Date("2022-03-15"),
      theme: "romantic",
      description: "O dia que mudou nossas vidas para sempre ❤️",
      photos: [],
      spotifyTrack: null,
      emoji: "❤️",
      isPremium: false,
    },
    {
      title: "Pedido de Casamento",
      names: { person1: "Maria", person2: "João" },
      startDate: new Date("2023-12-24"),
      theme: "purple",
      description: "Ela disse SIM! 💍",
      photos: [],
      spotifyTrack: null,
      emoji: "💍",
      isPremium: false,
    },
    {
      title: "Nossa Lua de Mel",
      names: { person1: "Lucia", person2: "Pedro" },
      startDate: new Date("2023-06-10"),
      theme: "ocean",
      description: "Duas semanas mágicas em Santorini 🌅",
      photos: [],
      spotifyTrack: null,
      emoji: "🌅",
      isPremium: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao início
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Demonstração
          </h1>
          <p className="text-gray-600 mt-2">Veja como ficam os contadores em tempo real</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Exemplos de Contadores</h2>
            <p className="text-gray-600">
              Clique nos exemplos abaixo para ver diferentes estilos e temas de contadores.
            </p>

            <div className="space-y-3">
              {demos.map((demo, index) => (
                <Button
                  key={index}
                  variant={currentDemo === index ? "default" : "outline"}
                  className="w-full justify-start text-left h-auto p-4"
                  onClick={() => setCurrentDemo(index)}
                >
                  <div>
                    <div className="font-semibold">{demo.title}</div>
                    <div className="text-sm opacity-70">
                      {demo.names.person1} ❤️ {demo.names.person2}
                    </div>
                  </div>
                </Button>
              ))}
            </div>

            <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Recursos Disponíveis:</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✨ Contadores em tempo real</li>
                <li>🎨 Múltiplos temas e cores</li>
                <li>📱 Design responsivo</li>
                <li>💝 Mensagens personalizadas</li>
                <li>📤 Compartilhamento fácil</li>
                <li>🔔 Lembretes automáticos</li>
              </ul>
            </div>
          </div>

          <div>
            <CounterPreview {...demos[currentDemo]} />

            <div className="mt-6 text-center">
              <Link href="/create">
                <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                  Criar meu site
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
