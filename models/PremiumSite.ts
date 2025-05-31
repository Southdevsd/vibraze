import mongoose from "mongoose"

// Schema centralizado para reutilização
const PremiumSiteSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, "Token é obrigatório"],
      unique: true,
      index: true, // Índice para busca rápida
    },
    id: { type: String, required: true },
    isPremium: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    views: { type: Number, default: 0, min: 0 },
    plan: {
      type: String,
      required: true,
      enum: ["premium", "lifetime"], // Validação de valores permitidos
    },
    paymentId: { type: String, required: true },

    // Informações do cliente
    customerInfo: {
      name: {
        type: String,
        required: [true, "Nome do cliente é obrigatório"],
        trim: true,
        maxlength: [100, "Nome muito longo"],
      },
      email: {
        type: String,
        required: [true, "Email é obrigatório"],
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Email inválido"],
      },
      cpf: {
        type: String,
        required: true,
        match: [/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF deve estar no formato XXX.XXX.XXX-XX"],
      },
      plan: { type: String, required: true },
      paymentId: { type: String, required: true },
      paymentDate: { type: Date, required: true },
    },

    // Configurações do site
    title: {
      type: String,
      required: [true, "Título é obrigatório"],
      trim: true,
      maxlength: [200, "Título muito longo"],
    },
    description: {
      type: String,
      default: "",
      maxlength: [1000, "Descrição muito longa"],
    },
    startDate: {
      type: Date,
      required: [true, "Data de início é obrigatória"],
    },
    theme: {
      type: String,
      default: "romantic",
      enum: ["romantic", "purple", "ocean", "sunset", "forest"],
    },

    names: {
      person1: {
        type: String,
        required: [true, "Primeiro nome é obrigatório"],
        trim: true,
        maxlength: [50, "Nome muito longo"],
      },
      person2: {
        type: String,
        default: "",
        trim: true,
        maxlength: [50, "Nome muito longo"],
      },
    },

    photos: {
      type: [String],
      validate: {
        validator: (photos: string[]) => photos.length <= 7,
        message: "Máximo de 7 fotos permitidas",
      },
    },
    banner: {
      type: String,
      default: "",
      validate: {
        validator: (url: string) => {
          if (!url) return true // Permite vazio
          return /^https?:\/\/.+/.test(url)
        },
        message: "Banner deve ser uma URL válida",
      },
    },
    emoji: {
      type: String,
      default: "❤️",
      maxlength: [10, "Emoji muito longo"],
    },
    backgroundColor: {
      type: String,
      default: "#ffffff",
      match: [/^#[0-9A-Fa-f]{6}$/, "Cor deve estar no formato hexadecimal (#RRGGBB)"],
    },

    // Spotify
    spotifyTrack: {
      name: { type: String, maxlength: [200, "Nome da música muito longo"] },
      artist: { type: String, maxlength: [200, "Nome do artista muito longo"] },
      preview_url: { type: String },
      id: { type: String },
      embed_url: { type: String },
      external_urls: {
        spotify: { type: String },
      },
    },
  },
  {
    timestamps: true, // Adiciona createdAt e updatedAt automaticamente
    collection: "premium_sites",
    // Índices compostos para consultas otimizadas
    indexes: [{ token: 1 }, { "customerInfo.email": 1 }, { paymentId: 1 }, { createdAt: -1 }],
  },
)

// Middleware para logs
PremiumSiteSchema.pre("save", function (next) {
  console.log(`💾 Salvando site premium: ${this.token}`)
  next()
})

PremiumSiteSchema.post("save", (doc) => {
  console.log(`✅ Site premium salvo: ${doc.token}`)
})

// Métodos personalizados
PremiumSiteSchema.methods.incrementViews = function () {
  this.views += 1
  this.updatedAt = new Date()
  return this.save()
}

PremiumSiteSchema.statics.findByToken = function (token: string) {
  return this.findOne({ token }).lean()
}

// Exportar modelo
export const PremiumSite = mongoose.models.PremiumSite || mongoose.model("PremiumSite", PremiumSiteSchema)

export default PremiumSite
