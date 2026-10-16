import type { Metadata } from "next";
import { ProfileSelector } from "@/components/profile-selector";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: { absolute: `${site.name} · Quem está assistindo?` },
};

export default function EntryPage() {
  return <ProfileSelector mode="entry" />;
}
