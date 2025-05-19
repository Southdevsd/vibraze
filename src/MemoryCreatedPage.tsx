import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

function getElapsedText(startDate: string): string {
  const now = new Date();
  const start = new Date(startDate);
  let diff = now.getTime() - start.getTime();
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = day * 365;
  const years = Math.floor(diff / year); diff -= years * year;
  const months = Math.floor(diff / month); diff -= months * month;
  const days = Math.floor(diff / day); diff -= days * day;
  const hours = Math.floor(diff / hour); diff -= hours * hour;
  const minutes = Math.floor(diff / minute); diff -= minutes * minute;
  const seconds = Math.floor(diff / second);
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} ano${years > 1 ? 's' : ''}`);
  if (months > 0) parts.push(`${months} mês${months > 1 ? 'es' : ''}`);
  if (days > 0) parts.push(`${days} dia${days > 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hora${hours > 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minuto${minutes > 1 ? 's' : ''}`);
  parts.push(`${seconds} segundo${seconds !== 1 ? 's' : ''}`);
  if (parts.length === 1) return parts[0] + ' de amor e companheirismo';
  const last = parts.pop();
  return parts.join(', ') + ' e ' + last + ' de amor e companheirismo';
}

const getElapsedTime = (startDate: string) => {
  const now = new Date();
  const start = new Date(startDate);
  let diff = now.getTime() - start.getTime();
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = day * 365;
  const years = Math.floor(diff / year); diff -= years * year;
  const months = Math.floor(diff / month); diff -= months * month;
  const days = Math.floor(diff / day); diff -= days * day;
  const hours = Math.floor(diff / hour); diff -= hours * hour;
  const minutes = Math.floor(diff / minute); diff -= minutes * minute;
  const seconds = Math.floor(diff / second);
  // Helper to pad with zero
  const pad = (n: number) => n.toString().padStart(2, '0');
  return [
    { label: 'Anos', valor: pad(years) },
    { label: 'Meses', valor: pad(months) },
    { label: 'Dias', valor: pad(days) },
    { label: 'Horas', valor: pad(hours) },
    { label: 'Min', valor: pad(minutes) },
    { label: 'Seg', valor: pad(seconds) },
  ];
};

// Componente para corações subindo
const FloatingHearts: React.FC<{ count?: number }> = ({ count = 8 }) => {
  const [hearts, setHearts] = useState<Array<{ id: number; left: number; delay: number }>>([]);
  useEffect(() => {
    // Gera posições e delays aleatórios para os corações
    setHearts(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 90 + 2, // porcentagem da tela
        delay: Math.random() * 8, // segundos
      }))
    );
  }, [count]);
  return (
    <div style={{ pointerEvents: 'none', position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', zIndex: 100 }}>
      {hearts.map((h) => (
        <span
          key={h.id}
          style={{
            position: 'absolute',
            left: `${h.left}%`,
            bottom: '-40px',
            fontSize: '2.2rem',
            opacity: 0.7,
            animation: `floatHeart 4.5s cubic-bezier(.4,0,.2,1) ${h.delay}s infinite`,
            filter: 'drop-shadow(0 2px 8px #ffb6d5)',
            userSelect: 'none',
          }}
        >
          💗
        </span>
      ))}
      {/* CSS da animação */}
      <style>{`
        @keyframes floatHeart {
          0% { transform: translateY(0) scale(1) rotate(-8deg); opacity: 0.7; }
          20% { opacity: 1; }
          60% { transform: translateY(-60vh) scale(1.15) rotate(8deg); opacity: 0.8; }
          100% { transform: translateY(-100vh) scale(0.9) rotate(-8deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

const MemoryCreatedPage = () => {
  const [searchParams] = useSearchParams();
  const coupleName = searchParams.get('coupleName') || '';
  const relationshipDate = searchParams.get('relationshipDate') || '';
  const loveDeclaration = searchParams.get('loveDeclaration') || '';
  const titulo = searchParams.get('titulo') || '';
  let fotosCasal: string[] = [];
  try {
    fotosCasal = JSON.parse(searchParams.get('fotosCasal') || '[]');
  } catch {}

  // Estado para o contador animado
  const [elapsedTime, setElapsedTime] = useState(() => getElapsedTime(relationshipDate));
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(getElapsedTime(relationshipDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [relationshipDate]);

  // Estado para o slider de fotos
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const totalPhotos = fotosCasal.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % totalPhotos);
    }, 3000); // Muda a cada 3 segundos
    return () => clearInterval(timer);
  }, [totalPhotos]);

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % totalPhotos);
  };

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + totalPhotos) % totalPhotos);
  };

  // Estado para o botão de surpresa
  const [showSurprise, setShowSurprise] = useState(true);
  type FallingHeart = { id: number; left: number; key: number; duration: number };
  const [fallingHearts, setFallingHearts] = useState<FallingHeart[]>([]);

  // Função para adicionar corações caindo
  const addFallingHeart = () => {
    setFallingHearts((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        left: Math.random() * 98 + 1,
        key: Math.random(),
        duration: 1.5 + Math.random() * 1.2, // random duration between 1.5s and 2.7s
      }
    ]);
  };

  // Enquanto o botão de surpresa está visível, faz chover corações
  useEffect(() => {
    if (!showSurprise) return;
    const interval = setInterval(addFallingHeart, 180);
    return () => clearInterval(interval);
  }, [showSurprise]);

  // Remove corações após animação
  useEffect(() => {
    if (fallingHearts.length === 0) return;
    const timeout = setTimeout(() => {
      setFallingHearts((prev) => prev.slice(1));
    }, 1800);
    return () => clearTimeout(timeout);
  }, [fallingHearts]);

  if (showSurprise) {
    return (
      <div style={{
        minHeight: '100vh',
        minWidth: '100vw',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        overflow: 'hidden',
      }}>
        <button
          onClick={() => setShowSurprise(false)}
          style={{
            background: 'linear-gradient(to bottom, #f96894 0%, #f96894 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 16,
            padding: '22px 60px',
            fontWeight: 700,
            fontSize: '1.5rem',
            boxShadow: '0 4px 32px #f9689440',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
            outline: 'none',
            position: 'relative',
            zIndex: 10,
            transition: 'transform 0.15s',
          }}
        >
          <span style={{ fontSize: 32, marginRight: 8 }}>💖</span> Clique para ver a surpresa
        </button>
        {/* Emojis caindo */}
        {fallingHearts.map((h) => (
          <span
            key={h.key}
            style={{
              position: 'fixed',
              top: '-48px',
              left: `${h.left}%`,
              fontSize: 38,
              pointerEvents: 'none',
              zIndex: 20,
              animation: `fallHeartAnim ${h.duration || 2}s linear`,
              userSelect: 'none',
            }}
          >❤️</span>
        ))}
        <style>{`
          @keyframes fallHeartAnim {
            0% { transform: translateY(0) scale(1) rotate(-10deg); opacity: 0.7; }
            20% { opacity: 1; }
            80% { transform: translateY(85vh) scale(1.1) rotate(10deg); opacity: 0.8; }
            100% { transform: translateY(100vh) scale(0.95) rotate(-10deg); opacity: 0; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: '#fff1e6',
        minHeight: '100vh',
        padding: '2rem 0.5rem',
        textAlign: 'center',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <FloatingHearts count={10} />
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '1rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
          width: '100%',
          maxWidth: 768,
          margin: '0 auto',
          overflow: 'hidden',
          padding: '2rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Barra do navegador fake */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#f3f4f6',
          borderBottom: '1px solid #e5e7eb',
          justifyContent: 'center',
        }}>
        </div>
        {/* Player do Spotify acima do nome do casal */}
        {(() => {
          const spotifyId = searchParams.get('spotifyId');
          if (!spotifyId) return null;

          // Detecta se é mobile
          const isMobile = typeof window !== "undefined" && /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);

          if (isMobile) {
            // No mobile, mostra botão para abrir direto no app do Spotify
            return (
              <div style={{ marginTop: 24, marginBottom: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <button
                  style={{
                    background: '#1db954',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '12px 24px',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    marginBottom: 8,
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    window.open(`spotify:track:${spotifyId}`, '_blank');
                  }}
                >
                  Ouvir no Spotify
                </button>
                <span style={{ color: '#888', fontSize: 13 }}>Clique para abrir no app do Spotify</span>
              </div>
            );
          }

          // Desktop: mostra o player embed normal
          return (
            <div style={{ marginTop: 24, marginBottom: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <iframe
                src={`https://open.spotify.com/embed/track/${spotifyId}`}
                width="320"
                height="80"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                style={{ borderRadius: 8, maxWidth: '100%' }}
                title="Spotify Player"
                allowFullScreen
              ></iframe>
            </div>
          );
        })()}
        {/* Nome do casal estilizado */}
        {coupleName && (
          <div style={{ marginTop: '1.5rem', textAlign: 'center', position: 'relative', background: '#ffe4ec', borderRadius: '1rem', padding: '0.5rem 0 1.5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '2rem', marginRight: 8, marginTop: 0, filter: 'drop-shadow(0 1px 0 #ffb6d5)' }}>❤️</span>
              <span style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#ff7eb3', letterSpacing: 1, textShadow: '0 2px 8px #ffd6e8', padding: '0 0.5rem 0.2rem 0.5rem', borderRadius: 4, background: 'transparent' }}>{coupleName}</span>
              <span style={{ fontSize: '2rem', marginLeft: 8, marginTop: 0, filter: 'drop-shadow(0 1px 0 #ffb6d5)' }}>❤️</span>
            </div>
            {/* Sombra rosa embaixo do nome */}
            <div style={{ height: 8, marginTop: 2, display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: 120, height: 8, borderRadius: 8, background: 'radial-gradient(ellipse at center, #ffb6d5 60%, transparent 100%)', filter: 'blur(1.5px)' }} />
            </div>
          </div>
        )}
        {/* Galeria dinâmica de fotos - Slider estilo "cartas" sutil */}
        {fotosCasal.length > 0 && (
          <div
            style={{
              marginTop: '1rem',
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 'auto',
              minHeight: 180,
              width: '100%',
              maxWidth: 340,
            }}
          >
            {/* Imagem anterior (só um pedacinho à esquerda, atrás) */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 30,
                width: 80,
                height: 240,
                borderRadius: '1rem',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                transform: 'translateX(-180px) scale(0.85)',
                zIndex: 0,
                opacity: 0.45,
                background: '#fff',
                transition: 'all 0.4s cubic-bezier(.4,2,.6,1)',
                border: '1.5px solid #f3f4f6',
                display: totalPhotos > 1 ? 'block' : 'none',
                pointerEvents: 'none',
              }}
            >
              <img
                src={fotosCasal[(currentPhotoIndex - 1 + totalPhotos) % totalPhotos]}
                alt="Anterior"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '1rem', filter: 'brightness(0.93) blur(1px)' }}
              />
            </div>
            {/* Imagem principal */}
            <div
              style={{
                width: '100%',
                maxWidth: 300,
                height: 'auto',
                aspectRatio: '1/1',
                borderRadius: '1rem',
                overflow: 'hidden',
                position: 'relative',
                zIndex: 2,
                boxShadow: '0 6px 24px rgba(0,0,0,0.18)',
                background: '#fff',
                transition: 'all 0.4s cubic-bezier(.4,2,.6,1)',
                border: '2.5px solid #ffe4ec',
                margin: '0 auto',
              }}
            >
              <img
                src={fotosCasal[currentPhotoIndex]}
                alt={`Foto ${currentPhotoIndex + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '1rem' }}
              />
            </div>
            {/* Imagem próxima (só um pedacinho à direita, atrás) */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 30,
                width: 80,
                height: 240,
                borderRadius: '1rem',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                transform: 'translateX(100px) scale(0.85)',
                zIndex: 0,
                opacity: 0.45,
                background: '#fff',
                transition: 'all 0.4s cubic-bezier(.4,2,.6,1)',
                border: '1.5px solid #f3f4f6',
                display: totalPhotos > 1 ? 'block' : 'none',
                pointerEvents: 'none',
              }}
            >
              <img
                src={fotosCasal[(currentPhotoIndex + 1) % totalPhotos]}
                alt="Próxima"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '1rem', filter: 'brightness(0.93) blur(1px)' }}
              />
            </div>
            {/* Botões de navegação */}
            <button
              onClick={handlePrevPhoto}
              style={{
                position: 'absolute',
                left: 18, // mais próximo da imagem
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
                zIndex: 5, // garantir que fique acima da imagem
                transition: 'background 0.2s',
              }}
            >
              <span style={{ fontSize: '1.5rem', color: '#db2777' }}>&lt;</span>
            </button>
            <button
              onClick={handleNextPhoto}
              style={{
                position: 'absolute',
                right: 18, // mais próximo da imagem
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
                zIndex: 5, // garantir que fique acima da imagem
                transition: 'background 0.2s',
              }}
            >
              <span style={{ fontSize: '1.5rem', color: '#db2777' }}>&gt;</span>
            </button>
          </div>
        )}
        {/* Aviso se não for possível exibir imagens reais */}
        {fotosCasal.length > 0 && !fotosCasal[0].startsWith('http') && (
          <div style={{ color: '#db2777', marginTop: 8, fontSize: 13 }}>
          </div>
        )}
        {/* Conteúdo */}
        <div
          style={{
            background: 'linear-gradient(to bottom, #fff1f2, #ffffff)',
            padding: '1.5rem 0.5rem',
            textAlign: 'center',
            minHeight: 200,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            maxWidth: 400,
          }}
        >
          {/* Título personalizado acima do contador */}
          {titulo && (
            <div style={{ marginBottom: '0.8rem', marginTop: '1.2rem', textAlign: 'center' }}>
            </div>
          )}
          <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#374151' }}>
            Um amor que começou em{' '}
            <span style={{ color: '#db2777', fontWeight: 'bold' }}>{formatDate(relationshipDate)}</span>
          </h3>
          <p style={{ marginTop: '0.5rem', color: '#4b5563' }}></p>
          {/* Contador de tempo animado */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem', marginBottom: '0.5rem' }}>
            {elapsedTime.map((item, index) => (
              <div key={index} style={{
                backgroundColor: '#fff',
                border: '2.5px solid',
                borderImage: 'linear-gradient(180deg, #ff7eb3 0%, #ff758c 100%) 1',
                borderRadius: '0.5rem',
                width: '56px',
                height: '72px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
                margin: 0,
                padding: 0,
              }}>
                <span style={{ color: '#ff7eb3', fontWeight: 'bold', fontSize: '1.6rem', letterSpacing: '1px', lineHeight: 1 }}>{item.valor}</span>
                <span style={{ fontSize: '0.85rem', color: '#444', marginTop: 4, fontWeight: 400 }}>{item.label}</span>
              </div>
            ))}
          </div>
          {/* Título personalizado acima do companheirismo */}
          {titulo && (
            <div style={{ marginBottom: '0.8rem', marginTop: '1.2rem', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f85a8e', margin: 0 }}>{titulo}</h2>
            </div>
          )}
          <p style={{ fontSize: '0.875rem', color: '#6b7280', fontStyle: 'italic' }}>{getElapsedText(relationshipDate)}</p>
          <div
            style={{
              marginTop: '1.5rem',
              backgroundColor: '#ffffff',
              borderRadius: '1rem',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              padding: '1rem',
              width: '100%',
              maxWidth: 340,
              marginLeft: 'auto',
              marginRight: 'auto',
              border: '1px solid #fce7f3',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
            }}
          >
            <h4 style={{ color: '#db2777', fontWeight: '600', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <span style={{ fontSize: '1.2rem', marginRight: 4 }}>💗</span>
              Nossa História
              <span style={{ fontSize: '1.2rem', marginLeft: 4 }}>💗</span>
            </h4>
            <blockquote style={{ color: '#374151', fontStyle: 'italic' }}>
              “{loveDeclaration || 'Sem declaração ainda.'}”
            </blockquote>
          </div>
        </div>
      </div>
      {/* Media queries para responsividade */}
      <style>{`
        @media (max-width: 600px) {
          .memory-main {
            padding: 1rem 0.2rem !important;
          }
          .memory-card {
            padding: 1rem 0.2rem !important;
            max-width: 99vw !important;
          }
          .memory-slider {
            max-width: 98vw !important;
            min-height: 140px !important;
          }
          .memory-content {
            max-width: 99vw !important;
            padding: 1rem 0.2rem !important;
          }
          .memory-box {
            max-width: 99vw !important;
            padding: 0.7rem 0.2rem !important;
            font-size: 0.97rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MemoryCreatedPage;
