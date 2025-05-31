// Função para gerar QR Code usando API externa
export const generateQRCode = async (text: string, size = 200): Promise<string> => {
  try {
    // Usar API gratuita do QR Server
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&format=png&margin=10`

    console.log("🔗 Gerando QR Code para:", text)
    console.log("📱 URL do QR Code:", qrUrl)

    return qrUrl
  } catch (error) {
    console.error("❌ Erro ao gerar QR Code:", error)
    throw error
  }
}

// Função para gerar QR Code como base64
export const generateQRCodeBase64 = async (text: string, size = 200): Promise<string> => {
  try {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&format=png&margin=10`

    // Buscar a imagem e converter para base64
    const response = await fetch(qrUrl)
    const blob = await response.blob()

    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = reader.result as string
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error("❌ Erro ao gerar QR Code base64:", error)
    throw error
  }
}
