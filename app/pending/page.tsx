import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PendingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 flex items-center justify-center py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <Clock className="w-20 h-20 text-yellow-500 animate-pulse" />
            </div>
            <CardTitle className="text-3xl font-bold text-yellow-600 mb-2">Pagamento Pendente</CardTitle>
            <p className="text-gray-600 text-lg">Seu pagamento está sendo processado. Aguarde a confirmação.</p>
          </CardHeader>

          <CardContent className="text-center space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">O que está acontecendo?</h3>
              <ul className="text-yellow-700 space-y-2 text-left">
                <li>⏳ Seu pagamento está sendo processado</li>
                <li>📧 Você receberá um email quando for aprovado</li>
                <li>🔄 Isso pode levar alguns minutos</li>
                <li>✅ Sua conta será ativada automaticamente</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                💡 <strong>Dica:</strong> Mantenha esta página aberta ou verifique seu email. Você será notificado assim
                que o pagamento for confirmado.
              </p>
            </div>

            <div className="space-y-4">
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
