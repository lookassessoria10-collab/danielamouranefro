import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AboutDaniela } from "@/components/about-daniela";
import { site } from "@/data/site";

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
  return (
    <>
      <AboutDaniela variant="page" />
      <section aria-labelledby="como-funciona" className="reveal shell py-14">
        <h2 id="como-funciona" className="font-display text-[2.4rem] leading-none text-snow sm:text-[3rem]">
          Como o Nefroflix funciona
        </h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {pillars.map((p, i) => (
            <li key={p.title} className="rounded-3xl bg-charcoal p-6 ring-1 ring-white/[0.06]">
              <span className="font-display text-4xl text-caramel">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 text-xl font-semibold text-snow">{p.title}</h3>
              <p className="mt-2 leading-relaxed text-mist">{p.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 max-w-2xl rounded-2xl border border-white/[0.06] bg-charcoal/60 px-5 py-4 text-sm leading-relaxed text-mist">
          {site.disclaimer}
        </p>
        <Link href="/explorar" className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-caramel px-6 font-semibold text-ink hover:bg-caramel-soft">
          Explorar os vídeos <ArrowRight size={18} aria-hidden />
        </Link>
      </section>
    </>
  );
}
