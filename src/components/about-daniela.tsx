import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { InstagramIcon } from "./icons";
import { site } from "@/data/site";
import { photos } from "@/lib/photos";
import { allVideos, categories } from "@/lib/catalog";
import { cn } from "@/lib/utils";

/** Apresentação discreta da Dra. Daniela — sem autopromoção nem dados não confirmados. */
export function AboutDaniela({ variant = "section" }: { variant?: "section" | "page" }) {
  const Heading = variant === "page" ? "h1" : "h2";
  return (
    <section aria-labelledby="sobre-daniela" className={cn("reveal shell", variant === "section" ? "py-12 md:py-16" : "pb-10 pt-24 md:pt-32")}>
      <div className="grid items-center gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-20">
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] ring-1 ring-white/10">
            <Image
              src={photos.consultorio.src}
              alt={photos.consultorio.alt}
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              placeholder="blur"
              className="object-cover"
              style={{ objectPosition: "50% 22%" }}
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
          </div>
          {variant === "page" && (
            <div className="absolute -bottom-6 -right-2 hidden w-40 overflow-hidden rounded-3xl ring-4 ring-ink sm:block lg:-right-10 lg:w-48">
              <div className="relative aspect-[3/4]">
                <Image src={photos.retrato.src} alt={photos.retrato.alt} fill sizes="200px" className="object-cover" style={{ objectPosition: "50% 28%" }} />
              </div>
            </div>
          )}
        </div>

        <div>
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-caramel">Quem fala com você</p>
          <Heading id="sobre-daniela" className="mt-3 font-display text-[2.8rem] leading-[0.98] text-snow sm:text-[3.6rem]">
            {site.doctor.name}
          </Heading>
          <p className="mt-2 text-lg text-mist">
            {site.doctor.specialty}
            {site.doctor.registry && <span className="text-fog"> · {site.doctor.registry}</span>}
          </p>

          <div className="mt-7 max-w-lg space-y-4 leading-relaxed text-mist">
            <p>
              A Dra. Daniela usa o Instagram para falar de saúde renal em linguagem acessível — das dúvidas sobre água
              e bebidas aos exames, aos sinais do corpo e aos medicamentos.
            </p>
            <p>
              O Nefroflix reúne esses vídeos em um endereço permanente, organizado por temas e por perguntas, para que
              você encontre o assunto que procura sem depender do feed.
            </p>
          </div>

          <dl className="mt-8 grid max-w-md grid-cols-2 gap-4 border-t border-white/[0.08] pt-6">
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-fog">Vídeos no acervo</dt>
              <dd className="mt-1 font-display text-4xl text-snow">{allVideos.length}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-fog">Temas</dt>
              <dd className="mt-1 font-display text-4xl text-snow">{categories.length}</dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            {variant === "section" && (
              <Link
                href="/sobre"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 px-5 font-medium text-snow transition-colors hover:border-white/40"
              >
                Sobre o Nefroflix <ArrowRight size={17} aria-hidden />
              </Link>
            )}
            {site.links.instagram && (
              <a
                href={site.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 px-5 font-medium text-snow transition-colors hover:border-white/40"
              >
                <InstagramIcon size={18} /> {site.links.instagramHandle || "Instagram"}
              </a>
            )}
            {site.links.contact && (
              <a
                href={site.links.contact}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-caramel px-5 font-semibold text-ink transition-colors hover:bg-caramel-soft"
              >
                {site.links.contactLabel} <ArrowUpRight size={17} aria-hidden />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
