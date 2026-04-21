import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import Templates from "@/components/landing/Templates";
import StatsBand from "@/components/landing/StatsBand";
import Testimonials from "@/components/landing/Testimonials";
import CtaBanner from "@/components/landing/CtaBanner";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="flex flex-col min-h-full" style={{ backgroundColor: "#0d0e12" }}>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Templates />
      <StatsBand />
      <Testimonials />
      <CtaBanner />
      <Footer />
    </main>
  );
}
