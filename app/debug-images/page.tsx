"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugImagesPage() {
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const analyzeLocalStorage = () => {
    const analysis: any = {
      totalKeys: localStorage.length,
      premiumSites: [],
      totalSize: 0,
      imageAnalysis: [],
    }

    // Analisar todas as chaves
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith("vibraze_premium_")) {
        try {
          const data = localStorage.getItem(key)
          if (data) {
            const parsed = JSON.parse(data)
            analysis.totalSize += data.length

            const siteInfo = {
              key,
              title: parsed.title,
              photosCount: parsed.photos ? parsed.photos.length : 0,
              photos: parsed.photos || [],
              dataSize: data.length,
              hasValidPhotos: false,
            }

            // Analisar fotos
            if (parsed.photos && parsed.photos.length > 0) {
              siteInfo.hasValidPhotos = parsed.photos.some(
                (photo: string) =>
                  photo && typeof photo === "string" && photo.length > 100 && photo.startsWith("data:image/"),
              )

              parsed.photos.forEach((photo: string, index: number) => {
                analysis.imageAnalysis.push({
                  site: parsed.title || key,
                  photoIndex: index + 1,
                  isValid: photo && typeof photo === "string" && photo.length > 100 && photo.startsWith("data:image/"),
                  type: typeof photo,
                  size: photo ? photo.length : 0,
                  format: photo ? (photo.startsWith("data:image/") ? "base64" : "outro") : "inválido",
                  preview: photo ? photo.substring(0, 100) : "VAZIO",
                })
              })
            }

            analysis.premiumSites.push(siteInfo)
          }
        } catch (error) {
          console.error("Erro ao analisar", key, error)
        }
      }
    }

    setDebugInfo(analysis)
  }

  const clearAllData = () => {
    if (confirm("Tem certeza que deseja limpar todos os dados?")) {
      const keys = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith("vibraze")) {
          keys.push(key)
        }
      }

      keys.forEach((key) => localStorage.removeItem(key))
      alert(`${keys.length} chaves removidas`)
      analyzeLocalStorage()
    }
  }

  const testImageSave = async () => {
    // Criar uma imagem de teste
    const canvas = document.createElement("canvas")
    canvas.width = 200
    canvas.height = 200
    const ctx = canvas.getContext("2d")

    if (ctx) {
      // Desenhar um quadrado colorido
      ctx.fillStyle = "#ff6b6b"
      ctx.fillRect(0, 0, 200, 200)
      ctx.fillStyle = "#4ecdc4"
      ctx.fillRect(50, 50, 100, 100)
      ctx.fillStyle = "#45b7d1"
      ctx.fillRect(75, 75, 50, 50)

      const testImage = canvas.toDataURL("image/jpeg", 0.8)

      // Salvar imagem de teste
      const testData = {
        token: "test-" + Date.now(),
        title: "Teste de Imagem",
        photos: [testImage],
        isPremium: true,
        createdAt: new Date().toISOString(),
      }

      try {
        localStorage.setItem(`vibraze_premium_test-${Date.now()}`, JSON.stringify(testData))
        alert("✅ Imagem de teste salva com sucesso!")
        analyzeLocalStorage()
      } catch (error) {
        alert("❌ Erro ao salvar imagem de teste: " + error)
      }
    }
  }

  useEffect(() => {
    analyzeLocalStorage()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>🔍 Debug de Imagens - LocalStorage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={analyzeLocalStorage}>🔄 Atualizar Análise</Button>
              <Button onClick={testImageSave} variant="outline">
                🧪 Testar Salvamento de Imagem
              </Button>
              <Button onClick={clearAllData} variant="destructive">
                🗑️ Limpar Todos os Dados
              </Button>
            </div>

            {debugInfo && (
              <div className="space-y-6">
                {/* Resumo Geral */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-bold text-blue-800 mb-2">📊 Resumo Geral</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Total de chaves:</span>
                      <div className="text-lg font-bold text-blue-600">{debugInfo.totalKeys}</div>
                    </div>
                    <div>
                      <span className="font-medium">Sites premium:</span>
                      <div className="text-lg font-bold text-green-600">{debugInfo.premiumSites.length}</div>
                    </div>
                    <div>
                      <span className="font-medium">Tamanho total:</span>
                      <div className="text-lg font-bold text-orange-600">
                        {(debugInfo.totalSize / 1024).toFixed(1)} KB
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Imagens válidas:</span>
                      <div className="text-lg font-bold text-purple-600">
                        {debugInfo.imageAnalysis.filter((img: any) => img.isValid).length}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sites Premium */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-4">🏆 Sites Premium Encontrados</h3>
                  <div className="grid gap-4">
                    {debugInfo.premiumSites.map((site: any, index: number) => (
                      <div key={index} className="bg-white p-4 rounded-lg border shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{site.title}</h4>
                            <p className="text-sm text-gray-500">{site.key}</p>
                          </div>
                          <div className="text-right">
                            <div
                              className={`px-2 py-1 rounded text-xs ${
                                site.hasValidPhotos ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              {site.photosCount} foto(s)
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{(site.dataSize / 1024).toFixed(1)} KB</div>
                          </div>
                        </div>

                        {site.photos.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium mb-2">Fotos:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                              {site.photos.map((photo: string, photoIndex: number) => (
                                <div
                                  key={photoIndex}
                                  className={`p-2 rounded border ${
                                    photo && photo.startsWith("data:image/")
                                      ? "bg-green-50 border-green-200"
                                      : "bg-red-50 border-red-200"
                                  }`}
                                >
                                  <div className="font-medium">Foto {photoIndex + 1}</div>
                                  <div>Tamanho: {photo ? (photo.length / 1024).toFixed(1) : 0} KB</div>
                                  <div>Válida: {photo && photo.startsWith("data:image/") ? "✅" : "❌"}</div>
                                  {photo && photo.startsWith("data:image/") && (
                                    <img
                                      src={photo || "/placeholder.svg"}
                                      alt={`Preview ${photoIndex + 1}`}
                                      className="w-16 h-16 object-cover rounded mt-1"
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Análise Detalhada das Imagens */}
                {debugInfo.imageAnalysis.length > 0 && (
                  <div>
                    <h3 className="font-bold text-gray-800 mb-4">🖼️ Análise Detalhada das Imagens</h3>
                    <div className="bg-white rounded-lg border overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="p-3 text-left">Site</th>
                            <th className="p-3 text-left">Foto</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Tamanho</th>
                            <th className="p-3 text-left">Formato</th>
                            <th className="p-3 text-left">Preview</th>
                          </tr>
                        </thead>
                        <tbody>
                          {debugInfo.imageAnalysis.map((img: any, index: number) => (
                            <tr key={index} className="border-t">
                              <td className="p-3">{img.site}</td>
                              <td className="p-3">#{img.photoIndex}</td>
                              <td className="p-3">
                                <span
                                  className={`px-2 py-1 rounded text-xs ${
                                    img.isValid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {img.isValid ? "✅ Válida" : "❌ Inválida"}
                                </span>
                              </td>
                              <td className="p-3">{(img.size / 1024).toFixed(1)} KB</td>
                              <td className="p-3">{img.format}</td>
                              <td className="p-3">
                                {img.isValid ? (
                                  <img
                                    src={img.preview.length > 50 ? img.preview.substring(0, 100) + "..." : img.preview}
                                    alt="Preview"
                                    className="w-8 h-8 object-cover rounded"
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none"
                                    }}
                                  />
                                ) : (
                                  <span className="text-gray-400">N/A</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
