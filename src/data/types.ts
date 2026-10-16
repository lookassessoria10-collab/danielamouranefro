/**
 * Tipos do catálogo do Nefroflix.
 *
 * O catálogo é a única fonte de verdade sobre os vídeos. Os componentes visuais
 * nunca guardam títulos, IDs ou relações: tudo vem de `src/data`.
 */

export type CategoryId =
  | "entenda-seus-rins"
  | "agua-e-hidratacao"
  | "bebidas-e-chas"
  | "habitos-e-duvidas"
  | "medicamentos-e-tratamentos";

export type CollectionId =
  | "comece-por-aqui"
  | "perguntas-frequentes"
  | "sinais-do-corpo"
  | "tudo-sobre-agua"
  | "noite-e-rotina"
  | "emagrecimento-em-pauta";

export type SeriesId = "cafezinho-com-a-nefro";

export type ProfileId = "paciente" | "residente" | "curioso";

export type Video = {
  /** Identificador interno estável. Nunca muda, mesmo que o título mude. */
  id: string;
  /** Endereço público da página do vídeo (/assistir/[slug]). */
  slug: string;
  /** Numeração original do arquivo no Google Drive. */
  number: number;
  /** ID do arquivo no Google Drive, usado para reprodução. */
  driveId: string;
  /** Nome original do arquivo no Drive, para rastreabilidade. */
  fileName: string;
  /** Título exibido. Pode ser editado sem afetar links ou listas salvas. */
  title: string;
  category: CategoryId;
  /** Assuntos do vídeo, usados em busca e recomendações. */
  tags: string[];
  /** Sinônimos e termos populares para a busca (ex.: "xixi", "remédio"). */
  keywords: string[];
  /** Pergunta que leva ao vídeo. É um caminho de acesso, não uma resposta. */
  question: string;
  /**
   * Resumo validado pela equipe a partir do conteúdo real do vídeo.
   * Enquanto for `null`, nenhuma descrição é exibida.
   */
  summary: string | null;
  contentType: "reel";
  /** Proporção original do vídeo. Todos os arquivos atuais são 9:16. */
  orientation: "vertical" | "horizontal";
  collections: CollectionId[];
  series?: SeriesId;
  /** Prioridade editorial de destaque (0 a 10). */
  featured: number;
  /** Data de publicação original (AAAA-MM-DD), quando conhecida. */
  publishedAt: string | null;
  /** Duração real em segundos, quando conhecida. Nunca estimar. */
  durationSeconds: number | null;
  /** Relações editoriais definidas manualmente (IDs internos). */
  related: string[];
};

export type Category = {
  id: CategoryId;
  /** Ordem e nome da pasta original no Drive. */
  driveFolder: { order: number; name: string; id: string };
  title: string;
  shortTitle: string;
  description: string;
  /** Cor de apoio da categoria (hex). */
  color: string;
  icon: "kidney" | "droplet" | "cup" | "sun-moon" | "pill";
};

export type Collection = {
  id: CollectionId;
  title: string;
  eyebrow: string;
  description: string;
  /** Ordem editorial explícita. Vídeos da coleção que não estiverem aqui vão para o fim. */
  order?: string[];
};

export type Series = {
  id: SeriesId;
  title: string;
  description: string;
};
