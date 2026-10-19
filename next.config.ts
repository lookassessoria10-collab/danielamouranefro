import type { NextConfig } from "next";
import { videos } from "./src/data/videos";

/*
 * Cache Components fica desligado de propósito: o site é 100% estático e, com ele
 * ligado, rotas antigas ficam "escondidas" em vez de desmontadas — um vídeo poderia
 * continuar tocando o áudio depois que a pessoa sai da página.
 */
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  /*
   * /media/<id>.mp4 entrega o arquivo que continua hospedado no Google Drive.
   * O Drive recusa pedidos de vídeo vindos de outros sites, mas aceita quando o pedido
   * sai do próprio domínio; assim o site usa um player nativo, com um único conjunto de
   * controles (o player incorporado do Drive duplica os controles no celular).
   * Só os vídeos do catálogo têm rota: não é um repasse aberto para qualquer arquivo.
   */
  async rewrites() {
    return videos.map((video) => ({
      source: `/media/${video.id}.mp4`,
      destination: `https://drive.usercontent.google.com/download?id=${video.driveId}&export=download`,
    }));
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
