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
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = Number.parseInt(searchParams.get("skip") || "0")
    const email = searchParams.get("email")

    console.log("📋 Listando sites premium do MongoDB Atlas...")

    // Conectar ao MongoDB Atlas
    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    })

    await client.connect()
    console.log("✅ Conectado ao MongoDB Atlas")

    const db = client.db(DATABASE_NAME)
    const collection = db.collection(COLLECTION_NAME)

    // Construir filtro
    const filter: any = {}
    if (email) {
      filter["customerInfo.email"] = email
    }

    // Buscar documentos
    const sites = await collection
      .find(filter)
      .sort({ createdAt: -1 }) // Mais recentes primeiro
      .skip(skip)
      .limit(limit)
      .toArray()

    // Contar total de documentos
    const total = await collection.countDocuments(filter)

    console.log(`✅ Encontrados ${sites.length} sites de ${total} total`)

    // Remover _id e dados sensíveis
    const sanitizedSites = sites.map((site) => {
      const { _id, customerInfo, ...publicData } = site
      return {
        ...publicData,
        customerEmail: customerInfo?.email, // Manter apenas email
        customerName: customerInfo?.name, // Manter apenas nome
      }
    })

    return NextResponse.json({
      success: true,
      data: sanitizedSites,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + limit < total,
      },
      database: DATABASE_NAME,
      collection: COLLECTION_NAME,
    })
  } catch (error) {
    console.error("❌ Erro ao listar sites:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  } finally {
    if (client) {
      try {
        await client.close()
        console.log("🔌 Conexão MongoDB fechada")
      } catch (closeError) {
        console.error("⚠️ Erro ao fechar conexão:", closeError)
      }
    }
  }
}
