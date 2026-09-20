import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Tour } from "@/types/tours";
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "../animations/MagneticButton";

interface TourEditorialCardProps {
  tour: Tour;
}

export const TourEditorialCard: React.FC<TourEditorialCardProps> = ({
  tour,
}) => {
  return (
    <div className="tour-card-discrete tour-editorial-card group bg-white text-[#0C1A14] flex h-full flex-col justify-between border-2 border-[#0C1A14] relative overflow-hidden transition-colors hover:border-[#F3CE32]">
      {/* Header Metadata Band */}
      <div className="flex justify-between items-center px-4 py-3 border-b-2 border-[#0C1A14] bg-white z-10 relative">
        <span className="card-meta text-[10px] font-black uppercase tracking-widest text-[#0C1A14]">
          {tour.location}
        </span>
        <span className="card-meta text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-[#F3CE32] text-[#0C1A14] border border-[#0C1A14]">
          {tour.difficulty}
        </span>
      </div>

      {/* Media Block */}
      <Link
        href={`/tours/${tour.id}`}
        className="card-media-wrapper relative aspect-square w-full bg-[#EAEBE3] overflow-hidden border-b-2 border-[#0C1A14] block"
      >
        <Image
          src={tour.images[0]}
          alt={tour.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </Link>

      {/* Content Block */}
      <div className="flex flex-col flex-1 bg-white relative z-10">
        <div className="p-6 flex-1">
          <div className="text-[10px] font-black uppercase tracking-widest text-[#0C1A14]/50 mb-3 flex items-center justify-between">
            <span>{tour.availableDates[0] || "TBA"}</span>
            <span>{tour.durationDays} DAYS</span>
          </div>

          <Link href={`/tours/${tour.id}`}>
            <h3 className="font-serif font-black text-2xl uppercase tracking-tight text-[#0C1A14] leading-[1.1] mb-4 group-hover:text-[#0C1A14]/70 transition-colors">
              {tour.title}
              <span className="card-underline mt-2 bg-[#0C1A14]" />
            </h3>
          </Link>

          <p className="text-xs font-medium text-[#0C1A14]/70 line-clamp-2 leading-relaxed">
            {tour.description}
          </p>
        </div>

        {/* Price & Action Band */}
        <div className="tour-cart-panel border-t-2 border-[#0C1A14] flex mt-auto">
          <div className="flex-1 p-4 flex flex-col justify-center border-r-2 border-[#0C1A14] bg-white">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#0C1A14]/50 block">
              Cost Per Guest
            </span>
            <span className="card-price text-lg font-black text-[#0C1A14] tracking-tighter">
              LKR {tour.pricePerPerson.toLocaleString()}
            </span>
          </div>

          <Link
            href={`/tours/${tour.id}`}
            className="motion-magnetic flex-shrink-0 flex items-center justify-center p-6 bg-[#0C1A14] text-white hover:bg-[#F3CE32] hover:text-[#0C1A14] transition-colors relative overflow-hidden"
            data-magnetic-strength="0.18"
          >
            {/* We target this inner wrapper for GSAP text-shift */}
            <span className="flex items-center transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRight className="w-6 h-6 stroke-[2.5]" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};
