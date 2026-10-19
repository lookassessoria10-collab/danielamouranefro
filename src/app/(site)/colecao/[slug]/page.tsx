import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CollectionCard, PosterCard } from "@/components/cards/cards";
import { Cover } from "@/components/cards/cover";
import { MetaChip, PageHeader } from "@/components/page-header";
import { Rail } from "@/components/rail";
import { railItem } from "@/components/rail-items";
import { collections, getCollection, videosInCollection } from "@/lib/catalog";
import { photos } from "@/lib/photos";
import { pluralize } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }: PageProps<"/colecao/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return {};
  return { title: collection.title, description: collection.description, alternates: { canonical: `/colecao/${slug}` } };
}

export default async function CollectionPage({ params }: PageProps<"/colecao/[slug]">) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();
  const videos = videosInCollection(collection.id);
  const photo = collection.photo ? photos[collection.photo] : null;

  const media = photo ? (
    <Image src={photo.src} alt="" fill priority sizes="(min-width: 768px) 58vw, 100vw" className="object-cover" style={{ objectPosition: photo.position }} />
  ) : (
    videos[0] && <Cover video={videos[0]} shape="landscape" priority sizes="(min-width: 768px) 58vw, 100vw" />
  );

  return (
    <>
      <PageHeader
        eyebrow={collection.eyebrow}
        title={collection.title}
        description={collection.description}
        media={media}
        meta={<MetaChip>{pluralize(videos.length, "vídeo", "vídeos")}</MetaChip>}
      />
      <section aria-label={`Vídeos da coleção ${collection.title}`} className="shell">
        <ol className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-4 xl:grid-cols-5">
          {videos.map((v) => (
            <li key={v.id}>
              <PosterCard video={v} />
            </li>
          ))}
        </ol>
      </section>
      <div className="mt-10">
        <Rail title="Outras coleções" href="/explorar#colecoes" itemClassName={railItem.collection}>
          {collections
            .filter((c) => c.id !== collection.id)
            .map((c) => (
              <CollectionCard key={c.id} collection={c} videos={videosInCollection(c.id)} />
            ))}
        </Rail>
      </div>
    </>
  );
}
