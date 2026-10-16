import type { Metadata, Viewport } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import { Providers } from "@/components/providers";
import { PROFILE_STORAGE_KEY as PROFILE_KEY } from "@/data/profiles";
import { site } from "@/data/site";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"], display: "swap" });
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · Saúde renal em vídeo com a ${site.doctor.name}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.name,
    title: `${site.name} · ${site.tagline}`,
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#101317",
  colorScheme: "dark",
};

/**
 * Quem já escolheu um perfil e abre a raiz do site vai direto para a sua home,
 * antes da primeira pintura (sem piscar a tela de perfis).
 */
const profileRedirect = `try{if(location.pathname==="/"){var p=localStorage.getItem(${JSON.stringify(PROFILE_KEY)});if(p==="paciente"||p==="residente"||p==="curioso")location.replace("/"+p+location.search)}}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geist.variable} ${instrument.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: profileRedirect }} />
      </head>
      <body>
        <a
          href="#conteudo"
          className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-full bg-snow px-4 py-2 text-sm font-medium text-ink transition-transform focus:translate-y-0"
        >
          Pular para o conteúdo
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
