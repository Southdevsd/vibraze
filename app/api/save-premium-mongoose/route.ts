import { type NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"

// Schema do Mongoose para Site Premium
const PremiumSiteSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true },
    id: { type: String, required: true },
    isPremium: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
    plan: { type: String, required: true },
    paymentId: { type: String, required: true },

    // Informações do cliente
    customerInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      cpf: { type: String, required: true },
      plan: { type: String, required: true },
      paymentId: { type: String, required: true },
      paymentDate: { type: Date, required: true },
    },

    // Configurações do site
    title: { type: String, required: true },
    description: { type: String, default: "" },
    startDate: { type: Date, required: true },
    theme: { type: String, default: "romantic" },

    names: {
      person1: { type: String, required: true },
      person2: { type: String, default: "" },
    },

    photos: [{ type: String }], // URLs do ImgBB
    banner: { type: String, default: "" }, // URL do ImgBB
    emoji: { type: String, default: "❤️" },
    backgroundColor: { type: String, default: "#ffffff" },

    // Spotify
    spotifyTrack: {
      name: String,
      artist: String,
      preview_url: String,
      id: String,
      embed_url: String,
      external_urls: {
        spotify: String,
      },
    },
  },
  {
    timestamps: true, // Adiciona createdAt e updatedAt automaticamente
    collection: "premium_sites",
  },
)

// Modelo do Mongoose
const PremiumSite = mongoose.models.PremiumSite || mongoose.model("PremiumSite", PremiumSiteSchema)

// Conectar ao MongoDB usando Mongoose
async function connectToDatabase() {
  if (mongoose.connection.readyState === 0) {
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/vibraze"
    await mongoose.connect(MONGODB_URI)
    console.log("✅ Conectado ao MongoDB via Mongoose")
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("🗄️ Iniciando salvamento no MongoDB via Mongoose...")

    const premiumData = await request.json()

    console.log("📋 Dados recebidos:", {
      token: premiumData.token,
      title: premiumData.title,
      photosCount: premiumData.photos?.length || 0,
      hasSpotify: !!premiumData.spotifyTrack,
      hasBanner: !!premiumData.banner,
      customerName: premiumData.customerInfo?.name,
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

    // Conectar ao MongoDB
    await connectToDatabase()

    // Verificar se já existe um documento com este token
    const existingSite = await PremiumSite.findOne({ token: premiumData.token })

    if (existingSite) {
      console.log("📝 Atualizando documento existente...")

      const updatedSite = await PremiumSite.findOneAndUpdate(
        { token: premiumData.token },
        {
          ...premiumData,
          updatedAt: new Date(),
        },
        {
          new: true, // Retorna o documento atualizado
          runValidators: true, // Executa validações do schema
        },
      )

      console.log("✅ Documento atualizado via Mongoose")

      return NextResponse.json({
        success: true,
        message: "Site premium atualizado com sucesso",
        data: updatedSite,
        token: premiumData.token,
      })
    } else {
      console.log("📝 Criando novo documento...")

      const newSite = new PremiumSite({
        ...premiumData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const savedSite = await newSite.save()

      console.log("✅ Documento criado via Mongoose:", savedSite._id)

      return NextResponse.json({
        success: true,
        message: "Site premium salvo com sucesso",
        data: savedSite,
        insertedId: savedSite._id,
        token: premiumData.token,
      })
    }
  } catch (error) {
    console.error("❌ Erro ao salvar via Mongoose:", error)

    // Tratamento específico de erros do Mongoose
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        {
          success: false,
          error: "Dados inválidos",
          details: Object.values(error.errors).map((err) => err.message),
        },
        { status: 400 },
      )
    }

    if (error instanceof mongoose.Error.CastError) {
      return NextResponse.json(
        {
          success: false,
          error: "Formato de dados inválido",
          details: error.message,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
