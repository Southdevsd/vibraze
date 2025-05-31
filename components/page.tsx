"use client"

import { useState } from "react"
import { SpotifyPlayer } from "../components/spotify-player"
import { SpotifyLinkInput } from "../components/spotify-link-input"

interface SpotifyTrack {
  id: string
  name: string
  artist: string
  preview_url: string
  embed_url: string
  external_url: string
  image: string
}

export default function Page() {
  const [selectedTrack, setSelectedTrack] = useState<SpotifyTrack | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="w-full max-w-md mx-auto space-y-4 sm:space-y-6">
          {/* Título */}
          <div className="text-center space-y-1 sm:space-y-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">🎵 Player do Spotify</h1>
            <p className="text-sm sm:text-base text-gray-600">Adicione sua música especial</p>
          </div>

          {/* Formulário */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
            <SpotifyLinkInput onTrackSelect={setSelectedTrack} selectedTrack={selectedTrack} />
          </div>

          {/* Player */}
          {selectedTrack && (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
              <SpotifyPlayer track={selectedTrack} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
