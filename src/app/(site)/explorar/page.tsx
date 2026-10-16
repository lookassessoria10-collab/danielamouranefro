import type { Metadata } from "next";
import { CategoryTile, CollectionCard, FeatureCard } from "@/components/cards/cards";
import { AllVideos } from "@/components/explore/all-videos";
import { SeriesSpotlight } from "@/components/home/series-spotlight";
import { MetaChip, PageHeader } from "@/components/page-header";
import { allVideos, categories, collections, seriesList, videosInCategory, videosInCollection } from "@/lib/catalog";
import { photos } from "@/lib/photos";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Explorar",
  description: "Todos os vídeos do Nefroflix organizados por temas, coleções e quadros.",
  alternates: { canonical: "/explorar" },
};

export default function ExplorePage() {
  return (
    <>
      <PageHeader
        eyebrow="Explorar"
        title={
          <>
            Todo o acervo, <em className="text-caramel-soft">por temas.</em>
          </>
        }
        description="Os cinco temas seguem a organização original dos vídeos. As coleções e o quadro reúnem os mesmos vídeos por outros caminhos."
        meta={
          <>
            <MetaChip>{allVideos.length} vídeos</MetaChip>
            <MetaChip>{categories.length} temas</MetaChip>
            <MetaChip>{collections.length} coleções</MetaChip>
            <MetaChip>{seriesList.length} quadro</MetaChip>
          </>
        }
      />

      <section aria-label="Temas" className="shell">
        <ul className="grid gap-3 sm:gap-4 md:grid-cols-6">
          {categories.map((c, i) => (
            <li key={c.id} className={cn(i < 2 ? "md:col-span-3" : "md:col-span-2")}>
              <CategoryTile category={c} count={videosInCategory(c.id).length} large={i < 2} className="h-full" />
            </li>
          ))}
        </ul>
      </section>

      <section id="colecoes" aria-labelledby="colecoes-titulo" className="reveal shell scroll-mt-24 py-14">
        <h2 id="colecoes-titulo" className="text-[1.6rem] font-semibold tracking-[-0.02em] text-snow">
          Coleções
        </h2>
        <p className="mt-1 text-sm text-fog">Seleções editoriais com vídeos do acervo — nenhum arquivo duplicado.</p>
        <ul className="mt-6 grid grid-cols-1 gap-6 min-[440px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {collections.map((c) => (
            <li key={c.id} className="xl:col-span-2">
              <CollectionCard collection={c} videos={videosInCollection(c.id)} />
            </li>
          ))}
        </ul>
      </section>

      <div className="shell py-4">
        <FeatureCard
          eyebrow="Não sabe por onde começar?"
          title="Conte o que você quer entender."
          description="Duas escolhas rápidas e o Nefroflix monta uma seleção de vídeos sobre o assunto que despertou sua curiosidade."
          href="/por-onde-comecar"
          cta="Começar agora"
          photo={photos.consultorio}
          photoPosition="50% 26%"
        />
      </div>

      <SeriesSpotlight />
      <AllVideos />
    </>
  );
}
