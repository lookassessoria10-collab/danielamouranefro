"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Search, Settings2, X } from "lucide-react";
import { Logo } from "@/components/brand";
import { ProfileBadge } from "@/components/profile-badge";
import { profiles, getProfile, isProfileId } from "@/data/profiles";
import { library, useLibrary } from "@/lib/library";
import { cn } from "@/lib/utils";

export function useHomeHref() {
  const { profile } = useLibrary();
  return profile ? `/${profile}` : "/";
}

export function isActivePath(pathname: string, key: "home" | "explore" | "discover" | "list" | "search") {
  switch (key) {
    case "home":
      return isProfileId(pathname.slice(1));
    case "explore":
      return /^\/(explorar|categoria|colecao|serie)/.test(pathname);
    case "discover":
      return pathname.startsWith("/por-onde-comecar");
    case "list":
      return pathname.startsWith("/minha-lista");
    case "search":
      return pathname.startsWith("/busca");
  }
}

export function SiteHeader() {
  const pathname = usePathname();
  const home = useHomeHref();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = [
    { href: home, label: "Início", key: "home" as const },
    { href: "/explorar", label: "Explorar", key: "explore" as const },
    { href: "/por-onde-comecar", label: "Por onde começar", key: "discover" as const },
    { href: "/minha-lista", label: "Minha lista", key: "list" as const },
  ];

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled
          ? "border-b border-white/[0.06] bg-ink/85 backdrop-blur-xl"
          : "border-b border-transparent bg-gradient-to-b from-ink/90 via-ink/40 to-transparent",
      )}
    >
      <div className="shell flex h-16 items-center gap-4 md:h-[72px] lg:gap-10">
        <Link href={home} aria-label="Nefroflix — página inicial" className="shrink-0 rounded-md">
          <Logo />
        </Link>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => {
              const active = isActivePath(pathname, item.key);
              return (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative rounded-full px-3.5 py-2 text-[0.92rem] transition-colors",
                      active ? "text-snow" : "text-mist hover:text-snow",
                    )}
                  >
                    {item.label}
                    {active && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-caramel"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-3">
          {pathname !== "/busca" && <HeaderSearch />}
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}

function HeaderSearch() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const close = () => {
    setOpen(false);
    setValue("");
  };

  return (
    <form
      role="search"
      className="hidden md:block"
      onSubmit={(e) => {
        e.preventDefault();
        const q = value.trim();
        router.push(q ? `/busca?q=${encodeURIComponent(q)}` : "/busca");
        close();
        inputRef.current?.blur();
      }}
    >
      <div
        className={cn(
          "flex h-10 items-center overflow-hidden rounded-full border transition-[width,background-color,border-color] duration-300 ease-out-expo",
          open ? "w-72 border-white/15 bg-charcoal/90" : "w-10 border-transparent",
        )}
      >
        <button
          type={open ? "submit" : "button"}
          aria-label={open ? "Buscar" : "Abrir busca"}
          onClick={() => {
            if (!open) {
              setOpen(true);
              requestAnimationFrame(() => inputRef.current?.focus());
            }
          }}
          className="grid size-10 shrink-0 place-items-center rounded-full text-mist transition-colors hover:text-snow"
        >
          <Search size={19} aria-hidden />
        </button>
        <input
          ref={inputRef}
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => !value && setOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && close()}
          tabIndex={open ? 0 : -1}
          aria-label="Buscar vídeos por assunto"
          placeholder="Espuma, água, remédio…"
          className="h-full w-full min-w-0 bg-transparent pr-2 text-sm text-snow placeholder:text-fog focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        {open && value && (
          <button
            type="button"
            aria-label="Limpar busca"
            onClick={() => {
              setValue("");
              inputRef.current?.focus();
            }}
            className="mr-2 grid size-7 shrink-0 place-items-center rounded-full text-fog hover:text-snow"
          >
            <X size={15} aria-hidden />
          </button>
        )}
      </div>
    </form>
  );
}

function ProfileMenu() {
  const { profile, ready } = useLibrary();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!wrapper.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!ready) return <span className="skeleton size-9 rounded-full" aria-hidden />;

  if (!profile) {
    return (
      <Link
        href="/"
        className="rounded-full border border-white/15 px-3.5 py-2 text-sm text-snow transition-colors hover:border-caramel/60"
      >
        Escolher perfil
      </Link>
    );
  }

  const current = getProfile(profile);

  return (
    <div ref={wrapper} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`Perfil: ${current.label}. Trocar perfil`}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full p-0.5 pr-1 text-mist transition-colors hover:text-snow sm:pr-2.5"
      >
        <ProfileBadge id={profile} size={36} />
        <span className="hidden text-sm text-snow lg:inline">{current.label}</span>
        <ChevronDown size={16} aria-hidden className={cn("hidden transition-transform sm:block", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-3 w-72 origin-top-right rounded-2xl border border-white/10 bg-charcoal-2/98 p-2 shadow-lift backdrop-blur-xl"
          >
            <p className="px-3 pb-2 pt-2 text-xs uppercase tracking-[0.16em] text-fog">Quem está assistindo?</p>
            <ul>
              {profiles.map((p) => {
                const selected = p.id === profile;
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      aria-pressed={selected}
                      onClick={() => {
                        library.setProfile(p.id);
                        setOpen(false);
                        router.push(`/${p.id}`);
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                        selected ? "bg-white/[0.06]" : "hover:bg-white/[0.04]",
                      )}
                    >
                      <ProfileBadge id={p.id} size={34} />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-snow">{p.label}</span>
                        <span className="block truncate text-xs text-fog">{p.description}</span>
                      </span>
                      {selected && <span className="size-2 rounded-full bg-caramel" aria-hidden />}
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="mt-1 border-t border-white/[0.07] pt-1">
              <Link
                href="/perfis"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-mist transition-colors hover:bg-white/[0.04] hover:text-snow"
              >
                <Settings2 size={16} aria-hidden /> Tela de perfis
              </Link>
              <p className="px-3 pb-2 pt-1 text-[0.72rem] leading-relaxed text-fog">
                O perfil só muda a ordem das sugestões. Todo o acervo fica disponível.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
