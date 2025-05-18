import React, { useEffect, useState } from 'react';
import MemoryCreatedPage from './MemoryCreatedPage';
import { uploadToPostimages } from './utils/uploadToPostimages';
import { QrCodePix } from 'qrcode-pix';

const EtapasForm = () => {
  const [step, setStep] = useState(1);
  const [coupleName, setCoupleName] = useState('');
  const [email, setEmail] = useState('');
  const [relationshipDate, setRelationshipDate] = useState('');
  const [loveDeclaration, setLoveDeclaration] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [fotosCasal, setFotosCasal] = useState<string[]>([]);
  const [qrEmail, setQrEmail] = useState('');
  const [siteDuration, setSiteDuration] = useState<'7dias' | '3meses'>('7dias');
  const [showResumo, setShowResumo] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(getElapsedTime(relationshipDate));
  const [slideIndex, setSlideIndex] = useState(0);
  const [showCreated, setShowCreated] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [titulo, setTitulo] = useState('');

  // Adiciona estados para etapa de pagamento
  const [paymentStep, setPaymentStep] = useState(false); // true se mostrar etapa 5
  const [paymentConfirmed, setPaymentConfirmed] = useState(false); // true se pagamento confirmado
  const [selectedPayment, setSelectedPayment] = useState<'pix' | 'mercadopago' | null>(null);
  const [pixQrCode, setPixQrCode] = useState<string | null>(null);
  const [pixPayload, setPixPayload] = useState<string | null>(null);

  const fotosExtras = Math.max(0, fotosCasal.length - 2);
  const valorFotosExtras = fotosExtras * 1.99;
  
  // Atualiza o tempo a cada segundo
useEffect(() => {
  const interval = setInterval(() => {
    setElapsedTime(getElapsedTime(relationshipDate));
  }, 1000);

  return () => clearInterval(interval);
}, [relationshipDate]);

// Troca de slide automaticamente a cada 3 segundos (se houver mais de 1 foto)
useEffect(() => {
  if (fotosCasal.length <= 1) return;

  const interval = setInterval(() => {
    setSlideIndex((prev) => (prev === fotosCasal.length - 1 ? 0 : prev + 1));
  }, 3000);

  return () => clearInterval(interval);
}, [fotosCasal]);

  function getElapsedTime(startDate: string) {
    const now = new Date();
    const start = new Date(startDate);
    const diff = now.getTime() - start.getTime();

    const seconds = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / 1000 / 60) % 60;
    const hours = Math.floor(diff / 1000 / 60 / 60) % 24;
    const days = Math.floor(diff / 1000 / 60 / 60 / 24);

    return [
      { label: 'dias', valor: days },
      { label: 'horas', valor: hours },
      { label: 'min', valor: minutes },
      { label: 'seg', valor: seconds },
    ];
  }

  function getElapsedText(startDate: string): string {
  const now = new Date();
  const start = new Date(startDate);
  let diff = now.getTime() - start.getTime();

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30; // aproximado
  const year = day * 365;

  const years = Math.floor(diff / year);
  diff -= years * year;

  const months = Math.floor(diff / month);
  diff -= months * month;

  const days = Math.floor(diff / day);
  diff -= days * day;

  const hours = Math.floor(diff / hour);
  diff -= hours * hour;

  const minutes = Math.floor(diff / minute);
  diff -= minutes * minute;

  const seconds = Math.floor(diff / second);

  const parts: string[] = [];

  if (years > 0) parts.push(`${years} ano${years > 1 ? 's' : ''}`);
  if (months > 0) parts.push(`${months} mês${months > 1 ? 'es' : ''}`);
  if (days > 0) parts.push(`${days} dia${days > 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hora${hours > 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minuto${minutes > 1 ? 's' : ''}`);

  parts.push(`${seconds} segundo${seconds !== 1 ? 's' : ''}`);

  // Monta a frase com vírgulas e "e" antes do último elemento
  if (parts.length === 1) return parts[0] + ' de amor e companheirismo';
  const last = parts.pop();
  return parts.join(', ') + ' e ' + last + ' de amor e companheirismo';
}
 const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};


  const labelStyle = { display: 'block', marginBottom: '1rem' };
  const inputStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    marginTop: '5px',
    fontFamily: "'Poppins', sans-serif"
  };
  const iconLabel = { display: 'block', fontWeight: 'bold', color: '#f85a8e' };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep(2);
  };


const handleFotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files) return;
  const filesArray = Array.from(e.target.files);
  const uploadedUrls: string[] = [];
  for (const file of filesArray) {
    try {
      const url = await uploadToPostimages(file);
      uploadedUrls.push(url);
    } catch (err) {
      alert('Erro ao enviar imagem para o Postimages. Tente novamente.');
    }
  }
  setFotosCasal((prev) => [...prev, ...uploadedUrls]);
};

  const handleRemoverFoto = (index: number) => {
    setFotosCasal((prev) => prev.filter((_, i) => i !== index));
  };

  // Função para adicionar foto (simples placeholder)
  const handleAddPhoto = () => {
    if (photos.length < 2) {
      setPhotos([...photos, `Foto ${photos.length + 1}`]);
    } else {
      alert('Você já adicionou o máximo de 2 fotos grátis.');
    }
  };

  const handleCriarSite = () => {
    const token = Date.now().toString() + Math.floor(Math.random() * 10000).toString();
    setGeneratedToken(token);
    setShowCreated(true);
    setStep(4); // Vai direto para etapa 4
    // Gera URLs temporários para as imagens (apenas se for File)
    const fotosCasalUrls = fotosCasal;
    const params = new URLSearchParams({
      coupleName,
      relationshipDate,
      loveDeclaration,
      fotosCasal: JSON.stringify(fotosCasalUrls),
      titulo // Passa o título para a MemoryCreatedPage
    });
    window.open(`/MemoryCreate/${token}?${params.toString()}`, '_blank');
  };

  // Função para checar se precisa de pagamento (corrigida)
  function needsPayment() {
    return hasMoreThan2Photos || hasQrEmail || hasExtendedDuration;
  }

  // Quando o usuário avança para a etapa 4 (prévia), verifica se precisa de pagamento
  useEffect(() => {
    if (step === 4 && needsPayment()) {
      setPaymentStep(true);
    } else {
      setPaymentStep(false);
    }
  }, [step, fotosCasal, email, siteDuration]);

  // Remove the mock QRCode PIX effect and replace with real QR code generation
  useEffect(() => {
    async function generatePixQr() {
      if (selectedPayment === 'pix') {
        // Calculate the total value for payment
        const fotosExtras = Math.max(0, fotosCasal.length - 2);
        const valorFotos = fotosExtras * 1.49;
        const valorQr = qrEmail.trim() !== '' ? 4.99 : 0;
        const valorDuracao = siteDuration === '3meses' ? 3.99 : 0;
        const total = valorFotos + valorQr + valorDuracao;
        // Use a fallback value if total is 0 (should not happen)
        const value = total > 0 ? total : 1.0;
        // Generate a unique transaction ID (max 25 chars)
        const transactionId = `VIBRAZE${Date.now()}`.slice(0, 25);
        const qrCodePix = QrCodePix({
          version: '01',
          key: 'test@mail.com.br', // Troque para sua chave real
          name: coupleName || 'Vibraze',
          city: 'SAO PAULO',
          transactionId,
          message: 'Pagamento Vibraze',
          cep: '99999999',
          value: Number(value.toFixed(2)),
        });
        setPixPayload(qrCodePix.payload());
        const base64 = await qrCodePix.base64();
        setPixQrCode(base64);
      } else {
        setPixQrCode(null);
        setPixPayload(null);
      }
    }
    generatePixQr();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPayment, fotosCasal, qrEmail, siteDuration, coupleName]);

  // Lógica para etapas dinâmicas (corrigida)
