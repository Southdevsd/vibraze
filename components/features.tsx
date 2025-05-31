import { Card, CardContent } from "@/components/ui/card"
import { Heart, Palette, Share2, Bell, Lock, Smartphone } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: Heart,
      title: "Múltiplos Contadores",
      description: "Crie contadores para primeiro encontro, namoro, noivado, casamento e muito mais",
    },
    {
      icon: Palette,
      title: "Temas Personalizados",
      description: "Escolha entre diversos temas românticos ou crie o seu próprio estilo",
    },
    {
      icon: Share2,
      title: "Compartilhamento",
      description: "Compartilhe seus contadores nas redes sociais ou com amigos e família",
    },
    {
      icon: Bell,
      title: "Lembretes",
      description: "Receba notificações em datas especiais e marcos importantes",
    },
    {
      icon: Lock,
      title: "Privacidade",
      description: "Seus dados são seguros e você controla quem pode ver seus contadores",
    },
    {
      icon: Smartphone,
      title: "Responsivo",
      description: "Acesse de qualquer dispositivo - celular, tablet ou computador",
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Recursos Incríveis
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tudo que você precisa para celebrar e acompanhar os momentos especiais do seu relacionamento
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
