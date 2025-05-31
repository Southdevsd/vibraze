import { type NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGO_URI || "mongodb://localhost:27017"
const DATABASE_NAME = "vibraze"
const COLLECTION_NAME = "premium_sites"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Token é obrigatório",
        },
        { status: 400 },
      )
    }

    console.log("🔍 Buscando dados no MongoDB para token:", token)

    // Conectar ao MongoDB
    const client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db(DATABASE_NAME)
    const collection = db.collection(COLLECTION_NAME)

    // Buscar documento pelo token
    const document = await collection.findOne({ token })

    await client.close()

    if (!document) {
      console.log("❌ Documento não encontrado para token:", token)
      return NextResponse.json(
        {
          success: false,
          error: "Site não encontrado",
        },
        { status: 404 },
      )
    }

    console.log("✅ Documento encontrado no MongoDB")

    return NextResponse.json({
      success: true,
      data: document,
    })
  } catch (error) {
    console.error("❌ Erro ao buscar no MongoDB:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
        details: "Erro interno do servidor ao buscar dados",
      },
      { status: 500 },
    )
  }
}