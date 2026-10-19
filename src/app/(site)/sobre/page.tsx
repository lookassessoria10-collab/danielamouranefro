import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AboutHero } from "@/components/about-daniela";
import { site } from "@/data/site";
import { photos } from "@/lib/photos";

export const metadata: Metadata = {
  title: "Sobre",
  description: `O Nefroflix reúne os vídeos educativos da ${site.doctor.name}, ${site.doctor.specialty.toLowerCase()}.`,
  alternates: { canonical: "/sobre" },
};

const pillars = [
  { title: "Encontrar", text: "Busca por assunto, por tema e por palavras do dia a dia, como “xixi” ou “remédio”." },
  { title: "Descobrir", text: "Perguntas, coleções e a trilha “Por onde começar?” mostram assuntos que você talvez não conhecesse." },
  { title: "Assistir", text: "Os vídeos tocam aqui mesmo, no formato vertical original, sem depender do feed do Instagram." },
];

export default function AboutPage() {
  const second = photos.retrato;
  return (
    <>
      <div className="pt-14 md:pt-16">
        <AboutHero />
      </div>

      <section aria-labelledby="como-funciona" className="reveal shell py-14 md:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:gap-16">
          <div>
            <p className="eyebrow text-orange-bright">O Nefroflix</p>
            <h2 id="como-funciona" className="mt-2 text-display text-[2.2rem] text-snow sm:text-[3rem]">
              Como a plataforma funciona
            </h2>
            <ol className="mt-8 grid gap-3 sm:grid-cols-3">
              {pillars.map((p, i) => (
                <li key={p.title} className="rounded-2xl bg-surface p-6">
                  <span className="text-sm font-bold tabular-nums text-orange-bright">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 text-xl font-extrabold tracking-[-0.02em] text-snow">{p.title}</h3>
                  <p className="mt-2 leading-relaxed text-mist">{p.text}</p>
                </li>
              ))}
            </ol>
            <p className="mt-8 max-w-2xl rounded-2xl bg-surface/60 px-5 py-4 text-sm leading-relaxed text-mist">{site.disclaimer}</p>
            <Link
              href="/explorar"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-orange px-6 font-bold text-ink transition-colors hover:bg-orange-bright"
            >
              Explorar os vídeos <ArrowRight size={18} aria-hidden />
            </Link>
          </div>
          <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-[28px] lg:max-w-none">
            <Image src={second.src} alt={second.alt} fill placeholder="blur" sizes="(min-width: 1024px) 30vw, 90vw" className="object-cover" style={{ objectPosition: "50% 30%" }} />
          </div>
        </div>
      </section>
    </>
  );
}
