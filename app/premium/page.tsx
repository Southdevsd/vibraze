"use client"

import { Crown, Check, Heart, ArrowLeft, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Logo } from "@/components/logo"

export default function PremiumPage() {
  const plans = [
    {
      name: "Gratuito",
      price: "R$ 0",
      period: "para sempre",
      features: ["1 contador ativo", "3 temas básicos", "1 foto por contador", "Marca d'água Vibraze"],
      limitations: ["Temas limitados", "Sem estatísticas", "Sem backup"],
      current: true,
    },
    {
      name: "Premium",
      price: "R$ 9,90",
      period: "por mês",
      features: [
        "Contadores ilimitados",
        "Todos os temas e animações",
        "Galeria de fotos ilimitada",
        "Sem marca d'água",
        "Estatísticas detalhadas",
        "Backup automático",
        "Suporte prioritário",
        "Novos recursos em primeira mão",
      ],
      popular: true,
    },
    {
      name: "Premium Anual",
      price: "R$ 99,90",
      period: "por ano",
      originalPrice: "R$ 118,80",
      discount: "16% OFF",
      features: [
        "Todos os recursos Premium",
        "2 meses grátis",
        "Acesso vitalício a novos temas",
        "Consultoria personalizada",
      ],
      bestValue: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/create" className="flex items-center text-purple-600 hover:text-purple-700 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Link>
          <Link href="/" className="flex items-center text-purple-600 hover:text-purple-700">
            <Logo size="md" />
          </Link>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Crown className="w-8 h-8 text-yellow-500" />
              <h1 className="text-4xl font-bold text-gray-800">Vibraze Premium</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Desbloqueie todo o potencial dos seus contadores especiais com recursos exclusivos
            </p>
          </div>

          {/* Plans */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${
                  plan.popular
                    ? "ring-2 ring-purple-500 shadow-xl scale-105"
                    : plan.bestValue
                      ? "ring-2 ring-yellow-500 shadow-xl"
                      : "shadow-lg"
                } bg-white/90 backdrop-blur-sm`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500">
                    Mais Popular
                  </Badge>
                )}
                {plan.bestValue && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-500">
                    Melhor Valor
                  </Badge>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600">/{plan.period}</span>
                    </div>
                    {plan.originalPrice && (
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <span className="text-lg text-gray-400 line-through">{plan.originalPrice}</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          {plan.discount}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations?.map((limitation, limitIndex) => (
                      <li key={limitIndex} className="flex items-start gap-3 opacity-60">
                        <div className="w-5 h-5 mt-0.5 flex-shrink-0 flex items-center justify-center">
                          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                        </div>
                        <span className="text-gray-500">{limitation}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-4">
                    {plan.current ? (
                      <Button variant="outline" className="w-full" disabled>
                        Plano Atual
                      </Button>
                    ) : (
                      <Link href="/payment" className="block">
                        <Button
                          className={`w-full ${
                            plan.popular
                              ? "bg-purple-500 hover:bg-purple-600"
                              : plan.bestValue
                                ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                                : "bg-gray-800 hover:bg-gray-900"
                          }`}
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Escolher Plano
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Showcase */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="bg-white/80 backdrop-blur-sm text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="font-bold mb-2">Temas Exclusivos</h3>
              <p className="text-sm text-gray-600">Acesso a mais de 20 temas únicos e animações</p>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm text-center p-6">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-pink-500" />
              </div>
              <h3 className="font-bold mb-2">Sem Limites</h3>
              <p className="text-sm text-gray-600">Crie quantos contadores quiser</p>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="font-bold mb-2">Sem Marca D'água</h3>
              <p className="text-sm text-gray-600">Seus contadores 100% personalizados</p>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm text-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="font-bold mb-2">Suporte Premium</h3>
              <p className="text-sm text-gray-600">Atendimento prioritário e personalizado</p>
            </Card>
          </div>

          {/* Guarantee */}
          <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-center">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Garantia de 30 dias</h3>
              <p className="text-lg opacity-90">
                Não ficou satisfeito? Devolvemos 100% do seu dinheiro, sem perguntas.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
