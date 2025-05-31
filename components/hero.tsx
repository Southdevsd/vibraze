import { Button } from "@/components/ui/button"
import { Heart, Calendar, Clock } from "lucide-react"
import { Logo } from "@/components/logo"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <Logo size="xl" showText={false} className="animate-pulse" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">∞</span>
            </div>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
          Vibraze
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Conte cada momento especial do seu relacionamento. Crie contadores personalizados para aniversários, marcos
          importantes e momentos únicos que vocês compartilham.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/create">
            <Button
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 text-lg"
            >
              <Heart className="w-5 h-5 mr-2" />
              Criar meu site
            </Button>
          </Link>
          <Link href="/demo">
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-2">
              <Clock className="w-5 h-5 mr-2" />
              Ver Demo
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <Calendar className="w-12 h-12 text-pink-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Contadores Precisos</h3>
            <p className="text-gray-600">Acompanhe anos, meses, dias, horas e até segundos juntos</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <Heart className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Totalmente Personalizável</h3>
            <p className="text-gray-600">Escolha temas, cores e adicione suas fotos especiais</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <Clock className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Compartilhamento Fácil</h3>
            <p className="text-gray-600">Compartilhe com seu amor ou nas redes sociais</p>
          </div>
        </div>
      </div>
    </section>
  )
}
