'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { INITIAL_CATEGORIES } from '@/services/productService';
import { ArrowUpRight } from 'lucide-react';

export const CategoryGrid: React.FC = () => {
  return (
    <section className="py-16 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C86D51]">
              Curated Collections
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C2826] mt-1">
              Explore by Category
            </h2>
          </div>
          <p className="text-sm text-[#5C6B66] max-w-md mt-2 md:mt-0">
            Engineered for high mobility, weather resistance, and long-lasting performance on tropical and alpine terrains.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INITIAL_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative h-80 rounded-2xl overflow-hidden shadow-earth shadow-earth-hover border border-[#E5DFD5] bg-white flex flex-col justify-end p-6"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C2826]/90 via-[#1C2826]/30 to-transparent"></div>

              <div className="relative z-10 text-white">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-serif font-bold group-hover:text-[#F3EFEA] transition">
                    {cat.name}
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-[#C86D51] transition">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-xs text-neutral-300 line-clamp-2">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
