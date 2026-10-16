/**
 * Integração com o Google Drive (mesma lógica do Instituto Landim):
 * o vídeo é exibido pelo player incorporado do Drive em /file/d/ID/preview.
 *
 * Requisito: cada arquivo precisa estar compartilhado como
 * "Qualquer pessoa com o link · Leitor". Sem isso o player pede login.
 */
export const drivePreviewUrl = (driveId: string) =>
  `https://drive.google.com/file/d/${encodeURIComponent(driveId)}/preview`;

export const driveViewUrl = (driveId: string) =>
  `https://drive.google.com/file/d/${encodeURIComponent(driveId)}/view`;

/** Miniatura gerada pelo Drive. Só carrega quando o arquivo é público. */
export const driveThumbnailUrl = (driveId: string, width = 32) =>
  `https://drive.google.com/thumbnail?id=${encodeURIComponent(driveId)}&sz=w${width}`;
