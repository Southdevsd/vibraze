// Função para fazer upload de imagem para o ImgBB
export const uploadToImgBB = async (imageFile: File | string): Promise<string> => {
  const API_KEY = "84a91d2e48ace922981701ddff37e41b"

  try {
    // Converter File para base64 se necessário
    let base64Image: string

    if (typeof imageFile === "string") {
      // Se já é base64, remover o prefixo data:image/...;base64,
      base64Image = imageFile.includes(",") ? imageFile.split(",")[1] : imageFile
    } else {
      // Converter File para base64
      base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const result = reader.result as string
          const base64 = result.split(",")[1] // Remover prefixo
          resolve(base64)
        }
        reader.onerror = reject
        reader.readAsDataURL(imageFile)
      })
    }

    // Fazer upload para ImgBB
    const formData = new FormData()
    formData.append("key", API_KEY)
    formData.append("image", base64Image)
    formData.append("expiration", "15552000") // 6 meses em segundos

    console.log("📤 Fazendo upload para ImgBB...")

    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    })

    const data = await response.json()

    if (data.success) {
      console.log("✅ Upload realizado com sucesso:", data.data.url)
      return data.data.url // URL da imagem hospedada
    } else {
      throw new Error(data.error?.message || "Erro no upload")
    }
  } catch (error) {
    console.error("❌ Erro no upload para ImgBB:", error)
    throw error
  }
}

// Função para fazer upload de múltiplas imagens
export const uploadMultipleToImgBB = async (images: (File | string)[]): Promise<string[]> => {
  const uploadPromises = images.map((image) => uploadToImgBB(image))

  try {
    const urls = await Promise.all(uploadPromises)
    console.log(`✅ ${urls.length} imagens enviadas para ImgBB`)
    return urls
  } catch (error) {
    console.error("❌ Erro no upload múltiplo:", error)
    throw error
  }
}

// Função para comprimir imagem antes do upload
export const compressImageForUpload = (file: File, maxWidth = 800, quality = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      try {
        // Calcular novas dimensões
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
        canvas.width = img.width * ratio
        canvas.height = img.height * ratio

        // Desenhar imagem redimensionada
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)

        // Converter para blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              })
              resolve(compressedFile)
            } else {
              reject(new Error("Erro na compressão"))
            }
          },
          "image/jpeg",
          quality,
        )
      } catch (error) {
        reject(error)
      }
    }

    img.onerror = () => reject(new Error("Erro ao carregar imagem"))
    img.src = URL.createObjectURL(file)
  })
}
