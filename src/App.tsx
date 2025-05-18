import React, { useEffect, useState } from "react";
import banner from "./assets/banner.png"; // imagem dos dois celulares
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Terms from "./Terms";
import Privacy from "./privacy";
import MemoryCreate from "./MemoryCreate";
import MemoryCreatedPage from './MemoryCreatedPage';
import Contagem from "./Contagem";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const phrases = ["Surpreender quem você ama", "Criar memórias inesquecíveis"];
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];

      setText((prev) =>
        isDeleting ? fullText.substring(0, prev.length - 1) : fullText.substring(0, prev.length + 1)
      );

      setTypingSpeed(isDeleting ? 50 : 100);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting]);

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* TOPO (Navbar) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px",
          backgroundColor: "#fff5f7",
          borderBottom: "1px solid #ffe0eb",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img
            src="https://media.discordapp.net/attachments/1372392119721000980/1373127790760562698/2eb478e5-a880-4df0-af1d-7ec0935a8814-removebg-preview.png?ex=682b42a8&is=6829f128&hm=3c616d7c7fa6e9ba9d53bbe7c8aad282bbd7b02c146e53f0b2e7ade9eb9bf689&=&format=webp&quality=lossless"
            alt="logo"
            style={{ width: 50, height: 50, objectFit: "contain" }}
          />
          <span
            style={{
              fontWeight: 600,
              color: "#f85a8e",
              fontSize: "1.2rem",
              userSelect: "none",
            }}
          >
            vibraze
          </span>
        </div>

        <Link to="/Contagem">
  <button
    style={{
      backgroundColor: "#f85a8e",
      color: "white",
      border: "none",
      padding: "10px 18px",
      borderRadius: 8,
      fontWeight: 600,
      fontSize: "1rem",
      cursor: "pointer",
      boxShadow: "0 2px 8px rgba(248, 90, 142, 0.3)",
      transition: "all 0.3s ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = "#ff79a8";
      e.currentTarget.style.transform = "scale(1.05)";
      e.currentTarget.style.boxShadow = "0 6px 14px rgba(248, 90, 142, 0.4)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = "#f85a8e";
      e.currentTarget.style.transform = "scale(1)";
      e.currentTarget.style.boxShadow = "0 2px 8px rgba(248, 90, 142, 0.3)";
    }}
  >
    Contagem 💗
  </button>
</Link>

        {/* Botão Navbar */}
        <button
          style={{
            backgroundColor: "#f85a8e",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: "1rem",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(248, 90, 142, 0.3)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#ff79a8";
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 6px 14px rgba(248, 90, 142, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#f85a8e";
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(248, 90, 142, 0.3)";
          }}
        >
          Criar meu site 💗
        </button>
      </div>


      {/* SEÇÃO PRINCIPAL */}
      <div
        style={{
          background: "linear-gradient(to bottom, #f96894 0%, #ffe0eb 100%)",
          padding: "80px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            maxWidth: 1440,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 60,
          }}
        >
          {/* Texto */}
          <div style={{ flex: 1, minWidth: 300 }}>
            <h1
              style={{
                fontSize: "3.2rem",
                fontWeight: 800,
                color: "#fff",
                marginBottom: 24,
                minHeight: 60,
                transition: "all 0.3s ease",
              }}
            >
              {text}
              <span style={{ color: "#fff", animation: "blink 1s infinite" }}>|</span>
            </h1>

            <p
              style={{
                fontSize: "1.2rem",
                color: "#fff",
                lineHeight: 1.7,
                maxWidth: 520,
              }}
            >
              Pequenos gestos fazem toda a diferença. Mostre seu carinho de uma forma inesperada, criando uma página dedicada para alguém especial.
            </p>

           <Link to="/MemoryCreate">
  <button
    style={{
      marginTop: 30,
      backgroundColor: "#fff",
      color: "#f85a8e",
      border: "none",
      padding: "14px 28px",
      borderRadius: 10,
      fontWeight: 600,
      fontSize: "1.1rem",
      cursor: "pointer",
      boxShadow: "0 4px 8px rgba(248, 90, 142, 0.3)",
      transition: "all 0.3s ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = "#ffe0eb";
      e.currentTarget.style.transform = "scale(1.05)";
      e.currentTarget.style.boxShadow = "0 6px 14px rgba(248, 90, 142, 0.5)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = "#fff";
      e.currentTarget.style.transform = "scale(1)";
      e.currentTarget.style.boxShadow = "0 4px 8px rgba(248, 90, 142, 0.3)";
    }}
  >
    Criar meu site gratuito agora
  </button>
</Link>

            <p
              style={{
                fontSize: 12,
                marginTop: 14,
                color: "#fff",
                opacity: 0.8,
              }}
            >
              Ao criar o site você concorda com os Termos de Uso e a Política de
              Privacidade
            </p>
          </div>

          {/* Imagem */}
          <div style={{ flex: 1, textAlign: "center", minWidth: 300 }}>
            <img
              src={banner}
              alt="Celulares"
              style={{
                width: "100%",
                maxWidth: 500,
                height: "auto",
                borderRadius: 20,
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
              }}
            />
          </div>
        </div>
      </div>
{/* COMO FUNCIONA */}
<div style={{ background: "#ffefec", padding: "60px 20px", textAlign: "center" }}>
  {/* Botão personalizado */}
  <div id="como-funciona" style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}>
  <button className="moment-button">Como Funciona</button>
