"use client"

import { useState } from "react"
import { CreditCard, Shield, ArrowLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"

export default function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState("monthly")
  const [paymentMethod, setPaymentMethod] = useState("card")

  const plans = {
    monthly: { name: "Premium Mensal", price: "R$ 9,90", period: "mês" },
    yearly: { name: "Premium Anual", price: "R$ 99,90", period: "ano", discount: "16% OFF" },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/premium" className="flex items-center text-purple-600 hover:text-purple-700 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar aos Planos
          </Link>
          <div className="flex items-center gap-2 text-green-600">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-medium">Pagamento 100% Seguro</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                Resumo do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Plan Selection */}
              <div className="space-y-3">
                <Label>Escolha seu plano:</Label>
                <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly" className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">Premium Mensal</div>
                          <div className="text-sm text-gray-600">Renovação automática</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">R$ 9,90</div>
                          <div className="text-sm text-gray-600">por mês</div>
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-4 border rounded-lg border-purple-200 bg-purple-50">
                    <RadioGroupItem value="yearly" id="yearly" />
                    <Label htmlFor="yearly" className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">Premium Anual</div>
                          <div className="text-sm text-green-600 font-medium">16% de desconto</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">R$ 99,90</div>
                          <div className="text-sm text-gray-400 line-through">R$ 118,80</div>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Features */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-3">Incluído no seu plano:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Contadores ilimitados
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Todos os temas premium
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Galeria de fotos ilimitada
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Sem marca d'água
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Suporte prioritário
                  </li>
                </ul>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span>{plans[selectedPlan as keyof typeof plans].price}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Cobrança recorrente a cada {plans[selectedPlan as keyof typeof plans].period}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Informações de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Payment Method */}
              <div className="space-y-3">
                <Label>Método de Pagamento:</Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                      <CreditCard className="w-4 h-4" />
                      Cartão de Crédito
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="pix" id="pix" />
                    <Label htmlFor="pix" className="cursor-pointer">
                      PIX (Desconto de 5%)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {paymentMethod === "card" && (
                <>
                  {/* Card Details */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Número do Cartão</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Validade</Label>
                        <Input id="expiry" placeholder="MM/AA" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardName">Nome no Cartão</Label>
                      <Input id="cardName" placeholder="João Silva" />
                    </div>
                  </div>

                  {/* Billing Address */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Endereço de Cobrança</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Nome</Label>
                        <Input id="firstName" placeholder="João" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Sobrenome</Label>
                        <Input id="lastName" placeholder="Silva" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="joao@email.com" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Endereço</Label>
                      <Input id="address" placeholder="Rua das Flores, 123" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Cidade</Label>
                        <Input id="city" placeholder="São Paulo" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">Estado</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sp">São Paulo</SelectItem>
                            <SelectItem value="rj">Rio de Janeiro</SelectItem>
                            <SelectItem value="mg">Minas Gerais</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {paymentMethod === "pix" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Pagamento via PIX</h4>
                  <p className="text-sm text-blue-700">
                    Após confirmar, você receberá um QR Code para pagamento instantâneo. Desconto de 5% aplicado
                    automaticamente.
                  </p>
                </div>
              )}

              {/* Security */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800 mb-2">
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">Pagamento Seguro</span>
                </div>
                <p className="text-sm text-green-700">
                  Seus dados são protegidos com criptografia SSL de 256 bits. Não armazenamos informações do cartão.
                </p>
              </div>

              {/* Submit */}
              <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3">
                <CreditCard className="w-5 h-5 mr-2" />
                Finalizar Pagamento - {plans[selectedPlan as keyof typeof plans].price}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade. Cancele a qualquer
                momento.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
