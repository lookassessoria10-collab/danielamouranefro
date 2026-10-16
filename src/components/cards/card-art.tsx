import { KIDNEY_PATH } from "@/components/icons";
import type { Category } from "@/data/types";
import { cn } from "@/lib/utils";

/**
 * Composição geométrica discreta de cada categoria. O `seed` (número do vídeo)
 * varia posição e rotação para que nenhum card seja idêntico ao outro.
 */
export function CardArt({
  icon,
  color,
  seed,
  className,
}: {
  icon: Category["icon"];
  color: string;
  seed: number;
  className?: string;
}) {
  const r = ((seed * 37) % 50) - 25;
  const dx = (seed * 17) % 40;
  const dy = (seed * 23) % 50;

  return (
    <svg
      viewBox="0 0 200 260"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      fill="none"
      stroke={color}
      strokeWidth={1}
    >
      {icon === "kidney" && (
        <g opacity={0.55}>
          <g transform={`translate(${70 + dx} ${40 + dy}) rotate(${r} 60 70) scale(9)`}>
            <path d={KIDNEY_PATH} vectorEffect="non-scaling-stroke" />
          </g>
          <g transform={`translate(${98 + dx} ${72 + dy}) rotate(${r} 30 40) scale(5)`} opacity={0.6}>
            <path d={KIDNEY_PATH} vectorEffect="non-scaling-stroke" strokeDasharray="2 4" />
          </g>
          <circle cx={46 + dx} cy={196 - dy / 2} r={3} fill={color} stroke="none" opacity={0.7} />
        </g>
      )}

      {icon === "droplet" && (
        <g opacity={0.5}>
          {[18, 40, 64, 92, 124].map((rx, i) => (
            <ellipse
              key={rx}
              cx={150 - dx / 2}
              cy={70 + dy}
              rx={rx}
              ry={rx * 0.42}
              opacity={1 - i * 0.16}
              strokeDasharray={i === 2 ? "3 5" : undefined}
            />
          ))}
          <path
            d={`M${150 - dx / 2} ${10 + dy}c8 14 16 22 16 32a16 16 0 0 1-32 0c0-10 8-18 16-32Z`}
            fill={color}
            fillOpacity={0.12}
          />
        </g>
      )}

      {icon === "cup" && (
        <g opacity={0.5}>
          <circle cx={136 + dx / 2} cy={66 + dy / 2} r={52} />
          <circle cx={136 + dx / 2} cy={66 + dy / 2} r={40} strokeDasharray="2 5" />
          <circle cx={96 - dx / 3} cy={120 + dy / 2} r={34} opacity={0.6} />
          <path d={`M${60 + dx} ${30 + dy / 3}c-6 8 6 14 0 22`} strokeLinecap="round" />
          <path d={`M${74 + dx} ${26 + dy / 3}c-6 8 6 14 0 22`} strokeLinecap="round" opacity={0.6} />
        </g>
      )}

      {icon === "sun-moon" && (
        <g opacity={0.5}>
          <path d={`M${40 + dx / 2} ${150 - dy / 3}a70 70 0 0 1 140 0`} />
          <path d={`M${62 + dx / 2} ${150 - dy / 3}a48 48 0 0 1 96 0`} strokeDasharray="2 5" />
          <line x1={0} x2={200} y1={150 - dy / 3} y2={150 - dy / 3} opacity={0.6} />
          <path
            d={`M${150 - dx} ${34 + dy / 2}a18 18 0 1 0 14 30a14 14 0 1 1-14-30Z`}
            fill={color}
            fillOpacity={0.12}
          />
        </g>
      )}

      {icon === "pill" && (
        <g opacity={0.5}>
          <g transform={`rotate(${-30 + r} ${130 + dx / 2} ${80 + dy / 2})`}>
            <rect x={90 + dx / 2} y={62 + dy / 2} width={84} height={36} rx={18} />
            <line x1={132 + dx / 2} x2={132 + dx / 2} y1={62 + dy / 2} y2={98 + dy / 2} />
          </g>
          <g transform={`rotate(${40 - r} ${70} ${150 + dy / 3})`} opacity={0.6}>
            <rect x={40} y={138 + dy / 3} width={60} height={26} rx={13} strokeDasharray="3 4" />
          </g>
          <circle cx={170 - dx} cy={170 - dy / 3} r={8} fill={color} fillOpacity={0.15} />
        </g>
      )}
    </svg>
  );
}