</div>

  {/* Conteúdo */}
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 40,
      flexWrap: "wrap",
      maxWidth: 1200,
      margin: "0 auto",
    }}>
    {[
      {
        title: "1. Compartilhe sua história",
        desc: "Preencha os nomes, uma mensagem especial e detalhes do relacionamento.",
        icon: "📝",
      },
      {
        title: "2. Personalize",
        desc: "Adicione fotos e escolha funcionalidades adicionais para tornar seu site único.",
        icon: "🖼️",
      },
      {
        title: "3. Visualize",
        desc: "Veja como ficará sua página antes de surpreender quem você ama.",
        icon: "📷",
      },
      {
        title: "4. Surpreenda",
        desc: "Compartilhe o link ou QR code com seu amor e celebre juntos.",
        icon: "💗",
      },
    ].map((step, i) => (
      <div
        key={i}
        style={{
          background: "#fff",
          padding: 30,
          borderRadius: 12,
          minWidth: 260,
          maxWidth: 280,
          flex: "1 1 260px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          textAlign: "center",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget;
          el.style.transform = "translateY(-10px) scale(1.02)";
          el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget;
          el.style.transform = "translateY(0) scale(1)";
          el.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
        }}
      >
        <div
          style={{
            fontSize: 40,
            background: "#ffeef2",
            width: 60,
            height: 60,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          {step.icon}
        </div>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 10 }}>{step.title}</h3>
        <p style={{ fontSize: "0.95rem", color: "#444" }}>{step.desc}</p>
      </div>
    ))}
  </div>

  {/* Estilos personalizados */}
  <style>{`
    .memory-button {
      background-color: #000;
      color: #fff;
      border: 2px solid #f85a8e;
      border-radius: 30px;
      padding: 10px 24px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.3s, transform 0.2s;
    }

    .memory-button:hover {
      background-color: #111;
      transform: scale(1.05);
    }
  `}</style>
</div>



