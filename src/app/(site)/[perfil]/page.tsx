import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AboutDaniela } from "@/components/about-daniela";
import { CategoryTile, CollectionCard, PosterCard, VideoCard } from "@/components/cards/cards";
import { DiscoveryFlow } from "@/components/discovery/discovery-flow";
import { FeatureBanner } from "@/components/home/feature-banner";
import { Hero, type HeroSlide } from "@/components/home/hero";
import { ContinueRail, ForYouRail, ProfileNote, ProfileSync } from "@/components/home/personal-rails";
import { QuestionIndex } from "@/components/home/question-index";
import { SeriesSpotlight } from "@/components/home/series-spotlight";
import { Rail } from "@/components/rail";
import { railItem } from "@/components/rail-items";
import { banners, getProfile, isProfileId, profiles, type HomeSection, type RailSource } from "@/data/profiles";
import type { Video } from "@/data/types";
import {
  categories,
  collections,
  getCategory,
  getVideo,
  getVideos,
  videosInCategory,
  videosInCollection,
} from "@/lib/catalog";

export const dynamicParams = false;

export function generateStaticParams() {
  return profiles.map((p) => ({ perfil: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/[perfil]">): Promise<Metadata> {
  const { perfil } = await params;
  if (!isProfileId(perfil)) return {};
  return { title: `Início · ${getProfile(perfil).label}`, alternates: { canonical: `/${perfil}` } };
}

function railVideos(source: RailSource): Video[] {
  switch (source.type) {
    case "collection":
      return videosInCollection(source.id);
    case "category":
      return videosInCategory(source.id);
    case "videos":
      return getVideos(source.ids);
  }
}

export default async function ProfileHome({ params }: PageProps<"/[perfil]">) {
  const { perfil } = await params;
  if (!isProfileId(perfil)) notFound();
  const profile = getProfile(perfil);

  const slides: HeroSlide[] = profile.hero.map(({ videoId, photo }) => {
    const video = getVideo(videoId)!;
    return { video, category: getCategory(video.category)!, photo };
  });

  /** Vídeos dos dois trilhos seguintes a "Selecionados para você" (para não repetir conteúdo próximo). */
  const nextRailIds = (index: number) =>
    profile.sections
      .slice(index + 1)
      .filter((s): s is Extract<HomeSection, { kind: "rail" }> => s.kind === "rail")
      .slice(0, 2)
      .flatMap((s) => railVideos(s.source).map((v) => v.id));

  let bannerCount = 0;
  const render = (section: HomeSection, index: number): React.ReactNode => {
    switch (section.kind) {
      case "continue":
        return <ContinueRail />;
      case "for-you":
        return <ForYouRail profile={perfil} avoid={nextRailIds(index)} />;
      case "rail": {
        const videos = railVideos(section.source);
        const poster = section.card === "poster";
        return (
          <Rail
            eyebrow={section.eyebrow}
            title={section.title}
            href={section.href}
            itemClassName={poster ? railItem.poster : railItem.landscape}
          >
            {videos.map((v) => (poster ? <PosterCard key={v.id} video={v} /> : <VideoCard key={v.id} video={v} />))}
          </Rail>
        );
      }
      case "discovery":
        return <DiscoveryFlow />;
      case "questions":
        return (
          <QuestionIndex
            eyebrow={section.eyebrow}
            title={section.title}
            videos={videosInCollection("perguntas-frequentes").slice(0, 6)}
          />
        );
      case "series":
        return <SeriesSpotlight />;
      case "banner":
        return <FeatureBanner banner={banners[section.id]} photo={section.photo} reverse={bannerCount++ % 2 === 1} />;
      case "browse":
        return (
          <div className="py-2 md:py-4">
            <Rail eyebrow="Para maratonar" title="Coleções" href="/explorar#colecoes" itemClassName={railItem.collection}>
              {collections.map((c) => (
                <CollectionCard key={c.id} collection={c} videos={videosInCollection(c.id)} />
              ))}
            </Rail>
            <Rail eyebrow="Os cinco temas do acervo" title="Navegue por tema" href="/explorar" itemClassName={railItem.category}>
              {categories.map((c) => (
                <CategoryTile key={c.id} category={c} count={videosInCategory(c.id).length} />
              ))}
            </Rail>
          </div>
        );
      case "about":
        return <AboutDaniela />;
    }
  };

  return (
    <>
      <ProfileSync profile={perfil} />
      <Hero slides={slides} />
      <ProfileNote profile={perfil} />
      <div className="pt-2">
        {profile.sections.map((section, index) => (
          <div key={`${section.kind}-${index}`}>{render(section, index)}</div>
        ))}
      </div>
    </>
  );
}
