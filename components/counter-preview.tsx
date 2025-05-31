"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Heart } from "lucide-react"
import { SpotifyPlayer } from "./spotify-player"

interface SpotifyTrack {
  id: string
  name: string
  artist: string
  preview_url: string
  embed_url: string
  external_url: string
  image: string
}

interface CounterPreviewProps {
  title: string
  names: {
    person1: string
    person2: string
  }
  startDate?: Date
  theme: string
  description: string
  photos: string[]
  spotifyTrack?: SpotifyTrack | null
  spotifyUrl?: string
  emoji: string
  isPremium?: boolean
  banner?: string
}

const themes = {
  romantic: "from-pink-500 to-red-500",
  purple: "from-purple-500 to-indigo-500",
  ocean: "from-blue-500 to-teal-500",
  sunset: "from-orange-500 to-pink-500",
  forest: "from-green-500 to-emerald-500",
}

export function CounterPreview({
  title,
  names,
  startDate,
  theme,
  description,
  photos,
  spotifyTrack,
  spotifyUrl,
  emoji,
  isPremium = false,
  banner,
}: CounterPreviewProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Log para debug
  useEffect(() => {
    console.log("🎵 CounterPreview recebeu:")
    console.log("- title:", title)
    console.log("- names:", names)
    console.log("- spotifyTrack:", spotifyTrack)
    console.log("- spotifyUrl:", spotifyUrl)
  }, [title, names, spotifyTrack, spotifyUrl])

  // Contador em tempo real
  useEffect(() => {
    if (!startDate) return

    const updateCounter = () => {
      const now = new Date()
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
  }, [startDate])

  // Rotação de fotos
  useEffect(() => {
    if (!photos || photos.length <= 1) return

    const interval = setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev + 1) % photos.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [photos])

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200 p-6 rounded-lg min-h-screen flex items-center justify-center">
        <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm w-full">
          <CardContent className="text-center space-y-6 p-8">
            {/* TÍTULO DO SITE */}
            {title && (
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-800 leading-tight">{title}</h1>
                <div
                  className={`h-1 bg-gradient-to-r ${themes[theme as keyof typeof themes]} rounded-full w-16 mx-auto`}
                />
              </div>
            )}

            {/* NOMES DAS PESSOAS */}
            {(names?.person1 || names?.person2) && (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-3 text-lg text-gray-700">
                  {names.person1 && <span className="font-semibold text-pink-600">{names.person1}</span>}
                  {names.person1 && names.person2 && <Heart className="w-5 h-5 text-red-500" fill="currentColor" />}
                  {names.person2 && <span className="font-semibold text-pink-600">{names.person2}</span>}
                </div>
              </div>
            )}

            {/* Player do Spotify - passa o track diretamente */}
            {(spotifyTrack || spotifyUrl) && (
              <SpotifyPlayer track={spotifyTrack} spotifyUrl={spotifyUrl} loading={false} />
            )}

            {/* Banner Preview */}
            {banner && (
              <div className="space-y-3">
                <div>
                  <img
                    src={banner || "/placeholder.svg?height=96&width=384"}
                    alt="Banner Preview"
                    className="w-full h-24 object-cover rounded-lg shadow-sm"
                    onError={(e) => {
                      console.log("❌ Erro ao carregar banner preview:", banner)
                      e.currentTarget.src = "/placeholder.svg?height=96&width=384"
                    }}
                    onLoad={() => {
                      console.log("✅ Banner preview carregado com sucesso")
                    }}
                  />
                  <p className="text-xs text-center text-gray-500 mt-1">Preview do Banner</p>
                </div>
              </div>
            )}

            {/* Imagem */}
            {photos && photos.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-pink-600 font-medium">📸 Nossas Memórias</h3>
                <div className="relative">
                  <img
                    src={photos[currentPhotoIndex] || "/placeholder.svg?height=451&width=256"}
                    alt={`Preview ${currentPhotoIndex + 1}`}
                    className="w-64 h-[451px] object-cover rounded-lg mx-auto shadow-lg"
                    style={{ width: "256px", height: "451px" }}
                    onError={(e) => {
                      console.log("❌ Erro ao carregar foto:", photos[currentPhotoIndex])
                      e.currentTarget.src = "/placeholder.svg?height=451&width=256"
                    }}
                    onLoad={() => {
                      console.log("✅ Foto carregada com sucesso")
                    }}
                  />
                  {photos.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                      {photos.map((_, index) => (
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

            {/* Título principal com data */}
            <div className="space-y-2">
              <h2 className="text-base text-gray-700 leading-relaxed">
                Um amor que começou em{" "}
                <span className="text-pink-600 font-semibold">
                  {startDate
                    ? startDate.toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : ""}
                </span>
              </h2>
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
                  <div className="text-3xl font-bold text-pink-600">{timeElapsed.days.toString().padStart(2, "0")}</div>
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
                {timeElapsed.months > 0 && `${timeElapsed.months} ${timeElapsed.months === 1 ? "mês" : "meses"}, `}
                {timeElapsed.days} dia{timeElapsed.days !== 1 ? "s" : ""}, {timeElapsed.hours} hora
                {timeElapsed.hours !== 1 ? "s" : ""}, {timeElapsed.minutes} minuto{timeElapsed.minutes !== 1 ? "s" : ""}{" "}
                e {timeElapsed.seconds} segundo{timeElapsed.seconds !== 1 ? "s" : ""} de amor e companheirismo
              </p>
            </div>

            {/* Nossa História */}
            <div className="space-y-3 pt-4">
              <Heart className="w-6 h-6 mx-auto text-pink-400 fill-current" />
              <h2 className="text-pink-600 font-semibold text-lg">Nossa História</h2>
              {description && (
                <div className="bg-pink-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 italic leading-relaxed">{description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
