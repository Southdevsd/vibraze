"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, ExternalLink, Copy, Crown, ArrowLeft, AlertCircle } from "lucide-react"
import Link from "next/link"

interface SiteData {
  token: string
  title: string
  description: string
  startDate: string
  theme: string
  names: { person1: string; person2: string }
  photos: string[]
  spotifyTrack: any
  spotifyUrl: string
  emoji: string
  backgroundColor: string
  banner: string
  isPremium: boolean
  createdAt: string
  views: number
}

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const submissionId = searchParams.get("submission_id")

  const [siteData, setSiteData] = useState<SiteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSiteData = async () => {
      if (!submissionId) {
        setError("ID de submissão não encontrado")
        setLoading(false)
        return
      }

      try {
        console.log(`Buscando dados do site: ${submissionId}`)

        // Primeiro tentar localStorage
        if (typeof window !== "undefined") {
          const sites = JSON.parse(localStorage.getItem("Vibraze_sites") || "{}")
          const localSite = sites[submissionId]

          if (localSite) {
            setSiteData(localSite)
            setLoading(false)
            return
          }
        }

        // Se não encontrou no localStorage, tentar API
        const response = await fetch(`/api/create-site?token=${submissionId}`)
        const data = await response.json()

        if (data.success) {
          setSiteData(data.site)
          console.log("Dados do site carregados:", data.site)
        } else {
          setError("Site não encontrado")
        }
      } catch (err) {
        console.error("Erro ao carregar dados do site:", err)
        setError("Erro ao carregar dados do site")
      } finally {
        setLoading(false)
      }
    }

    fetchSiteData()
  }, [submissionId])

  const copyLink = () => {
    if (submissionId) {
      const url = `${window.location.origin}/site/${submissionId}`
      navigator.clipboard.writeText(url)
      alert("✅ Link copiado!")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-12 h-12 text-green-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Carregando informações do site...</p>
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
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/create">
                <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Criar Novo Site
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Heart className="w-20 h-20 text-green-500" fill="currentColor" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-green-600 mb-2">Site Criado com Sucesso!</CardTitle>
            <p className="text-gray-600 text-lg">{siteData?.title || "Seu site"} está pronto e já pode ser acessado!</p>
          </CardHeader>

          <CardContent className="text-center space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4">🎉 Seu site foi criado!</h3>

              <div className="bg-white border border-green-300 rounded-lg p-4 mb-4">
                <Label className="text-sm font-medium text-gray-700">Link do seu site:</Label>
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

              <div className="text-green-700 space-y-2 text-left">
                <p>✅ Site criado com sucesso</p>
                <p>
                  ✅ ID único: <code className="bg-green-100 px-1 rounded text-xs">{submissionId}</code>
                </p>
                <p>✅ Contador funcionando em tempo real</p>
                <p>✅ Pronto para compartilhar</p>
                {siteData && (
                  <>
                    <p>✅ Título: {siteData.title}</p>
                    {siteData.names.person1 && siteData.names.person2 && (
                      <p>
                        ✅ Casal: {siteData.names.person1} ❤️ {siteData.names.person2}
                      </p>
                    )}
                    {siteData.photos.length > 0 && <p>✅ {siteData.photos.length} foto(s) adicionada(s)</p>}
                    {siteData.spotifyTrack && <p>✅ Música do Spotify configurada</p>}
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <a href={`/site/${submissionId}`} target="_blank" rel="noopener noreferrer" className="block">
                <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-lg py-3">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Abrir Meu Site
                </Button>
              </a>

              <Link href="/checkout?plan=premium">
                <Button variant="outline" className="w-full border-yellow-400 text-yellow-600 hover:bg-yellow-50">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade para Premium - Mais Recursos
                </Button>
              </Link>

              <Link href="/create">
                <Button variant="ghost" className="w-full">
                  Criar Outro Site
                </Button>
              </Link>

              <Link href="/">
                <Button variant="ghost" className="w-full">
                  Voltar ao Início
                </Button>
              </Link>
            </div>

            <div className="text-sm text-gray-500">
              <p>💡 Seu site ficará disponível permanentemente neste link!</p>
              <p>Compartilhe com quem quiser! ❤️</p>
              <p className="text-xs mt-2">Submission ID: {submissionId}</p>
              {siteData && <p className="text-xs">Criado em: {new Date(siteData.createdAt).toLocaleString("pt-BR")}</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
