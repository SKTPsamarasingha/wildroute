import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RefreshCw } from "lucide-react";

export default function ReturnsPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-16 text-[#1C2826] space-y-8">
        <div className="border-b border-[#E5DFD5] pb-6">
          <div className="flex items-center gap-3 text-[#23382B] mb-2">
            <RefreshCw className="w-6 h-6" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#C86D51]">
              Exchange & Guarantee
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold">
            <span className="hero-title-line">
              <span className="hero-serif-slide">Returns & Refund Policy</span>
            </span>
          </h1>
          <div className="h-px w-full bg-[#E5DFD5] mt-6" />
        </div>

        <div className="prose prose-stone text-xs sm:text-sm text-[#5C6B66] space-y-6 leading-relaxed">
          <h3 className="font-serif font-bold text-base text-[#1C2826]">
            1. 7-Day Exchange Window
          </h3>
          <p>
            If your gear item (apparel, size variant, accessories) does not fit
            or contains a manufacturing defect, you may request an exchange
            within 7 days of receiving your order.
          </p>

          <h3 className="font-serif font-bold text-base text-[#1C2826]">
            2. Condition Requirements
          </h3>
          <p>
            Returned items must be unused, in original condition, and with all
            manufacturer tags intact.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