{/* FUNCIONALIDADES E PREÇOS */}
<div style={{ background: "#fff3e9", padding: "60px 20px", textAlign: "center" }}>
  {/* Botão centralizado */}
  <div id="preços" style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}>
    <button className="moment-button">Funcionalidades e Preços</button>
  </div>

  <p style={{ marginBottom: 40, color: "#555", fontSize: "1rem" }}>
    Personalize seu site com funcionalidades adicionais
  </p>

  {/* Cards */}
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "stretch",
      gap: 40,
      flexWrap: "wrap",
      maxWidth: 1200,
      margin: "0 auto",
    }}
  >
    {[
      {
        emoji: "📷",
        title: "Fotos",
        badge: "2 fotos grátis",
        price: "R$ 1,99 por foto adicional",
        text: "Adicione fotos especiais do casal para personalizar seu site.",
      },
      {
        emoji: "🎁",
        title: "QR Code + Surpresa",
        badge: null,
        price: "R$ 4,99",
        text: "Receba um QR Code por email e surpreenda seu amor com um email especial enviado diretamente para ele(a).",
      },
      {
        emoji: "⏳",
        title: "Extensão de Duração",
        badge: null,
        price: "R$ 3,99",
        text: "Estenda a duração do seu site de 7 dias para 3 meses e aproveite por mais tempo.",
      },
    ].map(({ emoji, title, badge, price, text }, i) => (
      <div
        key={i}
        style={{
          background: "#fff",
          padding: 30,
          borderRadius: 12,
          minWidth: 260,
          maxWidth: 280,
          flex: "1 1 260px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          textAlign: "left",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget;
          el.style.transform = "translateY(-10px) scale(1.02)";
          el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget;
          el.style.transform = "translateY(0) scale(1)";
          el.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
        }}
      >
        <div style={{ fontSize: "2.5rem", marginBottom: 20 }}>{emoji}</div>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 10 }}>{title}</h3>

        {badge && (
          <div
            style={{
              background: "#ffd800",
              color: "#000",
              fontWeight: 600,
              fontSize: "0.85rem",
              padding: "4px 10px",
              borderRadius: 6,
              display: "inline-block",
              marginBottom: 10,
            }}
          >
            {badge}
          </div>
        )}

        <p style={{ fontSize: "0.95rem", color: "#444", marginBottom: 20 }}>{text}</p>
        <hr style={{ border: "none", borderTop: "1px solid #eee", marginBottom: 10 }} />
        <p style={{ color: "#f57c93", fontWeight: 600, fontSize: "0.95rem" }}>{price}</p>
      </div>
    ))}
  </div>

  {/* Estilo do botão */}
  <style>{`
    .features-button {
      background-color: #000;
      color: #fff;
      border: 2px solid #f57c93;
      border-radius: 30px;
      padding: 10px 24px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.3s, transform 0.2s;
    }

    .features-button:hover {
      background-color: #111;
      transform: scale(1.05);
    }
  `}</style>
</div>



<div style={{ background: "#fbeee7", padding: "60px 20px", textAlign: "center" }}>
  {/* Botão acima do título */}
  <div style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}>
    <button className="moment-button">Quando usar o Vibraze?</button>
  </div>
  <p style={{ marginBottom: 40, color: "#555", fontSize: "1rem" }}>
    Surpreenda em momentos especiais
  </p>

  {/* Cards de momentos */}
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "stretch",
      gap: 40,
      flexWrap: "wrap",
      maxWidth: 1200,
      margin: "0 auto",
    }}
  >
    {[
      {
        emoji: "🎂",
        title: "Aniversário de Namoro",
        text: "Surpreenda seu amor com um site personalizado celebrando cada momento juntos no aniversário de relacionamento.",
      },
      {
        emoji: "💗",
        title: "Dia dos Namorados",
        text: "Crie um presente digital único para o Dia dos Namorados que ficará guardado para sempre.",
      },
      {
        emoji: "🎁",
        title: "Surpresa Especial",
        text: "Faça uma declaração de amor surpreendente em qualquer momento para demonstrar seus sentimentos.",
      },
    ].map(({ emoji, title, text }, index) => (
      <div
        key={index}
        style={{
          background: "#fff",
          padding: 30,
          borderRadius: 12,
          minWidth: 260,
          maxWidth: 320,
          flex: "1 1 260px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          textAlign: "left",
          cursor: "pointer",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget;
          el.style.transform = "translateY(-10px) scale(1.02)";
          el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget;
          el.style.transform = "translateY(0) scale(1)";
          el.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
        }}
      >
        <div style={{ fontSize: "1.8rem", color: "#f57c93", marginBottom: 10 }}>
          {emoji}
        </div>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 10 }}>
          {title}
        </h3>
        <p style={{ fontSize: "0.95rem", color: "#444" }}>{text}</p>
      </div>
    ))}

    {/* Estilo do botão */}
    <style>{`
      .moment-button {
        background-color: #000;
        color: #fff;
        border: 2px solid #fff;
        border-radius: 40px;
        padding: 10px 24px;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.3s, transform 0.2s, box-shadow 0.3s;
        box-shadow: 0 0 8px 2px rgba(255, 255, 255, 0.6);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 150px;
      }

      .moment-button:hover {
        background-color: #111;
        transform: scale(1.05);
        box-shadow: 0 0 12px 3px rgba(255, 255, 255, 0.8);
      }
    `}</style>
  </div>
