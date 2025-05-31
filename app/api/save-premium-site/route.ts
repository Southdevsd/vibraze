import { type NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGO_URI || "mongodb://localhost:27017"
const DATABASE_NAME = "vibraze"
const COLLECTION_NAME = "premium_sites"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    console.log("📥 Recebendo dados para salvar no MongoDB:", {
      token: data.token,
      title: data.title,
      photosCount: data.photos?.length || 0,
      hasSpotify: !!data.spotifyTrack,
      hasBanner: !!data.banner,
    })

    // Conectar ao MongoDB
    const client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db(DATABASE_NAME)
    const collection = db.collection(COLLECTION_NAME)

    // Adicionar timestamp de criação
    const documentToSave = {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Inserir documento
    const result = await collection.insertOne(documentToSave)

    await client.close()

    console.log("✅ Documento salvo no MongoDB:", result.insertedId)

    return NextResponse.json({
      success: true,
      insertedId: result.insertedId,
      message: "Dados salvos com sucesso no MongoDB",
    })
  } catch (error) {
    console.error("❌ Erro ao salvar no MongoDB:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
        details: "Erro interno do servidor ao salvar dados",
      },
      { status: 500 },
    )
  }
}