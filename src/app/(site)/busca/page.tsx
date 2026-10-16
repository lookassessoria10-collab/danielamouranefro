import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchView } from "@/components/search/search-view";

export const metadata: Metadata = {
  title: "Buscar",
  description: "Busque vídeos do Nefroflix por assunto, pergunta, tema ou palavra-chave.",
  alternates: { canonical: "/busca" },
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="shell min-h-[60vh] pt-32" />}>
      <SearchView />
    </Suspense>
  );
}
