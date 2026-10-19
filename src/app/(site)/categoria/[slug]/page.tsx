import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryTile, VideoCard } from "@/components/cards/cards";
import { Cover } from "@/components/cards/cover";
import { MetaChip, PageHeader } from "@/components/page-header";
import { Rail } from "@/components/rail";
import { railItem } from "@/components/rail-items";
import { categories, getCategory, getVideo, videosInCategory } from "@/lib/catalog";
import { pluralize } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }: PageProps<"/categoria/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return { title: category.title, description: category.description, alternates: { canonical: `/categoria/${slug}` } };
}

export default async function CategoryPage({ params }: PageProps<"/categoria/[slug]">) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const videos = videosInCategory(category.id);
  const cover = getVideo(category.coverVideo);

  return (
    <>
      <PageHeader
        eyebrow={`Tema ${String(category.driveFolder.order).padStart(2, "0")}`}
        title={category.title}
        description={category.description}
        media={cover && <Cover video={cover} shape="landscape" priority sizes="(min-width: 768px) 58vw, 100vw" />}
        meta={<MetaChip>{pluralize(videos.length, "vídeo", "vídeos")}</MetaChip>}
      />
      <section aria-label={`Vídeos de ${category.title}`} className="shell">
        <ul className="grid gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map((v, i) => (
            <li key={v.id}>
              <VideoCard video={v} priority={i < 4} />
            </li>
          ))}
        </ul>
      </section>
      <div className="mt-10">
        <Rail title="Outros temas" href="/explorar" itemClassName={railItem.category}>
          {categories
            .filter((c) => c.id !== category.id)
            .map((c) => (
              <CategoryTile key={c.id} category={c} count={videosInCategory(c.id).length} />
            ))}
        </Rail>
      </div>
    </>
  );
}
