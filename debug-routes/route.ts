import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("🔍 [DEBUG-ROUTES] Listando rotas disponíveis...")

    const routes = [
      "/api/debug-routes",
      "/api/save-premium-data",
      "/api/get-premium-data",
      "/api/test-connection",
      "/api/create-pix",
      "/api/check-payment",
      "/api/spotify-track",
    ]

    return NextResponse.json({
      success: true,
      message: "Rotas disponíveis listadas",
      routes: routes,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      mongoUri: process.env.MONGODB_URI ? "✅ Configurado" : "❌ Não configurado",
    })
  } catch (error) {
    console.error("❌ [DEBUG-ROUTES] Erro:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Erro ao listar rotas",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
