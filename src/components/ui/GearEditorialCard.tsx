"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/ecommerce";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface GearEditorialCardProps {
  product: Product;
}

export const GearEditorialCard: React.FC<GearEditorialCardProps> = ({
  product,
}) => {
  const { addToCart } = useCart();
  const outOfStock = product.stock === 0;
  const lowStock = !outOfStock && product.stock < 5;
  const categoryLabel = product.category.replace(/-/g, " ");

  return (
    <div className="gear-panel-isolated gear-editorial-card group bg-white text-[#0C1A14] flex flex-col h-full border-2 border-[#0C1A14] relative overflow-hidden transition-colors hover:border-[#F3CE32]">
      {lowStock && (
        <div className="absolute top-4 left-4 z-20 bg-red-600 border-2 border-[#0C1A14] px-3 py-1.5 shadow-[4px_4px_0px_#0C1A14]">
          <span className="text-[10px] font-black uppercase tracking-widest text-white">
            Low Stock
          </span>
        </div>
      )}
      {outOfStock && (
        <div className="absolute top-4 left-4 z-20 bg-[#0C1A14] border-2 border-[#F3CE32] px-3 py-1.5">
          <span className="text-[10px] font-black uppercase tracking-widest text-white">
            Sold Out
          </span>
        </div>
      )}

      <Link
        href={`/products/${product.id}`}
        className="card-media-wrapper relative aspect-square w-full bg-[#F4F5EF] overflow-hidden border-b-2 border-[#0C1A14] block"
      >
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center transition-transform duration-700 ease-out"
            data-gear-image
          />
        ) : null}
      </Link>

      <div className="flex flex-col flex-1 min-w-0 bg-white">
        <div className="p-5 flex-1 min-w-0">
          <div className="card-meta text-[10px] font-black uppercase tracking-widest text-[#0C1A14]/50 mb-2">
            {categoryLabel}
          </div>

          <Link href={`/products/${product.id}`} className="block min-w-0">
            <h3 className="font-serif font-black text-xl uppercase tracking-tight text-[#0C1A14] leading-[1.15] group-hover:text-[#0C1A14]/70 transition-colors line-clamp-2 break-words">
              {product.title}
            </h3>
            <span className="card-underline mt-2 bg-[#0C1A14]" />
          </Link>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_4rem] border-t-2 border-[#0C1A14] min-h-16">
          <div className="min-w-0 px-4 sm:px-5 flex items-center bg-white">
            <span className="card-price text-lg font-black text-[#0C1A14] tracking-tighter truncate">
              LKR {product.price.toLocaleString()}
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              addToCart(product, 1, product.sizes?.[0], product.colors?.[0])
            }
            disabled={outOfStock}
            className="gear-cta-magnetic flex items-center justify-center bg-[#F3CE32] text-[#0C1A14] border-l-2 border-[#0C1A14] hover:bg-[#0C1A14] hover:text-[#F3CE32] disabled:bg-[#0C1A14]/20 disabled:text-[#0C1A14]/40 disabled:hover:bg-[#0C1A14]/20 disabled:hover:text-[#0C1A14]/40 transition-colors"
            data-magnetic-strength="0.18"
            aria-label={
              outOfStock ? "Sold out" : `Add ${product.title} to cart`
            }
          >
            <ShoppingBag className="w-5 h-5 stroke-[2]" />
          </button>
        </div>
      </div>
    </div>
  );
};
