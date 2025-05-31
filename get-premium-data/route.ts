import { type NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://Gabriel:BwjlGa0rzgWoy9IU@cluster0.lp7rflf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const DATABASE_NAME = "vibraze"
const COLLECTION_NAME = "premium_sites"

export async function GET(request: NextRequest) {
  let client: MongoClient | null = null

  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    console.log("🔍 [GET-PREMIUM-DATA] Buscando site premium no MongoDB Atlas:", token)

    if (!token) {
      return NextResponse.json({ success: false, error: "Token é obrigatório" }, { status: 400 })
    }

    // Conectar ao MongoDB Atlas
    console.log("🔌 [GET-PREMIUM-DATA] Conectando ao MongoDB Atlas...")
    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 20000,
      maxPoolSize: 10,
    })

    await client.connect()
    console.log("✅ [GET-PREMIUM-DATA] Conectado ao MongoDB Atlas")

    const db = client.db(DATABASE_NAME)
    const collection = db.collection(COLLECTION_NAME)

    // Buscar documento pelo token e incrementar visualizações
    console.log("🔍 [GET-PREMIUM-DATA] Buscando e incrementando visualizações...")
    const premiumSite = await collection.findOneAndUpdate(
      { token },
      {
        $inc: { views: 1 },
        $set: {
          lastViewedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      {
        returnDocument: "after", // Retorna o documento após a atualização
      },
    )

    if (!premiumSite) {
      console.log("❌ [GET-PREMIUM-DATA] Site premium não encontrado")
      return NextResponse.json({ success: false, error: "Site premium não encontrado" }, { status: 404 })
    }

    console.log("✅ [GET-PREMIUM-DATA] Site premium encontrado:", {
      token: premiumSite.token,
      title: premiumSite.title,
      views: premiumSite.views,
      customerEmail: premiumSite.customerInfo?.email,
    })

    // Remover _id do MongoDB antes de retornar
    const { _id, ...siteData } = premiumSite

    return NextResponse.json({
      success: true,
      data: siteData,
      database: DATABASE_NAME,
      collection: COLLECTION_NAME,
    })
  } catch (error) {
    console.error("❌ [GET-PREMIUM-DATA] Erro ao buscar no MongoDB Atlas:", error)

    let errorMessage = "Erro interno do servidor"
    const errorDetails = error instanceof Error ? error.message : "Erro desconhecido"

    if (error instanceof Error) {
      if (error.message.includes("serverSelectionTimeoutMS")) {
        errorMessage = "Timeout de conexão com MongoDB"
      } else if (error.message.includes("authentication")) {
        errorMessage = "Erro de autenticação MongoDB"
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: errorDetails,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  } finally {
    if (client) {
      try {
        await client.close()
        console.log("🔌 [GET-PREMIUM-DATA] Conexão MongoDB fechada")
      } catch (closeError) {
        console.error("⚠️ [GET-PREMIUM-DATA] Erro ao fechar conexão:", closeError)
      }
    }
  }
}