const hasMoreThan2Photos = fotosCasal.length > 2;
const hasQrEmail = qrEmail.trim() !== '';
const hasExtendedDuration = siteDuration === '3meses';
const totalSteps = hasMoreThan2Photos || hasQrEmail || hasExtendedDuration ? 5 : 4;

  return (
    <div className="memory-main" style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: '#fff1e6', minHeight: '100vh', padding: '2rem 0.5rem' }}>
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

      {/* Barra de progresso dinâmica */}
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ margin: 0 }}>
          Etapa {step} de {totalSteps}
          <span style={{ color: '#f85a8e', fontWeight: 600, marginLeft: 12 }}>
            ({Math.round((step / totalSteps) * 100)}%)
          </span>
        </p>
        <div style={{ width: '80%', margin: '10px auto', height: '6px', background: '#eee', borderRadius: '10px' }}>
          <div style={{ width: `${(step / totalSteps) * 100}%`, height: '100%', backgroundColor: '#f78dac', borderRadius: '10px' }}></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px' }}>
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
            <div
              key={s}
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                backgroundColor: s === step ? '#fff' : '#eee',
                border: `2px solid ${s === step ? '#f85a8e' : '#ccc'}`,
                color: s === step ? '#f85a8e' : '#ccc',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      {/* Etapa 1 */}
      {step === 1 && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ color: '#f85a8e' }}>Informações Básicas</h2>
            <p style={{ color: '#333' }}>Conte-nos um pouco sobre você e seu relacionamento</p>
          </div>

          <form onSubmit={handleSubmit} style={{ width: '90%', maxWidth: '600px', margin: '0 auto' }}>
            <label style={labelStyle}>
              <span style={iconLabel}>💖 Nome do casal</span>
              <input type="text" placeholder="Theodora & Gabriel" value={coupleName} onChange={(e) => setCoupleName(e.target.value)} style={inputStyle} required />
            </label>

            <label style={labelStyle}>
              <span style={iconLabel}>📧 Seu email</span>
              <input type="email" placeholder="nome@email.com" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
            </label>

            <label style={labelStyle}>
              <span style={iconLabel}>📅 Data de início do relacionamento</span>
              <input type="date" value={relationshipDate} onChange={(e) => setRelationshipDate(e.target.value)} style={inputStyle} required />
            </label>

            <label style={labelStyle}>
              <span style={iconLabel}>💌 Titulo</span>
              <input type="text" placeholder="Eu te amo" value={titulo} onChange={(e) => setTitulo(e.target.value)} style={inputStyle} required />
            </label>


            <label style={labelStyle}>
              <span style={iconLabel}>💌 Sua declaração de amor</span>
              <textarea placeholder="Deixe o seu coração falar por você" value={loveDeclaration} onChange={(e) => setLoveDeclaration(e.target.value)} rows={4} style={inputStyle} required />
            </label>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
              <button
                type="button"
                style={{ padding: '10px 16px', background: '#eee', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }}
                onClick={() => setShowResumo(true)}
              >
                📋 Ver resumo
              </button>
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f85a8e',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '1rem',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(248, 90, 142, 0.3)'
                }}
              >
                Continuar
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Modal Resumo do Pedido */}
      {showResumo && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowResumo(false)}
        >
          <div
            style={{
              background: 'linear-gradient(90deg, #f85a8e, #b86bd5)',
              borderRadius: '8px',
              padding: '1rem',
              width: '90%',
              maxWidth: '600px',
              color: '#fff',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()} // Para não fechar ao clicar dentro do modal
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>Resumo do Pedido</h3>
              <button
                onClick={() => setShowResumo(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  cursor: 'pointer'
                }}
                aria-label="Fechar resumo"
              >
                ×
              </button>
            </div>

            <div
              style={{
                backgroundColor: '#fff',
                borderRadius: '6px',
                padding: '1rem',
                color: '#333'
              }}
            >
              <p>
                <strong>Incluído gratuitamente:</strong>
              </p>
              <ul style={{ listStyle: 'none', paddingLeft: 0, color: '#333' }}>
                <li>✅ <strong>Site personalizado</strong><br />
                  <small>Seu site ficará disponível por 7 dias</small>
                </li>
                <li>✅ <strong>Contador de tempo</strong><br />
                  <small>Mostra há quanto tempo vocês estão juntos</small>
                </li>
                 <li>✅ <strong>Titulo Especial pro seu par</strong><br />
                  <small>Adicione um titulo especial</small>
                </li>
                <li>✅ <strong>Até 2 fotos</strong><br />
                  <small>Adicione até 2 fotos gratuitamente</small>
                </li>
                <li>✅ <strong>Mensagem personalizada</strong><br />
                  <small>Adicione uma mensagem especial</small>
                </li>
              </ul>

              <hr style={{ margin: '1rem 0' }} />

              <p>
                <strong>Total:</strong>{' '}
                <span style={{ color: '#f85a8e', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  {siteDuration === '7dias' ? 'Grátis' : 'R$ 3,99'}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
{step === 2 && (
  <div style={{ width: '90%', maxWidth: '600px', margin: '0 auto' }}>
    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
      <h2 style={{ color: '#f85a8e' }}>Personalização</h2>
      <p style={{ color: '#333' }}>Adicione elementos especiais para tornar seu site único</p>
    </div>

    {/* Fotos do Casal */}
    <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: 10, marginBottom: '1rem' }}>
      <h4>
        📷 Fotos do Casal{' '}
        <span style={{ float: 'right', color: fotosCasal.length > 2 ? '#f85a8e' : '#8c4be9', fontSize: 14 }}>
          {fotosCasal.length <= 2 ? 'Até 2 fotos grátis' : `${fotosCasal.length - 2} foto(s) extra(s) pagas`}
        </span>
      </h4>
      <p>Adicione fotos especiais do casal</p>

      <label
        style={{
          display: 'inline-block',
          background: '#ffe4ed',
          padding: '8px 12px',
          borderRadius: 8,
          color: '#f85a8e',
          cursor: 'pointer',
        }}
      >
        Adicionar fotos 📸
        <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleFotoUpload} />
      </label>
{/* Preview principal (slide e galeria de fotos) */}
{fotosCasal.length > 0 && (
  <img
    src={fotosCasal[slideIndex]}
    alt={`Foto ${slideIndex + 1}`}
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: '1rem',
    }}
  />
)}

      <div style={{ marginTop: '1rem', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {fotosCasal.map((foto, index) => (
          <div key={index} style={{ position: 'relative' }}>
            <img
              src={foto}
              alt={`Foto ${index + 1}`}
              style={{
                width: 100,
                height: 100,
                borderRadius: 10,
                objectFit: 'cover',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              }}
            />
            <button
              onClick={() => handleRemoverFoto(index)}
              style={{
                position: 'absolute',
                top: -5,
                right: -5,
                backgroundColor: '#f85a8e',
                border: 'none',
                borderRadius: '50%',
                width: 24,
                height: 24,
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>

    {/* QR Code */}
    <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: 10, marginBottom: '1rem' }}>
      <h4>🔐 QR Code + Surpresa</h4>
      <p>Receba seu QR Code + surpreenda seu amor</p>
      <small style={{ color: '#f85a8e' }}>
        ⚠️ Você só receberá o QR Code por email se essa opção estiver ativada.
      </small>
      <input
        type="email"
        placeholder="meuamor@mail.com"
        value={qrEmail}
        onChange={(e) => setQrEmail(e.target.value)}
        style={{ ...inputStyle, marginTop: '10px' }}
      />
      <span style={{ float: 'right', color: '#ffcc00', fontWeight: 'bold' }}>R$ 4,99</span>
    </div>

    {/* Duração do site */}
    <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: 10 }}>
      <h4>⏱️ Duração do Site</h4>
      <label style={{ display: 'block', marginBottom: '10px' }}>
        <input
          type="radio"
          name="duracao"
          value="7dias"
          checked={siteDuration === '7dias'}
          onChange={() => setSiteDuration('7dias')}
        />{' '}
        Duração padrão (7 dias) <span style={{ color: '#00b894', fontWeight: 'bold' }}>Grátis</span>
      </label>
      <label style={{ display: 'block' }}>
        <input
          type="radio"
          name="duracao"
          value="3meses"
          checked={siteDuration === '3meses'}
          onChange={() => setSiteDuration('3meses')}
        />{' '}
        Estender duração (3 meses) <span style={{ color: '#ffcc00', fontWeight: 'bold' }}>R$ 3,99</span>
      </label>
    </div>

    {/* Botões de total ou continuar */}
    {(() => {
      const fotosExtras = Math.max(0, fotosCasal.length - 2);
      const valorFotos = fotosExtras * 1.49;
      const valorQr = qrEmail.trim() !== '' ? 4.99 : 0;
      const valorDuracao = siteDuration === '3meses' ? 3.99 : 0;
      const total = valorFotos + valorQr + valorDuracao;

      // Sempre mostra o botão para pré-visualizar, independente das opções pagas
      return (
        <div style={{ marginTop: '2rem', textAlign: total > 0 ? 'left' : 'right', display: 'flex', justifyContent: total > 0 ? 'space-between' : 'flex-end' }}>
          {total > 0 && (
            <button
              onClick={() => alert(`Total a pagar:\nR$ ${total.toFixed(2)}`)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#f85a8e',
                color: '#fff',
                fontWeight: 600,
                fontSize: '1rem',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Ver Total
            </button>
          )}
          <button
            onClick={() => setStep(3)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f85a8e',
              color: '#fff',
              fontWeight: 600,
              fontSize: '1rem',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginLeft: total > 0 ? 16 : 0
            }}
          >
            Pré-visualizar
          </button>
        </div>
      );
    })()}
  </div>
)}

{step === 3 && !showCreated && (
<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#db2777', marginBottom: '0.5rem' }}>
        Pré-visualização
      </h2>
      <p style={{ color: '#374151', marginBottom: '1.5rem' }}>
        Veja como ficará seu site antes de finalizar
      </p>

      <div style={{
        backgroundColor: '#fff',
        borderRadius: '1rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb',
        width: '100%',
        maxWidth: '768px',
        overflow: 'hidden'
      }}>
        {/* Barra do navegador */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#f3f4f6',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '9999px', backgroundColor: '#f87171' }}></span>
          <span style={{ width: '12px', height: '12px', borderRadius: '9999px', backgroundColor: '#facc15' }}></span>
          <span style={{ width: '12px', height: '12px', borderRadius: '9999px', backgroundColor: '#4ade80' }}></span>
        </div>
{/* Nome do casal */}
{coupleName && (
  <div style={{
    marginTop: '1.5rem',
    textAlign: 'center'
  }}>
    <h4 style={{
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#db2777'
    }}>
      {coupleName}
    </h4>
  </div>
)}

{/* Título personalizado acima do contador */}
{titulo && (
  <div style={{ marginTop: '1.2rem', marginBottom: '-0.5rem', textAlign: 'center' }}>
  </div>
)}

{/* Galeria dinâmica de fotos */}
{fotosCasal.length === 1 && (
  <div style={{
    marginTop: '1rem',
    display: 'flex',
    justifyContent: 'center'
  }}>
    <img
      src={fotosCasal[0]}
      alt="Foto do casal"
      style={{
        width: '300px',
        height: '300px',
        objectFit: 'cover',
        borderRadius: '1rem',
        border: '3px solid #f9a8d4'
      }}
    />
  </div>
)}
{fotosCasal.length > 1 && (
  <div style={{
    position: 'relative',
    marginTop: '1rem',
    width: '300px',
    height: '300px',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: '1rem',
    overflow: 'hidden',
    border: '3px solid #f9a8d4'
  }}>
    <img
      src={fotosCasal[slideIndex]}
      alt={`Foto ${slideIndex + 1}`}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '1rem'
      }}
    />

    {/* Botão Anterior */}
    <button
      onClick={() => setSlideIndex((prev) => (prev === 0 ? fotosCasal.length - 1 : prev - 1))}
      style={{
        position: 'absolute',
        top: '50%',
        left: '0.5rem',
        transform: 'translateY(-50%)',
        backgroundColor: '#ffffffcc',
        border: 'none',
        borderRadius: '9999px',
        fontSize: '1.5rem',
        cursor: 'pointer',
        padding: '0.25rem 0.5rem',
        color: '#db2777'
      }}
    >
      ‹
    </button>

    {/* Botão Próximo */}
    <button
      onClick={() => setSlideIndex((prev) => (prev === fotosCasal.length - 1 ? 0 : prev + 1))}
      style={{
        position: 'absolute',
        top: '50%',
        right: '0.5rem',
        transform: 'translateY(-50%)',
        backgroundColor: '#ffffffcc',
        border: 'none',
        borderRadius: '9999px',
        fontSize: '1.5rem',
        cursor: 'pointer',
        padding: '0.25rem 0.5rem',
        color: '#db2777'
      }}
    >
      ›
    </button>
  </div>
)}
   {/* Conteúdo */}
<div
  style={{
    background: 'linear-gradient(to bottom, #fff1f2, #ffffff)',
    padding: '1.5rem',
    textAlign: 'center',
    minHeight: '400px',
  }}
>
  {/* Título e data */}
  <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#374151', marginBottom: 24 }}>
    Um amor que começou em{' '}
    <span style={{ color: '#db2777', fontWeight: 'bold' }}>
      {formatDate(relationshipDate)}
    </span>
  </h3>

  {/* Contador de tempo igual ao MemoryCreatedPage */}
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '18px',
      marginBottom: 18,
    }}
  >
    {['anos', 'meses', 'dias', 'horas', 'min', 'seg'].map((label, idx) => {
      let valor = 0;
      if (label === 'anos' || label === 'meses') {
        const now = new Date();
        const start = new Date(relationshipDate);
        let years = now.getFullYear() - start.getFullYear();
        let months = now.getMonth() - start.getMonth();
        if (now.getDate() < start.getDate()) months--;
        if (months < 0) { years--; months += 12; }
        if (label === 'anos') valor = years < 0 ? 0 : years;
        if (label === 'meses') valor = months < 0 ? 0 : months;
      } else {
        const item = elapsedTime.find((i) => i.label === label);
        valor = item ? item.valor : 0;
      }
      const valorStr = valor.toString().padStart(2, '0');
      let labelStr = '';
      switch (label) {
        case 'anos': labelStr = 'Anos'; break;
        case 'meses': labelStr = 'Meses'; break;
        case 'dias': labelStr = 'Dias'; break;
        case 'horas': labelStr = 'Horas'; break;
        case 'min': labelStr = 'Min'; break;
        case 'seg': labelStr = 'Seg'; break;
      }
      return (
        <div
          key={label}
          style={{
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
          }}
        >
          <span style={{ color: '#ff69b4', fontWeight: 700, fontSize: 26, lineHeight: 1 }}>{valorStr}</span>
          <span style={{ color: '#ff758c', fontWeight: 600, fontSize: 15, marginTop: 4 }}>{labelStr}</span>
        </div>
      );
    })}
  </div>

  {/* Título personalizado igual ao print */}
  {titulo && (
    <div style={{ marginBottom: '0.8rem', marginTop: '1.2rem', textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f85a8e', margin: 0 }}>{titulo}</h2>
    </div>
  )}
  <p
    style={{
      fontSize: '0.95rem',
      color: '#6b7280',
      fontStyle: 'italic',
      marginBottom: 18,
    }}
  >
    {getElapsedText(relationshipDate)}
  </p>

  {/* Caixa de mensagem personalizada igual ao print */}
  <div
    style={{
      marginTop: '1.5rem',
      backgroundColor: '#fff',
      borderRadius: '1rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      padding: '1.2rem',
      width: '100%',
      maxWidth: '400px',
      marginLeft: 'auto',
      marginRight: 'auto',
      border: '1.5px solid #fce7f3',
    }}
  >
    <h4
      style={{
        color: '#db2777',
        fontWeight: '600',
        marginBottom: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        fontSize: 18,
      }}
    >
      <span role="img" aria-label="coração">💗</span>
      Nossa História
      <span role="img" aria-label="coração">💗</span>
    </h4>
    <blockquote
      style={{
        color: '#374151',
        fontStyle: 'italic',
        margin: 0,
      }}
    >
      “{loveDeclaration || 'Sem declaração ainda.'}”
    </blockquote>
  </div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
      {!(hasMoreThan2Photos || hasQrEmail || hasExtendedDuration) ? (
        <button
          style={{
            backgroundColor: '#f85a8e',
            color: 'white',
            border: 'none',
            padding: '10px 18px',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(248, 90, 142, 0.3)',
            transition: 'all 0.3s ease',
          }}
          onClick={handleCriarSite}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#ff79a8';
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 6px 14px rgba(248, 90, 142, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f85a8e';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(248, 90, 142, 0.3)';
          }}
        >
          Criar Site 💘
        </button>
      ) : (
        <button
          style={{
            backgroundColor: '#f85a8e',
            color: 'white',
            border: 'none',
            padding: '10px 18px',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(248, 90, 142, 0.3)',
            transition: 'all 0.3s ease',
          }}
          onClick={() => setStep(5)}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#ff79a8';
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 6px 14px rgba(248, 90, 142, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f85a8e';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(248, 90, 142, 0.3)';
          }}
        >
          Ir para pagamento
        </button>
      )}
    </div>
  </div>

