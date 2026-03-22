import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HealthFit - Sua Plataforma Completa de Saúde e Fitness",
  description:
    "Treinos personalizados, nutrição inteligente, telemedicina, scanner corporal 3D e muito mais. Transforme sua saúde com tecnologia de ponta.",
  keywords: "saúde, fitness, treino, nutrição, telemedicina, app, bem-estar",
  openGraph: {
    title: "HealthFit - Saúde e Fitness",
    description: "Sua plataforma completa de saúde e bem-estar",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, fontFamily: "'Inter', sans-serif" }}>{children}</body>
    </html>
  );
}
