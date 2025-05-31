"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ExternalLink, Copy, Crown, ArrowLeft, AlertCircle, Share2, CheckCircle, Download, Mail } from "lucide-react"
import Link from "next/link"
import { generateQRCode } from "../lib/qrcode"

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
  plan: string
  paymentId: string
  paymentDate?: string
}

interface PremiumSiteData {
  token: string
  id: string
  title: string
  description: string
  startDate: string
  theme: string
  names?: {
    person1: string
    person2: string
  }
  photos: string[]
  spotifyTrack: SpotifyTrack | null
  spotifyUrl?: string
  emoji: string
  backgroundColor: string
  banner: string
  isPremium: boolean
  isActive?: boolean
  createdAt: string
  updatedAt?: string
  views: number
  plan: string
  paymentId: string
  customerInfo: CustomerInfo
}

// Função para buscar dados do localStorage de forma segura
const getSiteDataFromStorage = (submissionId: string): PremiumSiteData | null => {
  try {
    // Tentar múltiplas fontes de dados
    const sources = [`vibraze_premium_${submissionId}`, "Vibraze_sites", "Vibraze_premium_sites"]

    for (const source of sources) {
      try {
        const data = localStorage.getItem(source)
        if (!data) continue

        if (source === "Vibraze_sites") {
          const sites = JSON.parse(data)
          if (sites[submissionId] && sites[submissionId].isPremium) {
            return sites[submissionId] as PremiumSiteData
          }
        } else if (source === `vibraze_premium_${submissionId}`) {
          const siteData = JSON.parse(data)
          if (siteData && (siteData.isPremium || siteData.token === submissionId)) {
            return siteData as PremiumSiteData
          }
        } else if (source === "Vibraze_premium_sites") {
          const premiumSites = JSON.parse(data) as string[]
          if (Array.isArray(premiumSites) && premiumSites.includes(submissionId)) {
            // Se encontrou na lista, tentar buscar os dados específicos
            const specificData = localStorage.getItem(`vibraze_premium_${submissionId}`)
            if (specificData) {
              return JSON.parse(specificData) as PremiumSiteData
            }
          }
        }
      } catch (parseError) {
        console.warn(`Erro ao parsear dados de ${source}:`, parseError)
        continue
      }
    }

    return null
  } catch (error) {
    console.error("Erro geral ao buscar dados:", error)
    return null
  }
}

