import Link from "next/link";
import { Search } from "lucide-react";
import { Logo } from "@/components/brand";

export default function NotFound() {
  return (
    <main id="conteudo" className="shell flex min-h-dvh flex-col items-center justify-center py-20 text-center">
      <Link href="/" aria-label="Nefroflix — início">
        <Logo />
      </Link>
      <span className="mt-12 grid size-16 place-items-center rounded-2xl bg-orange/15 text-orange-bright">
        <Search size={28} aria-hidden />
      </span>
      <h1 className="mt-6 text-display text-[2.4rem] text-snow sm:text-[3.2rem]">Esta página não está no acervo.</h1>
      <p className="mt-4 max-w-md text-mist">O endereço pode ter mudado. Que tal procurar o assunto ou começar pelas perguntas?</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/busca" className="inline-flex h-12 items-center rounded-full bg-orange px-6 font-bold text-ink hover:bg-orange-bright">
          Buscar um assunto
        </Link>
        <Link href="/" className="inline-flex h-12 items-center rounded-full bg-white/[0.08] px-6 font-semibold text-snow hover:bg-white/[0.14]">
          Ir para o início
        </Link>
      </div>
    </main>
  );
}
