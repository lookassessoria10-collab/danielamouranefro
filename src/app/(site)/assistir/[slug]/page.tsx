import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VideoCard } from "@/components/cards/cards";
import { Rail } from "@/components/rail";
import { railItem } from "@/components/rail-items";
import { WatchView } from "@/components/watch/watch-view";
import {
  allVideos,
  getCategory,
  getSeries,
  getVideoBySlug,
  relatedVideos,
  videosInCategory,
  videosInSeries,
} from "@/lib/catalog";
import { site } from "@/data/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return allVideos.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: PageProps<"/assistir/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const video = getVideoBySlug(slug);
  if (!video) return {};
  const description = `${video.question} Vídeo com a ${site.doctor.name}, ${site.doctor.specialty.toLowerCase()}.`;
  return {
    title: video.title,
    description,
    alternates: { canonical: `/assistir/${video.slug}` },
    openGraph: { type: "video.other", title: `${video.title} · ${site.name}`, description },
  };
}

export default async function WatchPage({ params }: PageProps<"/assistir/[slug]">) {
  const { slug } = await params;
  const video = getVideoBySlug(slug);
  if (!video) notFound();

  const category = getCategory(video.category)!;
  const series = video.series ? getSeries(video.series) ?? null : null;
  const episode = series ? videosInSeries(series.id).findIndex((v) => v.id === video.id) + 1 : null;
  const related = relatedVideos(video, 6);
  const next = related[0] ?? null;
  const upNext = related.slice(1, 5);
  const shown = new Set([video.id, ...related.slice(0, 5).map((v) => v.id)]);
  const more = videosInCategory(video.category).filter((v) => !shown.has(v.id));
  const moreRail = more.length >= 2 ? more : videosInCategory(video.category).filter((v) => v.id !== video.id);

  return (
    <>
      <WatchView video={video} category={category} series={series} episode={episode || null} upNext={upNext} next={next} />
      {moreRail.length > 0 && (
        <div className="mt-4 border-t border-white/[0.05] pt-4">
          <Rail
            eyebrow={category.title}
            title={`Mais vídeos de ${category.shortTitle.toLowerCase()}`}
            href={`/categoria/${category.id}`}
            itemClassName={railItem.landscape}
          >
            {moreRail.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </Rail>
        </div>
      )}
    </>
  );
}
