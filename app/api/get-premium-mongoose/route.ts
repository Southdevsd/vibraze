import { type NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"

// Usar o mesmo schema (você pode extrair para um arquivo separado)
const PremiumSiteSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true },
    id: { type: String, required: true },
    isPremium: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
    plan: { type: String, required: true },
    paymentId: { type: String, required: true },

    customerInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      cpf: { type: String, required: true },
      plan: { type: String, required: true },
      paymentId: { type: String, required: true },
      paymentDate: { type: Date, required: true },
    },

    title: { type: String, required: true },
    description: { type: String, default: "" },
    startDate: { type: Date, required: true },
    theme: { type: String, default: "romantic" },

    names: {
      person1: { type: String, required: true },
      person2: { type: String, default: "" },
    },

    photos: [{ type: String }],
    banner: { type: String, default: "" },
    emoji: { type: String, default: "❤️" },
    backgroundColor: { type: String, default: "#ffffff" },

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
    timestamps: true,
    collection: "premium_sites",
  },
)

const PremiumSite = mongoose.models.PremiumSite || mongoose.model("PremiumSite", PremiumSiteSchema)

async function connectToDatabase() {
  if (mongoose.connection.readyState === 0) {
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/vibraze"
    await mongoose.connect(MONGODB_URI)
    console.log("✅ Conectado ao MongoDB via Mongoose")
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    console.log("🔍 Buscando site premium via Mongoose:", token)

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Token é obrigatório",
        },
        { status: 400 },
      )
    }

    // Conectar ao MongoDB
    await connectToDatabase()

    // Buscar e incrementar visualizações em uma operação atômica
    const premiumSite = await PremiumSite.findOneAndUpdate(
      { token },
      {
        $inc: { views: 1 },
        $set: { updatedAt: new Date() },
      },
      {
        new: true, // Retorna o documento atualizado
        lean: true, // Retorna objeto JavaScript puro (mais rápido)
      },
    )

    if (!premiumSite) {
      console.log("❌ Site premium não encontrado")
      return NextResponse.json(
        {
          success: false,
          error: "Site premium não encontrado",
        },
        { status: 404 },
      )
    }

    console.log("✅ Site premium encontrado via Mongoose:", {
      token: premiumSite.token,
      title: premiumSite.title,
      views: premiumSite.views,
    })

    // Remover _id e __v do Mongoose antes de retornar
    const { _id, __v, ...siteData } = premiumSite

    return NextResponse.json({
      success: true,
      data: siteData,
    })
  } catch (error) {
    console.error("❌ Erro ao buscar via Mongoose:", error)

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