export default function SuccessPremiumPage() {
  const searchParams = useSearchParams()
  const submissionId = searchParams.get("submission_id")
  const paymentId = searchParams.get("payment_id")
  const plan = searchParams.get("plan")

  const [siteData, setSiteData] = useState<PremiumSiteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [sendingEmail, setSendingEmail] = useState(false)

  useEffect(() => {
    const fetchPremiumSiteData = async () => {
      if (!submissionId) {
        setError("ID de submissão não encontrado na URL")
        setLoading(false)
        return
      }

      console.log("Buscando dados para submission_id:", submissionId)

      try {
        // Buscar dados usando a função melhorada
        const site = getSiteDataFromStorage(submissionId)

        if (site) {
          console.log("✅ Dados encontrados:", site)
          setSiteData(site)

          // Gerar QR Code do site
          const siteUrl = `${window.location.origin}/site/${submissionId}`
          try {
            const qrUrl = await generateQRCode(siteUrl, 300)
            setQrCodeUrl(qrUrl)
            console.log("✅ QR Code gerado:", qrUrl)
          } catch (qrError) {
            console.warn("⚠️ Erro ao gerar QR Code:", qrError)
          }

          // Incrementar visualizações
          try {
            site.views = (site.views || 0) + 1
            site.updatedAt = new Date().toISOString()
            localStorage.setItem(`vibraze_premium_${submissionId}`, JSON.stringify(site))

            // Atualizar também na estrutura principal se existir
            const sites = localStorage.getItem("Vibraze_sites")
            if (sites) {
              const sitesObj = JSON.parse(sites)
              if (sitesObj[submissionId]) {
                sitesObj[submissionId] = site
                localStorage.setItem("Vibraze_sites", JSON.stringify(sitesObj))
              }
            }
          } catch (updateError) {
            console.warn("Erro ao atualizar visualizações:", updateError)
          }
        } else {
          console.error("❌ Site premium não encontrado")
          console.log("Dados disponíveis no localStorage:")

          // Debug: listar todas as chaves do localStorage
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key && (key.includes("vibraze") || key.includes("Vibraze"))) {
              console.log(`- ${key}`)
            }
          }

          setError("Site premium não encontrado. Verifique se o pagamento foi processado corretamente.")
        }
      } catch (err) {
        console.error("Erro ao carregar dados do site premium:", err)
        setError("Erro ao carregar dados do site premium. Tente recarregar a página.")
      } finally {
        setLoading(false)
      }
    }

    fetchPremiumSiteData()
  }, [submissionId])

  const copyLink = async (): Promise<void> => {
    if (submissionId) {
      try {
        const url = `${window.location.origin}/site/${submissionId}`
        await navigator.clipboard.writeText(url)
        alert("✅ Link copiado para a área de transferência!")
      } catch (err) {
        console.error("Erro ao copiar:", err)
        // Fallback para navegadores mais antigos
        const textArea = document.createElement("textarea")
        textArea.value = `${window.location.origin}/site/${submissionId}`
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)
        alert("✅ Link copiado!")
      }
    }
  }

  const sharesite = async (): Promise<void> => {
    if (!submissionId) return

    const url = `${window.location.origin}/site/${submissionId}`
    const title = siteData?.title || "Meu Site Premium"

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} - Vibraze Premium`,
          text: `Veja meu contador de amor premium: ${title}`,
          url: url,
        })
      } catch (err) {
        console.log("Erro ao compartilhar:", err)
        await copyLink()
      }
    } else {
      await copyLink()
    }
  }

  const downloadQRCode = async (): Promise<void> => {
    if (!qrCodeUrl) return

    try {
      const response = await fetch(qrCodeUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = `qrcode-${siteData?.title || "site"}-vibraze.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      alert("✅ QR Code baixado com sucesso!")
    } catch (error) {
      console.error("Erro ao baixar QR Code:", error)
      alert("❌ Erro ao baixar QR Code. Tente novamente.")
    }
  }

  const sendSiteEmail = async (): Promise<void> => {
    if (!siteData || !submissionId) return

    setSendingEmail(true)
    try {
      const siteUrl = `${window.location.origin}/site/${submissionId}`

      const response = await fetch("/api/send-site-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerEmail: siteData.customerInfo.email,
          customerName: siteData.customerInfo.name,
          siteTitle: siteData.title,
          siteUrl: siteUrl,
          token: submissionId,
          plan: siteData.plan,
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert("✅ Email enviado com sucesso! Verifique sua caixa de entrada.")
      } else {
        throw new Error(data.error || "Erro ao enviar email")
      }
    } catch (error) {
      console.error("Erro ao enviar email:", error)
      alert("❌ Erro ao enviar email. Tente novamente.")
    } finally {
      setSendingEmail(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-12 h-12 text-yellow-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Carregando seu site premium...</p>
          <p className="text-sm text-gray-500 mt-2">ID: {submissionId}</p>
        </div>
      </div>
    )
  }

  if (error || !submissionId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 flex items-center justify-center py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <AlertCircle className="w-20 h-20 text-red-500" />
              </div>
              <CardTitle className="text-3xl font-bold text-red-600 mb-2">Erro</CardTitle>
              <p className="text-gray-600 text-lg">{error || "Parâmetros inválidos"}</p>
              {submissionId && (
                <p className="text-sm text-gray-500 mt-2">
                  ID da submissão: <code className="bg-gray-100 px-1 rounded">{submissionId}</code>
                </p>
              )}
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-yellow-800 mb-2">💡 Possíveis soluções:</h4>
                <div className="text-sm text-yellow-700 space-y-1 text-left">
                  <p>• Verifique se o pagamento foi aprovado</p>
                  <p>• Aguarde alguns minutos e recarregue a página</p>
                  <p>• Verifique se você está no mesmo navegador usado para o pagamento</p>
                  <p>• Entre em contato com o suporte se o problema persistir</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => window.location.reload()} variant="outline" className="flex-1">
                  🔄 Recarregar Página
                </Button>

                <Link href="/checkout?plan=premium" className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Tentar Novamente
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 flex items-center justify-center py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="shadow-xl border-0 border-yellow-200">
          <CardHeader className="text-center pb-4 bg-gradient-to-r from-yellow-50 to-orange-50">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Crown className="w-20 h-20 text-yellow-500" fill="currentColor" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">
              🎉 Pagamento Aprovado!
            </CardTitle>
            <p className="text-gray-600 text-lg">
              Seu site premium <strong>{siteData?.title || "Vibraze"}</strong> está pronto!
            </p>
          </CardHeader>

          <CardContent className="text-center space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4">✨ Site Premium Ativado!</h3>

              <div className="bg-white border border-green-300 rounded-lg p-4 mb-4">
                <Label className="text-sm font-medium text-gray-700">Link do seu site premium:</Label>
                <div className="flex items-center mt-2">
                  <Input
                    value={`${typeof window !== "undefined" ? window.location.origin : ""}/site/${submissionId}`}
                    readOnly
                    className="font-mono text-sm bg-gray-50"
                  />
                  <Button onClick={copyLink} variant="outline" className="ml-2">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* QR Code Section */}
              {qrCodeUrl && (
                <div className="bg-white border border-blue-300 rounded-lg p-4 mb-4">
                  <Label className="text-sm font-medium text-blue-700 mb-3 block">📱 QR Code do Seu Site:</Label>
                  <div className="flex flex-col items-center space-y-3">
                    <img
                      src={qrCodeUrl || "/placeholder.svg"}
                      alt="QR Code do Site"
                      className="border-2 border-blue-200 rounded-lg p-2 bg-white"
                      width="200"
                      height="200"
                    />
                    <div className="flex gap-2">
                      <Button onClick={downloadQRCode} variant="outline" size="sm" className="border-blue-300">
                        <Download className="w-4 h-4 mr-1" />
                        Baixar QR Code
                      </Button>
                      <Button
                        onClick={sendSiteEmail}
                        variant="outline"
                        size="sm"
                        className="border-green-300"
                        disabled={sendingEmail}
                      >
                        <Mail className="w-4 h-4 mr-1" />
                        {sendingEmail ? "Enviando..." : "Enviar por Email"}
                      </Button>
                    </div>
                    <p className="text-xs text-blue-600">
                      Escaneie para acessar rapidamente ou imprima para compartilhar!
                    </p>
                  </div>
                </div>
              )}

              <div className="text-green-700 space-y-2 text-left">
                <p>✅ Pagamento aprovado com sucesso</p>
                <p>✅ Site premium ativado</p>
                <p>✅ Todos os recursos premium disponíveis</p>
                <p>✅ Armazenamento permanente</p>
                {paymentId && (
                  <p>
                    ✅ ID do Pagamento: <code className="bg-green-100 px-1 rounded text-xs">{paymentId}</code>
                  </p>
                )}
                {siteData && (
                  <>
                    <p>✅ Título: {siteData.title || "Site Premium"}</p>
                    {siteData.names?.person1 && siteData.names?.person2 && (
                      <p>
                        ✅ Casal: {siteData.names.person1} ❤️ {siteData.names.person2}
                      </p>
                    )}
                    {siteData.photos && siteData.photos.length > 0 && (
                      <p>✅ {siteData.photos.length} foto(s) premium</p>
                    )}
                    {siteData.spotifyTrack && <p>✅ Música do Spotify configurada</p>}
                    {siteData.emoji && <p>✅ Emoji personalizado: {siteData.emoji}</p>}
                    {siteData.banner && <p>✅ Banner personalizado</p>}
                    <p>✅ Visualizações: {siteData.views || 0}</p>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={sharesite}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg py-3"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Compartilhar Site
              </Button>

              <a href={`/site/${submissionId}`} target="_blank" rel="noopener noreferrer" className="block">
                <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-lg py-3">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Abrir Meu Site
                </Button>
              </a>
            </div>

            <div className="space-y-4">
              <Link href="/create">
                <Button variant="outline" className="w-full border-yellow-400 text-yellow-600 hover:bg-yellow-50">
                  <Crown className="w-4 h-4 mr-2" />
                  Criar Outro Site Premium
                </Button>
              </Link>

              <Link href="/">
                <Button variant="ghost" className="w-full">
                  Voltar ao Início
                </Button>
              </Link>
            </div>

            {siteData?.customerInfo && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-yellow-800 mb-2">📋 Informações da Compra:</h4>
                <div className="text-xs text-yellow-700 space-y-1 text-left">
                  <p>• Cliente: {siteData.customerInfo.name}</p>
                  <p>• Email: {siteData.customerInfo.email}</p>
                  <p>• Plano: {siteData.customerInfo.plan === "premium" ? "Premium Mensal" : "Lifetime"}</p>
                  <p>• ID do Pagamento: {siteData.customerInfo.paymentId}</p>
                  <p>• Data: {new Date(siteData.createdAt).toLocaleString("pt-BR")}</p>
                  {siteData.updatedAt && (
                    <p>• Última atualização: {new Date(siteData.updatedAt).toLocaleString("pt-BR")}</p>
                  )}
                </div>
              </div>
            )}

            <div className="text-sm text-gray-500">
              <p>🎉 Parabéns! Agora você tem acesso a todos os recursos premium!</p>
              <p>💎 Seu site ficará disponível permanentemente!</p>
              <p>📱 Use o QR Code para compartilhar facilmente!</p>
              <p className="text-xs mt-2">Token Premium: {submissionId}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
