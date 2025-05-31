"use client"
import { useState } from "react"
// ... outros imports (mesmo do código anterior)

export default function CheckoutPageMongoose() {
  const [pixData, setPixData] = useState<{ payment_id?: string }>({})
  const [paymentStatus, setPaymentStatus] = useState<string>("")
  const [formData, setFormData] = useState<{ name: string; email: string; cpf: string }>({
    name: "",
    email: "",
    cpf: "",
  })
  const [premiumData, setPremiumData] = useState<{
    title?: string
    theme?: string
    names?: { person1?: string; person2?: string }
    startDate?: Date
    backgroundColor?: string
    emoji?: string
    description?: string
    photos?: any[]
    banner?: any
    spotifyTrack?: any
  }>({})
  const [plan, setPlan] = useState<string>("")
  const [isCheckingPayment, setIsCheckingPayment] = useState<boolean>(false)

  // ... mesmo estado e funções do código anterior

  const checkPayment = async (): Promise<void> => {
    if (!pixData?.payment_id) return

    setIsCheckingPayment(true)

    try {
      console.log(`Verificando pagamento ${pixData.payment_id}`)
      const response = await fetch(`/api/check-payment?id=${pixData.payment_id}`)
      const data = await response.json()

      console.log("Status do pagamento:", data)
      setPaymentStatus(data.status)

      if (data.status === "approved") {
        // Gerar token único
        const timestamp = Date.now()
        const randomId = Math.random().toString(36).substring(2, 8)
        const premiumToken = `premium-${timestamp}-${randomId}`

        console.log("💾 SALVANDO DADOS PREMIUM NO MONGODB VIA MONGOOSE COM TOKEN:", premiumToken)

        // Criar dados premium
        const premiumSiteData = {
          token: premiumToken,
          id: premiumToken,
          isPremium: true,
          isActive: true,
          title: premiumData.title || "Site Premium",
          theme: premiumData.theme || "romantic",
          names: {
            person1: premiumData.names?.person1 || formData.name.split(" ")[0] || "",
            person2: premiumData.names?.person2 || "",
          },
          startDate: premiumData.startDate ? premiumData.startDate.toISOString() : new Date().toISOString(),
          backgroundColor: premiumData.backgroundColor || "#ffffff",
          emoji: premiumData.emoji || "❤️",
          description: premiumData.description || "",
          photos: premiumData.photos,
          banner: premiumData.banner,
          spotifyTrack: premiumData.spotifyTrack,
          views: 0,
          plan: plan,
          paymentId: pixData.payment_id,
          customerInfo: {
            name: formData.name,
            email: formData.email,
            cpf: formData.cpf,
            plan: plan,
            paymentId: pixData.payment_id,
            paymentDate: new Date().toISOString(),
          },
        }

        try {
          // SALVAR NO MONGODB VIA MONGOOSE
          const mongooseResponse = await fetch("/api/save-premium-mongoose", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(premiumSiteData),
          })

          console.log("📡 Status da resposta Mongoose:", mongooseResponse.status)

          if (!mongooseResponse.ok) {
            const errorText = await mongooseResponse.text()
            console.error("❌ Erro HTTP Mongoose:", mongooseResponse.status, errorText)
            throw new Error(`Erro HTTP ${mongooseResponse.status}: ${errorText}`)
          }

          const mongooseData = await mongooseResponse.json()
          console.log("📥 Resposta do Mongoose:", mongooseData)

          if (mongooseData.success) {
            console.log("✅ Site salvo no MongoDB via Mongoose com sucesso!")
            console.log("🆔 ID do documento:", mongooseData.insertedId || mongooseData.data?._id)

            // Testar busca imediata
            console.log("🧪 Testando busca via Mongoose...")
            try {
              const testResponse = await fetch(`/api/get-premium-mongoose?token=${premiumToken}`)
              const testData = await testResponse.json()

              if (testData.success) {
                console.log("✅ Teste de busca via Mongoose bem-sucedido!")
              } else {
                console.warn("⚠️ Teste de busca via Mongoose falhou:", testData.error)
              }
            } catch (testError) {
              console.warn("⚠️ Erro no teste de busca Mongoose:", testError)
            }

            const finalMessage = `🎉 Site premium criado com sucesso via Mongoose!

📸 Fotos hospedadas: ${premiumSiteData.photos.length}
🖼️ Banner: ${premiumSiteData.banner ? "Sim" : "Não"}
🎨 Tema: ${premiumSiteData.theme}
🎵 Spotify: ${premiumSiteData.spotifyTrack ? "Sim" : "Não"}
🗄️ Salvo no MongoDB via Mongoose com validações!
📱 QR Code será gerado automaticamente!
🔗 Token: ${premiumToken}`

            alert(finalMessage)

            // Redirecionar
            setTimeout(() => {
              const successUrl = `/success-premium?submission_id=${premiumToken}&payment_id=${pixData.payment_id}&plan=${plan}`
              console.log("🔗 Redirecionando para:", successUrl)
              window.location.href = successUrl
            }, 2000)
          } else {
            throw new Error(mongooseData.error || "Erro desconhecido do Mongoose")
          }
        } catch (mongooseError) {
          console.error("❌ Erro ao salvar via Mongoose:", mongooseError)
          alert(`❌ Erro ao salvar dados via Mongoose: ${mongooseError.message}. Entre em contato com o suporte.`)
        }
      }
      // ... resto do código de verificação de pagamento
    } catch (error) {
      console.error("Erro ao verificar pagamento:", error)
      alert("❌ Erro ao verificar pagamento. Tente novamente.")
    } finally {
      setIsCheckingPayment(false)
    }
  }

  // ... resto do componente (mesmo do código anterior)
}
