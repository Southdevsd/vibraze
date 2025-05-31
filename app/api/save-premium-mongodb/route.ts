import { type NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://Gabriel:BwjlGa0rzgWoy9IU@cluster0.lp7rflf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const DATABASE_NAME = "vibraze"
const COLLECTION_NAME = "premium_sites"

interface PremiumSiteData {
  token: string
  id: string
  isPremium: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
  views: number
  plan: string
  paymentId: string
  customerInfo: {
    name: string
    email: string
    cpf: string
    plan: string
    paymentId: string
    paymentDate: string
  }
  title: string
  description: string
  startDate: string
  theme: string
  names: {
    person1: string
    person2: string
  }
  photos: string[]
  spotifyTrack: any
  emoji: string
  backgroundColor: string
  banner: string
}

export async function POST(request: NextRequest) {
  let client: MongoClient | null = null

  try {
    console.log("🗄️ Iniciando salvamento no MongoDB Atlas...")

    const premiumData: PremiumSiteData = await request.json()

    console.log("📋 Dados recebidos:", {
      token: premiumData.token,
      title: premiumData.title,
      photosCount: premiumData.photos?.length || 0,
      hasSpotify: !!premiumData.spotifyTrack,
      hasBanner: !!premiumData.banner,
      customerName: premiumData.customerInfo?.name,
      customerEmail: premiumData.customerInfo?.email,
    })

    // Validar dados obrigatórios
    if (!premiumData.token || !premiumData.customerInfo?.email) {
      console.error("❌ Dados obrigatórios faltando")
      return NextResponse.json(
        {
          success: false,
          error: "Token e email são obrigatórios",
        },
        { status: 400 },
      )
    }

    // Conectar ao MongoDB Atlas
    console.log("🔌 Conectando ao MongoDB Atlas...")
    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout de 5 segundos
      connectTimeoutMS: 10000, // Timeout de conexão de 10 segundos
    })

    await client.connect()
    console.log("✅ Conectado ao MongoDB Atlas com sucesso!")

    const db = client.db(DATABASE_NAME)
    const collection = db.collection(COLLECTION_NAME)

    // Verificar se já existe um documento com este token
    console.log("🔍 Verificando se token já existe...")
    const existingDoc = await collection.findOne({ token: premiumData.token })

    if (existingDoc) {
      console.log("📝 Atualizando documento existente...")

      const updateResult = await collection.updateOne(
        { token: premiumData.token },
        {
          $set: {
            ...premiumData,
            updatedAt: new Date().toISOString(),
          },
        },
      )

      console.log("✅ Documento atualizado:", {
        matchedCount: updateResult.matchedCount,
        modifiedCount: updateResult.modifiedCount,
      })

      return NextResponse.json({
        success: true,
        message: "Site premium atualizado com sucesso no MongoDB Atlas",
        modifiedCount: updateResult.modifiedCount,
        token: premiumData.token,
        database: DATABASE_NAME,
        collection: COLLECTION_NAME,
      })
    } else {
      console.log("📝 Inserindo novo documento...")

      // Preparar dados para inserção
      const documentToInsert = {
        ...premiumData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Garantir que campos obrigatórios existam
        views: premiumData.views || 0,
        photos: premiumData.photos || [],
        description: premiumData.description || "",
        banner: premiumData.banner || "",
        emoji: premiumData.emoji || "❤️",
        backgroundColor: premiumData.backgroundColor || "#ffffff",
      }

      const insertResult = await collection.insertOne(documentToInsert)

      console.log("✅ Documento inserido com sucesso:", {
        insertedId: insertResult.insertedId,
        acknowledged: insertResult.acknowledged,
      })

      // Verificar se o documento foi realmente inserido
      const verifyDoc = await collection.findOne({ _id: insertResult.insertedId })
      console.log("🔍 Verificação pós-inserção:", verifyDoc ? "✅ Encontrado" : "❌ Não encontrado")

      return NextResponse.json({
        success: true,
        message: "Site premium salvo com sucesso no MongoDB Atlas",
        insertedId: insertResult.insertedId.toString(),
        token: premiumData.token,
        database: DATABASE_NAME,
        collection: COLLECTION_NAME,
        verified: !!verifyDoc,
      })
    }
  } catch (error) {
    console.error("❌ Erro ao salvar no MongoDB Atlas:", error)

    // Tratamento específico de erros do MongoDB
    let errorMessage = "Erro interno do servidor"
    let errorDetails = error instanceof Error ? error.message : "Erro desconhecido"

    if (error instanceof Error) {
      if (error.message.includes("serverSelectionTimeoutMS")) {
        errorMessage = "Timeout de conexão com MongoDB"
        errorDetails = "Não foi possível conectar ao banco de dados. Verifique a conexão."
      } else if (error.message.includes("authentication")) {
        errorMessage = "Erro de autenticação MongoDB"
        errorDetails = "Credenciais inválidas para o banco de dados."
      } else if (error.message.includes("network")) {
        errorMessage = "Erro de rede"
        errorDetails = "Problema de conectividade com o banco de dados."
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
    // Sempre fechar a conexão
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
