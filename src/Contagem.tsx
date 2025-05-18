import React, { useEffect, useState } from 'react';

const Contagem: React.FC = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [diff, setDiff] = useState<{
    years: number;
    months: number;
    days: number;
    hours: number;
    totalDays: number;
    totalHours: number;
  } | null>(null);

  useEffect(() => {
    const today = new Date();
    const oneYearLater = new Date();
    oneYearLater.setFullYear(today.getFullYear() + 1);

    setStartDate(today.toISOString().substring(0, 10));
    setEndDate(oneYearLater.toISOString().substring(0, 10));
  }, []);

  const calculate = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      alert('A data de término deve ser após a data de início!');
      return;
    }

    const diffTime = end.getTime() - start.getTime();
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(diffTime / (1000 * 60 * 60));

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();
    let hours = end.getHours() - start.getHours();

    if (hours < 0) {
      days--;
      hours += 24;
    }

    if (days < 0) {
      months--;
      const tempDate = new Date(end.getFullYear(), end.getMonth(), 0);
      days += tempDate.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    setDiff({ years, months, days, hours, totalDays, totalHours });
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* TOPO (Navbar) */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
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
      </div>

      <div
        style={{
          fontFamily: 'Arial, sans-serif',
          padding: '2rem',
          textAlign: 'center',
          background: '#fff', // fundo branco só na parte principal
          minHeight: '100vh',
        }}
      >
        <h1
          style={{
            fontSize: '3rem',
            color: '#d63384',
            fontFamily: 'cursive',
            marginBottom: '1rem',
            textShadow: '0 0 10px rgba(255, 105, 180, 0.7)',
          }}
        >
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#333', marginBottom: '2rem' }}>
          Contagem regressiva para a sua data especial com quem você ama
        </p>

        <div
          style={{
            backgroundColor: 'rgba(255,255,255,0.5)',
            padding: '2rem',
            borderRadius: '1rem',
            marginBottom: '2rem',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ fontFamily: 'Poppins, Arial, sans-serif', fontWeight: 600, color: '#d63384', fontSize: '1.1rem' }}>Data de Início</label>
              <br />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #ccc', fontFamily: 'Poppins, Arial, sans-serif', fontWeight: 500, color: '#d63384', fontSize: '1.1rem' }}
              />
            </div>
            <div>
              <label style={{ fontFamily: 'Poppins, Arial, sans-serif', fontWeight: 600, color: '#d63384', fontSize: '1.1rem' }}>Data de Término</label>
              <br />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #ccc', fontFamily: 'Poppins, Arial, sans-serif', fontWeight: 500, color: '#d63384', fontSize: '1.1rem' }}
              />
            </div>
          </div>
          <button
            onClick={calculate}
            style={{
              backgroundColor: '#d63384',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '9999px',
              border: 'none',
              fontSize: '1.1rem',
              cursor: 'pointer',
              fontFamily: 'Poppins, Arial, sans-serif',
              fontWeight: 700,
              letterSpacing: '0.5px',
              boxShadow: '0 2px 8px rgba(214,51,132,0.08)'
            }}
          >
            ❤️ Calcular Amor
          </button>
        </div>

        {diff && (
          <div>
            <div
              style={{
                backgroundColor: 'rgba(255,255,255,0.3)',
                padding: '2rem',
                borderRadius: '1rem',
                marginBottom: '2rem',
                backdropFilter: 'blur(10px)',
              }}
            >
              <h2 style={{ fontSize: '1.5rem', color: '#d63384', marginBottom: '1rem' }}>Sua Contagem do Amor</h2>
              <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1rem' }}>
                { [
                  { key: 'years', label: 'Anos' },
                  { key: 'months', label: 'Meses' },
                  { key: 'days', label: 'Dias' },
                  { key: 'hours', label: 'Horas' },
                ].map(({ key, label }) => (
                  <div
                    key={key}
                    style={{
                      backgroundColor: 'white',
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      flex: '1 1 100px',
                    }}
                  >
                    <div style={{ fontSize: '2rem', color: '#d63384', fontWeight: 'bold' }}>
                      {diff[key as keyof typeof diff]}
                    </div>
                    <div style={{ color: '#555' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(255,255,255,0.3)',
                padding: '2rem',
                borderRadius: '1rem',
                backdropFilter: 'blur(10px)',
              }}
            >
              <h3 style={{ fontSize: '1.25rem', color: '#d63384', marginBottom: '1rem' }}>Sua História de Amor</h3>
              <p style={{ marginBottom: '0.5rem' }}>
                Vocês estão juntos há <strong>{diff.totalDays}</strong> dias
              </p>
              <p>Isso são <strong>{diff.totalHours}</strong> horas de amor!</p>

              <div style={{ marginTop: '1rem' }}>
                {/* Removidos os botões de compartilhar */}
              </div>
            </div>
          </div>
        )}

        {/* Novo footer */}
        <div
          style={{
            backgroundColor: "#fff3e9",
            color: "#000",
            padding: "40px 20px",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            fontSize: "0.9rem",
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 40,
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 80, width: "100%" }}>
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
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 1.01 4.5 2.5C13.09 4.01 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </span>
                  <strong style={{ color: "#000", fontSize: "1.25rem" }}>Vibraze</strong>
                </div>
                <p style={{ lineHeight: 1.5, color: "#000" }}>
                  Criamos experiências únicas e inesquecíveis para casais, ajudando a eternizar momentos especiais com presentes virtuais personalizados.
                </p>
              </div>

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
                  <a href="/termos" style={{ color: "#000", textDecoration: "none", display: "block", marginBottom: 6 }}>Termos de Uso</a>
                  <a href="/privacy" style={{ color: "#000", textDecoration: "none", display: "block", marginBottom: 6 }}>Privacidade</a>
                  <a href="#" style={{ color: "#000", textDecoration: "none", display: "block", marginBottom: 6 }}>Cookies</a>
                  <a href="#faq" style={{ color: "#000", textDecoration: "none" }}>FAQ</a>
                </div>
              </div>
            </div>

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
      </div>
    </div>
  );
};

export default Contagem;
