"use client"

import type React from "react"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  ArrowLeft,
  CreditCard,
  Shield,
  Check,
  Copy,
  QrCode,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Mail,
  Crown,
  X,
  Palette,
  CalendarIcon,
  Cloud,
} from "lucide-react"
import Link from "next/link"
import { CounterPreview } from "@/components/counter-preview"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { SpotifyLinkInput } from "@/components/spotify-link-input"
import { uploadToImgBB, compressImageForUpload } from "../lib/imgbb"

// Definir tipos explícitos
interface SpotifyTrack {
  name: string
  artist: string
  preview_url: string
  id: string
  embed_url?: string
  external_urls?: {
    spotify: string
  }
}

interface CustomerInfo {
  name: string
  email: string
  cpf: string
  plan: string
  paymentId: string
  paymentDate: string
}

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
  customerInfo: CustomerInfo
  title: string
  description: string
  startDate: string
  theme: string
  names: {
    person1: string
    person2: string
  }
  photos: string[] // Agora serão URLs do ImgBB
  spotifyTrack: SpotifyTrack | null
  emoji: string
  backgroundColor: string
  banner: string // URL do ImgBB
}

interface PixData {
  payment_id: string
  qr_code: string
  qr_code_base64?: string
  qr_code_url: string
  pix_code: string
  amount: number
  description: string
  ticket_url?: string
  emailSent?: boolean
}

interface FormData {
  name: string
  email: string
  cpf: string
}

interface PremiumData {
  title: string
  description: string
  startDate: Date | undefined
  theme: string
  names: {
    person1: string
    person2: string
  }
  photos: string[] // URLs do ImgBB
  spotifyTrack: SpotifyTrack | null
  emoji: string
  backgroundColor: string
  banner: string // URL do ImgBB
}

const emojis = [
  "❤️",
  "💕",
  "💖",
  "💗",
  "💘",
  "💝",
  "💞",
  "💟",
  "🥰",
  "😍",
  "🌹",
  "💐",
  "🎀",
  "💎",
  "⭐",
  "✨",
  "🌟",
  "💫",
]

const themes = [
  { id: "romantic", name: "Romântico", colors: "from-pink-500 to-red-500" },
  { id: "purple", name: "Roxo Místico", colors: "from-purple-500 to-indigo-500" },
  { id: "ocean", name: "Oceano", colors: "from-blue-500 to-teal-500" },
  { id: "sunset", name: "Pôr do Sol", colors: "from-orange-500 to-pink-500" },
  { id: "forest", name: "Floresta", colors: "from-green-500 to-emerald-500" },
]

