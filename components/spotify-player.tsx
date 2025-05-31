"use client"

import { ExternalLink, Loader2 } from "lucide-react"
import { useState } from "react"

interface SpotifyTrack {
  id: string
  name: string
  artist: string
  image: string
  preview_url: string
  embed_url: string
  external_url: string
}

interface SpotifyPlayerProps {
  track?: SpotifyTrack
  spotifyUrl?: string
  loading?: boolean
}

export function SpotifyPlayer({ track, spotifyUrl, loading }: SpotifyPlayerProps) {
  const [isEmbedLoaded, setIsEmbedLoaded] = useState(false)

  const openSpotify = () => {
    if (track?.external_url) {
      window.open(track.external_url, "_blank")
    } else if (spotifyUrl) {
      window.open(spotifyUrl, "_blank")
    }
  }

  // Estado de carregamento
  if (loading) {
    return (
      <div className="space-y-3">


        <div className="bg-[#191414] rounded-lg p-4 text-white shadow-lg border border-gray-800">
          <div className="flex items-center justify-center space-x-2 py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-sm">Buscando música no Spotify...</span>
          </div>
        </div>
      </div>
    )
  }

  // Se não tem música, não renderiza nada
  if (!track && !spotifyUrl) {
    return null
  }

  return (
    <div className="space-y-3">


      {/* Player Integrado do Spotify - Igual à imagem */}
      <div className="">
        {track?.embed_url ? (
          <div className="relative">
            <iframe
              src={track.embed_url}
              width="110%" 
              height="80"
              frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-lg"
            /></div>
        ) : (
          /* Fallback quando não tem embed_url */
          <div className="p-4">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-800 rounded-lg flex-shrink-0 overflow-hidden">
                {track?.image ? (
                  <img
                    src={track.image || "/placeholder.svg"}
                    alt="Capa do álbum"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=80&width=80"
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <div className="w-10 h-10 bg-gray-600 rounded"></div>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-lg leading-tight mb-1">
                  {track?.name || "Música do Spotify"}
                </h3>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded font-medium">Prévia</span>
                  <span className="text-gray-300 text-sm">{track?.artist || "Artista"}</span>
                </div>
                <button onClick={openSpotify} className="text-white text-sm hover:text-gray-300 transition-colors">
                  Abrir no Spotify para ouvir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
  )
}
