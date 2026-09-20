"use client";

import React, { useEffect, useState, use } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Product } from "@/types/ecommerce";
import { getProductById } from "@/services/productService";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Star,
  ShieldCheck,
  Truck,
  RefreshCw,
  ArrowLeft,
  Check,
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  useEffect(() => {
    getProductById(resolvedParams.id).then((data) => {
      if (data) {
        setProduct(data);
        setSelectedImage(data.images[0] || "");
        if (data.sizes?.length) setSelectedSize(data.sizes[0]);
        if (data.colors?.length) setSelectedColor(data.colors[0]);
      }
      setLoading(false);
    });
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0C1A14] text-[#F8F9F5]">
        <Navbar />
        <LoadingSpinner label="Loading gear item details..." fullPage />
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0C1A14] text-[#F8F9F5]">
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-serif font-bold text-white">
            Product Not Found
          </h2>
          <Link
            href="/products"
            className="text-xs font-bold text-[#F3CE32] underline mt-4 inline-block"
          >
            ← Back to Catalog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const bnplInstallment = Math.round(product.price / 3);

  return (
    <div className="min-h-screen flex flex-col bg-[#0C1A14] text-[#F8F9F5]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Breadcrumb Navigation */}
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-[#F3CE32] transition mb-8 uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="hero-cinematic-mask relative aspect-4/3 w-full bg-white rounded-none overflow-hidden border border-white/20">
              <Image
                src={selectedImage}
                alt={product.title}
                fill
                className="hero-cinematic-img object-cover"
                priority
              />
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-20 rounded-none overflow-hidden border-2 transition ${
                      selectedImage === img
                        ? "border-[#F3CE32]"
                        : "border-white/20 opacity-70"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Specifications & Add to Cart */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-[#F3CE32] text-black text-[10px] font-black px-3 py-1 rounded-none uppercase tracking-widest">
                  {product.category.replace("-", " ")}
                </span>
                {product.stock > 0 ? (
                  <span className="text-[10px] font-black text-white bg-green-900/50 px-2.5 py-1 rounded-none border border-green-500 uppercase tracking-widest">
                    In Stock ({product.stock})
                  </span>
                ) : (
                  <span className="text-[10px] font-black text-white bg-red-900/50 px-2.5 py-1 rounded-none border border-red-500 uppercase tracking-widest">
                    Out of Stock
                  </span>
                )}
              </div>

              <h1 className="text-4xl lg:text-5xl font-serif font-black text-white leading-tight uppercase tracking-tight">
                <span className="hero-title-line">
                  <span className="hero-serif-slide">{product.title}</span>
                </span>
              </h1>

              {product.rating && (
                <div className="flex items-center gap-2 mt-4">
                  <div className="flex text-[#F3CE32]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-white">
                    {product.rating}
                  </span>
                  <span className="text-xs text-white/50">
                    ({product.reviewCount} customer reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Pricing Box */}
            <div className="p-6 bg-white text-black rounded-none border border-white/20 space-y-4">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-black">
                  LKR {product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-black/50 line-through">
                    LKR {product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Mint Pay & Koko Pay 3x breakdown info */}
              <div className="pt-4 border-t border-black/10 flex items-center justify-between text-xs font-semibold text-black/70">
                <span>Pay in 3 installments of:</span>
                <span className="font-bold text-black">
                  LKR {bnplInstallment.toLocaleString()} / mo
                </span>
              </div>
              <div className="flex gap-2 pt-1 text-[10px] font-bold uppercase tracking-wider">
                <span className="px-2 py-1 bg-green-100 text-green-900 rounded-none">
                  Mint Pay 3x
                </span>
                <span className="px-2 py-1 bg-orange-100 text-orange-900 rounded-none">
                  Koko Pay 3x
                </span>
              </div>
            </div>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-widest mb-3">
                  Select Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-2.5 text-xs font-bold rounded-none border transition uppercase tracking-widest ${
                        selectedSize === size
                          ? "bg-[#F3CE32] text-black border-[#F3CE32]"
                          : "bg-transparent text-white border-white/30 hover:bg-white/5"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="pt-2">
                <label className="block text-xs font-bold text-white uppercase tracking-widest mb-3">
                  Select Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-6 py-2.5 text-xs font-bold rounded-none border transition uppercase tracking-widest ${
                        selectedColor === color
                          ? "bg-[#F3CE32] text-black border-[#F3CE32]"
                          : "bg-transparent text-white border-white/30 hover:bg-white/5"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & CTA */}
            <div className="flex gap-4 pt-4">
              <div className="flex items-center border border-white/30 bg-transparent text-white rounded-none">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-4 text-sm hover:bg-white/5 font-bold"
                >
                  -
                </button>
                <span className="px-4 text-sm font-bold w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  className="px-4 py-4 text-sm hover:bg-white/5 font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={() =>
                  addToCart(product, quantity, selectedSize, selectedColor)
                }
                disabled={product.stock === 0}
                className="motion-magnetic flex-1 flex items-center justify-center gap-3 py-4 bg-[#F3CE32] hover:bg-white disabled:bg-neutral-700 text-black font-black uppercase tracking-widest text-sm rounded-none transition"
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Cart • LKR {(product.price * quantity).toLocaleString()}
              </button>
            </div>

            {/* Product Description */}
            <div className="p-6 bg-white/5 rounded-none border border-white/10 space-y-4">
              <h3 className="font-serif font-bold text-lg text-white uppercase tracking-widest">
                Product Details
              </h3>
              <p className="text-sm font-medium text-white/70 leading-relaxed">
                {product.description}
              </p>

              {product.weight && (
                <div className="pt-4 border-t border-white/10 text-xs text-white/70 flex justify-between font-bold uppercase tracking-widest">
                  <span className="text-white">Item Weight:</span>
                  <span>{product.weight}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
