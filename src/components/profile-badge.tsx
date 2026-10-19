import { CuriousIcon, PatientIcon, ResidentIcon } from "./icons";
import { getProfile } from "@/data/profiles";
import type { ProfileId } from "@/data/types";
import { cn } from "@/lib/utils";

const ICONS = { paciente: PatientIcon, residente: ResidentIcon, curioso: CuriousIcon };

export function ProfileGlyph({ id, size = 24, strokeWidth }: { id: ProfileId; size?: number; strokeWidth?: number }) {
  const Icon = ICONS[id];
  return <Icon size={size} strokeWidth={strokeWidth} />;
}

/** Selo circular do perfil (cabeçalho, menus). */
export function ProfileBadge({ id, className, size = 32 }: { id: ProfileId; className?: string; size?: number }) {
  const profile = getProfile(id);
  return (
    <span
      className={cn("inline-grid shrink-0 place-items-center rounded-full", className)}
      style={{
        width: size,
        height: size,
        color: profile.color,
        background: `color-mix(in oklab, ${profile.color} 16%, var(--color-surface))`,
        boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${profile.color} 40%, transparent)`,
      }}
    >
      <ProfileGlyph id={id} size={Math.round(size * 0.56)} strokeWidth={1.8} />
    </span>
  );
}
