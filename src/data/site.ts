/**
 * Configurações institucionais do Nefroflix.
 *
 * Campos vazios ("") não aparecem no site. Preencha quando houver a informação
 * confirmada — nada aqui deve ser inventado (telefone, endereço, convênios, CRM).
 */
export const site = {
  name: "Nefroflix",
  tagline: "Suas perguntas encontram respostas em vídeo.",
  description:
    "Vídeos educativos sobre saúde renal com a Dra. Daniela Moura Landim, médica nefrologista. Encontre o assunto, descubra novas perguntas e assista sem sair da plataforma.",
  /** Domínio público usado em links de compartilhamento e SEO. */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
  doctor: {
    name: "Dra. Daniela Moura Landim",
    shortName: "Dra. Daniela",
    specialty: "Médica nefrologista",
    /** Ex.: "CRM-BA 00.000 · RQE 00.000". Exibido apenas quando preenchido. */
    registry: "",
  },
  links: {
    /** Ex.: "https://www.instagram.com/usuario/" */
    instagram: "",
    instagramHandle: "",
    /** Link do CTA de contato (WhatsApp, agenda online, página do consultório...). */
    contact: "",
    contactLabel: "Fale com o consultório",
  },
  disclaimer:
    "Conteúdo educativo. Os vídeos não substituem a consulta médica nem servem para diagnóstico ou tratamento individual.",
} as const;
