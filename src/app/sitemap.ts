import type { MetadataRoute } from "next";
import { allVideos, categories, collections, seriesList } from "@/lib/catalog";
import { profiles } from "@/data/profiles";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    ...profiles.map((p) => `/${p.id}`),
    "/explorar",
    "/por-onde-comecar",
    "/busca",
    "/sobre",
    ...categories.map((c) => `/categoria/${c.id}`),
    ...collections.map((c) => `/colecao/${c.id}`),
    ...seriesList.map((s) => `/serie/${s.id}`),
    ...allVideos.map((v) => `/assistir/${v.slug}`),
  ];
  return paths.map((path) => ({ url: `${site.url}${path}` }));
}
