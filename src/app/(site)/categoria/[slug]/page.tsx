import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryTile, PosterCard } from "@/components/cards/cards";
import { CategoryIcon } from "@/components/icons";
import { MetaChip, PageHeader } from "@/components/page-header";
import { Rail } from "@/components/rail";
import { railItem } from "@/components/rail-items";
import { categories, getCategory, videosInCategory } from "@/lib/catalog";
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

  return (
    <>
      <PageHeader
        eyebrow={`Tema ${String(category.driveFolder.order).padStart(2, "0")}`}
        title={category.title}
        description={category.description}
        accent={category.color}
        icon={<CategoryIcon icon={category.icon} size={340} strokeWidth={0.6} />}
        meta={<MetaChip>{pluralize(videos.length, "vídeo", "vídeos")}</MetaChip>}
      />
      <section aria-label={`Vídeos de ${category.title}`} className="shell">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {videos.map((v) => (
            <li key={v.id}>
              <PosterCard video={v} />
            </li>
          ))}
        </ul>
      </section>
      <div className="mt-12">
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
