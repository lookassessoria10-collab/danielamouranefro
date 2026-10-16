import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PosterCard } from "@/components/cards/cards";
import { Rail } from "@/components/rail";
import { railItem } from "@/components/rail-items";
import { WatchView } from "@/components/watch/watch-view";
import { allVideos, getCategory, getSeries, getVideoBySlug, relatedVideos, videosInCategory } from "@/lib/catalog";
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
  const related = relatedVideos(video, 5);
  const more = videosInCategory(video.category).filter((v) => v.id !== video.id);

  return (
    <>
      <WatchView
        video={video}
        category={category}
        series={video.series ? getSeries(video.series) ?? null : null}
        related={related}
        next={related[0] ?? null}
      />
      {more.length > 0 && (
        <div className="mt-6 border-t border-white/[0.06] pt-6">
          <Rail
            eyebrow={category.title}
            title={`Mais vídeos de ${category.shortTitle.toLowerCase()}`}
            href={`/categoria/${category.id}`}
            itemClassName={railItem.poster}
          >
            {more.map((v) => (
              <PosterCard key={v.id} video={v} />
            ))}
          </Rail>
        </div>
      )}
    </>
  );
}
