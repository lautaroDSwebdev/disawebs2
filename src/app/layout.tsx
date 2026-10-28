import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DISAWebs — Diseño y desarrollo web por Lautaro Di Salvo",
  description:
    "Diseño y desarrollo web a medida para negocios, marcas y profesionales. Sitios modernos, rápidos y preparados para conectar con tus clientes.",
  keywords: [
    "desarrollo web",
    "creación de páginas web",
    "diseño web Tandil",
    "DISAWebs",
    "frontend developer",
    "sitios web personalizados",
  ],
  authors: [
    {
      name: "Lautaro Di Salvo",
      url: "https://www.linkedin.com/in/lautarodisalvofullstack/",
    },
  ],
  creator: "Lautaro Di Salvo",
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://www.disawebs.com",
    title: "DISAWebs — Diseño y desarrollo web",
    description: "Diseño y desarrollo web a medida para negocios, marcas y profesionales.",
    siteName: "DISAWebs",
  },
  twitter: {
    card: "summary_large_image",
    title: "DISAWebs — Diseño y desarrollo web",
    description:
      "Diseño y desarrollo web a medida para negocios, marcas y profesionales.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-AR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
