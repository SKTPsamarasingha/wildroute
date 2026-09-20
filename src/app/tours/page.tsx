"use client";

import React, { useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Tour } from "@/types/tours";
import { getTours } from "@/services/tourService";
import Image from "next/image";
import Link from "next/link";
import { TourEditorialCard } from "@/components/ui/TourEditorialCard";
import {
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  Star,
  Compass,
  SlidersHorizontal,
  ChevronDown,
  LayoutGrid,
  LayoutList,
  Search,
  X,
  RotateCcw,
  Filter,
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { animateTourFilterPanelElement } from "@/components/animations/gsap-orchestrator";

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Layout Controls
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterPanelRef = useRef<HTMLElement>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter States
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [minDays, setMinDays] = useState<number>(0);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<
    "featured" | "price-low" | "price-high" | "duration" | "rating"
  >("featured");

  useEffect(() => {
    getTours().then((data) => {
      setTours(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!isFilterOpen || !filterPanelRef.current) return;
    return animateTourFilterPanelElement(filterPanelRef.current);
  }, [isFilterOpen]);

  const activeFilterCount =
    (filterDifficulty !== "all" ? 1 : 0) +
    (searchQuery.trim() !== "" ? 1 : 0) +
    (maxPrice < 100000 ? 1 : 0) +
    (minDays > 0 ? 1 : 0) +
    (minRating > 0 ? 1 : 0);

  const resetFilters = () => {
    setFilterDifficulty("all");
    setSearchQuery("");
    setMaxPrice(100000);
    setMinDays(0);
    setMinRating(0);
    setSortBy("featured");
  };

  const filteredTours = tours
    .filter((t) => {
      const matchDiff =
        filterDifficulty === "all" ||
        t.difficulty.toLowerCase() === filterDifficulty.toLowerCase();
      const matchSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPrice = t.pricePerPerson <= maxPrice;
      const matchDays = minDays === 0 || t.durationDays >= minDays;
      const matchRating = !minRating || (t.rating || 0) >= minRating;
      return matchDiff && matchSearch && matchPrice && matchDays && matchRating;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.pricePerPerson - b.pricePerPerson;
      if (sortBy === "price-high") return b.pricePerPerson - a.pricePerPerson;
      if (sortBy === "duration") return a.durationDays - b.durationDays;
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });

  return (
    <div className="min-h-screen flex flex-col bg-[#0C1A14] text-[#F8F9F5]">
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Expedition Banner Header */}
        <div className="mb-10 mt-14 bg-[#F3CE32] text-[#0C1A14] rounded-none p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#0C1A14] text-[#F3CE32] rounded-none text-xs font-black uppercase tracking-widest">
              <Compass className="w-4 h-4 text-[#F3CE32]" /> Guided Mountain
              Expeditions
            </span>
            <h1 className="text-4xl sm:text-6xl font-serif font-black uppercase tracking-tight leading-none">
              <span className="hero-title-line">
                <span className="hero-serif-slide">
                  Trek Sri Lanka’s Untamed Peaks
                </span>
              </span>
            </h1>
            <p className="text-sm sm:text-base text-[#0C1A14]/80 font-bold leading-relaxed">
              Explore UNESCO cloud forests, high summits, and river valleys led
              by certified wilderness first-responder guides. All camping
              equipment, permits, and meals provided.
            </p>
          </div>
          <div className="hero-cinematic-mask absolute right-0 top-0 bottom-0 w-1/3 opacity-30 pointer-events-none hidden lg:block mix-blend-multiply grayscale">
            <Image
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"
              alt=""
              fill
              className="hero-cinematic-img object-cover z-100"
            />
          </div>
        </div>

        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between py-4 mb-8 border-y border-white/10 gap-4">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`motion-magnetic flex items-center gap-2.5 px-6 py-3 rounded-none border text-xs font-black uppercase tracking-widest transition ${
              isFilterOpen
                ? "bg-[#F3CE32] text-black border-[#F3CE32]"
                : "bg-transparent text-white border-white/20 hover:bg-white/5"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>FILTER</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-none bg-black text-[#F3CE32] text-[10px] font-bold flex items-center justify-center ml-1">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest">
            <span className="text-white/60 hidden sm:inline">
              {filteredTours.length}{" "}
              {filteredTours.length === 1 ? "expedition" : "expeditions"}
            </span>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="appearance-none py-3 pl-4 pr-10 bg-transparent border border-white/20 rounded-none text-xs font-black text-white uppercase tracking-widest form-field cursor-pointer"
              >
                <option value="featured" className="text-black">
                  Featured First
                </option>
                <option value="price-low" className="text-black">
                  Price: Low to High
                </option>
                <option value="price-high" className="text-black">
                  Price: High to Low
                </option>
                <option value="duration" className="text-black">
                  Duration: Shortest
                </option>
                <option value="rating" className="text-black">
                  Highest Rated
                </option>
              </select>
              <ChevronDown className="w-4 h-4 text-white/50 absolute right-3 top-3 pointer-events-none" />
            </div>

            <div className="flex items-center p-1 bg-transparent border border-white/20 rounded-none gap-1">
              <button
                onClick={() => setViewMode("list")}
                title="List View"
                className={`p-2 rounded-none transition ${
                  viewMode === "list"
                    ? "bg-white text-black"
                    : "text-white/50 hover:text-white"
                }`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                title="Grid View"
                className={`p-2 rounded-none transition ${
                  viewMode === "grid"
                    ? "bg-white text-black"
                    : "text-white/50 hover:text-white"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Layout Container */}
        <div
          className={`flex items-start relative ${
            isFilterOpen ? "gap-8" : "gap-0"
          }`}
        >
          {/* FILTER SIDE PANEL */}
          <aside
            ref={filterPanelRef}
            aria-hidden={!isFilterOpen}
            className={`tour-filter-panel bg-[#0C1A14] rounded-none border border-white/20 shrink-0 space-y-8 transition-all duration-300 ease-out overflow-hidden ${
              isFilterOpen
                ? "pointer-events-auto opacity-100 translate-x-0 w-full lg:w-72 max-w-[18rem] p-6 border-white/20"
                : "pointer-events-none opacity-0 -translate-x-4 w-0 lg:w-0 max-w-0 p-0 border-transparent"
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2 text-white">
                <SlidersHorizontal className="w-4 h-4 text-[#F3CE32]" />
                <h2 className="font-serif font-bold text-xl uppercase tracking-widest">
                  Refine
                </h2>
              </div>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-1 rounded-none text-white/50 hover:bg-white/10 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Keyword Search */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#F3CE32]">
                Search Expedition
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-white/50" />
                <input
                  type="text"
                  placeholder="Knuckles, Peak..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-field w-full pl-9 pr-3 py-3 bg-transparent border border-white/20 rounded-none text-xs font-bold text-white focus:outline-none placeholder:text-white/30 uppercase tracking-widest"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-3 text-white/50 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#F3CE32]">
                Difficulty Level
              </label>
              <div className="space-y-2">
                {["all", "easy", "moderate", "challenging"].map((diff) => {
                  const count = tours.filter(
                    (t) =>
                      diff === "all" || t.difficulty.toLowerCase() === diff,
                  ).length;
                  return (
                    <button
                      key={diff}
                      onClick={() => setFilterDifficulty(diff)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-none text-[10px] uppercase tracking-widest font-bold transition ${
                        filterDifficulty === diff
                          ? "bg-[#F3CE32] text-black"
                          : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span>{diff}</span>
                      <span>({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between text-[10px]">
                <label className="font-black uppercase tracking-widest text-[#F3CE32]">
                  Max Price / Person
                </label>
                <span className="font-bold text-white">
                  LKR {maxPrice.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="15000"
                max="100000"
                step="5000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#F3CE32] cursor-pointer"
              />
            </div>

            {/* Duration Filter */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#F3CE32]">
                Min Duration
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[0, 2, 3].map((daysVal) => (
                  <button
                    key={daysVal}
                    onClick={() => setMinDays(daysVal)}
                    className={`px-2 py-2.5 rounded-none text-[10px] font-bold uppercase tracking-widest text-center transition ${
                      minDays === daysVal
                        ? "bg-[#F3CE32] text-black"
                        : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {daysVal === 0 ? "Any" : `${daysVal}+ D`}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Action */}
            {activeFilterCount > 0 && (
              <div className="pt-6 border-t border-white/10">
                <button
                  onClick={resetFilters}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-white/20 hover:bg-white/5 text-white rounded-none text-xs font-black uppercase tracking-widest transition"
                >
                  <RotateCcw className="w-4 h-4 text-[#F3CE32]" /> Clear Filters
                </button>
              </div>
            )}
          </aside>

          {/* TOUR EXPEDITIONS DISPLAY AREA */}
          <div className="flex-1 w-full">
            {loading ? (
              <LoadingSpinner label="Loading tour expeditions..." fullPage />
            ) : filteredTours.length === 0 ? (
              <div className="bg-transparent rounded-none border border-white/20 p-16 text-center">
                <Filter className="w-12 h-12 mx-auto stroke-1 mb-4 text-white/30" />
                <p className="font-serif text-2xl font-bold text-white uppercase tracking-widest">
                  No matching expeditions
                </p>
                <p className="text-sm mt-2 text-white/50">
                  Adjust filters to see more results.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-6 px-6 py-3 bg-[#F3CE32] text-black font-black uppercase tracking-widest text-xs rounded-none transition"
                >
                  Clear All Filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              /* GRID VIEW DISPLAY */
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
                {filteredTours.map((tour) => (
                  <div key={tour.id} className="tour-card-discrete h-full">
                    <TourEditorialCard tour={tour} />
                  </div>
                ))}
              </div>
            ) : (
              /* LIST VIEW DISPLAY */
              <div className="space-y-6">
                {filteredTours.map((tour) => (
                  <div
                    key={tour.id}
                    className="bg-white text-black rounded-none p-5 flex flex-col lg:flex-row items-center gap-8"
                  >
                    <div className="relative w-full lg:w-72 h-56 bg-[#EAEBE3] rounded-none overflow-hidden shrink-0">
                      <Image
                        src={tour.images[0]}
                        alt={tour.title}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute top-3 left-3 bg-[#F3CE32] text-black text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-none">
                        {tour.difficulty}
                      </span>
                    </div>

                    <div className="flex-1 space-y-3 w-full py-2">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-black/50 card-meta">
                          <MapPin className="w-3.5 h-3.5 text-[#F3CE32]" />{" "}
                          {tour.location}
                        </span>
                        {tour.rating && (
                          <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-black font-black">
                            <Star className="w-3.5 h-3.5 fill-[#F3CE32] text-[#F3CE32]" />{" "}
                            {tour.rating} ({tour.reviewCount || 0})
                          </span>
                        )}
                      </div>

                      <Link href={`/tours/${tour.id}`}>
                        <h3 className="font-serif font-black text-3xl uppercase tracking-tight text-black hover:text-black/70 transition leading-none">
                          {tour.title}
                        </h3>
                      </Link>

                      <p className="text-xs text-black/70 font-medium line-clamp-2 leading-relaxed max-w-2xl">
                        {tour.description}
                      </p>

                      <div className="pt-4 mt-4 border-t border-black/10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] text-black/50 block uppercase tracking-widest font-black">
                            {tour.durationDays} Days • Max {tour.maxGroupSize}{" "}
                            Guests
                          </span>
                          <span className="text-2xl font-black text-black card-price">
                            LKR {tour.pricePerPerson.toLocaleString()}
                          </span>
                        </div>

                        <Link
                          href={`/tours/${tour.id}`}
                          className="motion-magnetic flex items-center justify-center gap-2 px-8 py-3 bg-black hover:bg-[#F3CE32] hover:text-black text-white rounded-none text-[10px] uppercase tracking-widest font-black transition"
                        >
                          Book Expedition <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
