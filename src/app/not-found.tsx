import Link from "next/link";
import { Logo } from "@/components/brand";
import { CuriousIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <main id="conteudo" className="shell flex min-h-dvh flex-col items-center justify-center py-20 text-center">
      <Link href="/" aria-label="Nefroflix — início">
        <Logo />
      </Link>
      <span className="mt-12 grid size-20 place-items-center rounded-3xl bg-caramel/10 text-caramel">
        <CuriousIcon size={40} strokeWidth={1.3} />
      </span>
      <h1 className="mt-6 font-display text-[2.6rem] leading-none text-snow sm:text-[3.4rem]">Esta página não está no acervo.</h1>
      <p className="mt-4 max-w-md text-mist">O endereço pode ter mudado. Que tal procurar o assunto ou começar pelas perguntas?</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/busca" className="inline-flex h-12 items-center rounded-full bg-caramel px-6 font-semibold text-ink hover:bg-caramel-soft">
          Buscar um assunto
        </Link>
        <Link href="/" className="inline-flex h-12 items-center rounded-full border border-white/20 px-6 font-medium text-snow hover:border-white/40">
          Ir para o início
        </Link>
      </div>
    </main>
  );
}
