import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Star } from "lucide-react"
import Link from "next/link"

export function Pricing() {
  const plans = [
    {
      name: "Gratuito",
      price: "R$ 0",
      period: "para sempre",
      description: "Perfeito para começar",
      features: ["1 contador ativo", "Temas básicos", "Compartilhamento simples", "Suporte por email"],
      buttonText: "Começar Grátis",
      buttonVariant: "outline" as const,
      href: "/create",
    },
    {
      name: "Premium",
      price: "R$ 10,99",
      period: "por mês",
      description: "Para casais apaixonados",
      features: [
        "Contadores ilimitados",
        "Todos os temas premium",
        "Upload de fotos personalizadas",
        "Lembretes por email",
        "Compartilhamento avançado",
        "Suporte prioritário",
      ],
      buttonText: "Assinar Premium",
      buttonVariant: "default" as const,
      href: "/checkout?plan=premium",
      popular: true,
    },
    {
      name: "Lifetime",
      price: "R$ 20.99",
      period: "pagamento único",
      description: "Para o amor eterno",
      features: [
        "Tudo do Premium",
        "Acesso vitalício",
        "Novos recursos inclusos",
        "Backup automático",
        "Suporte VIP",
        "Sem mensalidades",
      ],
      buttonText: "Comprar Lifetime",
      buttonVariant: "default" as const,
      href: "/checkout?plan=lifetime",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Escolha Seu Plano
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comece grátis e evolua conforme sua necessidade. Todos os planos incluem nossa garantia de satisfação.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${plan.popular ? "ring-2 ring-purple-500 scale-105" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                    <Star className="w-4 h-4 mr-1" fill="currentColor" />
                    Mais Popular
                  </div>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>
                <p className="text-gray-600 mt-2">{plan.description}</p>
              </CardHeader>

              <CardContent className="pt-4">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={plan.href} className="block">
                  <Button
                    variant={plan.buttonVariant}
                    className={`w-full py-3 ${plan.popular ? "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700" : ""}`}
                  >
                    {plan.buttonText}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
