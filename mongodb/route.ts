import { type NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://Gabriel:BwjlGa0rzgWoy9IU@cluster0.lp7rflf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const DATABASE_NAME = "vibraze"
const COLLECTION_NAME = "premium_sites"

// POST - Salvar dados
export async function POST(request: NextRequest) {
  let client: MongoClient | null = null

  try {
    console.log("🗄️ [MONGODB-POST] Salvando no MongoDB...")

    const premiumData = await request.json()

    console.log("📋 [MONGODB-POST] Dados:", {
      token: premiumData.token,
      title: premiumData.title,
      email: premiumData.customerInfo?.email,
    })

    if (!premiumData.token) {
      return NextResponse.json({ success: false, error: "Token obrigatório" }, { status: 400 })
    }

    client = new MongoClient(MONGODB_URI)
    await client.connect()
    console.log("✅ [MONGODB-POST] Conectado!")

    const db = client.db(DATABASE_NAME)
    const collection = db.collection(COLLECTION_NAME)

    const result = await collection.insertOne({
      ...premiumData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    console.log("✅ [MONGODB-POST] Salvo:", result.insertedId)

    return NextResponse.json({
      success: true,
      message: "Dados salvos com sucesso",
      insertedId: result.insertedId.toString(),
      token: premiumData.token,
    })
  } catch (error) {
    console.error("❌ [MONGODB-POST] Erro:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao salvar",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  } finally {
    if (client) {
      await client.close()
    }
  }
}

// GET - Buscar dados
export async function GET(request: NextRequest) {
  let client: MongoClient | null = null

  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    console.log("🔍 [MONGODB-GET] Buscando:", token)

    if (!token) {
      return NextResponse.json({ success: false, error: "Token obrigatório" }, { status: 400 })
    }

    client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db(DATABASE_NAME)
    const collection = db.collection(COLLECTION_NAME)

    const site = await collection.findOneAndUpdate(
      { token },
      { $inc: { views: 1 }, $set: { lastViewedAt: new Date().toISOString() } },
      { returnDocument: "after" },
    )

    if (!site) {
      return NextResponse.json({ success: false, error: "Site não encontrado" }, { status: 404 })
    }

    const { _id, ...siteData } = site

    return NextResponse.json({
      success: true,
      data: siteData,
    })
  } catch (error) {
    console.error("❌ [MONGODB-GET] Erro:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao buscar",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  } finally {
    if (client) {
      await client.close()
    }
  }
}
