import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Logo } from "./brand";
import { InstagramIcon } from "./icons";
import { site } from "@/data/site";
import type { PhotoKey } from "@/data/types";
import { photos } from "@/lib/photos";
import { allVideos, categories } from "@/lib/catalog";
import { cn } from "@/lib/utils";

/** Texto institucional — sem autopromoção nem dados não confirmados. */
export function AboutText({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4 leading-relaxed", className)}>
      <p>
        A Dra. Daniela usa o Instagram para falar de saúde renal em linguagem acessível, das dúvidas sobre água e
        bebidas aos exames, aos sinais do corpo e aos medicamentos.
      </p>
      <p>
        O Nefroflix reúne esses vídeos em um endereço permanente, organizado por temas e por perguntas, para que você
        encontre o assunto que procura sem depender do feed.
      </p>
    </div>
  );
}

export function ContactLinks({ tone }: { tone: "light" | "dark" }) {
  if (!site.links.instagram && !site.links.contact) return null;
  const outline =
    tone === "light" ? "bg-brown/10 text-brown hover:bg-brown/15" : "bg-white/[0.08] text-snow hover:bg-white/[0.14]";
  return (
    <div className="flex flex-wrap gap-3">
      {site.links.instagram && (
        <a href={site.links.instagram} target="_blank" rel="noopener noreferrer" className={cn("inline-flex h-12 items-center gap-2 rounded-full px-5 font-semibold transition-colors", outline)}>
          <InstagramIcon size={18} /> {site.links.instagramHandle || "Instagram"}
        </a>
      )}
      {site.links.contact && (
        <a
          href={site.links.contact}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center gap-2 rounded-full bg-orange px-5 font-bold text-ink transition-colors hover:bg-orange-bright"
        >
          {site.links.contactLabel} <ArrowUpRight size={17} aria-hidden />
        </a>
      )}
    </div>
  );
}

/**
 * Apresentação da Dra. Daniela na home: um intervalo claro (bege acinzentado)
 * no meio da interface escura, com o logotipo nas cores originais.
 */
export function AboutDaniela({ photo: photoKey = "consultorio" }: { photo?: PhotoKey }) {
  const photo = photos[photoKey];
  return (
    <section aria-labelledby="sobre-daniela" className="reveal shell py-10 md:py-14">
      <div className="grid overflow-hidden rounded-[28px] bg-sand md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[460px]">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 768px) 44vw, 100vw"
            placeholder="blur"
            className="object-cover [object-position:var(--pos-m)] md:[object-position:var(--pos)]"
            style={{ "--pos": "50% 26%", "--pos-m": "50% 24%" } as React.CSSProperties}
          />
        </div>
        <div className="flex flex-col justify-center p-6 text-brown sm:p-10 lg:p-14">
          <Logo tone="light" className="h-7 self-start md:h-8" />
          <p className="eyebrow mt-8 text-[#9a4600]">Quem fala com você</p>
          <h2 id="sobre-daniela" className="mt-2 text-display text-[2.3rem] text-brown-deep sm:text-[3rem]">
            {site.doctor.name}
          </h2>
          <p className="mt-2 text-lg font-semibold">
            {site.doctor.specialty}
            {site.doctor.registry && <span className="font-medium"> · {site.doctor.registry}</span>}
          </p>
          <AboutText className="mt-6 max-w-lg text-[1.02rem]" />
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/sobre"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-brown px-6 font-bold text-paper transition-colors hover:bg-brown-deep"
            >
              Sobre a Dra. Daniela <ArrowRight size={17} aria-hidden />
            </Link>
            <ContactLinks tone="light" />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Página /sobre: composição própria, com fotografia grande e informação profissional. */
export function AboutHero() {
  const main = photos.verde;
  return (
    <section aria-labelledby="sobre-titulo" className="relative isolate grid min-h-[calc(100svh-4rem)] md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="relative min-h-[64svh] md:min-h-0">
        <Image
          src={main.src}
          alt={main.alt}
          fill
          priority
          placeholder="blur"
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover [object-position:42%_14%] md:[object-position:42%_22%]"
        />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-sand to-transparent md:hidden" />
      </div>
      <div className="flex flex-col justify-center bg-sand px-6 py-12 text-brown sm:px-12 lg:px-20">
        <Logo tone="light" className="h-8 self-start" />
        <p className="eyebrow mt-10 text-[#9a4600]">Quem fala com você</p>
        <h1 id="sobre-titulo" className="mt-3 text-display text-[2.8rem] text-brown-deep sm:text-[3.8rem] lg:text-[4.4rem]">
          {site.doctor.name}
        </h1>
        <p className="mt-3 text-xl font-semibold">
          {site.doctor.specialty}
          {site.doctor.registry && <span className="font-medium"> · {site.doctor.registry}</span>}
        </p>
        <AboutText className="mt-7 max-w-lg text-[1.05rem]" />
        <dl className="mt-9 grid max-w-sm grid-cols-2 gap-6 border-t border-brown/15 pt-6">
          <div>
            <dt className="eyebrow text-brown/80">Vídeos no acervo</dt>
            <dd className="mt-1 text-4xl font-extrabold tracking-[-0.03em] text-brown-deep">{allVideos.length}</dd>
          </div>
          <div>
            <dt className="eyebrow text-brown/80">Temas</dt>
            <dd className="mt-1 text-4xl font-extrabold tracking-[-0.03em] text-brown-deep">{categories.length}</dd>
          </div>
        </dl>
        <div className="mt-9">
          <ContactLinks tone="light" />
        </div>
      </div>
    </section>
  );
}
