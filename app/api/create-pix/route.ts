import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Dados recebidos:", body)

    const { plan, customer, amount } = body

    // Validações básicas
    if (!plan || !customer || !amount) {
      return NextResponse.json({ error: "Dados obrigatórios não fornecidos" }, { status: 400 })
    }

    if (!customer.name || !customer.email || !customer.cpf) {
      return NextResponse.json({ error: "Dados do cliente incompletos" }, { status: 400 })
    }

    // Usar o access token fornecido
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN

    if (!accessToken) {
      return NextResponse.json({ error: "Token do Mercado Pago não configurado" }, { status: 500 })
    }

    // Limpar CPF (apenas números)
    const cpfNumbers = customer.cpf.replace(/\D/g, "")

    if (cpfNumbers.length !== 11) {
      return NextResponse.json({ error: "CPF deve ter 11 dígitos" }, { status: 400 })
    }

    // Separar nome em primeiro e último nome
    const nameParts = customer.name.trim().split(" ")
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(" ") || firstName

    // Criar pagamento PIX usando a API do Mercado Pago
    const paymentData = {
      transaction_amount: Number(amount),
      description: plan === "premium" ? "Vibraze Premium - Assinatura Mensal" : "Vibraze Lifetime - Acesso Vitalício",
      payment_method_id: "pix",
      payer: {
        email: customer.email,
        first_name: firstName,
        last_name: lastName,
        identification: {
          type: "CPF",
          number: cpfNumbers,
        },
      },
      external_reference: `Vibraze_${plan}_${Date.now()}`,
      statement_descriptor: "Vibraze",
      metadata: {
        plan: plan,
        customer_name: customer.name,
        customer_email: customer.email,
      },
    }

    console.log("Criando pagamento PIX:", JSON.stringify(paymentData, null, 2))

    const response = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Idempotency-Key": `Vibraze_${plan}_${customer.email}_${Date.now()}`,
      },
      body: JSON.stringify(paymentData),
    })

    const responseData = await response.json()
    console.log("Resposta completa do Mercado Pago:", JSON.stringify(responseData, null, 2))

    if (!response.ok) {
      console.error("Erro do Mercado Pago:", {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      })

      return NextResponse.json(
        {
          error: "Erro ao criar pagamento PIX",
          details: responseData.message || responseData.error || "Erro desconhecido",
          mercadoPagoError: responseData,
          status: response.status,
        },
        { status: 400 },
      )
    }

    // Extrair dados do PIX da resposta
    const pixData = responseData.point_of_interaction?.transaction_data

    if (!pixData || !pixData.qr_code) {
      console.error("Dados do PIX não encontrados na resposta:", responseData)
      return NextResponse.json(
        {
          error: "Dados do PIX não foram gerados pelo Mercado Pago",
          details: "point_of_interaction.transaction_data não encontrado",
          fullResponse: responseData,
        },
        { status: 400 },
      )
    }

    // Gerar URL do QR Code usando o código PIX
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixData.qr_code)}`

    // Enviar email de confirmação
    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: customer.name,
          customerEmail: customer.email,
          plan: plan,
          amount: Number(amount),
          paymentId: responseData.id,
        }),
      })
      console.log("Email de confirmação enviado")
    } catch (emailError) {
      console.error("Erro ao enviar email:", emailError)
      // Não falhar o PIX se o email der erro
    }

    return NextResponse.json({
      success: true,
      payment_id: responseData.id,
      status: responseData.status,
      qr_code: pixData.qr_code,
      qr_code_base64: pixData.qr_code_base64,
      qr_code_url: qrCodeUrl,
      ticket_url: pixData.ticket_url,
      pix_code: pixData.qr_code,
      amount: responseData.transaction_amount,
      description: responseData.description,
      external_reference: responseData.external_reference,
      date_created: responseData.date_created,
      date_of_expiration: responseData.date_of_expiration,
      customer: {
        name: customer.name,
        email: customer.email,
        cpf: customer.cpf,
      },
      emailSent: true,
    })
  } catch (error) {
    console.error("Erro detalhado ao criar pagamento PIX:", error)
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
