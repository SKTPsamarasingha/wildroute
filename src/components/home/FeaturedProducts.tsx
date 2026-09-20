"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/ecommerce";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Star, Eye } from "lucide-react";

interface FeaturedProductsProps {
  products: Product[];
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
}) => {
  const { addToCart } = useCart();

  return (
    <section className="py-16 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C86D51]">
              WildRoute Signature Store
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C2826] mt-1">
              <span className="hero-title-line">
                <span className="hero-serif-slide">Top Adventure Gear</span>
              </span>
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-[#23382B] hover:text-[#C86D51] underline underline-offset-4 mt-2 md:mt-0 transition"
          >
            View Entire Catalog ({products.length} Items) →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product) => (
            <div
              key={product.id}
              className="gear-panel-isolated group bg-white rounded-2xl border border-[#E5DFD5] overflow-hidden shadow-earth shadow-earth-hover flex flex-col justify-between"
            >
              {/* Product Image Box */}
              <div className="relative aspect-square bg-[#F3EFEA] overflow-hidden border-b border-[#E5DFD5]">
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Stock & Discount Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  {product.originalPrice && (
                    <span className="bg-[#C86D51] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      SAVE LKR{" "}
                      {(product.originalPrice - product.price).toLocaleString()}
                    </span>
                  )}
                  {product.stock <= 5 && product.stock > 0 ? (
                    <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Only {product.stock} left!
                    </span>
                  ) : product.stock === 0 ? (
                    <span className="bg-neutral-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Sold Out
                    </span>
                  ) : null}
                </div>

                {/* Quick view overlay button */}
                <Link
                  href={`/products/${product.id}`}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="flex items-center gap-1.5 px-4 py-2 bg-white text-[#1C2826] text-xs font-semibold rounded-full shadow-lg hover:bg-[#F3EFEA] transition">
                    <Eye className="w-3.5 h-3.5" /> Quick View
                  </span>
                </Link>
              </div>

              {/* Product Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-[#8E9B96] mb-1">
                    <span className="capitalize">
                      {product.category.replace("-", " ")}
                    </span>
                    {product.rating && (
                      <span className="flex items-center gap-1 text-[#1C2826] font-medium">
                        <Star className="w-3 h-3 fill-[#C86D51] text-[#C86D51]" />{" "}
                        {product.rating}
                      </span>
                    )}
                  </div>

                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-serif font-bold text-sm text-[#1C2826] group-hover:text-[#23382B] transition line-clamp-2">
                      {product.title}
                    </h3>
                  </Link>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E5DFD5] flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#8E9B96] block font-medium">
                      Price
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-bold text-[#23382B]">
                        LKR {product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-[#8E9B96] line-through">
                          LKR {product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      addToCart(
                        product,
                        1,
                        product.sizes?.[0],
                        product.colors?.[0],
                      )
                    }
                    disabled={product.stock === 0}
                    className="p-2.5 bg-[#23382B] hover:bg-[#192B20] disabled:bg-neutral-300 text-white rounded-xl transition shadow-sm"
                    title="Add to Cart"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
