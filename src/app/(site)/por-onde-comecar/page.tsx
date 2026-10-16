import type { Metadata } from "next";
import { CollectionCard } from "@/components/cards/cards";
import { DiscoveryFlow } from "@/components/discovery/discovery-flow";
import { Rail } from "@/components/rail";
import { railItem } from "@/components/rail-items";
import { collections, videosInCollection } from "@/lib/catalog";
import { discoveryIntro } from "@/data/discovery";

export const metadata: Metadata = {
  title: discoveryIntro.title,
  description: discoveryIntro.text,
  alternates: { canonical: "/por-onde-comecar" },
};

export default function DiscoverPage() {
  return (
    <>
      <DiscoveryFlow variant="page" />
      <Rail eyebrow="Ou siga uma coleção" title="Caminhos prontos" href="/explorar#colecoes" itemClassName={railItem.collection}>
        {collections.map((c) => (
          <CollectionCard key={c.id} collection={c} videos={videosInCollection(c.id)} />
        ))}
      </Rail>
    </>
  );
}
