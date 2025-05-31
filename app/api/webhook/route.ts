import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Verificar se é uma notificação de pagamento
    if (body.type === "payment") {
      const paymentId = body.data.id
      const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN

      // Buscar detalhes do pagamento
      const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const paymentData = await paymentResponse.json()

      // Processar o pagamento baseado no status
      if (paymentData.status === "approved") {
        // Pagamento aprovado - ativar assinatura do usuário
        console.log("Pagamento aprovado:", paymentData)

        // Aqui você salvaria no banco de dados que o usuário tem acesso premium
        // Exemplo: await activateUserPremium(paymentData.payer.email)
      } else if (paymentData.status === "rejected") {
        // Pagamento rejeitado
        console.log("Pagamento rejeitado:", paymentData)
      } else if (paymentData.status === "pending") {
        // Pagamento pendente
        console.log("Pagamento pendente:", paymentData)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Erro no webhook:", error)
    return NextResponse.json({ error: "Erro ao processar webhook" }, { status: 500 })
  }
}
