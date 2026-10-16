import type { Metadata } from "next";
import { MyListView } from "@/components/list/my-list-view";

export const metadata: Metadata = {
  title: "Minha lista",
  robots: { index: false },
};

export default function MyListPage() {
  return <MyListView />;
}
