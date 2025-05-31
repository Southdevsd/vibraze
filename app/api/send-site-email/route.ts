import { type NextRequest, NextResponse } from "next/server"
import { generateQRCode } from "./../../lib/qrcode"

interface EmailData {
  customerEmail: string
  customerName: string
  siteTitle: string
  siteUrl: string
  token: string
  plan: string
}

export async function POST(request: NextRequest) {
  try {
    const emailData: EmailData = await request.json()

    console.log("📧 Enviando email do site para:", emailData.customerEmail)

    // Gerar QR Code do site
    const qrCodeUrl = await generateQRCode(emailData.siteUrl, 300)

    // Simular envio de email (aqui você integraria com um serviço real como SendGrid, Resend, etc.)
    const emailContent = {
      to: emailData.customerEmail,
      subject: `🎉 Seu Site Premium "${emailData.siteTitle}" está pronto!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #e91e63; margin-bottom: 10px;">💕 Vibraze Premium</h1>
            <h2 style="color: #333; margin-bottom: 20px;">Seu site "${emailData.siteTitle}" está pronto!</h2>
          </div>
          
          <div style="background: linear-gradient(135deg, #fce4ec, #f3e5f5); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <p style="color: #333; font-size: 16px; margin-bottom: 15px;">
              Olá <strong>${emailData.customerName}</strong>! 🎉
            </p>
            <p style="color: #666; margin-bottom: 15px;">
              Seu contador de amor premium foi criado com sucesso e está disponível no link abaixo:
            </p>
            
            <div style="text-align: center; margin: 20px 0;">
              <a href="${emailData.siteUrl}" 
                 style="background: linear-gradient(135deg, #e91e63, #9c27b0); 
                        color: white; 
                        padding: 12px 24px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        font-weight: bold;
                        display: inline-block;">
                🔗 Acessar Meu Site Premium
              </a>
            </div>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 10px; border: 2px solid #e1bee7; margin-bottom: 20px;">
            <h3 style="color: #7b1fa2; text-align: center; margin-bottom: 15px;">📱 QR Code do Seu Site</h3>
            <p style="color: #666; text-align: center; margin-bottom: 15px;">
              Escaneie este QR Code para acessar seu site rapidamente ou imprima para compartilhar:
            </p>
            
            <div style="text-align: center; margin: 20px 0;">
              <img src="${qrCodeUrl}" 
                   alt="QR Code do Site" 
                   style="border: 2px solid #e1bee7; border-radius: 10px; padding: 10px; background: white;"
                   width="250" 
                   height="250">
            </div>
            
            <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin-top: 15px;">
              <p style="color: #7b1fa2; font-size: 14px; margin: 0; text-align: center;">
                💡 <strong>Dica:</strong> Salve esta imagem ou imprima o QR Code para compartilhar facilmente!
              </p>
            </div>
          </div>
          
          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; border-left: 4px solid #4caf50; margin-bottom: 20px;">
            <h4 style="color: #2e7d32; margin-bottom: 10px;">✨ Recursos Premium Ativados:</h4>
            <ul style="color: #388e3c; margin: 0; padding-left: 20px;">
              <li>Fotos ilimitadas hospedadas na nuvem</li>
              <li>Música do Spotify integrada</li>
              <li>Banner personalizado</li>
              <li>Emojis e cores customizadas</li>
              <li>Acesso universal (qualquer navegador)</li>
              <li>Contador em tempo real</li>
            </ul>
          </div>
          
          <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h4 style="color: #f57c00; margin-bottom: 10px;">📋 Detalhes da Compra:</h4>
            <p style="color: #ef6c00; margin: 5px 0;"><strong>Plano:</strong> ${emailData.plan === "premium" ? "Premium Mensal" : "Lifetime"}</p>
            <p style="color: #ef6c00; margin: 5px 0;"><strong>Token:</strong> ${emailData.token}</p>
            <p style="color: #ef6c00; margin: 5px 0;"><strong>Link:</strong> <a href="${emailData.siteUrl}" style="color: #e65100;">${emailData.siteUrl}</a></p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #666; font-size: 14px; margin-bottom: 10px;">
              Criado com ❤️ no <strong>Vibraze Premium</strong>
            </p>
            <p style="color: #999; font-size: 12px;">
              Dúvidas? Responda este email ou acesse nosso suporte.
            </p>
          </div>
        </div>
      `,
      qrCodeUrl: qrCodeUrl,
    }

    console.log("✅ Email preparado com QR Code")
    console.log("📱 QR Code URL:", qrCodeUrl)

    // Aqui você integraria com um serviço real de email
    // Por exemplo: await sendgrid.send(emailContent)

    return NextResponse.json({
      success: true,
      message: "Email enviado com sucesso",
      qrCodeUrl: qrCodeUrl,
      emailContent: emailContent,
    })
  } catch (error) {
    console.error("❌ Erro ao enviar email:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao enviar email",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
