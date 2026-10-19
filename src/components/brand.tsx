import Image from "next/image";
import logoDark from "@/assets/brand/nefroflix-logo-dark.png";
import logoLight from "@/assets/brand/nefroflix-logo.png";
import { cn } from "@/lib/utils";

/**
 * Logotipo oficial do Nefroflix (arquivo enviado pela equipe).
 * - "dark": versão negativa para fundos escuros (só o "Nefro" fica creme).
 * - "light": cores originais, para fundos claros.
 */
export function Logo({
  tone = "dark",
  className,
  priority = false,
}: {
  tone?: "dark" | "light";
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={tone === "dark" ? logoDark : logoLight}
      alt="Nefroflix"
      priority={priority}
      sizes="(min-width: 768px) 180px, 140px"
      className={cn("h-7 w-auto select-none md:h-8", className)}
    />
  );
}
