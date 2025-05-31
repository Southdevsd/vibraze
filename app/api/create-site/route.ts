import { type NextRequest, NextResponse } from "next/server"

// Armazenamento em memória como backup
const sitesStorage = new Map<string, any>()

export async function POST(request: NextRequest) {
  try {
    const siteData = await request.json()

    console.log("📝 API: Recebendo dados para criar site:", {
      token: siteData.token,
      title: siteData.title,
      hasPhotos: siteData.photos?.length > 0,
    })

    // Validações básicas
    if (!siteData.token || !siteData.title) {
      console.error("❌ API: Dados obrigatórios não fornecidos")
      return NextResponse.json({ error: "Dados obrigatórios não fornecidos" }, { status: 400 })
    }

    // Salvar no armazenamento em memória
    sitesStorage.set(siteData.token, siteData)

    console.log(`💾 API: Site salvo com token: ${siteData.token}`)
    console.log(`📊 API: Total de sites: ${sitesStorage.size}`)
    console.log(`🔑 API: Tokens disponíveis:`, Array.from(sitesStorage.keys()))

    return NextResponse.json({
      success: true,
      token: siteData.token,
      message: "Site criado com sucesso",
      url: `/site/${siteData.token}`,
      siteData: siteData,
    })
  } catch (error) {
    console.error("❌ API: Erro ao criar site:", error)
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 400 })
    }

    console.log(`🔍 API: Buscando site com token: ${token}`)
    console.log(`📊 API: Total de sites armazenados: ${sitesStorage.size}`)
    console.log(`🔑 API: Tokens disponíveis:`, Array.from(sitesStorage.keys()))

    const siteData = sitesStorage.get(token)

    if (!siteData) {
      console.log(`❌ API: Site não encontrado para token: ${token}`)
      return NextResponse.json(
        {
          error: "Site não encontrado",
          debug: {
            requestedToken: token,
            availableTokens: Array.from(sitesStorage.keys()),
            totalSites: sitesStorage.size,
            storageKeys: Array.from(sitesStorage.keys()).slice(0, 5), // Primeiros 5 para debug
          },
        },
        { status: 404 },
      )
    }

    // Incrementar visualizações
    siteData.views = (siteData.views || 0) + 1
    sitesStorage.set(token, siteData)

    console.log(`✅ API: Site encontrado e retornado: ${siteData.title} (${siteData.views} views)`)

    return NextResponse.json({
      success: true,
      site: siteData,
    })
  } catch (error) {
    console.error("❌ API: Erro ao buscar site:", error)
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
