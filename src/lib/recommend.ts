import { allVideos, getVideo } from "./catalog";
import { getProfile } from "@/data/profiles";
import type { ProfileId, Video } from "@/data/types";

type Signals = {
  profile: ProfileId;
  /** Vídeos escolhidos na trilha "Por onde começar?" (mais recentes primeiro). */
  interests: string[];
  /** Vídeos abertos (mais recentes primeiro). */
  history: string[];
  watched: string[];
};

/**
 * "Selecionados para você": regras simples e transparentes.
 * Perfil define o peso das categorias; escolhas na trilha e vídeos abertos
 * aproximam assuntos relacionados; vídeos já assistidos descem na fila.
 */
export function recommendForYou(signals: Signals, limit = 12): Video[] {
  const { weights } = getProfile(signals.profile);
  const interestSet = new Set(signals.interests);
  const historySet = new Set(signals.history);
  const watchedSet = new Set(signals.watched);

  const recent = signals.history.slice(0, 5).map(getVideo).filter((v): v is Video => Boolean(v));
  const interestVideos = signals.interests.map(getVideo).filter((v): v is Video => Boolean(v));

  const scored = allVideos.map((video) => {
    let score = weights[video.category] + video.featured * 0.35;

    if (interestSet.has(video.id)) score += 4;
    for (const interest of interestVideos) {
      if (interest.related.includes(video.id)) score += 1.5;
    }
    for (const seen of recent) {
      if (seen.id === video.id) continue;
      if (seen.related.includes(video.id)) score += 1.5;
      score += seen.tags.filter((t) => video.tags.includes(t)).length * 0.4;
    }
    if (historySet.has(video.id)) score -= 1.5;
    if (watchedSet.has(video.id)) score -= 4;

    return { video, score };
  });

  return scored
    .sort((a, b) => b.score - a.score || a.video.number - b.video.number)
    .slice(0, limit)
    .map((s) => s.video);
}
