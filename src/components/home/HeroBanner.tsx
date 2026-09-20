"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Compass, ShieldCheck, MapPin, Star } from "lucide-react";

export const HeroBanner: React.FC = () => {
  return (
    <section className="editorial-hero relative overflow-hidden pt-8 pb-20 lg:pt-16 lg:pb-32 bg-[#FAF8F5]">
      {/* Background soft ambient blur shapes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#EAE3DA] rounded-full filter blur-3xl opacity-60 pointer-events-none -mr-40 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#6E8071]/10 rounded-full filter blur-3xl opacity-50 pointer-events-none -ml-20 -mb-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#F3EFEA] border border-[#E5DFD5] rounded-full text-xs font-semibold text-[#23382B] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#C86D51] animate-ping" />
              <span>Wilderness Expedition & Outdoor Gear • Sri Lanka</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#1C2826] leading-[1.15] tracking-tight">
              <span className="hero-title-line">
                <span className="hero-serif-slide">
                  Frame the Wilderness with Authentic Gear & Guided Expeditions.
                </span>
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#5C6B66] max-w-2xl leading-relaxed">
              Step into Sri Lanka’s misty peaks and rainforest trails equipped
              with high-performance 4-season tents, GORE-TEX outerwear, and
              expert-led mountain treks.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/products"
                className="motion-magnetic flex items-center gap-2 px-7 py-4 bg-[#23382B] hover:bg-[#192B20] text-white text-sm font-semibold rounded-2xl shadow-xl shadow-[#23382B]/20 transition-all transform hover:-translate-y-0.5"
              >
                Shop Gear Collection
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/tours"
                className="flex items-center gap-2 px-7 py-4 bg-[#F3EFEA] hover:bg-[#EAE3DA] text-[#1C2826] border border-[#E5DFD5] text-sm font-semibold rounded-2xl transition"
              >
                <MapPin className="w-4 h-4 text-[#C86D51]" />
                Book Guided Expeditions
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-8 border-t border-[#E5DFD5] grid grid-cols-3 gap-4 max-w-lg metrics-section">
              <div>
                <span
                  className="stat-counter-isolated block text-2xl font-serif font-bold text-[#1C2826]"
                  data-target="150"
                  data-suffix="+"
                >
                  150+
                </span>
                <span className="text-xs text-[#6E8071]">Tested Products</span>
              </div>
              <div>
                <span className="block text-2xl font-serif font-bold text-[#1C2826]">
                  100%
                </span>
                <span className="text-xs text-[#6E8071]">
                  Weatherproof Quality
                </span>
              </div>
              <div>
                <span className="flex items-center gap-1 text-2xl font-serif font-bold text-[#1C2826]">
                  4.9 <Star className="w-4 h-4 fill-[#C86D51] text-[#C86D51]" />
                </span>
                <span className="text-xs text-[#6E8071]">Customer Reviews</span>
              </div>
            </div>
          </div>

          {/* Right Image Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Image Card */}
              <div className="relative h-[480px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white hero-cinematic-mask">
                <Image
                  src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80"
                  alt="WildRoute Mountain Expedition"
                  fill
                  className="hero-cinematic-img object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-xs uppercase tracking-widest text-[#E5DFD5] font-semibold">
                    Featured Trek
                  </span>
                  <h3 className="text-xl font-serif font-bold mt-1">
                    Knuckles Peak Cloud Forest Expedition
                  </h3>
                  <p className="text-xs text-neutral-200 mt-1">
                    3 Days Guided Trek • All Gear Included
                  </p>
                </div>
              </div>

              {/* Floating Organic Accent Card */}
              <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-[#E5DFD5] max-w-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F3EFEA] text-[#23382B] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1C2826]">
                    Monsoon Certified
                  </h4>
                  <p className="text-[11px] text-[#5C6B66]">
                    Rated for high altitude torrential rains
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
