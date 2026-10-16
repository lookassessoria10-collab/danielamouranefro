import type { Metadata } from "next";
import { ProfileSelector } from "@/components/profile-selector";

export const metadata: Metadata = {
  title: "Trocar perfil",
  robots: { index: false },
};

export default function ProfilesPage() {
  return <ProfileSelector mode="manage" />;
}
