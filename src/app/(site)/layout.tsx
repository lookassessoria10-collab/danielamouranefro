import { MobileNav } from "@/components/layout/mobile-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="conteudo" className="min-h-dvh">
        {children}
      </main>
      <SiteFooter />
      <MobileNav />
    </>
  );
}
