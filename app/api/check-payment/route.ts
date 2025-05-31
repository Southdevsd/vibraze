import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const paymentId = searchParams.get("id")

    if (!paymentId) {
      return NextResponse.json({ error: "ID do pagamento não fornecido" }, { status: 400 })
    }

    // Usar o access token fornecido
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN

    if (!accessToken) {
      return NextResponse.json({ error: "Token do Mercado Pago não configurado" }, { status: 500 })
    }

    console.log(`Consultando pagamento ${paymentId}`)

    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()
    console.log("Status do pagamento:", data)

    if (!response.ok) {
      console.error("Erro ao consultar pagamento:", data)
      return NextResponse.json({ error: "Erro ao consultar pagamento", details: data }, { status: 400 })
    }

    return NextResponse.json({
      id: data.id,
      status: data.status,
      status_detail: data.status_detail,
      transaction_amount: data.transaction_amount,
      date_approved: data.date_approved,
      date_created: data.date_created,
      external_reference: data.external_reference,
      description: data.description,
    })
  } catch (error) {
    console.error("Erro ao consultar pagamento:", error)
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
