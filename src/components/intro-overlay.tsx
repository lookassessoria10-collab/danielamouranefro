import kidneyLeft from "@/assets/brand/intro-kidney-left.webp";
import kidneyRight from "@/assets/brand/intro-kidney-right.webp";
import play from "@/assets/brand/intro-play.webp";
import wordmark from "@/assets/brand/intro-wordmark.webp";

/**
 * Abertura do Nefroflix com as peças do logotipo oficial
 * (rim esquerdo, rim direito, play e a palavra), animadas só com CSS.
 *
 * Quem decide tocar, pular e encerrar é o script do <head> (app/layout.tsx):
 * a abertura cobre a tela desde a primeira pintura, uma vez por sessão,
 * sem depender do carregamento do React.
 */
export function IntroOverlay() {
  return (
    <div className="nf-intro">
      <div className="nf-intro__logo" role="img" aria-label="Nefroflix">
        <span className="nf-intro__glow" aria-hidden />
        {/* eslint-disable-next-line @next/next/no-img-element -- peças estáticas, já otimizadas */}
        <img src={kidneyLeft.src} alt="" loading="lazy" decoding="async" className="nf-intro__part nf-intro__part--symbol nf-intro__part--kidney-left" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={kidneyRight.src} alt="" loading="lazy" decoding="async" className="nf-intro__part nf-intro__part--symbol nf-intro__part--kidney-right" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={play.src} alt="" loading="lazy" decoding="async" className="nf-intro__part nf-intro__part--symbol nf-intro__part--play" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={wordmark.src} alt="" loading="lazy" decoding="async" className="nf-intro__part nf-intro__part--wordmark" />
      </div>
      <button type="button" className="nf-intro__skip">
        Pular abertura
      </button>
    </div>
  );
}
