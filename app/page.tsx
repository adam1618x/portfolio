'use client';

import { Hero } from "@/src/components/Hero"
import { Experience } from "@/src/components/Experience"
import { About } from "@/src/components/AboutMe"
import { Skills } from "@/src/components/Skills"
import { Projects } from "@/src/components/Projects"
import { Certificates } from "@/src/components/Certificates"
import { AIAssistant } from "@/src/components/AiAssistant"
import { Contact } from "@/src/components/Contact"
import { Navigation } from "@/src/components/Navigation"
import { BackgroundEffects } from "@/src/components/BackgroundEffects"
import { ScrollToTop } from "@/src/components/ScrollToTop"
import { ShootingStars } from "@/src/components/ShootingStarts";
import { Education } from "@/src/components/Education";
import { Footer } from "@/src/components/Footer";

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      <BackgroundEffects />
      <Navigation />
      <main className="relative z-50 px-4 sm:px-6 md:px-12 lg:px-24 xl:px-32">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Certificates />
        <Education />
        <AIAssistant />
        <Contact />
        <Footer />
      </main>
      <ShootingStars />
      <ScrollToTop />
    </div>
  )
}
