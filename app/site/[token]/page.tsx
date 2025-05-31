"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Share2, Eye, ArrowLeft, RefreshCw, Crown, AlertCircle } from "lucide-react"
import Link from "next/link"
import { SpotifyPlayer } from "../../../components/spotify-player"
import { motion, AnimatePresence } from "framer-motion"

interface SpotifyTrack {
  name: string
  artist: string
  preview_url: string | null
  id: string
  embed_url?: string
  external_url?: string
  external_urls?: {
    spotify: string
  }
  image?: string
  album?: {
    images: Array<{
      url: string
      height: number
      width: number
    }>
  }
}

interface SiteData {
  token: string
  id?: string
  title: string
  description: string
  startDate: string
  theme: string
  names?: {
    person1: string
    person2: string
  }
  photos: string[]
  spotifyTrack?: SpotifyTrack | null
  spotifyUrl?: string
  emoji: string
  backgroundColor: string
  banner: string
  isPremium: boolean
  isActive?: boolean
  createdAt: string
  updatedAt?: string
  views: number
  plan?: string
  paymentId?: string
  customerInfo?: {
    name: string
    email: string
    plan: string
    paymentId: string
  }
}

export default function SitePage() {
  const params = useParams()
  const token = params.token as string

  const [siteData, setSiteData] = useState<SiteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [hasEntered, setHasEntered] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  const themes = {
    romantic: "from-pink-500 to-red-500",
    purple: "from-purple-500 to-indigo-500",
    ocean: "from-blue-500 to-teal-500",
    sunset: "from-orange-500 to-pink-500",
    forest: "from-green-500 to-emerald-500",
  }

  // Função para buscar dados do servidor
  const fetchSiteFromServer = async (token: string): Promise<SiteData | null> => {
    try {
      console.log("🌐 Buscando site no servidor:", token)

      const response = await fetch(`/api/get-premium-site?token=${token}`)
      const data = await response.json()

      if (data.success) {
        console.log("✅ Site encontrado no servidor:", data.data.title)
        return data.data
      } else {
        console.log("❌ Site não encontrado no servidor")
        return null
      }
    } catch (error) {
      console.error("❌ Erro ao buscar no servidor:", error)
      return null
    }
  }

  // Função para buscar dados do localStorage (fallback)
  const getFromLocalStorage = (token: string): SiteData | null => {
    try {
      console.log("💾 Buscando no localStorage como fallback:", token)

      // Buscar como site premium específico
      const premiumKey = `vibraze_premium_${token}`
      const premiumData = localStorage.getItem(premiumKey)
      if (premiumData) {
        const site = JSON.parse(premiumData)
        console.log("✅ Site encontrado no localStorage")
        return site
      }

      // Buscar na estrutura principal
      const sitesData = localStorage.getItem("Vibraze_sites")
      if (sitesData) {
        const sites = JSON.parse(sitesData)
        if (sites[token]) {
          console.log("✅ Site encontrado em Vibraze_sites")
          return sites[token]
        }
      }

      console.log("❌ Site não encontrado no localStorage")
      return null
    } catch (error) {
      console.error("❌ Erro no localStorage:", error)
      return null
    }
  }

  const fetchSite = async () => {
    setLoading(true)
    setError(null)

    try {
      console.log(`🚀 CARREGANDO SITE COM TOKEN: ${token}`)

      // PRIORIDADE 1: Buscar no servidor
      let siteData = await fetchSiteFromServer(token)

      // PRIORIDADE 2: Fallback para localStorage
      if (!siteData) {
        console.log("🔄 Tentando localStorage como fallback...")
        siteData = getFromLocalStorage(token)
      }

      if (siteData) {
        console.log("✅ SITE CARREGADO COM SUCESSO!")
        setSiteData(siteData)
      } else {
        setError("Site não encontrado")
      }
    } catch (err) {
      console.error("❌ Erro ao carregar site:", err)
      setError("Erro ao carregar site")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchSite()
    }
  }, [token])

  // Contador em tempo real
  useEffect(() => {
    if (!siteData?.startDate) return

    const updateCounter = () => {
      const now = new Date()
      const startDate = new Date(siteData.startDate)
      const diff = now.getTime() - startDate.getTime()

      if (diff < 0) {
        setTimeElapsed({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365))
      const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30))
      const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeElapsed({ years, months, days, hours, minutes, seconds })
    }

    updateCounter()
    const interval = setInterval(updateCounter, 1000)
    return () => clearInterval(interval)
  }, [siteData?.startDate])

  // Rotação de fotos
  useEffect(() => {
    if (!siteData?.photos || siteData.photos.length <= 1) return

    const interval = setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev + 1) % siteData.photos.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [siteData?.photos])

  const sharesite = async () => {
    const url = window.location.href
    const title = siteData?.title || "Meu Contador de Amor"

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} - Vibraze`,
          text: `Veja nosso contador de amor: ${title}`,
          url: url,
        })
      } catch (err) {
        copyToClipboard(url)
      }
    } else {
      copyToClipboard(url)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("✅ Link copiado!")
      })
      .catch(() => {
        const textArea = document.createElement("textarea")
        textArea.value = text
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)
        alert("✅ Link copiado!")
      })
  }

  // Função para converter SpotifyTrack para o formato esperado pelo SpotifyPlayer
  const convertSpotifyTrack = (track: SpotifyTrack) => {
    return {
      id: track.id,
      name: track.name,
      artist: track.artist,
      image: track.image || track.album?.images?.[0]?.url || "",
      preview_url: track.preview_url || "",
      embed_url: track.embed_url || `https://open.spotify.com/embed/track/${track.id}?utm_source=generator&theme=0`,
      external_url: track.external_url || track.external_urls?.spotify || "",
    }
  }

  const handleEnter = () => {
    setHasEntered(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-12 h-12 text-pink-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Carregando seu site...</p>
          <p className="text-xs text-gray-500 mt-2">Token: {token}</p>
          <div className="mt-4 text-sm text-gray-500">
            <p>🌐 Buscando no servidor...</p>
            <p>💾 Verificando localStorage...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !siteData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">💔</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Site não encontrado</h1>
          <p className="text-gray-600 mb-4">O site que você está procurando não existe ou foi removido.</p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-red-700">
              <strong>Token procurado:</strong> <code className="bg-red-100 px-1 rounded">{token}</code>
            </p>
            <div className="mt-2 text-xs text-red-600">
              <p>🌐 Verificado no servidor: ❌</p>
              <p>💾 Verificado no localStorage: ❌</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button onClick={fetchSite} variant="outline" className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>

            <Link href="/create">
              <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Criar Novo Site
              </Button>
            </Link>
          </div>

          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center text-blue-800 text-sm">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span className="font-medium">Possíveis causas:</span>
            </div>
            <div className="text-xs text-blue-700 mt-2 text-left">
              <p>• Site ainda não foi criado ou pagamento não foi aprovado</p>
              <p>• Token inválido ou expirado</p>
              <p>• Problema temporário no servidor</p>
              <p>• Site foi removido por inatividade</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {!hasEntered ? (
          // BOTÃO DE ENTRADA
          <motion.div
  key="entrance"
  initial={{ opacity: 1 }}
  exit={{
    opacity: 0,
    scale: 0.8,
    filter: "blur(10px)",
  }}
  transition={{ duration: 0.8 }}
  className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-100 to-pink-50 flex items-center justify-center p-4"
>
  {/* Background glow effect */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000" />
  </div>

  <div className="relative z-10 text-center space-y-8">
    {/* Site title */}
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-2"
    >
      <h1 className="text-2xl md:text-3xl font-bold text-purple-800">{siteData.title}</h1>
      <div className="flex items-center justify-center gap-2 text-pink-400">
      </div>
    </motion.div>

    {/* Main entrance button */}
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <motion.button
        onClick={handleEnter}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="relative group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Glow effect */}
  <div className="absolute inset-0 rounded-xl border-4 border-cyan-400 opacity-50 blur-md animate-pulse pointer-events-none" />
{/* Button background */}
<div className="relative rounded-2xl p-1 border-2 border-pink-400">
  <div className="bg-transparent backdrop-blur-sm rounded-xl px-8 py-4">
    <div className="flex items-center justify-center gap-4">
      {/* Emoji do site */}
      <motion.div
        animate={{
          rotate: isHovered ? [0, -10, 10, 0] : 0,
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ duration: 0.3 }}
        className="text-3xl md:text-4xl"
      >
        {siteData.emoji}
      </motion.div>

      {/* Click text */}
      <motion.span
        animate={{
          color: isHovered ? "#000000" : "#000000",
        }}
        className="text-xl md:text-2xl font-bold tracking-wider text-black"
      >
        Surpresa
      </motion.span>
    </div>
  </div>
</div>



        {/* Sparkle effects */}
        <AnimatePresence>
          {isHovered && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: Math.random() * 200 - 100,
                    y: Math.random() * 200 - 100,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.1,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 2,
                  }}
                  className="absolute w-2 h-2 bg-pink-300 rounded-full"
                  style={{
                    left: "50%",
                    top: "50%",
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>

    {/* Subtitle */}
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="text-purple-700/80 text-sm md:text-base max-w-md mx-auto"
    >
    </motion.p>

    {/* Floating hearts */}
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 0,
            x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 800),
            y: (typeof window !== "undefined" ? window.innerHeight : 600) + 50,
          }}
          animate={{
            opacity: [0, 0.6, 0],
            y: -50,
            x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 800),
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            delay: i * 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute text-pink-300/40 text-xl"
        >
          💕
        </motion.div>
      ))}
    </div>
  </div>
</motion.div>
        ) : (
          // SITE PRINCIPAL
          <motion.div
            key="site"
            initial={{
              opacity: 0,
              scale: 1.1,
              filter: "blur(10px)",
            }}
            animate={{
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
            }}
            transition={{ duration: 0.8 }}
            className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200 py-8"
          >
            <div className="max-w-md mx-auto px-4">
              {/* Header simples */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-4 mb-4">
                </div>

                {siteData.isPremium && (
                  <div className="">
                  </div>
                )}
              </div>

              {/* Site principal com design da imagem */}
              <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                <CardContent className="text-center space-y-6 p-8">
                  {/* Player do Spotify (se houver) - INTEGRADO */}
                  {(siteData.spotifyTrack || siteData.spotifyUrl) && (
                    <div className="space-y-3">
                      <SpotifyPlayer
                        track={siteData.spotifyTrack ? convertSpotifyTrack(siteData.spotifyTrack) : undefined}
                        spotifyUrl={siteData.spotifyUrl}
                        loading={false}
                      />
                    </div>
                  )}

                  {/* Banner Premium */}
                  {siteData.banner && (
                    <div className="space-y-3">
                      {/* Linha do tema em cima do banner */}
                      <div
                        className={`h-1 bg-gradient-to-r ${themes[siteData.theme as keyof typeof themes]} rounded-full`}
                      />
                      <div>
                        <img
                          src={siteData.banner || "/placeholder.svg?height=96&width=384"}
                          alt="Banner"
                          className="w-full h-24 object-cover rounded-lg shadow-sm"
                          onError={(e) => {
                            console.log("❌ Erro ao carregar banner:", siteData.banner)
                            e.currentTarget.src = "/placeholder.svg?height=96&width=384"
                          }}
                          onLoad={() => {
                            console.log("✅ Banner carregado com sucesso")
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Fotos (se houver) */}
                  {siteData.photos && siteData.photos.length > 0 && (
                    <div className="space-y-3">
                      <div className="relative w-64 mx-auto">
                        <img
                          src={siteData.photos[currentPhotoIndex] || "/placeholder.svg?height=451&width=256"}
                          alt={`Foto ${currentPhotoIndex + 1}`}
                          className="w-64 h-[451px] object-cover rounded-lg shadow-lg"
                          style={{ width: "256px", height: "451px" }}
                          onError={(e) => {
                            console.log(
                              `❌ Erro ao carregar foto ${currentPhotoIndex + 1}:`,
                              siteData.photos[currentPhotoIndex],
                            )
                            e.currentTarget.src = "/placeholder.svg?height=451&width=256"
                          }}
                          onLoad={() => {
                            console.log(`✅ Foto ${currentPhotoIndex + 1} carregada com sucesso`)
                          }}
                        />
                        {siteData.photos.length > 1 && (
                          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                            {siteData.photos.map((_, index) => (
                              <div
                                key={index}
                                className={`w-2 h-2 rounded-full ${index === currentPhotoIndex ? "bg-white" : "bg-white/50"}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Título principal */}
                  <div className="space-y-2">
                    <h1 className="text-base text-gray-700 leading-relaxed">
                      Um amor que começou em{" "}
                      <span className="text-pink-600 font-semibold">
                        {siteData.startDate
                          ? new Date(siteData.startDate).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })
                          : ""}
                      </span>
                    </h1>
                    {(siteData.names?.person1 || siteData.names?.person2) && (
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mt-2">
                        <span className="font-medium">{siteData.names.person1}</span>
                        {siteData.names.person1 && siteData.names.person2 && (
                          <Heart className="w-4 h-4 text-red-500" fill="currentColor" />
                        )}
                        <span className="font-medium">{siteData.names.person2}</span>
                      </div>
                    )}
                  </div>

                  {/* Contador */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-pink-50 border-2 border-pink-200 rounded-lg p-4">
                        <div className="text-3xl font-bold text-pink-600">
                          {timeElapsed.years.toString().padStart(2, "0")}
                        </div>
                        <div className="text-sm text-pink-500 font-medium mt-1">Anos</div>
                      </div>
                      <div className="bg-pink-50 border-2 border-pink-200 rounded-lg p-4">
                        <div className="text-3xl font-bold text-pink-600">
                          {timeElapsed.months.toString().padStart(2, "0")}
                        </div>
                        <div className="text-sm text-pink-500 font-medium mt-1">Meses</div>
                      </div>
                      <div className="bg-pink-50 border-2 border-pink-200 rounded-lg p-4">
                        <div className="text-3xl font-bold text-pink-600">
                          {timeElapsed.days.toString().padStart(2, "0")}
                        </div>
                        <div className="text-sm text-pink-500 font-medium mt-1">Dias</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-pink-50 border-2 border-pink-200 rounded-lg p-4">
                        <div className="text-3xl font-bold text-pink-600">
                          {timeElapsed.hours.toString().padStart(2, "0")}
                        </div>
                        <div className="text-sm text-pink-500 font-medium mt-1">Horas</div>
                      </div>
                      <div className="bg-pink-50 border-2 border-pink-200 rounded-lg p-4">
                        <div className="text-3xl font-bold text-pink-600">
                          {timeElapsed.minutes.toString().padStart(2, "0")}
                        </div>
                        <div className="text-sm text-pink-500 font-medium mt-1">Min</div>
                      </div>
                      <div className="bg-pink-50 border-2 border-pink-200 rounded-lg p-4">
                        <div className="text-3xl font-bold text-pink-600">
                          {timeElapsed.seconds.toString().padStart(2, "0")}
                        </div>
                        <div className="text-sm text-pink-500 font-medium mt-1">Seg</div>
                      </div>
                    </div>
                  </div>

                  {/* Texto descritivo */}
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {timeElapsed.years > 0 && `${timeElapsed.years} ano${timeElapsed.years !== 1 ? "s" : ""}, `}
                      {timeElapsed.months > 0 &&
                        `${timeElapsed.months} ${timeElapsed.months === 1 ? "mês" : "meses"}, `}
                      {timeElapsed.days} dia{timeElapsed.days !== 1 ? "s" : ""}, {timeElapsed.hours} hora
                      {timeElapsed.hours !== 1 ? "s" : ""}, {timeElapsed.minutes} minuto
                      {timeElapsed.minutes !== 1 ? "s" : ""} e {timeElapsed.seconds} segundo
                      {timeElapsed.seconds !== 1 ? "s" : ""} de amor e companheirismo
                    </p>
                  </div>

                  {/* Nossa História */}
                  <div className="space-y-3 pt-4">
                    <Heart className="w-6 h-6 mx-auto text-pink-400 fill-current" />
                    <h2 className="text-pink-600 font-semibold text-lg">Nossa História</h2>
                    {siteData.description && (
                      <div className="bg-pink-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 italic leading-relaxed">{siteData.description}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
