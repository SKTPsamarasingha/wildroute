"use client";

import React from "react";
import { Compass, Leaf, ShieldCheck, HeartHandshake } from "lucide-react";

export const BrandManifesto: React.FC = () => {
  return (
    <section className="py-24 bg-[#0C1A14] text-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-16">
        <div className="inline-flex items-center gap-2 p-4 bg-[#F3CE32] text-[#0C1A14] rounded-none">
          <Compass className="w-8 h-8 stroke-[1.5]" />
        </div>

        <div className="space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F3CE32]">
            Our Wilderness Manifesto
          </span>
          <h2 className="text-4xl md:text-6xl font-serif font-black uppercase leading-[0.9] tracking-tight max-w-4xl mx-auto text-white">
            <span className="hero-title-line">
              <span className="hero-serif-slide text-white">
                “We frame the wilderness with gear designed to withstand
                nature’s rawest elements.”
              </span>
            </span>
          </h2>
        </div>

        <p className="text-sm font-medium text-white/80 leading-relaxed max-w-2xl mx-auto">
          WildRoute Adventures was born out of deep respect for Sri Lanka’s
          untamed mountain ridges and rainforest trails. We build a bridge
          between social exploration and reliable digital commerce—bringing
          world-class expedition gear and guided mountain treks directly to your
          doorstep.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          <div className="p-8 bg-white text-[#0C1A14] rounded-none text-left space-y-4 flex flex-col justify-between min-h-[300px]">
            <div className="w-12 h-12 rounded-none bg-[#F3CE32] text-[#0C1A14] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-2xl uppercase leading-none mb-3 text-[#0C1A14]">
                Tested on
                <br />
                Extreme Trails
              </h3>
              <p className="text-xs font-medium leading-relaxed text-[#0C1A14] opacity-80">
                Every tent, shell jacket, and rucksack in our catalog undergoes
                real-world testing in Knuckles and Horton Plains rain
                conditions.
              </p>
            </div>
          </div>

          <div className="p-8 bg-[#F3CE32] text-[#0C1A14] rounded-none text-left space-y-4 flex flex-col justify-between min-h-[300px]">
            <div className="w-12 h-12 rounded-none bg-white text-[#0C1A14] flex items-center justify-center">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-2xl uppercase leading-none mb-3 text-[#0C1A14]">
                Leave No Trace
                <br />
                Expedition
              </h3>
              <p className="text-xs font-medium leading-relaxed text-[#0C1A14] opacity-80">
                Our guided tour teams strictly enforce Leave-No-Trace principles
                to preserve forest biodiversity for generations to come.
              </p>
            </div>
          </div>

          <div className="p-8 bg-white text-[#0C1A14] rounded-none text-left space-y-4 flex flex-col justify-between min-h-[300px]">
            <div className="w-12 h-12 rounded-none bg-[#F3CE32] text-[#0C1A14] flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-2xl uppercase leading-none mb-3 text-[#0C1A14]">
                Transparent
                <br />
                Local Commerce
              </h3>
              <p className="text-xs font-medium leading-relaxed text-[#0C1A14] opacity-80">
                Express Cash on Delivery, instant order tracking, and Mint Pay /
                Koko Pay 3-installment flexibility with zero hidden fees.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
