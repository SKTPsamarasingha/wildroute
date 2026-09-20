"use client";

import React, { useEffect, useState, use } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Product } from "@/types/ecommerce";
import { getProducts, INITIAL_CATEGORIES } from "@/services/productService";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { GearEditorialCard } from "@/components/ui/GearEditorialCard";
import {
  Search,
  Filter,
  ShoppingBag,
  Star,
  Eye,
  SlidersHorizontal,
  ChevronDown,
  LayoutGrid,
  LayoutList,
  X,
  RotateCcw,
} from "lucide-react";

import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const resolvedParams = use(searchParams);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Layout Controls
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(
    resolvedParams.category || "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<
    "featured" | "price-low" | "price-high" | "rating"
  >("featured");

  const { addToCart } = useCart();

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (resolvedParams.category) {
      setSelectedCategory(resolvedParams.category);
    }
  }, [resolvedParams.category]);

  const activeFilterCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (searchQuery.trim() !== "" ? 1 : 0) +
    (maxPrice < 100000 ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (minRating > 0 ? 1 : 0);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setMaxPrice(100000);
    setInStockOnly(false);
    setMinRating(0);
    setSortBy("featured");
  };

  const filteredProducts = products
    .filter((p) => {
      const matchCat =
        selectedCategory === "all" || p.category === selectedCategory;
      const matchSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPrice = p.price <= maxPrice;
      const matchStock = !inStockOnly || p.stock > 0;
      const matchRating = !minRating || (p.rating || 0) >= minRating;
      return matchCat && matchSearch && matchPrice && matchStock && matchRating;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });

  return (
    <div className="min-h-screen flex flex-col bg-[#0C1A14] text-[#F8F9F5]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Page Header */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F3CE32]">
            WildRoute Storefront
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-black text-white mt-2 uppercase tracking-tight">
            <span className="hero-title-line">
              <span className="hero-serif-slide">
                Outdoor Gear & Expedition Clothing
              </span>
            </span>
          </h1>
          <p className="text-sm font-medium text-white/80 mt-4 max-w-2xl">
            Browse weather-tested 4-season apparel, tents, backpacks, and
            accessories engineered for wilderness durability.
          </p>
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
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "item" : "items"}
            </span>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="appearance-none py-3 pl-4 pr-10 bg-transparent border border-white/20 rounded-none text-xs font-black text-white uppercase tracking-widest form-field cursor-pointer"
              >
                <option value="featured" className="text-black">
                  Featured
                </option>
                <option value="price-low" className="text-black">
                  Price: Low to High
                </option>
                <option value="price-high" className="text-black">
                  Price: High to Low
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

        <div
          className={`flex items-start relative ${
            isFilterOpen ? "gap-8" : "gap-0"
          }`}
        >
          {/* FILTER SIDE PANEL */}
          <aside
            className={`bg-[#0C1A14] rounded-none shrink-0 space-y-8 transition-all duration-300 ease-out overflow-hidden ${
              isFilterOpen
                ? "pointer-events-auto opacity-100 translate-x-0 w-full lg:w-72 max-w-[18rem] p-6"
                : "pointer-events-none opacity-0 -translate-x-4 w-0 lg:w-0 max-w-0 p-0"
            }`}
            aria-hidden={!isFilterOpen}
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

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#F3CE32]">
                Keyword Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-white/50" />
                <input
                  type="text"
                  placeholder="Search gear..."
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

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#F3CE32]">
                Categories
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-none text-[10px] uppercase tracking-widest font-bold transition ${
                    selectedCategory === "all"
                      ? "bg-[#F3CE32] text-black"
                      : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span>All Gear</span>
                  <span>({products.length})</span>
                </button>

                {INITIAL_CATEGORIES.map((cat) => {
                  const catCount = products.filter(
                    (p) => p.category === cat.slug,
                  ).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-none text-[10px] uppercase tracking-widest font-bold transition ${
                        selectedCategory === cat.slug
                          ? "bg-[#F3CE32] text-black"
                          : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span>({catCount})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between text-[10px]">
                <label className="font-black uppercase tracking-widest text-[#F3CE32]">
                  Max Price
                </label>
                <span className="font-bold text-white">
                  LKR {maxPrice.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="100000"
                step="2500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#F3CE32] cursor-pointer"
              />
            </div>

            <div className="space-y-4 pt-6 border-t border-white/10">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#F3CE32]">
                Availability & Rating
              </label>

              <label className="flex items-center gap-3 cursor-pointer text-xs font-bold uppercase tracking-widest text-white">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded-none bg-transparent border-white/30 text-[#F3CE32] focus:ring-[#F3CE32]"
                />
                <span>In Stock Only</span>
              </label>

              <div className="flex flex-col gap-2 pt-2">
                {[0, 4.5, 4.8].map((ratingVal) => (
                  <button
                    key={ratingVal}
                    onClick={() => setMinRating(ratingVal)}
                    className={`px-4 py-2.5 rounded-none text-[10px] font-bold uppercase tracking-widest transition text-left ${
                      minRating === ratingVal
                        ? "bg-[#F3CE32] text-black"
                        : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {ratingVal === 0 ? "Any Rating" : `${ratingVal}★ & Up`}
                  </button>
                ))}
              </div>
            </div>

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

          {/* PRODUCT DISPLAY AREA */}
          <div className="flex-1 w-full">
            {loading ? (
              <LoadingSpinner label="Loading catalog items..." fullPage />
            ) : filteredProducts.length === 0 ? (
              <div className="bg-transparent rounded-none border border-white/20 p-16 text-center">
                <Filter className="w-12 h-12 mx-auto stroke-1 mb-4 text-white/30" />
                <p className="font-serif text-2xl font-bold text-white uppercase tracking-widest">
                  No matching gear
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
              /* GRID VIEW */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="gear-panel-isolated min-w-0 h-full"
                  >
                    <GearEditorialCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              /* LIST VIEW */
              <div className="space-y-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white text-black rounded-none p-4 flex flex-col sm:flex-row items-center gap-8"
                  >
                    <div className="relative w-full sm:w-56 h-56 bg-[#EAEBE3] overflow-hidden shrink-0">
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="flex-1 space-y-3 w-full py-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-black/50 card-meta">
                          {product.category.replace("-", " ")}
                        </span>
                        {product.rating && (
                          <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-black">
                            <Star className="w-3.5 h-3.5 fill-[#F3CE32] text-[#F3CE32]" />{" "}
                            {product.rating} ({product.reviewCount || 0})
                          </span>
                        )}
                      </div>

                      <Link href={`/products/${product.id}`}>
                        <h3 className="font-serif font-black text-3xl uppercase tracking-tight text-black group-hover:text-black/70 transition leading-none">
                          {product.title}
                        </h3>
                      </Link>

                      <p className="text-xs font-medium text-black/70 line-clamp-2 max-w-2xl">
                        {product.description}
                      </p>

                      <div className="pt-4 mt-4 border-t border-black/10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div className="flex items-baseline gap-3">
                          <span className="text-2xl font-black text-black card-price">
                            LKR {product.price.toLocaleString()}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm font-bold text-black/40 line-through">
                              LKR {product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <Link
                            href={`/products/${product.id}`}
                            className="px-6 py-3 border border-black/20 hover:bg-black/5 text-black text-[10px] font-black uppercase tracking-widest transition"
                          >
                            Details
                          </Link>
                          <button
                            onClick={() => addToCart(product, 1)}
                            disabled={product.stock === 0}
                            className="gear-cta-magnetic flex items-center gap-2 px-6 py-3 bg-black hover:bg-[#F3CE32] hover:text-black disabled:bg-neutral-300 disabled:text-white text-white text-[10px] font-black uppercase tracking-widest transition"
                          >
                            <ShoppingBag className="w-4 h-4" /> Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
