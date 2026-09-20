import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Truck } from "lucide-react";

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-16 text-[#1C2826] space-y-8">
        <div className="border-b border-[#E5DFD5] pb-6">
          <div className="flex items-center gap-3 text-[#23382B] mb-2">
            <Truck className="w-6 h-6" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#C86D51]">
              Shipping & Logistics
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold">
            <span className="hero-title-line">
              <span className="hero-serif-slide">Shipping Policy</span>
            </span>
          </h1>
          <div className="h-px w-full bg-[#E5DFD5] mt-6" />
        </div>

        <div className="prose prose-stone text-xs sm:text-sm text-[#5C6B66] space-y-6 leading-relaxed">
          <h3 className="font-serif font-bold text-base text-[#1C2826]">
            1. Island-Wide Delivery Coverage
          </h3>
          <p>
            We deliver physical gear and expedition packages to all districts
            across Sri Lanka via our trusted courier partners. Deliveries to
            major urban centers (Colombo, Kandy, Galle) typically arrive within
            2–3 business days.
          </p>

          <h3 className="font-serif font-bold text-base text-[#1C2826]">
            2. Shipping Rates & Free Thresholds
          </h3>
          <p>
            Orders totaling LKR 25,000 or above qualify for FREE island-wide
            standard courier shipping. Standard courier delivery for orders
            below LKR 25,000 is charged at a flat rate of LKR 600.
          </p>

          <h3 className="font-serif font-bold text-base text-[#1C2826]">
            3. Cash on Delivery (COD) Processing
          </h3>
          <p>
            For Cash on Delivery orders, our logistics team may place a
            verification phone call or send a WhatsApp confirmation prior to
            dispatch.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
