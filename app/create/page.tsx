"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Heart, ArrowLeft, Crown, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"
import { CounterPreview } from "@/components/counter-preview"
import { useRouter } from "next/navigation"
import { SpotifyLinkInput } from "@/components/spotify-link-input"

export default function CreatePage() {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: undefined as Date | undefined,
    theme: "romantic",
    names: { person1: "", person2: "" },
    photos: [] as string[],
    spotifyTrack: null as { name: string; artist: string; preview_url: string; id: string; embed_url: string } | null,
    spotifyUrl: "",
    emoji: "",
    backgroundColor: "#ffffff",
    banner: "",
  })

  const themes = [
    { id: "romantic", name: "Romântico", colors: "from-pink-500 to-red-500" },
    { id: "purple", name: "Roxo Místico", colors: "from-purple-500 to-indigo-500" },
    { id: "ocean", name: "Oceano", colors: "from-blue-500 to-teal-500" },
    { id: "sunset", name: "Pôr do Sol", colors: "from-orange-500 to-pink-500" },
    { id: "forest", name: "Floresta", colors: "from-green-500 to-emerald-500" },
  ]

  const generateSiteToken = () => {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substring(2, 8)
    return `fc-${timestamp}-${random}`
  }

  // Função simplificada para salvar no localStorage
  const saveToLocalStorage = (token: string, siteData: any) => {
    try {
      if (typeof window === "undefined") {
        console.log("⚠️ Window não disponível (SSR)")
        return false
      }

      // Limpar sites antigos primeiro
      const sites = JSON.parse(localStorage.getItem("Vibraze_sites") || "{}")
      const now = Date.now()
      const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000

      // Remover sites antigos
      Object.keys(sites).forEach((key) => {
        const site = sites[key]
        if (site.createdAt && new Date(site.createdAt).getTime() < oneWeekAgo) {
          delete sites[key]
        }
      })

      // Adicionar novo site
      sites[token] = siteData

      // Salvar
      localStorage.setItem("Vibraze_sites", JSON.stringify(sites))

      console.log("✅ Site salvo no localStorage:", token)
      console.log("📊 Total de sites:", Object.keys(sites).length)

      return true
    } catch (error) {
      console.error("❌ Erro ao salvar no localStorage:", error)
      return false
    }
  }

  // Função para verificar se o site foi salvo
  const verifySiteExists = (token: string) => {
    try {
      if (typeof window === "undefined") return false

      const sites = JSON.parse(localStorage.getItem("Vibraze_sites") || "{}")
      const exists = !!sites[token]
      console.log(`🔍 Verificação do site ${token}:`, exists)
      return exists
    } catch (error) {
      console.error("❌ Erro na verificação:", error)
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)
    setError(null)

    try {
      // Validação básica
      if (!formData.title.trim()) {
        throw new Error("Título é obrigatório")
      }

      // Gerar token único
      const siteToken = generateSiteToken()
      console.log("🎯 Token gerado:", siteToken)

      // Preparar dados do site
      const siteData = {
        ...formData,
        token: siteToken,
        isPremium: false,
        createdAt: new Date().toISOString(),
        views: 0,
      }

      console.log("📦 Dados preparados:", {
        token: siteData.token,
        title: siteData.title,
        theme: siteData.theme,
        hasDate: !!siteData.startDate,
        hasSpotify: !!siteData.spotifyTrack,
      })

      // Salvar no localStorage
      const savedLocally = saveToLocalStorage(siteToken, siteData)

      if (!savedLocally) {
        throw new Error("Erro ao salvar dados localmente")
      }

      // Verificar se realmente foi salvo
      const verified = verifySiteExists(siteToken)
      if (!verified) {
        throw new Error("Erro na verificação dos dados salvos")
      }

      // Tentar salvar no servidor (opcional)
      try {
        const response = await fetch("/api/create-site", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(siteData),
        })

        if (response.ok) {
          const result = await response.json()
          console.log("✅ Também salvo no servidor:", result.success)
        } else {
          console.log("⚠️ Servidor não disponível, mas localStorage funcionou")
        }
      } catch (apiError) {
        console.log("⚠️ API não disponível, mas localStorage funcionou:", apiError)
      }

      console.log("🎉 Site criado com sucesso!")

      // Redirecionar para página de sucesso
      router.push(`/success?submission_id=${siteToken}`)
    } catch (error) {
      console.error("❌ Erro ao criar site:", error)
      setError(error instanceof Error ? error.message : "Erro ao criar site. Tente novamente.")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao início
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Criar Meu Site
          </h1>
          <p className="text-gray-600 mt-2">Preencha os detalhes para criar seu site personalizado</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <div>
              <span className="text-red-700 font-medium">Erro:</span>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="w-5 h-5 mr-2 text-pink-500" />
                Detalhes do Site
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title">Título do Contador *</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Nosso Primeiro Encontro"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="person1">Primeiro Nome</Label>
                    <Input
                      id="person1"
                      placeholder="Seu nome"
                      value={formData.names.person1}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          names: { ...formData.names, person1: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="person2">Segundo Nome</Label>
                    <Input
                      id="person2"
                      placeholder="Nome do(a) parceiro(a)"
                      value={formData.names.person2}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          names: { ...formData.names, person2: e.target.value },
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
                        {formData.startDate ? (
                          format(formData.startDate, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione a data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) => setFormData({ ...formData, startDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="description">Descrição (Opcional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Conte um pouco sobre este momento especial..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Tema</Label>
                  <Select value={formData.theme} onValueChange={(value) => setFormData({ ...formData, theme: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha um tema" />
                    </SelectTrigger>
                    <SelectContent>
                      {themes.map((theme) => (
                        <SelectItem key={theme.id} value={theme.id}>
                          <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${theme.colors} mr-2`} />
                            {theme.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Música do Spotify */}
                <div>
                  <SpotifyLinkInput
                    onTrackSelect={(track) => setFormData((prev) => ({ ...prev, spotifyTrack: track }))}
                    selectedTrack={formData.spotifyTrack}
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Informações:</h4>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Sites são salvos no seu navegador</li>
                    <li>• Funciona offline após criação</li>
                    <li>• Para mais recursos, considere a versão Premium</li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <Heart className="w-4 h-4 mr-2 animate-pulse" />
                      Criando Seu Site...
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 mr-2" />
                      Criar Meu Site
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <Link href="/checkout?plan=premium">
                    <Button variant="outline" className="w-full border-yellow-400 text-yellow-600 hover:bg-yellow-50">
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade para Premium
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          <div>
            <CounterPreview
              title={formData.title || "Seu Site"}
              names={formData.names}
              startDate={formData.startDate}
              theme={formData.theme}
              description={formData.description}
              photos={formData.photos}
              spotifyTrack={formData.spotifyTrack}
              emoji={formData.emoji}
              isPremium={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
