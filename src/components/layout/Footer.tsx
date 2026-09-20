"use client";

import React from "react";
import Image from "next/image";
import { ArrowDownRight } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#EAEBE3] text-[#0C1A14] pt-32 pb-16 px-6 md:px-12 relative overflow-hidden flex flex-col items-center">
      <div className="w-full relative flex justify-center mb-24">
        <h2 className="font-serif font-black text-[8rem] md:text-[15rem] lg:text-[22rem] leading-none tracking-tighter text-center">
          <span className="hero-title-line">
            <span className="hero-serif-slide">Wildroute</span>
          </span>
        </h2>
        
      </div>

      <div className="w-full h-px bg-[#0C1A14]/20 mb-12" />

      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mt-12 relative z-10">
        <div className="max-w-sm">
          <h3 className="font-serif text-[#F3CE32] text-2xl md:text-4xl font-bold uppercase leading-none mb-2">
            Adventure
            <br />
            <span className="text-[#0C1A14]">Spotlight</span>
            <br />
            <span className="text-[#0C1A14]">Trail</span>
          </h3>
          <p className="text-[10px] font-medium leading-relaxed mt-4">
            WildRoute Adventure masterclass allows you free access to explore a
            vibrant nature inspired energy page that highlights true trails,
            activities, and memorable moments.
          </p>
        </div>

        <div className="w-full max-w-xs">
          <p className="text-[#F3CE32] text-xs font-bold uppercase tracking-widest mb-4">
            Newsletter
          </p>
          <div className="flex border-b border-[#0C1A14]/30 pb-2 form-field">
            <input
              type="email"
              placeholder="Email address..."
              className="form-field bg-transparent w-full outline-none text-sm placeholder:text-[#0C1A14]/50 border-0"
            />
            <button
              type="button"
              className="motion-magnetic"
              data-magnetic-strength="0.2"
              aria-label="Subscribe"
            >
              <ArrowDownRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
