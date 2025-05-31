import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerName, customerEmail, plan, amount, paymentId } = body

    // Validações básicas
    if (!customerName || !customerEmail || !plan) {
      return NextResponse.json({ error: "Dados obrigatórios não fornecidos" }, { status: 400 })
    }

    // Template do email
    const emailSubject = `Vibraze - PIX Gerado com Sucesso! 💕`

    const emailBody = `
Olá ${customerName}!

Acabamos de gerar um PIX para você! 🎉

Detalhes do seu pedido:
• Plano: ${plan === "premium" ? "Premium (Mensal)" : "Lifetime (Vitalício)"}
• Valor: R$ ${amount?.toFixed(2) || "0,00"}
• ID do Pagamento: ${paymentId || "N/A"}

Para finalizar sua compra:
1. Abra o app do seu banco
2. Escaneie o QR Code ou cole o código PIX
3. Confirme o pagamento
4. Clique em "Verificar Pagamento" no site

Assim que o pagamento for aprovado, você receberá acesso completo ao Vibraze! ❤️

Precisa de ajuda? Responda este email que te ajudamos!

Com amor,
Equipe Vibraze 💕

---
Vibraze - Conte cada momento do seu amor
https://www.vibraze.fun
    `.trim()

    // Aqui você pode integrar com um serviço de email como:
    // - Resend
    // - SendGrid
    // - Nodemailer
    // - Etc.

    // Por enquanto, vamos simular o envio
    console.log("Email que seria enviado:")
    console.log("Para:", customerEmail)
    console.log("Assunto:", emailSubject)
    console.log("Corpo:", emailBody)

    // Simular delay de envio
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: "Email enviado com sucesso",
      emailSent: true,
    })
  } catch (error) {
    console.error("Erro ao enviar email:", error)
    return NextResponse.json(
      {
        error: "Erro ao enviar email",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
