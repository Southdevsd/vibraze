import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerName, customerEmail, plan, amount, paymentId } = body

    // Validações básicas
    if (!customerName || !customerEmail) {
      return NextResponse.json({ error: "Dados obrigatórios não fornecidos" }, { status: 400 })
    }

    // Template do email de pagamento aprovado
    const emailSubject = `🎉 Pagamento Aprovado - Bem-vindo ao Vibraze!`

    const emailBody = `
Olá ${customerName}!

Seu pagamento foi aprovado com sucesso! 🎉

Agora você tem acesso completo ao Vibraze ${plan === "premium" ? "Premium" : "Lifetime"}! ❤️

O que você pode fazer agora:
• Criar contadores ilimitados
• Usar todos os temas premium
• Fazer upload de fotos personalizadas
• Receber lembretes por email
• Compartilhar seus contadores

Acesse agora: https://www.vibraze.fun/create

Detalhes do pagamento:
• Plano: ${plan === "premium" ? "Premium (Mensal)" : "Lifetime (Vitalício)"}
• Valor pago: R$ ${amount?.toFixed(2) || "0,00"}
• ID do Pagamento: ${paymentId || "N/A"}

Obrigado por escolher o Vibraze para celebrar seus momentos especiais! 💕

Com amor,
Equipe Vibraze

---
Vibraze - Conte cada momento do seu amor
https://www.vibraze.fun
    `.trim()

    // Simular envio do email
    console.log("Email de pagamento aprovado que seria enviado:")
    console.log("Para:", customerEmail)
    console.log("Assunto:", emailSubject)
    console.log("Corpo:", emailBody)

    // Simular delay de envio
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      message: "Email de aprovação enviado com sucesso",
      emailSent: true,
    })
  } catch (error) {
    console.error("Erro ao enviar email de aprovação:", error)
    return NextResponse.json(
      {
        error: "Erro ao enviar email",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
