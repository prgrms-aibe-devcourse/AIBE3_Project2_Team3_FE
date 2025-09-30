import { CTASection } from "@/components/cta-section";
import { FeaturesSection } from "@/components/features-section";
import { HeroSection } from "@/components/hero-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { TestimonialsSection } from "@/components/testimonials-section";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CTASection />
      </main>
    </div>
  );
}
