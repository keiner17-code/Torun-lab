import type { Metadata } from "next";
import "./landing.css";
import { LandingProvider } from "@/components/landing/LandingProvider";
import { RevealEffects } from "@/components/landing/RevealEffects";
import { IconSprite } from "@/components/landing/IconSprite";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingHero } from "@/components/landing/LandingHero";
import { DolorSection } from "@/components/landing/DolorSection";
import { SimuladorSection } from "@/components/landing/SimuladorSection";
import { ComoFuncionaSection } from "@/components/landing/ComoFuncionaSection";
import { AutomatizamosSection } from "@/components/landing/AutomatizamosSection";
import { PorQueTorunSection } from "@/components/landing/PorQueTorunSection";
import { FormularioSection } from "@/components/landing/FormularioSection";
import { BannerFooter } from "@/components/landing/BannerFooter";

export const metadata: Metadata = {
  title: "Torún — El AI Partner de tu negocio",
  description:
    "Torun automatiza los procesos que te roban tiempo. Tú diriges el negocio, nosotros hacemos el trabajo repetitivo.",
};

export default function LandingPage() {
  return (
    <LandingProvider>
      <link rel="stylesheet" href="https://use.typekit.net/twb6wjb.css" />
      <div
        className="trn-root"
        style={{
          background: "#050505",
          color: "#f2f2f0",
          fontFamily: "proxima-nova,halyard-text-variable,sans-serif",
          overflowX: "hidden",
          minHeight: "100vh",
        }}
      >
        <IconSprite />
        <RevealEffects />

        <div id="trn-progress" style={{ position: "fixed", top: 0, left: 0, height: 2, width: "0%", background: "#c6ff34", zIndex: 200, boxShadow: "0 0 14px rgba(198,255,52,.9)", pointerEvents: "none" }} />

        <LandingNav />
        <LandingHero />
        <DolorSection />
        <SimuladorSection />
        <ComoFuncionaSection />
        <AutomatizamosSection />
        <PorQueTorunSection />
        <FormularioSection />
        <BannerFooter />
      </div>
    </LandingProvider>
  );
}