{Number(step) === 4 && !showCreated && (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1rem' }}>
    {/* ...Pré-visualização igual à etapa 3... */}
    {/* Se precisa de pagamento, mostra botão para etapa 5 */}
    {paymentStep ? (
      <div style={{ marginTop: 32, textAlign: 'center' }}>
        <button
          style={{
            backgroundColor: '#f85a8e',
            color: '#fff',
            border: 'none',
            padding: '12px 28px',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: '1.1rem',
            cursor: 'pointer',
            margin: '0 auto',
            display: 'block',
          }}
          onClick={() => setStep(5)}
        >
          Ir para pagamento
        </button>
      </div>
    ) : (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
        <button
          style={{
            backgroundColor: '#f85a8e',
            color: 'white',
            border: 'none',
            padding: '10px 18px',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(248, 90, 142, 0.3)',
            transition: 'all 0.3s ease',
          }}
          onClick={handleCriarSite}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#ff79a8';
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 6px 14px rgba(248, 90, 142, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f85a8e';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(248, 90, 142, 0.3)';
          }}
        >
          Criar Site 💘
        </button>
      </div>
    )}
  </div>
)}
{Number(step) === 5 && paymentStep && !showCreated && (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h2 style={{ color: '#db2777', marginBottom: 24 }}>Pagamento</h2>
    <p style={{ marginBottom: 24 }}>Escolha o método de pagamento para liberar seu site:</p>
    <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 32 }}>
      <button
        style={{
          backgroundColor: selectedPayment === 'pix' ? '#f85a8e' : '#fff',
          color: selectedPayment === 'pix' ? '#fff' : '#f85a8e',
          border: '2px solid #f85a8e',
          borderRadius: 8,
          padding: '12px 32px',
          fontWeight: 600,
          fontSize: '1.1rem',
          cursor: 'pointer',
        }}
        onClick={() => setSelectedPayment('pix')}
      >
        PIX
      </button>
      <button
        style={{
          backgroundColor: selectedPayment === 'mercadopago' ? '#f85a8e' : '#fff',
          color: selectedPayment === 'mercadopago' ? '#fff' : '#f85a8e',
          border: '2px solid #f85a8e',
          borderRadius: 8,
          padding: '12px 32px',
          fontWeight: 600,
          fontSize: '1.1rem',
          cursor: 'pointer',
        }}
        onClick={() => {
          setSelectedPayment('mercadopago');
          window.open('https://www.mercadopago.com.br/', '_blank');
        }}
      >
        Mercado Pago
      </button>
    </div>
    {/* QRCode PIX */}
    {selectedPayment === 'pix' && pixQrCode && (
      <div style={{ marginBottom: 24 }}>
        <img src={pixQrCode} alt="QR Code PIX" style={{ width: 200, height: 200 }} />
        <p style={{ marginTop: 12, color: '#666' }}>Escaneie o QRCode para pagar</p>
        {pixPayload && (
          <div style={{ marginTop: 16, background: '#f8f8f8', borderRadius: 8, padding: 12, wordBreak: 'break-all', fontSize: 13, color: '#333' }}>
            <strong>Código PIX (copia e cola):</strong>
            <div style={{ marginTop: 6 }}>{pixPayload}</div>
            <button
              style={{
                marginTop: 8,
                backgroundColor: '#f85a8e',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '6px 16px',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
              }}
              onClick={async () => {
                await navigator.clipboard.writeText(pixPayload);
                alert('Código PIX copiado!');
              }}
            >
              Copiar código PIX
            </button>
          </div>
        )}
        <button
          style={{
            marginTop: 16,
            backgroundColor: '#00b894',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 24px',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer',
          }}
          onClick={() => {
            setPaymentConfirmed(true);
          }}
        >
          Pagar com PIX
        </button>
      </div>
    )}
    {selectedPayment === 'mercadopago' && !paymentConfirmed && (
      <div style={{ marginBottom: 24 }}>
        <button
          style={{
            backgroundColor: '#009ee3',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 24px',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer',
          }}
          onClick={() => {
            setPaymentConfirmed(true);
            window.open('https://www.mercadopago.com.br/', '_blank');
          }}
        >
          Pagar com Mercado Pago
        </button>
      </div>
    )}
    {/* Mensagem de aguardando pagamento */}
    {selectedPayment && !paymentConfirmed && (
      <p style={{ color: '#f85a8e', fontWeight: 600 }}>Aguardando confirmação de pagamento...</p>
    )}
    {/* Libera botões após pagamento */}
    {paymentConfirmed && (
      <div style={{ marginTop: 32, display: 'flex', gap: 16, justifyContent: 'center' }}>
        <button
          style={{
            backgroundColor: '#f85a8e',
            color: 'white',
            border: 'none',
            padding: '10px 18px',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer',
            minWidth: 160
          }}
          onClick={handleCriarSite}
        >
          Entrar no meu site
        </button>
        <button
          style={{
            backgroundColor: '#fff',
            color: '#f85a8e',
            border: '2px solid #f85a8e',
            padding: '10px 18px',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer',
            minWidth: 160
          }}
          onClick={async () => {
            const fotosCasalUrls = fotosCasal;
            const params = new URLSearchParams({
              coupleName,
              relationshipDate,
              loveDeclaration,
              fotosCasal: JSON.stringify(fotosCasalUrls),
              titulo
            });
            const url = `${window.location.origin}/MemoryCreate/${generatedToken}?${params.toString()}`;
            await navigator.clipboard.writeText(url);
            alert('Link copiado para a área de transferência!');
          }}
        >
          Compartilhar este site
        </button>
      </div>
    )}
  </div>
)}

    {/* Footer */}
    <footer
      style={{
        backgroundColor: '#fff3e9',
        color: '#000',
        padding: '40px 20px 0 20px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        fontSize: '0.95rem',
        marginTop: 48,
        borderTop: '1.5px solid #ffe0cb',
        width: '96%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
        {/* Container superior com conteúdo centralizado */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 80, width: '100%' }}>
          {/* Logo e descrição */}
          <div style={{ flex: '1 1 300px', minWidth: 260, maxWidth: 400, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, justifyContent: 'center' }}>
              <span
                style={{
                  backgroundColor: '#fff3e9',
                  borderRadius: '50%',
                  padding: 8,
                  display: 'inline-flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: '0 2px 8px #ffe0cb',
                }}
              >
                <svg width="22" height="22" fill="#e05482" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 1.01 4.5 2.5C13.09 4.01 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </span>
              <strong style={{ color: '#e05482', fontSize: '1.35rem', letterSpacing: 1 }}>Vibraze</strong>
            </div>
            <p style={{ lineHeight: 1.6, color: '#222', fontWeight: 500, textAlign: 'center' }}>
              Criamos experiências únicas e inesquecíveis para casais, ajudando a eternizar momentos especiais com presentes virtuais personalizados.
            </p>
          </div>
          {/* Links */}
          <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ minWidth: 120, textAlign: 'center' }}>
              <strong style={{ color: '#e05482', display: 'block', marginBottom: 10 }}>Produto</strong>
              <a href="#como-funciona" style={{ color: '#222', textDecoration: 'none', display: 'block', marginBottom: 6 }}>Como Funciona</a>
              <a href="#planos" style={{ color: '#222', textDecoration: 'none', display: 'block', marginBottom: 6 }}>Planos</a>
              <a href="#preços" style={{ color: '#222', textDecoration: 'none', display: 'block', marginBottom: 6 }}>Preços</a>
              <a href="#" style={{ color: '#e05482', textDecoration: 'none', fontWeight: 600 }}>Criar Presente</a>
            </div>
            <div style={{ minWidth: 120, textAlign: 'center' }}>
              <strong style={{ color: '#e05482', display: 'block', marginBottom: 10 }}>Legal</strong>
              <a href="/termos" style={{ color: '#222', textDecoration: 'none', display: 'block', marginBottom: 6 }}>Termos de Uso</a>
              <a href="/privacy" style={{ color: '#222', textDecoration: 'none', display: 'block', marginBottom: 6 }}>Privacidade</a>
              <a href="#" style={{ color: '#222', textDecoration: 'none', display: 'block', marginBottom: 6 }}>Cookies</a>
              <a href="#faq" style={{ color: '#222', textDecoration: 'none' }}>FAQ</a>
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
    </footer>
  </div>
)}
<div>
   </div>
</div>);
}
export default EtapasForm;
