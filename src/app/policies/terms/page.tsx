import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShieldCheck } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-16 text-[#1C2826] space-y-8">
        <div className="border-b border-[#E5DFD5] pb-6">
          <div className="flex items-center gap-3 text-[#23382B] mb-2">
            <ShieldCheck className="w-6 h-6" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#C86D51]">
              Legal Terms
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold">
            <span className="hero-title-line">
              <span className="hero-serif-slide">Terms of Service</span>
            </span>
          </h1>
          <div className="h-px w-full bg-[#E5DFD5] mt-6" />
        </div>

        <div className="prose prose-stone text-xs sm:text-sm text-[#5C6B66] space-y-6 leading-relaxed">
          <h3 className="font-serif font-bold text-base text-[#1C2826]">
            1. Terms of Use
          </h3>
          <p>
            By accessing WildRoute Adventures web platform, placing physical
            product orders, or booking guided expedition tours, you agree to
            comply with our general commercial terms.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
