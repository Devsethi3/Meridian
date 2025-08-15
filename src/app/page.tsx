"use client";

import { ThemeToggleButton } from "@/components/ui/theme-toggle-button";
import { Header } from "@/components/Header";
import About from "@/components/About";
import HeroSection from "@/components/Hero";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Process from "@/components/Process";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Floating theme toggle */}
      <div className="fixed right-4 top-4 z-50">
        <ThemeToggleButton showLabel variant="circle-blur" start="top-right" />
      </div>

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
      </main>
    </div>
  );
}