</div>

{/* Para sempre e Anual */}
<div
  style={{
    background: "linear-gradient(to bottom, #f96894 0%, #ffe0eb 100%)",
    color: "#1b1b1f",
    padding: "60px 20px",
    textAlign: "center",
  }}
>
  <div id="planos" style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}>
  <button className="moment-button">Nossos Planos</button>
</div>
  <p style={{ color: "#4a4a4a", fontSize: "1rem", marginBottom: 50 }}>
    Escolha o plano ideal para sua página personalizada.
  </p>

  <div
    style={{
      display: "flex",
      justifyContent: "center",
      gap: 40,
      flexWrap: "wrap",
      maxWidth: 1000,
      margin: "0 auto",
    }}
  >
    {/* Plano Para Sempre */}
    <div className="plan-card highlight-card">
      <div className="badge">⭐ Recomendado</div>

      <h3>Para sempre</h3>
      <p className="price">
        R$ 27,00 <span className="price-sub">/uma vez</span>
      </p>
      <p className="old-price">R$ 54,00</p>

      <button className="plan-btn plan-pink">Surpreenda agora</button>

      <ul className="plan-details">
        <li>✅ Texto dedicado</li>
        <li><strong>✅ Contador em tempo real</strong></li>
        <li>✅ Data de início</li>
        <li><strong>✅ QR Code exclusivo</strong></li>
        <li>✅ Máximo de 8 imagens</li>
        <li><strong>✅ Com música</strong></li>
        <li>✅ Fundo dinâmico</li>
        <li><strong>✅ Com animações exclusivas</strong></li>
        <li>✅ URL personalizada</li>
        <li><strong>✅ Suporte 24 horas</strong></li>
      </ul>
    </div>

    {/* Plano Anual */}
    <div className="plan-card">
      <h3>Anual</h3>
      <p className="price">
        R$ 17,00 <span className="price-sub">/por ano</span>
      </p>
      <p className="old-price">R$ 34,00</p>

      <button className="plan-btn plan-white">Surpreenda agora</button>

      <ul className="plan-details">
        <li>✅ Texto dedicado</li>
        <li><strong>✅ Contador em tempo real</strong></li>
        <li>✅ Data de início</li>
        <li><strong>✅ QR Code exclusivo</strong></li>
        <li>✅ Máximo de 4 imagens</li>
        <li>❌ <span style={{ color: "#f96894" }}>Sem música</span></li>
        <li>❌ <span style={{ color: "#f96894" }}>Sem fundo dinâmico</span></li>
        <li>❌ <span style={{ color: "#f96894" }}>Sem animações exclusivas</span></li>
        <li>✅ URL personalizada</li>
        <li><strong>✅ Suporte 24 horas</strong></li>
      </ul>
    </div>
  </div>
</div>

