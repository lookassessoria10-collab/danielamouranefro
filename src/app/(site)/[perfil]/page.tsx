import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AboutDaniela } from "@/components/about-daniela";
import { CategoryTile, CollectionCard, PosterCard, WideCard } from "@/components/cards/cards";
import { DiscoveryFlow } from "@/components/discovery/discovery-flow";
import { Hero, type HeroSlide } from "@/components/home/hero";
import { ForYouRail, ProfileNote, ProfileSync, RecentRail } from "@/components/home/personal-rails";
import { QuestionIndex } from "@/components/home/question-index";
import { SeriesSpotlight } from "@/components/home/series-spotlight";
import { Rail } from "@/components/rail";
import { railItem } from "@/components/rail-items";
import { getProfile, isProfileId, profiles, type HomeSection } from "@/data/profiles";
import {
  categories,
  collections,
  getCategory,
  getVideo,
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

export default async function ProfileHome({ params }: PageProps<"/[perfil]">) {
  const { perfil } = await params;
  if (!isProfileId(perfil)) notFound();
  const profile = getProfile(perfil);

  const slides: HeroSlide[] = profile.hero.map(({ videoId, photo }) => {
    const video = getVideo(videoId)!;
    return { video, category: getCategory(video.category)!, photo };
  });

  const drinks = [...videosInCategory("agua-e-hidratacao"), ...videosInCategory("bebidas-e-chas")].sort(
    (a, b) => b.featured - a.featured || a.number - b.number,
  );

  const sections: Record<HomeSection, React.ReactNode> = {
    "for-you": <ForYouRail profile={perfil} />,
    recent: <RecentRail />,
    "start-here": (
      <Rail
        eyebrow="Primeiros passos"
        title="Comece por aqui"
        href="/colecao/comece-por-aqui"
        itemClassName={railItem.poster}
      >
        {videosInCollection("comece-por-aqui").map((v) => (
          <PosterCard key={v.id} video={v} />
        ))}
      </Rail>
    ),
    discovery: <DiscoveryFlow />,
    questions: <QuestionIndex videos={videosInCollection("perguntas-frequentes").slice(0, 6)} />,
    kidneys: (
      <Rail
        eyebrow="Entenda seus rins"
        title="Saúde renal"
        description="Sinais do corpo, exames e condições renais."
        href="/categoria/entenda-seus-rins"
        itemClassName={railItem.poster}
      >
        {videosInCategory("entenda-seus-rins").map((v) => (
          <PosterCard key={v.id} video={v} />
        ))}
      </Rail>
    ),
    drinks: (
      <Rail
        eyebrow="Água, bebidas e chás"
        title="O que você bebe também importa"
        href="/categoria/agua-e-hidratacao"
        hrefLabel="Ver água e hidratação"
        itemClassName={railItem.wide}
      >
        {drinks.map((v) => (
          <WideCard key={v.id} video={v} />
        ))}
      </Rail>
    ),
    meds: (
      <Rail
        eyebrow="Medicamentos e tratamentos"
        title="Medicamentos e cuidados"
        href="/categoria/medicamentos-e-tratamentos"
        itemClassName={railItem.poster}
      >
        {videosInCategory("medicamentos-e-tratamentos").map((v) => (
          <PosterCard key={v.id} video={v} />
        ))}
      </Rail>
    ),
    habits: (
      <Rail
        eyebrow="Hábitos e dúvidas comuns"
        title="No dia a dia"
        href="/categoria/habitos-e-duvidas"
        itemClassName={railItem.wide}
      >
        {videosInCategory("habitos-e-duvidas").map((v) => (
          <WideCard key={v.id} video={v} />
        ))}
      </Rail>
    ),
    series: <SeriesSpotlight />,
    collections: (
      <Rail eyebrow="Para maratonar" title="Coleções" href="/explorar#colecoes" itemClassName={railItem.collection}>
        {collections
          .filter((c) => c.id !== "comece-por-aqui")
          .map((c) => (
            <CollectionCard key={c.id} collection={c} videos={videosInCollection(c.id)} />
          ))}
      </Rail>
    ),
    categories: (
      <Rail eyebrow="Explorar" title="Navegue por tema" href="/explorar" itemClassName={railItem.category}>
        {categories.map((c) => (
          <CategoryTile key={c.id} category={c} count={videosInCategory(c.id).length} />
        ))}
      </Rail>
    ),
    about: <AboutDaniela />,
  };

  return (
    <>
      <ProfileSync profile={perfil} />
      <Hero slides={slides} />
      <div className="mt-2 md:-mt-4">
        <ProfileNote profile={perfil} />
      </div>
      <div className="pt-4">
        {profile.sections.map((key) => (
          <div key={key}>{sections[key]}</div>
        ))}
      </div>
    </>
  );
}