const formatCPF = (value: string): string => {
  const numbers = value.replace(/\D/g, "")
  if (numbers.length <= 11) {
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }
  return value
}

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const plan = searchParams.get("plan") || "premium"

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    cpf: "",
  })

  const [premiumData, setPremiumData] = useState<PremiumData>({
    title: "",
    description: "",
    startDate: undefined,
    theme: "romantic",
    names: { person1: "", person2: "" },
    photos: [],
    spotifyTrack: null,
    emoji: "",
    backgroundColor: "#ffffff",
    banner: "",
  })

  const [fallingEmojis, setFallingEmojis] = useState<Array<{ id: number; emoji: string; x: number; delay: number }>>([])
  const [uploadingPhotos, setUploadingPhotos] = useState<boolean>(false)
  const [uploadingBanner, setUploadingBanner] = useState<boolean>(false)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [pixData, setPixData] = useState<PixData | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null)
  const [isCheckingPayment, setIsCheckingPayment] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const plans = {
    premium: {
      name: "Premium",
      price: 10.99,
      period: "mensal",
      features: [
        "Contadores ilimitados",
        "Até 7 fotos por contador",
        "Música do Spotify integrada",
        "Emojis personalizados",
        "Cores de fundo customizadas",
        "Banner personalizado",
        "QR Code para impressão",
        "Email com link e QR Code",
        "Compartilhamento avançado",
        "Suporte prioritário",
      ],
    },
    lifetime: {
      name: "Lifetime",
      price: 20.99,
      period: "pagamento único",
      features: [
        "Tudo do Premium",
        "Acesso vitalício",
        "Novos recursos inclusos",
        "Backup automático",
        "Suporte VIP",
        "Sem mensalidades",
        "Recursos exclusivos futuros",
      ],
    },
  }

  const selectedPlan = plans[plan as keyof typeof plans]

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const formatted = formatCPF(e.target.value)
    setFormData({ ...formData, cpf: formatted })
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingPhotos(true)

    try {
      const maxPhotos = 7 - premiumData.photos.length
      const filesToUpload = Array.from(files).slice(0, maxPhotos)

      console.log(`📸 Fazendo upload de ${filesToUpload.length} foto(s) para ImgBB...`)

      for (const file of filesToUpload) {
        try {
          // Comprimir imagem antes do upload
          const compressedFile = await compressImageForUpload(file, 800, 0.8)

          // Fazer upload para ImgBB
          const imageUrl = await uploadToImgBB(compressedFile)

          // Adicionar URL à lista de fotos
          setPremiumData((prev) => ({
            ...prev,
            photos: [...prev.photos, imageUrl],
          }))

          console.log(`✅ Foto enviada: ${imageUrl}`)
        } catch (error) {
          console.error("❌ Erro no upload da foto:", error)
          alert(`Erro ao enviar foto ${file.name}. Tente novamente.`)
        }
      }
    } catch (error) {
      console.error("❌ Erro geral no upload:", error)
      alert("Erro ao enviar fotos. Verifique sua conexão e tente novamente.")
    } finally {
      setUploadingPhotos(false)
    }
  }

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingBanner(true)

    try {
      console.log("🖼️ Fazendo upload do banner para ImgBB...")

      // Comprimir banner antes do upload
      const compressedFile = await compressImageForUpload(file, 1200, 0.9)

      // Fazer upload para ImgBB
      const bannerUrl = await uploadToImgBB(compressedFile)

      setPremiumData((prev) => ({
        ...prev,
        banner: bannerUrl,
      }))

      console.log(`✅ Banner enviado: ${bannerUrl}`)
    } catch (error) {
      console.error("❌ Erro no upload do banner:", error)
      alert("Erro ao enviar banner. Tente novamente.")
    } finally {
      setUploadingBanner(false)
    }
  }

  const removePhoto = (index: number): void => {
    setPremiumData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }))
  }

  const handleEmojiClick = (emoji: string): void => {
    setPremiumData((prev) => ({ ...prev, emoji }))

    // Criar animação de emojis caindo
    const newFallingEmojis = Array.from({ length: 15 }, (_, i) => ({
      id: Date.now() + i,
      emoji: emoji,
      x: Math.random() * 100,
      delay: Math.random() * 1000,
    }))

    setFallingEmojis(newFallingEmojis)

    // Remover emojis após a animação
    setTimeout(() => {
      setFallingEmojis([])
    }, 3000)
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const payload = {
        plan,
        customer: formData,
        amount: selectedPlan.price,
        premiumData,
      }

      console.log("Enviando dados para criar PIX:", payload)

      const response = await fetch("/api/create-pix", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      console.log("Resposta da API create-pix:", data)

      if (!response.ok) {
        throw new Error(data.details || data.error || "Erro desconhecido ao gerar PIX")
      }

      if (data.success && data.qr_code) {
        setPixData(data)
        setError(null)
        console.log("PIX gerado com sucesso!")
      } else {
        throw new Error(data.details || data.error || "Erro ao gerar o código PIX")
      }
    } catch (err: any) {
      console.error("Erro na requisição:", err)
      setError(err.message || "Erro de conexão. Verifique sua internet e tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const copyPixCode = async (): Promise<void> => {
    if (pixData?.pix_code) {
      try {
        await navigator.clipboard.writeText(pixData.pix_code)
        alert("✅ Código PIX copiado para a área de transferência!")
      } catch (err) {
        console.error("Erro ao copiar:", err)
        const textArea = document.createElement("textarea")
        textArea.value = pixData.pix_code
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)
        alert("✅ Código PIX copiado!")
      }
    }
  }

  const checkPayment = async (): Promise<void> => {
    if (!pixData?.payment_id) return

    setIsCheckingPayment(true)

    try {
      console.log(`Verificando pagamento ${pixData.payment_id}`)
      const response = await fetch(`/api/check-payment?id=${pixData.payment_id}`)
      const data = await response.json()

      console.log("Status do pagamento:", data)
      setPaymentStatus(data.status)

      if (data.status === "approved") {
        // Gerar token único e consistente
        const timestamp = Date.now()
        const randomId = Math.random().toString(36).substring(2, 8)
        const premiumToken = `premium-${timestamp}-${randomId}`

        console.log("💾 SALVANDO DADOS PREMIUM COM TOKEN:", premiumToken)

        // Criar dados premium com URLs do ImgBB
        const premiumSiteData: PremiumSiteData = {
          token: premiumToken,
          id: premiumToken,
          isPremium: true,
          isActive: true,
          title: premiumData.title || "Site Premium",
          theme: premiumData.theme || "romantic",
          names: {
            person1: premiumData.names.person1 || formData.name.split(" ")[0] || "",
            person2: premiumData.names.person2 || "",
          },
          startDate: premiumData.startDate ? premiumData.startDate.toISOString() : new Date().toISOString(),
          backgroundColor: premiumData.backgroundColor || "#ffffff",
          emoji: premiumData.emoji || "❤️",
          description: premiumData.description || "",
          photos: premiumData.photos, // URLs do ImgBB
          banner: premiumData.banner, // URL do ImgBB
          spotifyTrack: premiumData.spotifyTrack,
          views: 0,
          plan: plan,
          paymentId: pixData.payment_id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          customerInfo: {
            name: formData.name,
            email: formData.email,
            cpf: formData.cpf,
            plan: plan,
            paymentId: pixData.payment_id,
            paymentDate: new Date().toISOString(),
          },
        }

        console.log("🌐 Salvando no servidor...")
        console.log("📋 Dados a serem salvos:", {
          token: premiumSiteData.token,
          title: premiumSiteData.title,
          photosCount: premiumSiteData.photos.length,
          hasSpotify: !!premiumSiteData.spotifyTrack,
          hasBanner: !!premiumSiteData.banner,
        })

        try {
          // SALVAR NO SERVIDOR
          const serverResponse = await fetch("/api/save-data", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(premiumSiteData),
          })

          console.log("📡 Status da resposta:", serverResponse.status)

          if (!serverResponse.ok) {
            const errorText = await serverResponse.text()
            console.error("❌ Erro HTTP:", serverResponse.status, errorText)
            throw new Error(`Erro HTTP ${serverResponse.status}: ${errorText}`)
          }

          const serverData = await serverResponse.json()
          console.log("📥 Resposta do servidor:", serverData)

          if (serverData.success) {
            console.log("✅ Site salvo no servidor com sucesso!")
            console.log("📂 Arquivo salvo em:", serverData.filePath)

            // Salvar também no localStorage como backup
            try {
              const dataString = JSON.stringify(premiumSiteData)
              localStorage.setItem(`vibraze_premium_${premiumToken}`, dataString)
              console.log("✅ Backup salvo no localStorage")
            } catch (localError) {
              console.warn("⚠️ Erro no localStorage, mas servidor OK:", localError)
            }

            // Testar se conseguimos buscar o site imediatamente
            console.log("🧪 Testando busca imediata...")
            try {
              const testResponse = await fetch(`/api/get-data?token=${premiumToken}`)
              const testData = await testResponse.json()

              if (testData.success) {
                console.log("✅ Teste de busca bem-sucedido!")
              } else {
                console.warn("⚠️ Teste de busca falhou:", testData.error)
              }
            } catch (testError) {
              console.warn("⚠️ Erro no teste de busca:", testError)
            }

            const finalMessage = `🎉 Site premium criado com sucesso!

📸 Fotos hospedadas: ${premiumSiteData.photos.length}
🖼️ Banner: ${premiumSiteData.banner ? "Sim" : "Não"}
🎨 Tema: ${premiumSiteData.theme}
🎵 Spotify: ${premiumSiteData.spotifyTrack ? "Sim" : "Não"}
🌐 Hospedado no servidor para acesso universal!
📱 QR Code será gerado automaticamente!
🔗 Token: ${premiumToken}`

            alert(finalMessage)

            // Redirecionar
            setTimeout(() => {
              const successUrl = `/success-premium?submission_id=${premiumToken}&payment_id=${pixData.payment_id}&plan=${plan}`
              console.log("🔗 Redirecionando para:", successUrl)
              window.location.href = successUrl
            }, 2000)
          } else {
            throw new Error(serverData.error || "Erro desconhecido do servidor")
          }
        } catch (serverError) {
          console.error("❌ Erro ao salvar no servidor:", serverError)
          alert(`❌ Erro ao salvar dados no servidor: ${serverError.message}. Entre em contato com o suporte.`)
        }
      } else if (data.status === "rejected") {
        alert("❌ Pagamento rejeitado. Tente novamente ou use outro método.")
      } else if (data.status === "pending") {
        alert("⏳ Pagamento ainda pendente. Continue aguardando ou tente verificar novamente em alguns instantes.")
      } else {
        alert(`📊 Status atual: ${data.status}`)
      }
    } catch (error) {
      console.error("Erro ao verificar pagamento:", error)
      alert("❌ Erro ao verificar pagamento. Tente novamente.")
    } finally {
      setIsCheckingPayment(false)
    }
  }

  const handleSpotifyTrackSelect = (track: SpotifyTrack | null): void => {
    setPremiumData((prev) => ({ ...prev, spotifyTrack: track }))
  }

  if (pixData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao início
            </Link>
            <div className="flex items-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                PIX Gerado com Sucesso!
              </h1>
            </div>
            <p className="text-gray-600 mt-2">
              Seu PIX foi gerado pelo Mercado Pago. Escaneie o QR Code ou copie o código para pagar.
            </p>

            {pixData.emailSent && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center">
                <Mail className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-blue-700 text-sm">
                  📧 Email de confirmação enviado para <strong>{formData.email}</strong>
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="shadow-lg border-green-200">
              <CardHeader className="bg-green-50">
                <CardTitle className="flex items-center text-green-700">
                  <QrCode className="w-5 h-5 mr-2" />
                  QR Code PIX - Mercado Pago
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6 pt-6">
                <div className="bg-white p-6 rounded-lg inline-block shadow-sm border-2 border-green-100">
                  {pixData.qr_code_base64 ? (
                    <img
                      src={`data:image/png;base64,${pixData.qr_code_base64}`}
                      alt="QR Code PIX"
                      className="w-48 h-48 mx-auto"
                    />
                  ) : (
                    <img
                      src={pixData.qr_code_url || "/placeholder.svg"}
                      alt="QR Code PIX"
                      className="w-48 h-48 mx-auto"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=192&width=192"
                      }}
                    />
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Código PIX (Copia e Cola)</Label>
                  <div className="flex mt-2">
                    <Input
                      value={pixData.pix_code}
                      readOnly
                      className="font-mono text-xs bg-gray-50"
                      style={{ fontSize: "10px" }}
                    />
                    <Button onClick={copyPixCode} variant="outline" className="ml-2 border-green-300 hover:bg-green-50">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={checkPayment}
                    disabled={isCheckingPayment}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    {isCheckingPayment ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Verificando Pagamento...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Verificar Pagamento
                      </>
                    )}
                  </Button>

                  {paymentStatus && (
                    <div
                      className={`p-4 rounded-lg ${
                        paymentStatus === "approved"
                          ? "bg-green-50 border border-green-200 text-green-800"
                          : paymentStatus === "rejected"
                            ? "bg-red-50 border border-red-200 text-red-800"
                            : "bg-yellow-50 border border-yellow-200 text-yellow-800"
                      }`}
                    >
                      <div className="flex items-center">
                        {paymentStatus === "approved" ? (
                          <CheckCircle className="w-5 h-5 mr-2" />
                        ) : (
                          <AlertCircle className="w-5 h-5 mr-2" />
                        )}
                        <span className="font-medium">
                          Status:{" "}
                          {paymentStatus === "approved"
                            ? "✅ Aprovado"
                            : paymentStatus === "rejected"
                              ? "❌ Rejeitado"
                              : "⏳ Pendente"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-sm text-gray-600 space-y-2 bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="font-medium text-blue-800">📱 Como pagar via PIX:</p>
                  <div className="text-left space-y-1">
                    <p>1. Abra o app do seu banco</p>
                    <p>2. Escolha a opção PIX</p>
                    <p>3. Escaneie o QR Code OU cole o código</p>
                    <p>4. Confirme o pagamento de R$ {pixData.amount.toFixed(2)}</p>
                    <p>5. Clique em "Verificar Pagamento" após pagar</p>
                  </div>
                </div>

                {pixData.ticket_url && (
                  <div className="pt-4">
                    <a
                      href={pixData.ticket_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      🎫 Ver comprovante no Mercado Pago
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Crown className="w-5 h-5 mr-2 text-yellow-500" />
                  Resumo Premium
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold">{selectedPlan.name}</h3>
                  <p className="text-gray-600">{selectedPlan.period}</p>
                  <p className="text-sm text-gray-500 mt-1">{pixData.description}</p>
                </div>

                <div className="space-y-3">
                  {selectedPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-green-600">R$ {pixData.amount.toFixed(2)}</span>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm font-medium text-green-800">Garantia de 30 dias</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Não ficou satisfeito? Devolvemos seu dinheiro em até 30 dias.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <QrCode className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-blue-800">QR Code Incluído</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    Receba por email o QR Code do seu site para imprimir e compartilhar!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-8 relative overflow-hidden">
      {/* Emojis caindo */}
      {fallingEmojis.map((item) => (
        <div
          key={item.id}
          className="fixed text-4xl pointer-events-none z-50 animate-bounce"
          style={{
            left: `${item.x}%`,
            top: "-50px",
            animationDelay: `${item.delay}ms`,
            animationDuration: "3s",
            animationFillMode: "forwards",
            animationName: "fall",
          }}
        >
          {item.emoji}
        </div>
      ))}

      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao início
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Finalizar Compra Premium
          </h1>
          <p className="text-gray-600 mt-2">Configure todos os recursos premium do seu site</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <div>
              <span className="text-red-700 font-medium">Erro ao gerar PIX:</span>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Informações de Cobrança */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-purple-500" />
                  Informações de Cobrança
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={handleCPFChange}
                    maxLength={14}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Configurações Premium */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Crown className="w-5 h-5 mr-2 text-yellow-500" />
                  Configurações Premium
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title">Título do Site</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Nosso Primeiro Encontro"
                    value={premiumData.title}
                    onChange={(e) => setPremiumData({ ...premiumData, title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="person1">Primeiro Nome</Label>
                    <Input
                      id="person1"
                      placeholder="Seu nome"
                      value={premiumData.names.person1}
                      onChange={(e) =>
                        setPremiumData({
                          ...premiumData,
                          names: { ...premiumData.names, person1: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="person2">Segundo Nome</Label>
                    <Input
                      id="person2"
                      placeholder="Nome do(a) parceiro(a)"
                      value={premiumData.names.person2}
                      onChange={(e) =>
                        setPremiumData({
                          ...premiumData,
                          names: { ...premiumData.names, person2: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>Data Especial</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {premiumData.startDate ? (
                          format(premiumData.startDate, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione a data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={premiumData.startDate}
                        onSelect={(date) => setPremiumData({ ...premiumData, startDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Conte um pouco sobre este momento especial..."
                    value={premiumData.description}
                    onChange={(e) => setPremiumData({ ...premiumData, description: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Tema</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {themes.map((theme) => (
                      <Button
                        key={theme.id}
                        type="button"
                        variant={premiumData.theme === theme.id ? "default" : "outline"}
                        className="justify-start h-auto p-3"
                        onClick={() => setPremiumData({ ...premiumData, theme: theme.id })}
                      >
                        <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${theme.colors} mr-2`} />
                        {theme.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Fotos Premium com ImgBB */}
                <div>
                  <Label className="flex items-center">
                    <Cloud className="w-4 h-4 mr-2" />
                    Fotos Premium (Hospedadas na Nuvem - Máximo 7)
                  </Label>
                  <div className="space-y-4">
                    {premiumData.photos.length < 7 && (
                      <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center bg-blue-50">
                        <Cloud className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                        <Label
                          htmlFor="premium-photos"
                          className="cursor-pointer text-sm text-blue-700 hover:text-blue-800"
                        >
                          {uploadingPhotos ? (
                            <div className="flex items-center justify-center">
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Enviando para ImgBB...
                            </div>
                          ) : (
                            `Adicionar fotos na nuvem (${premiumData.photos.length}/7)`
                          )}
                        </Label>
                        <Input
                          id="premium-photos"
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handlePhotoUpload}
                          disabled={uploadingPhotos}
                        />
                        <p className="text-xs text-blue-600 mt-2">☁️ Hospedadas no ImgBB - Sem limite de espaço!</p>
                      </div>
                    )}

                    {premiumData.photos.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {premiumData.photos.map((photoUrl, index) => (
                          <div key={index} className="relative">
                            <img
                              src={photoUrl || "/placeholder.svg"}
                              alt={`Foto ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg?height=80&width=80"
                              }}
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0"
                              onClick={() => removePhoto(index)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                            <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                              ☁️
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Banner Premium com ImgBB */}
                <div>
                  <Label className="flex items-center">
                    <Cloud className="w-4 h-4 mr-2" />
                    Banner Personalizado (Hospedado na Nuvem)
                  </Label>
                  <div className="space-y-2">
                    {premiumData.banner ? (
                      <div className="relative">
                        <img
                          src={premiumData.banner || "/placeholder.svg"}
                          alt="Banner"
                          className="w-full h-20 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg?height=80&width=320"
                          }}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0"
                          onClick={() => setPremiumData((prev) => ({ ...prev, banner: "" }))}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                        <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                          ☁️ ImgBB
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center bg-blue-50">
                        <Cloud className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                        <Label htmlFor="banner" className="cursor-pointer text-sm text-blue-700">
                          {uploadingBanner ? (
                            <div className="flex items-center justify-center">
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Enviando banner...
                            </div>
                          ) : (
                            "Adicionar banner na nuvem"
                          )}
                        </Label>
                        <Input
                          id="banner"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleBannerUpload}
                          disabled={uploadingBanner}
                        />
                        <p className="text-xs text-blue-600 mt-1">☁️ Hospedado no ImgBB</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Música do Spotify */}
                <div>
                  <SpotifyLinkInput onTrackSelect={handleSpotifyTrackSelect} selectedTrack={premiumData.spotifyTrack} />
                </div>

                {/* Emoji Premium */}
                <div>
                  <Label>Emoji Especial (Clique para ver a animação!)</Label>
                  <div className="grid grid-cols-6 gap-2 p-3 border rounded-lg">
                    {emojis.map((emoji) => (
                      <Button
                        key={emoji}
                        type="button"
                        variant={premiumData.emoji === emoji ? "default" : "ghost"}
                        className="w-10 h-10 text-lg p-0 hover:scale-110 transition-transform"
                        onClick={() => handleEmojiClick(emoji)}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                  {premiumData.emoji && (
                    <p className="text-xs text-green-600 mt-1">✨ Emoji selecionado: {premiumData.emoji}</p>
                  )}
                </div>

                {/* Cor de Fundo */}
                <div>
                  <Label className="flex items-center">
                    <Palette className="w-4 h-4 mr-2" />
                    Cor de Fundo
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={premiumData.backgroundColor}
                      onChange={(e) =>
                        setPremiumData((prev) => ({
                          ...prev,
                          backgroundColor: e.target.value,
                        }))
                      }
                      className="w-20"
                    />
                    <div
                      className="w-10 h-10 rounded border-2 border-gray-300"
                      style={{ backgroundColor: premiumData.backgroundColor }}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Pagamento seguro via PIX processado pelo Mercado Pago</span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                  <QrCode className="w-4 h-4 text-blue-500" />
                  <span>QR Code gerado automaticamente + Email com link para impressão!</span>
                </div>

                <Button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  disabled={isLoading || uploadingPhotos || uploadingBanner}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Gerando PIX...
                    </>
                  ) : uploadingPhotos || uploadingBanner ? (
                    <>
                      <Cloud className="w-4 h-4 mr-2" />
                      Aguarde o upload das imagens...
                    </>
                  ) : (
                    `🚀 Gerar PIX Premium - R$ ${selectedPlan.price.toFixed(2)}`
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Preview do Site Premium */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Crown className="w-5 h-5 mr-2 text-yellow-500" />
                  Preview do Seu Site Premium
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CounterPreview
                  title={premiumData.title}
                  names={premiumData.names}
                  startDate={premiumData.startDate}
                  theme={premiumData.theme}
                  description={premiumData.description}
                  photos={premiumData.photos}
                  spotifyTrack={premiumData.spotifyTrack}
                  emoji={premiumData.emoji}
                  banner={premiumData.banner}
                  isPremium={true}
                />
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Resumo Premium</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold">{selectedPlan.name}</h3>
                  <p className="text-gray-600">{selectedPlan.period}</p>
                </div>

                <div className="space-y-3">
                  {selectedPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span>R$ {selectedPlan.price.toFixed(2)}</span>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm font-medium text-green-800">Garantia de 30 dias</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Não ficou satisfeito? Devolvemos seu dinheiro em até 30 dias.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <QrCode className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-blue-800">QR Code Incluído</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    Receba por email o QR Code do seu site para imprimir e compartilhar!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
