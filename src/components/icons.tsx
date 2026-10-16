import { Coffee, Droplet, Pill, SunMoon, type LucideProps } from "lucide-react";
import type { Category } from "@/data/types";

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number };

const base = ({ size = 24, strokeWidth = 1.6, ...rest }: IconProps) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...rest,
});

/** Contorno de rim usado no ícone, no logotipo e nas ilustrações. */
export const KIDNEY_PATH =
  "M14.2 4.1C11.3 2.3 6.6 3.1 5.1 7.4c-1.3 3.7-.5 8.5 2.2 11.2 2.3 2.3 6 2.5 7.6.4 1-1.3.7-2.9-.3-4-.9-1-1-2.6-.1-3.7.9-1.1 2-1.7 2.1-3.3.1-1.6-1-3-2.4-3.9Z";

export function KidneyIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d={KIDNEY_PATH} />
      <path d="M14.9 12.6c1.7.2 3.2 1.4 3.6 3.3l.6 4.6" />
      <path d="M11.2 9.6c-1 1.1-1 3.5.2 4.6" opacity=".55" />
    </svg>
  );
}

/** Perfil Paciente: rim + cuidado. */
export function PatientIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d={KIDNEY_PATH} />
      <path d="M14.9 12.6c1.7.2 3.2 1.4 3.6 3.3l.6 4.6" />
      <path d="M9.9 12.9c-.9-.7-1.8-1.4-1.8-2.3 0-.6.5-1.1 1.1-1.1.3 0 .6.2.7.4.1-.2.4-.4.7-.4.6 0 1.1.5 1.1 1.1 0 .9-.9 1.6-1.8 2.3Z" />
    </svg>
  );
}

/** Perfil Residente: estetoscópio. */
export function ResidentIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 3.5H4a1 1 0 0 0-1 1V9a5 5 0 0 0 10 0V4.5a1 1 0 0 0-1-1h-1" />
      <path d="M8 14v1.5a5.5 5.5 0 0 0 11 0V13" />
      <circle cx="19" cy="10.5" r="2.5" />
    </svg>
  );
}

/** Perfil Curioso: lupa com interrogação. */
export function CuriousIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.3 15.3 5.2 5.2" />
      <path d="M8.7 8.9a1.9 1.9 0 1 1 2.8 1.7c-.6.3-1 .8-1 1.4v.3" />
      <path d="M10.5 14.1h.01" strokeWidth={2.2} />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" strokeWidth={2.4} />
    </svg>
  );
}

/** Xícara do quadro "Cafezinho com a Nefro". */
export function CoffeeCupIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 10h12v3.5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V10Z" />
      <path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H15" />
      <path d="M3 21h15" />
      <path d="M8 3.5c-.6.8.6 1.7 0 2.5M11.5 3.5c-.6.8.6 1.7 0 2.5" opacity=".7" />
    </svg>
  );
}

export function CategoryIcon({
  icon,
  ...props
}: { icon: Category["icon"] } & Omit<LucideProps, "ref">) {
  switch (icon) {
    case "kidney":
      return <KidneyIcon size={props.size as number} strokeWidth={props.strokeWidth as number} className={props.className} />;
    case "droplet":
      return <Droplet aria-hidden {...props} />;
    case "cup":
      return <Coffee aria-hidden {...props} />;
    case "sun-moon":
      return <SunMoon aria-hidden {...props} />;
    case "pill":
      return <Pill aria-hidden {...props} />;
  }
}
