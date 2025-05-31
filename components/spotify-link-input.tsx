"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Music, X, ExternalLink } from "lucide-react"

interface SpotifyTrack {
  id: string
  name: string
  artist: string
  preview_url: string
  embed_url: string
  external_url: string
  image: string
}

interface SpotifyLinkInputProps {
  onTrackSelect: (track: SpotifyTrack | null) => void
  selectedTrack: SpotifyTrack | null
}

export function SpotifyLinkInput({ onTrackSelect, selectedTrack }: SpotifyLinkInputProps) {
  const [spotifyUrl, setSpotifyUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const extractTrackId = (url: string): string | null => {
    // Diferentes formatos de URL do Spotify
    const patterns = [
      /spotify\.com\/track\/([a-zA-Z0-9]+)/,
      /spotify\.com\/intl-[a-z]+\/track\/([a-zA-Z0-9]+)/,
      /open\.spotify\.com\/track\/([a-zA-Z0-9]+)/,
      /open\.spotify\.com\/intl-[a-z]+\/track\/([a-zA-Z0-9]+)/,
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) {
        return match[1]
      }
    }

    return null
  }

  const handleAddTrack = async () => {
    if (!spotifyUrl.trim()) {
      setError("Por favor, cole um link do Spotify")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const trackId = extractTrackId(spotifyUrl)

      if (!trackId) {
        setError("Link do Spotify inválido. Use um link de música do Spotify.")
        setIsLoading(false)
        return
      }

      // Simular dados da música (em produção, você usaria a API do Spotify)
      const mockTrack: SpotifyTrack = {
        id: trackId,
        name: "Música do Spotify",
        artist: "Artista",
        preview_url: `https://p.scdn.co/mp3-preview/${trackId}`,
        embed_url: `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`,
        external_url: spotifyUrl,
        image: "/placeholder.svg?height=64&width=64",
      }

      onTrackSelect(mockTrack)
      setSpotifyUrl("")
      setError("")
    } catch (err) {
      setError("Erro ao processar o link. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveTrack = () => {
    onTrackSelect(null)
    setSpotifyUrl("")
    setError("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTrack()
    }
  }

  return (
    <div className="space-y-4">
      <Label className="flex items-center text-base font-medium">
        <Music className="w-5 h-5 mr-2 text-green-600" />🎵 Música especial do Spotify
      </Label>

      {selectedTrack ? (
        <div className="space-y-4">
          {/* Música selecionada */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Music className="w-5 h-5 text-green-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-green-800">Música adicionada com sucesso!</p>
                  <p className="text-xs text-green-600">A música será reproduzida no seu site</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveTrack}
                className="text-green-700 hover:text-green-800"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Player do Spotify */}
            <div className="w-full">
              <iframe
                src={selectedTrack.embed_url}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-lg"
              ></iframe>
            </div>

            <div className="flex items-center justify-between mt-3 text-xs text-green-600">
              <span>🎵 Preview de 30 segundos disponível</span>
              <a
                href={selectedTrack.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:text-green-700"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Abrir no Spotify
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Busque e escolha uma música para tocar no seu site especial ou cole o link do Spotify
          </p>

          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="https://open.spotify.com/track/..."
                value={spotifyUrl}
                onChange={(e) => {
                  setSpotifyUrl(e.target.value)
                  setError("")
                }}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleAddTrack}
                disabled={isLoading || !spotifyUrl.trim()}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Music className="w-4 h-4" />
                )}
              </Button>
            </div>

            {error && (
              <p className="text-sm text-red-600 flex items-center">
                <X className="w-4 h-4 mr-1" />
                {error}
              </p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700 font-medium mb-1">💡 Como encontrar o link da música:</p>
            <ol className="text-xs text-blue-600 space-y-1">
              <li>1. Abra o Spotify no seu celular ou computador</li>
              <li>2. Encontre a música que você quer</li>
              <li>3. Clique nos 3 pontinhos (...) da música</li>
              <li>4. Escolha "Compartilhar" → "Copiar link"</li>
              <li>5. Cole o link aqui!</li>
            </ol>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-xs text-green-700">
              <strong>✨ Exemplo de link válido:</strong>
              <br />
              <code className="bg-green-100 px-1 rounded text-xs">
                https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh
              </code>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
