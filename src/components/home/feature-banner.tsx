import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Banner } from "@/data/profiles";
import type { PhotoKey } from "@/data/types";
import { photos } from "@/lib/photos";
import { cn } from "@/lib/utils";

/**
 * Banner intermediário: fotografia real da Dra. Daniela integrada ao bloco,
 * com uma chamada curta e um único botão.
 */
export function FeatureBanner({
  banner,
  photo: photoKey,
  reverse = false,
  headingLevel = "h2",
}: {
  banner: Banner;
  photo: PhotoKey;
  reverse?: boolean;
  headingLevel?: "h2" | "h3";
}) {
  const photo = photos[photoKey];
  const Heading = headingLevel;
  return (
    <section className="reveal shell py-6 md:py-10">
      <div className="relative isolate overflow-hidden rounded-[28px] bg-brown-deep">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background: "radial-gradient(90% 120% at 0% 100%, rgb(232 106 0 / 0.28), transparent 60%), linear-gradient(120deg, #3a1c12, #231d1a 65%)",
          }}
        />
        <div className={cn("grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]", reverse && "md:[&>*:first-child]:order-2")}>
          <div className="relative z-10 flex flex-col justify-center p-6 sm:p-10 lg:p-14">
            <p className="eyebrow text-orange-bright">{banner.eyebrow}</p>
            <Heading className="mt-3 text-display text-[2.1rem] text-snow sm:text-[2.8rem] lg:text-[3.2rem]">{banner.title}</Heading>
            <p className="mt-4 max-w-md text-[1.02rem] leading-relaxed text-mist">{banner.text}</p>
            <Link
              href={banner.cta.href}
              className="mt-7 inline-flex h-12 w-fit items-center gap-2 rounded-full bg-orange px-6 font-bold text-ink transition-colors hover:bg-orange-bright"
            >
              {banner.cta.label} <ArrowRight size={18} aria-hidden />
            </Link>
          </div>
          <div className="relative -order-1 aspect-[4/3] md:order-none md:aspect-auto md:min-h-[400px]">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 768px) 52vw, 100vw"
              placeholder="blur"
              className="object-cover [object-position:var(--pos-m)] md:[object-position:var(--pos)]"
              style={{ "--pos": photo.position, "--pos-m": photo.mobilePosition } as React.CSSProperties}
            />
            <div
              aria-hidden
              className={cn(
                "absolute inset-0 bg-gradient-to-t from-brown-deep via-transparent to-transparent",
                reverse ? "md:bg-gradient-to-l md:from-[#2c1710] md:via-transparent" : "md:bg-gradient-to-r md:from-[#2c1710] md:via-transparent",
              )}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
