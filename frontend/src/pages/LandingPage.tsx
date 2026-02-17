import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import LandingFooter from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingNavbar />
      <main className="flex-1">
        <HeroSection />
        <HowItWorks />
        <PricingSection />
        <FAQSection />
      </main>
      <LandingFooter />
    </div>
  );
}
