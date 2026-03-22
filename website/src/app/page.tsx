import "./globals.css";

const features = [
  {
    icon: "💪",
    title: "Treinos Personalizados",
    desc: "Planos de treino adaptados ao seu nível com rastreamento GPS e monitoramento cardíaco em tempo real.",
  },
  {
    icon: "🍎",
    title: "Nutrição Inteligente",
    desc: "Analise refeições por foto com IA. Contagem automática de calorias, proteínas e macronutrientes.",
  },
  {
    icon: "📸",
    title: "Scanner Corporal 3D",
    desc: "Tire fotos e obtenha medidas corporais precisas com inteligência artificial avançada.",
  },
  {
    icon: "🩺",
    title: "Telemedicina 24/7",
    desc: "Consultas online com mais de 12 especialidades médicas. Atendimento rápido e seguro.",
  },
  {
    icon: "🤖",
    title: "Coach de IA",
    desc: "Assistente virtual inteligente que analisa seus dados e fornece recomendações personalizadas.",
  },
  {
    icon: "🛒",
    title: "Loja Wellness",
    desc: "Suplementos, equipamentos e vestuário esportivo com cashback exclusivo e pagamento seguro via Stripe.",
  },
  {
    icon: "📊",
    title: "Insights Avançados",
    desc: "Dashboards completos com análise de tendências, evolução corporal e relatórios PDF exportáveis.",
  },
  {
    icon: "👥",
    title: "Comunidade Fitness",
    desc: "Conecte-se com outros usuários, participe de desafios comunitários e compartilhe conquistas.",
  },
];

