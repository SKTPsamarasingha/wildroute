'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Tour } from '@/types/tours';
import { MapPin, Calendar, Users, ArrowRight, ShieldAlert } from 'lucide-react';

interface UpcomingToursProps {
  tours: Tour[];
}

export const UpcomingTours: React.FC<UpcomingToursProps> = ({ tours }) => {
  return (
    <section className="py-20 bg-[#F3EFEA] border-y border-[#E5DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C86D51]">
              Wilderness Treks & Safaris
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C2826] mt-1">
              Guided Mountain Expeditions
            </h2>
          </div>
          <Link
            href="/tours"
            className="flex items-center gap-1.5 text-xs font-bold text-[#23382B] hover:text-[#C86D51] transition mt-2 md:mt-0"
          >
            Explore All Guided Expeditions <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {tours.slice(0, 3).map((tour) => (
            <div
              key={tour.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#E5DFD5] shadow-earth shadow-earth-hover flex flex-col justify-between"
            >
              {/* Tour Image */}
              <div className="relative h-64 w-full bg-[#EAE3DA]">
                <Image src={tour.images[0]} alt={tour.title} fill className="object-cover" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-[#23382B] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                    {tour.durationDays} Days / {tour.durationDays - 1} Nights
                  </span>
                  <span className="bg-[#FAF8F5] text-[#1C2826] border border-[#E5DFD5] text-[11px] font-bold px-3 py-1 rounded-full">
                    {tour.difficulty}
                  </span>
                </div>
              </div>

              {/* Tour Info */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-xs text-[#6E8071] font-semibold mb-2">
                    <MapPin className="w-3.5 h-3.5 text-[#C86D51]" /> {tour.location}
                  </div>

                  <h3 className="text-xl font-serif font-bold text-[#1C2826] mb-2 leading-snug">
                    {tour.title}
                  </h3>

                  <p className="text-xs text-[#5C6B66] line-clamp-3 leading-relaxed mb-4">
                    {tour.description}
                  </p>

                  <div className="space-y-1.5 pt-3 border-t border-[#E5DFD5] text-xs text-[#5C6B66]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#23382B]" />
                      <span>Next Date: {tour.availableDates[0]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-[#23382B]" />
                      <span>Small Group (Max {tour.maxGroupSize} Guests)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E5DFD5] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#8E9B96] block uppercase tracking-wider font-semibold">
                      Price per Person
                    </span>
                    <span className="text-lg font-bold text-[#23382B]">
                      LKR {tour.pricePerPerson.toLocaleString()}
                    </span>
                  </div>

                  <Link
                    href={`/tours/${tour.id}`}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-[#23382B] hover:bg-[#192B20] text-white text-xs font-semibold rounded-xl transition shadow-md"
                  >
                    Book Tour
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
