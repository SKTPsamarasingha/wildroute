import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BrandManifesto } from "@/components/home/BrandManifesto";
import { Compass, ShieldCheck, MapPin, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0C1A14] text-[#F8F9F5]">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-4xl mx-auto space-y-6 mb-24">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F3CE32]">
              WildRoute Brand Manifesto
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-black text-white uppercase leading-[0.9] tracking-tight">
              <span className="hero-title-line">
                <span className="hero-serif-slide">
                  Equipping Explorers Across Sri Lanka’s Wild Trails
                </span>
              </span>
            </h1>
            <p className="text-sm font-medium text-white/80 leading-relaxed max-w-2xl mx-auto mt-8">
              WildRoute Adventures was founded with a clear vision: to empower
              outdoor enthusiasts with weather-tested expedition equipment and
              authentic guided treks that celebrate natural beauty.
            </p>
          </div>

          <BrandManifesto />

          <section className="metrics-section mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="border border-white/15 p-8">
              <div className="h-px w-full bg-[#F3CE32] mb-6" />
              <p
                className="stat-counter-isolated font-serif text-5xl font-black text-[#F3CE32]"
                data-target="230"
                data-suffix="+"
              >
                230+
              </p>
              <p className="card-meta mt-3 text-[10px] font-black uppercase tracking-widest text-white/60">
                Completed Events
              </p>
            </div>
            <div className="border border-white/15 p-8">
              <div className="h-px w-full bg-[#F3CE32] mb-6" />
              <p
                className="stat-counter-isolated font-serif text-5xl font-black text-[#F3CE32]"
                data-target="300"
                data-suffix="+"
              >
                300+
              </p>
              <p className="card-meta mt-3 text-[10px] font-black uppercase tracking-widest text-white/60">
                Community Members
              </p>
            </div>
            <div className="border border-white/15 p-8">
              <div className="h-px w-full bg-[#F3CE32] mb-6" />
              <p
                className="stat-counter-isolated font-serif text-5xl font-black text-[#F3CE32]"
                data-target="48"
                data-suffix=""
              >
                48
              </p>
              <p className="card-meta mt-3 text-[10px] font-black uppercase tracking-widest text-white/60">
                Guided Expeditions
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
