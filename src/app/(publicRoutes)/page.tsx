import { CtaSection } from "@/components/Home/CtaSection";
import { FeaturesSection } from "@/components/Home/FeaturesSection";
import { HeroSection } from "@/components/Home/HeroSection";
import { HowItWorksSection } from "@/components/Home/HowItWorksSection";
import { PopularRoutesSection } from "@/components/Home/PopularRoutesSection";
import { StatsSection } from "@/components/Home/StatsSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <PopularRoutesSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CtaSection />
    </>
  );
}
