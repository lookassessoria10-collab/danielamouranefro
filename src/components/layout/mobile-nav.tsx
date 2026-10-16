"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, Compass, House, Search, Sparkles } from "lucide-react";
import { isActivePath, useHomeHref } from "./site-header";
import { cn } from "@/lib/utils";

/** Navegação inferior fixa, só no celular — o público chega pelo link da bio. */
export function MobileNav() {
  const pathname = usePathname();
  const home = useHomeHref();
  const items = [
    { href: home, label: "Início", icon: House, key: "home" as const },
    { href: "/explorar", label: "Explorar", icon: Compass, key: "explore" as const },
    { href: "/por-onde-comecar", label: "Descobrir", icon: Sparkles, key: "discover" as const },
    { href: "/busca", label: "Buscar", icon: Search, key: "search" as const },
    { href: "/minha-lista", label: "Minha lista", icon: Bookmark, key: "list" as const },
  ];

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.07] bg-ink/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
    >
      <ul className="grid grid-cols-5">
        {items.map(({ href, label, icon: Icon, key }) => {
          const active = isActivePath(pathname, key);
          return (
            <li key={key}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-[60px] flex-col items-center justify-center gap-1 text-[0.68rem] transition-colors",
                  active ? "text-caramel" : "text-fog active:text-snow",
                )}
              >
                <Icon size={21} strokeWidth={active ? 2.1 : 1.7} aria-hidden />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
