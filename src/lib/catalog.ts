import { videos } from "@/data/videos";
import { categories, collections, seriesList } from "@/data/taxonomy";
import type { Category, CategoryId, Collection, CollectionId, SeriesId, Video } from "@/data/types";

const byId = new Map(videos.map((v) => [v.id, v]));
const bySlug = new Map(videos.map((v) => [v.slug, v]));

const byFeatured = (a: Video, b: Video) => b.featured - a.featured || a.number - b.number;

export const allVideos: Video[] = [...videos].sort((a, b) => a.number - b.number);

export const getVideo = (id: string) => byId.get(id);
export const getVideoBySlug = (slug: string) => bySlug.get(slug);

export const getVideos = (ids: readonly string[]) =>
  ids.map((id) => byId.get(id)).filter((v): v is Video => Boolean(v));

export const getCategory = (id: CategoryId | string): Category | undefined =>
  categories.find((c) => c.id === id);

export const videosInCategory = (id: CategoryId) =>
  videos.filter((v) => v.category === id).sort(byFeatured);

export const getCollection = (id: CollectionId | string): Collection | undefined =>
  collections.find((c) => c.id === id);

export const videosInCollection = (id: CollectionId) => {
  const collection = getCollection(id);
  const members = videos.filter((v) => v.collections.includes(id));
  const order = collection?.order ?? [];
  const rank = (v: Video) => {
    const i = order.indexOf(v.id);
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };
  return members.sort((a, b) => rank(a) - rank(b) || byFeatured(a, b));
};

export const getSeries = (id: SeriesId | string) => seriesList.find((s) => s.id === id);

export const videosInSeries = (id: SeriesId) =>
  videos.filter((v) => v.series === id).sort((a, b) => a.number - b.number);

/**
 * Relacionados: primeiro a curadoria manual (`related`), depois vídeos com
 * assuntos em comum e, por fim, da mesma categoria.
 */
export function relatedVideos(video: Video, limit = 6): Video[] {
  const picked = new Set<string>([video.id]);
  const result: Video[] = [];
  const push = (v: Video | undefined) => {
    if (v && !picked.has(v.id) && result.length < limit) {
      picked.add(v.id);
      result.push(v);
    }
  };

  video.related.forEach((id) => push(byId.get(id)));

  const tags = new Set(video.tags);
  videos
    .map((v) => ({ v, shared: v.tags.filter((t) => tags.has(t)).length }))
    .filter(({ v, shared }) => shared > 0 && v.id !== video.id)
    .sort((a, b) => b.shared - a.shared || byFeatured(a.v, b.v))
    .forEach(({ v }) => push(v));

  videosInCategory(video.category).forEach(push);
  return result;
}

export { categories, collections, seriesList };
