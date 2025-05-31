import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { XCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function FailurePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 flex items-center justify-center py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <XCircle className="w-20 h-20 text-red-500" />
            </div>
            <CardTitle className="text-3xl font-bold text-red-600 mb-2">Pagamento Não Aprovado</CardTitle>
            <p className="text-gray-600 text-lg">
              Houve um problema com seu pagamento. Não se preocupe, você pode tentar novamente.
            </p>
          </CardHeader>

          <CardContent className="text-center space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Possíveis motivos:</h3>
              <ul className="text-red-700 space-y-2 text-left">
                <li>• Dados do cartão incorretos</li>
                <li>• Limite insuficiente</li>
                <li>• Problema temporário com o banco</li>
                <li>• Cartão bloqueado ou vencido</li>
              </ul>
            </div>

            <div className="space-y-4">
              <Link href="/checkout">
                <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-lg py-3">
                  Tentar Novamente
                </Button>
              </Link>

              <Link href="/">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Início
                </Button>
              </Link>
            </div>

            <div className="text-sm text-gray-500">
              <p>Precisa de ajuda? Entre em contato conosco em</p>
              <a href="mailto:support@vibraze.fun" className="text-purple-600 hover:underline">
                support@vibraze.fun
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
