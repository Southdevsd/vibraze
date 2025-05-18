import React from "react";
import { Link } from "react-router-dom"; // ou "next/link" se for Next.js

const Terms = () => {
  const voltarButton = (
    <div style={{ maxWidth: 800, margin: "20px auto 0", textAlign: "center" }}>
      <Link
        to="/"
        style={{
          backgroundColor: "#ff5c8a",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: 6,
          textDecoration: "none",
          fontWeight: "bold",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ fontSize: 16 }}></span> Voltar para a página inicial
      </Link>
    </div>
  );

  return (
    <div
      style={{
        backgroundColor: "#fff1e6",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 20px",
      }}
    >
      {/* Cabeçalho */}
      <div
        style={{
          background: "linear-gradient(to bottom, #ffb6c1, #fff1e6)",
          padding: "30px 4000px",
          textAlign: "center",
          width: "100%",
          maxWidth: 800,
          borderRadius: 8,
        }}>
            
        <h1 style={{ color: "#ff5c8a", fontSize: "2rem", fontWeight: 700 }}>
          Termos de Uso
        </h1>
        <p style={{ color: "#ffffff", marginTop: 10 }}>
          Estes termos regem o uso do serviço ForeverCount.love. Por favor,
          leia-os atentamente.
        </p>
      </div>

      {/* Conteúdo */}
      <div
        style={{
          backgroundColor: "white",
          maxWidth: 800,
          width: "100%",
          marginTop: 40,
          padding: "40px 30px",
          borderRadius: 8,
          boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
        }}
      >
        <h2 style={h2Style}>1. Aceitação dos Termos</h2>
        <p>
          Ao acessar e utilizar o site e os serviços da ForeverCount.love
          ("Serviço"), você concorda em cumprir os seguintes termos e condições
          ("Termos"). Esses Termos regem o uso do Serviço e qualquer conteúdo,
          funcionalidade e recursos oferecidos pela ForeverCount.love. Leia
          estes Termos cuidadosamente. Se você não concordar com eles, não
          utilize o Serviço.
        </p>

        <h2 style={h2Style}>2. Elegibilidade</h2>
        <p>
          Para utilizar o Serviço, você deve ter pelo menos 18 anos e ser capaz
          de firmar um contrato legalmente vinculativo. Ao usar o Serviço, você
          declara que atende a esses requisitos. Se você não atender, não
          poderá utilizar o Serviço.
        </p>

        <h2 style={h2Style}>3. Uso do Serviço</h2>
        <p>
          A ForeverCount.love oferece uma plataforma gratuita para casais
          criarem sites personalizados que celebram seus relacionamentos.
          Além disso, oferecemos funcionalidades adicionais pagas para
          personalizar ainda mais a experiência. Ao usar o Serviço, você
          concorda em:
        </p>
        <ul style={{ paddingLeft: 20 }}>
          <li>Fornecer informações precisas e atualizadas ao criar seu site.</li>
          <li>Carregar apenas conteúdo apropriado, como fotos e mensagens.</li>
          <li>Não utilizar o Serviço para fins ilegais ou prejudiciais.</li>
          <li>Não fingir ser outra pessoa ou entidade.</li>
        </ul>

        <h2 style={h2Style}>4. Propriedade e Licença do Conteúdo</h2>
        <p>
          Você mantém a propriedade do conteúdo que carregar no Serviço
          ("Conteúdo do Usuário"). Ao carregar qualquer conteúdo, você concede
          à ForeverCount.love uma licença mundial, gratuita e não exclusiva
          para usar, exibir e distribuir seu conteúdo para fins de melhoria do
          Serviço. Essa licença será válida até que o conteúdo seja excluído.
        </p>

        <h2 style={h2Style}>5. Privacidade e Comunicação por E-mail</h2>
        <p>
          Sua privacidade é importante para nós. Consulte nossa Política de
          Privacidade para entender como coletamos, usamos e protegemos suas
          informações pessoais. Ao usar o Serviço, você concorda em receber
          comunicações por e-mail sobre novidades e promoções. Você pode
          cancelar o recebimento a qualquer momento.
        </p>

        <h2 style={h2Style}>6. Funcionalidades Pagas</h2>
        <p>
          O ForeverCount.love oferece a criação de sites personalizados
          gratuitamente por 7 dias. Para adicionar mais funcionalidades ou
          estender o tempo de exibição, oferecemos recursos pagos. Pagamentos
          são processados via Pix ou cartão de crédito.
        </p>

        <h2 style={h2Style}>6.1 Funcionalidades Adicionais</h2>
        <ul style={{ paddingLeft: 20 }}>
          <li>Fotos Extras: R$ 1,99 por foto adicional</li>
          <li>
            Enviar E-mail Personalizado: R$ 0,99 para enviar automaticamente o
            site para o e-mail da pessoa amada.
          </li>
          <li>Estender Duração do Site: R$ 3,99 para estender a duração por mais 3 meses.</li>
        </ul>

        <h2 style={h2Style}>6.2 Planos Futuros</h2>
        <p>
          Planejamos oferecer novos temas personalizados, pacotes promocionais e
          muito mais. Fique atento para futuras atualizações!
        </p>

        <h2 style={h2Style}>7. Conduta do Usuário</h2>
        <p>
          Você concorda em não se envolver em atividades proibidas, incluindo,
          mas não se limitando a:
        </p>
        <ul style={{ paddingLeft: 20 }}>
          <li>Carregar conteúdo difamatório, obsceno ou abusivo.</li>
          <li>Violar leis, regulamentos ou direitos de terceiros.</li>
          <li>Utilizar o Serviço para fins comerciais não autorizados.</li>
        </ul>

        <h2 style={h2Style}>8. Moderação de Conteúdo</h2>
        <p>
          A ForeverCount.love se reserva o direito de revisar e remover qualquer
          conteúdo que viole estes Termos ou seja considerado inadequado.
        </p>

        <h2 style={h2Style}>9. Disponibilidade do Site</h2>
        <p>
          Tentamos fornecer um serviço contínuo, mas não garantimos
          disponibilidade ininterrupta. Podemos modificar ou encerrar o Serviço
          a qualquer momento, sem responsabilidade para você.
        </p>

        <h2 style={h2Style}>10. Limitação de Responsabilidade</h2>
        <p>
          A ForeverCount.love não se responsabiliza por danos indiretos ou
          consequenciais decorrentes do uso do Serviço. Nossa responsabilidade
          total está limitada ao valor que você pagou pelo Serviço.
        </p>

        <h2 style={h2Style}>11. Alterações nos Termos de Uso</h2>
        <p>
          A ForeverCount.love pode modificar estes Termos a qualquer momento.
          Alterações importantes serão comunicadas por e-mail. O uso contínuo do
          Serviço após tais mudanças indica sua aceitação dos novos Termos.
        </p>

        <h2 style={h2Style}>12. Legislação Aplicável</h2>
        <p>
          Estes Termos são regidos pelas leis do Brasil. Qualquer disputa será
          resolvida conforme as leis brasileiras.
        </p>

        <h2 style={h2Style}>13. Contato</h2>
        <p>
          Se você tiver dúvidas sobre estes Termos, entre em contato pelo e-mail
          suporte@forevercount.love
        </p>
      </div>

      {/* Botão de voltar */}
      {voltarButton}

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
    </div>
  );
};

const h2Style = {
  color: "#ff5c8a",
  fontWeight: "bold",
  fontSize: "1.2rem",
  marginTop: 30,
};

export default Terms;
