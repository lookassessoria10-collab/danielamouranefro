import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { IntroOverlay } from "@/components/intro-overlay";
import { Providers } from "@/components/providers";
import { INTRO_STORAGE_KEY, PROFILE_STORAGE_KEY } from "@/data/profiles";
import { site } from "@/data/site";
import introKidneyLeft from "@/assets/brand/intro-kidney-left.webp";
import introKidneyRight from "@/assets/brand/intro-kidney-right.webp";
import introPlay from "@/assets/brand/intro-play.webp";
import introWordmark from "@/assets/brand/intro-wordmark.webp";
import "./globals.css";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });

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
  themeColor: "#171311",
  colorScheme: "dark",
};

/**
 * Roda antes da primeira pintura:
 * 1. Quem já escolheu um perfil e abre a raiz vai direto para a sua home.
 * 2. Na primeira página da sessão, marca a abertura animada para tocar uma única vez
 *    (sessionStorage) e pré-carrega as peças do logo. Clique ou tecla pulam a abertura, e ela
 *    se encerra sozinha em 2,7 s — tudo sem depender do React. Com movimento reduzido, é pulada.
 */
const introParts = JSON.stringify([introKidneyLeft.src, introKidneyRight.src, introPlay.src, introWordmark.src]);
const bootScript = `(function(){try{var d=document.documentElement;if(location.pathname==="/"){var p=localStorage.getItem(${JSON.stringify(
  PROFILE_STORAGE_KEY,
)});if(p==="paciente"||p==="residente"||p==="curioso"){location.replace("/"+p+location.search);return}}var s=window.sessionStorage;if(!s.getItem(${JSON.stringify(
  INTRO_STORAGE_KEY,
)})){s.setItem(${JSON.stringify(INTRO_STORAGE_KEY)},"1");if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches){d.setAttribute("data-intro","play");var end=function(){if(d.getAttribute("data-intro")==="play")d.setAttribute("data-intro","done");document.removeEventListener("click",end,true);document.removeEventListener("keydown",end,true)};document.addEventListener("click",end,true);document.addEventListener("keydown",end,true);setTimeout(end,2700);${introParts}.forEach(function(h){var l=document.createElement("link");l.rel="preload";l.as="image";l.href=h;document.head.appendChild(l)})}}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={manrope.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <IntroOverlay />
        <a
          href="#conteudo"
          className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-full bg-snow px-4 py-2 text-sm font-semibold text-ink transition-transform focus:translate-y-0"
        >
          Pular para o conteúdo
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
