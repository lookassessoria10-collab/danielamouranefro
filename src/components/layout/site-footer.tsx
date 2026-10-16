import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/brand";
import { InstagramIcon } from "@/components/icons";
import { categories } from "@/lib/catalog";
import { site } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-white/[0.06] bg-ink-deep">
      <div className="shell grid gap-12 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 font-display text-2xl leading-snug text-snow">{site.tagline}</p>
          <p className="mt-3 text-sm leading-relaxed text-fog">
            Vídeos educativos com a {site.doctor.name}, {site.doctor.specialty.toLowerCase()}.
          </p>
          {(site.links.instagram || site.links.contact) && (
            <div className="mt-6 flex flex-wrap gap-2">
              {site.links.instagram && (
                <a
                  href={site.links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2 text-sm text-snow hover:border-caramel/60"
                >
                  <InstagramIcon size={16} /> {site.links.instagramHandle || "Instagram"}
                </a>
              )}
              {site.links.contact && (
                <a
                  href={site.links.contact}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-caramel px-4 py-2 text-sm font-medium text-ink hover:bg-caramel-soft"
                >
                  {site.links.contactLabel} <ArrowUpRight size={15} aria-hidden />
                </a>
              )}
            </div>
          )}
        </div>

        <FooterColumn title="Navegar">
          <FooterLink href="/">Início</FooterLink>
          <FooterLink href="/explorar">Explorar</FooterLink>
          <FooterLink href="/por-onde-comecar">Por onde começar?</FooterLink>
          <FooterLink href="/busca">Buscar</FooterLink>
          <FooterLink href="/minha-lista">Minha lista</FooterLink>
        </FooterColumn>

        <FooterColumn title="Temas">
          {categories.map((c) => (
            <FooterLink key={c.id} href={`/categoria/${c.id}`}>
              {c.title}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title="Nefroflix">
          <FooterLink href="/sobre">Sobre a Dra. Daniela</FooterLink>
          <FooterLink href="/serie/cafezinho-com-a-nefro">Cafezinho com a Nefro</FooterLink>
          <FooterLink href="/perfis">Trocar perfil</FooterLink>
        </FooterColumn>
      </div>

      <div className="shell pb-[calc(5.5rem_+_env(safe-area-inset-bottom))] md:pb-10">
        <p className="rounded-2xl border border-white/[0.06] bg-charcoal/60 px-5 py-4 text-sm leading-relaxed text-mist">
          {site.disclaimer}
        </p>
        <p className="mt-6 text-xs text-fog">
          © {new Date().getFullYear()} {site.doctor.name}
          {site.doctor.registry && ` · ${site.doctor.registry}`} · Vídeos hospedados no Google Drive.
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xs uppercase tracking-[0.18em] text-fog">{title}</h2>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-mist transition-colors hover:text-snow">
        {children}
      </Link>
    </li>
  );
}