const stats = [
  { value: "40+", label: "Funcionalidades" },
  { value: "12", label: "Especialidades Médicas" },
  { value: "24/7", label: "Disponibilidade" },
  { value: "IA", label: "Integração Avançada" },
];

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Navigation */}
      <nav
        className="glass"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: "16px 0",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 28 }}>🏋️</span>
            <span className="gradient-text" style={{ fontSize: 24, fontWeight: 800 }}>
              HealthFit
            </span>
          </div>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            <a href="#features" style={{ color: "var(--text-muted)", fontWeight: 500, fontSize: 14 }}>
              Funcionalidades
            </a>
            <a href="#pricing" style={{ color: "var(--text-muted)", fontWeight: 500, fontSize: 14 }}>
              Planos
            </a>
            <a href="#download" style={{ color: "var(--text-muted)", fontWeight: 500, fontSize: 14 }}>
              Download
            </a>
            <a
              href="#download"
              className="gradient-bg"
              style={{
                padding: "10px 24px",
                borderRadius: 12,
                color: "white",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              Baixar App
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px 24px 80px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(79,70,229,0.15), transparent 70%)",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
        <div style={{ maxWidth: 800, position: "relative", zIndex: 1 }}>
          <div
            className="glass"
            style={{
              display: "inline-block",
              padding: "8px 20px",
              borderRadius: 100,
              marginBottom: 24,
              fontSize: 14,
              color: "var(--primary-light)",
            }}
          >
            🚀 A plataforma #1 de saúde e fitness do Brasil
          </div>
          <h1
            style={{
              fontSize: "clamp(36px, 6vw, 72px)",
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: 24,
            }}
          >
            Transforme sua{" "}
            <span className="gradient-text">saúde</span> com{" "}
            <span className="gradient-text">tecnologia</span>
          </h1>
          <p
            style={{
              fontSize: 20,
              color: "var(--text-muted)",
              maxWidth: 600,
              margin: "0 auto 40px",
              lineHeight: 1.7,
            }}
          >
            Treinos personalizados, nutrição inteligente, telemedicina, scanner corporal 3D e
            coach de IA — tudo em um único app.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="#download"
              className="gradient-bg"
              style={{
                padding: "16px 40px",
                borderRadius: 16,
                color: "white",
                fontWeight: 700,
                fontSize: 18,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              📱 Baixar Grátis
            </a>
            <a
              href="#features"
              className="glass"
              style={{
                padding: "16px 40px",
                borderRadius: 16,
                fontWeight: 700,
                fontSize: 18,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Saiba Mais →
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: "40px 24px 80px" }}>
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 24,
          }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass"
              style={{ padding: 32, borderRadius: 20, textAlign: "center" }}
            >
              <div className="gradient-text" style={{ fontSize: 40, fontWeight: 900, marginBottom: 8 }}>
                {stat.value}
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: 14 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>
              Tudo que você precisa em{" "}
              <span className="gradient-text">um só lugar</span>
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: 18, maxWidth: 600, margin: "0 auto" }}>
              Mais de 40 funcionalidades integradas para cuidar da sua saúde física e mental.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {features.map((feature) => (
              <div
                key={feature.title}
                className="glass"
                style={{
                  padding: 32,
                  borderRadius: 20,
                  transition: "transform 0.3s, border-color 0.3s",
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 16 }}>{feature.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{feature.title}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.7 }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>
              Planos que <span className="gradient-text">cabem no seu bolso</span>
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {/* Free */}
            <div className="glass" style={{ padding: 40, borderRadius: 24, textAlign: "center" }}>
              <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Gratuito</h3>
              <div style={{ fontSize: 48, fontWeight: 900, marginBottom: 8 }}>R$ 0</div>
              <p style={{ color: "var(--text-muted)", marginBottom: 32, fontSize: 14 }}>
                Para sempre
              </p>
              <ul style={{ listStyle: "none", textAlign: "left", marginBottom: 32 }}>
                {["Treinos básicos", "Contagem de calorias", "Comunidade", "3 consultas/mês"].map(
                  (item) => (
                    <li key={item} style={{ padding: "8px 0", fontSize: 15, display: "flex", gap: 8 }}>
                      <span style={{ color: "var(--success)" }}>✓</span> {item}
                    </li>
                  )
                )}
              </ul>
              <a
                href="#download"
                className="glass"
                style={{
                  display: "block",
                  padding: "14px 0",
                  borderRadius: 14,
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                Começar Grátis
              </a>
            </div>
            {/* Pro */}
            <div
              className="gradient-bg"
              style={{
                padding: 40,
                borderRadius: 24,
                textAlign: "center",
                position: "relative",
                transform: "scale(1.05)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -12,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "var(--warning)",
                  color: "#000",
                  padding: "4px 16px",
                  borderRadius: 100,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                MAIS POPULAR
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Premium</h3>
              <div style={{ fontSize: 48, fontWeight: 900, marginBottom: 8 }}>R$ 29,90</div>
              <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: 32, fontSize: 14 }}>
                /mês
              </p>
              <ul style={{ listStyle: "none", textAlign: "left", marginBottom: 32 }}>
                {[
                  "Tudo do Gratuito",
                  "Scanner Corporal 3D",
                  "Coach de IA ilimitado",
                  "Telemedicina ilimitada",
                  "Relatórios PDF",
                  "Nutrição por foto IA",
                ].map((item) => (
                  <li key={item} style={{ padding: "8px 0", fontSize: 15, display: "flex", gap: 8 }}>
                    <span>✓</span> {item}
                  </li>
                ))}
              </ul>
              <a
                href="#download"
                style={{
                  display: "block",
                  padding: "14px 0",
                  borderRadius: 14,
                  fontWeight: 700,
                  textAlign: "center",
                  background: "white",
                  color: "var(--primary)",
                }}
              >
                Assinar Premium
              </a>
            </div>
            {/* Enterprise */}
            <div className="glass" style={{ padding: 40, borderRadius: 24, textAlign: "center" }}>
              <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Empresarial</h3>
              <div style={{ fontSize: 48, fontWeight: 900, marginBottom: 8 }}>Sob Consulta</div>
              <p style={{ color: "var(--text-muted)", marginBottom: 32, fontSize: 14 }}>
                Para empresas
              </p>
              <ul style={{ listStyle: "none", textAlign: "left", marginBottom: 32 }}>
                {[
                  "Tudo do Premium",
                  "Painel administrativo",
                  "API personalizada",
                  "Suporte dedicado",
                  "Branding customizado",
                ].map((item) => (
                  <li key={item} style={{ padding: "8px 0", fontSize: 15, display: "flex", gap: 8 }}>
                    <span style={{ color: "var(--success)" }}>✓</span> {item}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:contato@healthfit.app"
                className="glass"
                style={{
                  display: "block",
                  padding: "14px 0",
                  borderRadius: 14,
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                Fale Conosco
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Download CTA */}
      <section id="download" style={{ padding: "80px 24px" }}>
        <div
          className="gradient-bg"
          style={{
            maxWidth: 900,
            margin: "0 auto",
            padding: "64px 40px",
            borderRadius: 32,
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16 }}>
            Comece sua transformação hoje
          </h2>
          <p style={{ fontSize: 18, opacity: 0.9, marginBottom: 40, maxWidth: 500, margin: "0 auto 40px" }}>
            Baixe o HealthFit gratuitamente e tenha acesso a mais de 40 funcionalidades de saúde
            e bem-estar.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="#"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                background: "rgba(0,0,0,0.3)",
                padding: "16px 32px",
                borderRadius: 16,
                fontWeight: 600,
                backdropFilter: "blur(8px)",
              }}
            >
              <span style={{ fontSize: 28 }}>🤖</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 11, opacity: 0.8 }}>Disponível no</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>Google Play</div>
              </div>
            </a>
            <a
              href="#"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                background: "rgba(0,0,0,0.3)",
                padding: "16px 32px",
                borderRadius: 16,
                fontWeight: 600,
                backdropFilter: "blur(8px)",
              }}
            >
              <span style={{ fontSize: 28 }}>🍎</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 11, opacity: 0.8 }}>Disponível na</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>App Store</div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "40px 24px", borderTop: "1px solid rgba(148,163,184,0.1)" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20 }}>🏋️</span>
            <span style={{ fontWeight: 700 }}>HealthFit</span>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            © 2026 HealthFit. Todos os direitos reservados.
          </p>
          <div style={{ display: "flex", gap: 24, fontSize: 14, color: "var(--text-muted)" }}>
            <a href="#">Privacidade</a>
            <a href="#">Termos</a>
            <a href="#">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