<style>{`
  .plan-card {
    background: #fff;
    padding: 30px;
    border-radius: 16px;
    width: 320px;
    border: 1px solid #ddd;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
  }

  .highlight-card {
    border: 2px solid #f96894;
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  }

  .plan-card:hover {
    transform: scale(1.03);
    box-shadow: 0 10px 32px rgba(0, 0, 0, 0.12);
  }

  .badge {
    position: absolute;
    top: -14px;
    left: 20px;
    background: #f96894;
    color: #fff;
    font-size: 0.75rem;
    font-weight: bold;
    padding: 4px 10px;
    border-radius: 6px;
  }

  .price {
    font-size: 2rem;
    font-weight: 700;
    color: #f96894;
    margin-bottom: 5px;
  }

  .price-sub {
    font-size: 0.8rem;
    color: #888;
  }

  .old-price {
    color: #aaa;
    text-decoration: line-through;
    margin-bottom: 20px;
  }

  .plan-details {
    margin-top: 30px;
    text-align: left;
    line-height: 1.8;
    font-size: 0.95rem;
    padding: 0;
    list-style: none;
  }

  .plan-btn {
    display: inline-block;
    width: 100%;
    padding: 12px 0;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: background 0.3s ease, transform 0.2s ease;
  }

  .plan-pink {
    background-color: #f96894;
    color: #fff;
  }

  .plan-pink:hover {
    background-color: #e05482;
    transform: scale(1.03);
  }

  .plan-white {
    background-color: #f2f2f2;
    color: #333;
  }

  .plan-white:hover {
    background-color: #e4e4e4;
    transform: scale(1.03);
  }

  .moment-button {
    background-color: #000;
    color: #fff;
    border: 1.5px solid #fff;
    border-radius: 40px;
    padding: 14px 36px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.3s, transform 0.2s, box-shadow 0.3s;
    box-shadow: 0 0 8px 2px rgba(255, 255, 255, 0.6);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 150px;
  }

  .moment-button:hover {
    background-color: #111;
    transform: scale(1.05);
    box-shadow: 0 0 12px 3px rgba(255, 255, 255, 0.8);
  }
`}</style>

             {/* faq */}
    <div style={{ backgroundColor: "#fff3e9", padding: "60px 20px", color: "#fff" }}>
  <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 40 }}>
    
    {/* Esquerda - Título e descrição */}
    <div  id="faq" style={{ flex: 1, minWidth: 300 }}>
      <div style={{
        background: "#1b1b1f",
        display: "inline-block",
        padding: "4px 10px",
        borderRadius: 20,
        fontSize: "0.85rem",
        marginBottom: 16
      }}>
        <span role="img" aria-label="FAQ"></span>FAQ
      </div>
      <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 16 }}><span style={{ color: "#000" }}> Perguntas Frequentes</span>
      </h2>
      <p style={{ color: "#000", lineHeight: 1.6 }}>
        Separamos algumas perguntas frequentes sobre o Vibraze. Caso tenha alguma dúvida específica, entre em contato pelo nosso direct do Instagram ou pelo nosso e-mail.
      </p>

      {/* Contato */}
      <div style={{
        marginTop: 40,
        backgroundColor: "#141414",
        padding: 20,
        borderRadius: 12,
        border: "1px solid #333"
      }}>
        <p style={{ marginBottom: 16 }}>Não encontrou sua pergunta? Entre em contato conosco:</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <a href="gabriel:suporte@vibraze" style={{ color: "#fff3e9", textDecoration: "none" }}>
            ✉️ suporte@vibraze.com
          </a>
        </div>
      </div>
    </div>

    {/* Direita - Perguntas */}
    <div style={{ flex: 1.5, minWidth: 300 }}>
      {[
        {
          pergunta: "O que é o Vibraze?",
          resposta: "Vibraze é uma plataforma que permite criar páginas personalizadas para casais apaixonados. Você pode adicionar fotos especiais, sua música favorita e uma mensagem única para surpreender a pessoa amada com um presente digital memorável."
        },
        {
          pergunta: "Como funciona a criação da página personalizada?",
          resposta: "É muito simples! Você escolhe o modelo de página, adiciona fotos especiais do casal, seleciona a música que marca a relação, escreve uma mensagem personalizada e finaliza com o pagamento. Após a confirmação, a página é gerada automaticamente e fica disponível imediatamente."
        },
        {
          pergunta: "A página personalizada tem prazo de validade?",
          resposta: "Não! Sua página personalizada ficará disponível para sempre. Você e seu amor poderão acessá-la a qualquer momento, de qualquer lugar do mundo, através do link ou QR code fornecido."
        },
        {
          pergunta: "Como entrego este presente para a pessoa amada?",
          resposta: "Após finalizar sua compra, você receberá um QR code e um link exclusivo que pode ser compartilhado da maneira que preferir. Muitas pessoas optam por imprimir o QR code em um cartão especial ou enviar o link em um momento romântico. A surpresa ao acessar a página é sempre emocionante!"
        },
        {
          pergunta: "O que é a retrospectiva animada estilo Spotify?",
          resposta: "É uma experiência interativa onde as memórias do casal são apresentadas em um estilo visual moderno, inspirado nas retrospectivas do Spotify. As fotos, frases e músicas se unem para criar um momento emocionante e inesquecível."
        },
        {
          pergunta: "Quais formas de pagamento são aceitas?",
          resposta: "Aceitamos pagamentos via cartão de crédito, Pix e boleto bancário, proporcionando flexibilidade para você escolher a melhor forma de pagamento."
        },
        {
          pergunta: "Posso editar a página depois de criada?",
          resposta: "Sim! Após a criação, você poderá editar sua página quantas vezes quiser, adicionando ou removendo fotos, alterando a música ou ajustando a mensagem sempre que desejar."
        }
      ].map((item, index) => (
        <details key={index} style={{
          background: "#1a1a1a",
          borderRadius: 12,
          marginBottom: 16,
          padding: "16px 20px",
          color: "#fff3e9",
          cursor: "pointer"
        }}>
          <summary style={{
            fontWeight: "bold",
            fontSize: "1rem",
            listStyle: "none",
            outline: "none"
          }}>{item.pergunta}</summary>
          <p style={{ marginTop: 10, color: "#ccc", fontSize: "0.95rem" }}>
            {item.resposta}
          </p>
        </details>
      ))}
    </div>
  </div>
