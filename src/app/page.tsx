"use client";

import { Header } from "@/components/Header";
import About from "@/components/About";
import HeroSection from "@/components/Hero";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Process from "@/components/Process";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <Header />

      <main>
        {/* Hero */}
        <HeroSection />

        {/* About */}
        <About />

        {/* Features */}
        <Features />

        {/* How it works */}
        <Process />

        {/* CTA */}
        <CTA />

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}