</div>



    {/* footer*/}
<div
  style={{
    backgroundColor: "#fff3e9",
    color: "#000",
    padding: "40px 20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontSize: "0.9rem",
  }}
>
  <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
    {/* Container superior com conteúdo centralizado */}
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 80, width: "100%" }}>
      {/* Logo e descrição */}
      <div style={{ flex: "1 1 300px", minWidth: 260, maxWidth: 400 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span
            style={{
              backgroundColor: "#fff3e9",
              borderRadius: "50%",
              padding: 8,
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <svg width="20" height="20" fill="#e05482" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 1.01 4.5 2.5C13.09 4.01 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </span>
          <strong style={{ color: "#000", fontSize: "1.25rem" }}>Vibraze</strong>
        </div>
        <p style={{ lineHeight: 1.5, color: "#000" }}>
          Criamos experiências únicas e inesquecíveis para casais, ajudando a eternizar momentos especiais com presentes virtuais personalizados.
        </p>
      </div>

      {/* Links */}
      <div style={{ display: "flex", gap: 40, flexWrap: "wrap", justifyContent: "center" }}>
        <div style={{ minWidth: 120 }}>
          <strong style={{ color: "#000", display: "block", marginBottom: 10 }}>Produto</strong>
          <a href="#como-funciona" style={{ color: "#000", textDecoration: "none", display: "block", marginBottom: 6 }}>Como Funciona</a>
          <a href="#planos" style={{ color: "#000", textDecoration: "none", display: "block", marginBottom: 6 }}>Planos</a>
             <a href="#preços" style={{ color: "#000", textDecoration: "none", display: "block", marginBottom: 6 }}>Preços</a>
          <a href="#" style={{ color: "#000", textDecoration: "none" }}>Criar Presente</a>
        </div>
        <div style={{ minWidth: 120 }}>
          <strong style={{ color: "#000", display: "block", marginBottom: 10 }}>Legal</strong>
<a href="/termos" style={{ color: "#000", textDecoration: "none", display: "block", marginBottom: 6 }}>
  Termos de Uso
</a>
          <a href="/privacy" style={{ color: "#000", textDecoration: "none", display: "block", marginBottom: 6 }}>Privacidade</a>
          <a href="#" style={{ color: "#000", textDecoration: "none", display: "block", marginBottom: 6 }}>Cookies</a>
          <a href="#faq" style={{ color: "#000", textDecoration: "none" }}>FAQ</a>
        </div>
      </div>
    </div>



    {/* Footer inferior */}
    <div
      style={{
        marginTop: 40,
        borderTop: "1px solid #e2c2ae",
        paddingTop: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        textAlign: "center",
        fontSize: "0.8rem",
        width: "100%",
      }}

      
    >
      <div>© 2025 Vibraze. Todos os direitos reservados.</div>
    </div>
  </div>
</div>


      {/* Animação do cursor piscando */}
      <style>{`
        @keyframes blink {
          0% { opacity: 1 }
          50% { opacity: 0 }
          100% { opacity: 1 }
        }
      `}</style>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/termos" element={<Terms />} />
        <Route path="/memoryCreate" element={<MemoryCreate />} />
        <Route path="/MemoryCreate/:token" element={<MemoryCreatedPage />} />
        <Route path="/Contagem" element={<Contagem />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
    </Router>
  );
};

export default App;
