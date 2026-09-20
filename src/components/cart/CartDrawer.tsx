"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";

export const CartDrawer: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const shippingFee = cart.length === 0 || subtotal >= 25000 ? 0 : 600;
  const total = subtotal + shippingFee;

  return (
    <div
      className={`fixed inset-0 z-60 transition-opacity duration-300 ease-out ${
        isCartOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!isCartOpen}
    >
      <button
        type="button"
        aria-label="Close cart"
        onClick={() => setIsCartOpen(false)}
        className={`absolute inset-0 h-full w-full cursor-default bg-black/70 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          isCartOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        className={`absolute inset-y-0 right-0 flex h-dvh w-full max-w-xl flex-col border-l-2 border-[#F3CE32] bg-[#0C1A14] text-white shadow-2xl transition-transform duration-300 ease-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b-2 border-white/20 px-6 py-5 sm:px-8">
          <div>
            <p className="mb-1 text-[10px] font-black uppercase tracking-[0.25em] text-[#F3CE32]">
              Field Supply
            </p>
            <h2 className="font-serif text-3xl font-black uppercase">
              Your Pack
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
            className="border-2 border-white/20 p-2 transition-colors hover:border-[#F3CE32] hover:text-[#F3CE32]"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          {cart.length === 0 ? (
            <div className="flex min-h-[min(28rem,calc(100dvh-22rem))] flex-col items-center justify-center border-2 border-white/20 bg-[#13241B] px-6 text-center">
              <ShoppingBag className="mb-6 h-16 w-16 stroke-1 text-[#F3CE32]" />
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.25em] text-white/50">
                No gear in your pack
              </p>
              <h3 className="mb-7 font-serif text-3xl font-black uppercase">
                Ready for the next route?
              </h3>
              <Link
                href="/products"
                onClick={() => setIsCartOpen(false)}
                className="inline-flex items-center gap-3 border-2 border-[#F3CE32] bg-[#F3CE32] px-6 py-4 text-xs font-black uppercase tracking-widest text-[#0C1A14] transition-colors hover:bg-transparent hover:text-[#F3CE32]"
              >
                Browse Field Gear <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <article
                  key={item.id}
                  className="grid grid-cols-[5.5rem_minmax(0,1fr)] border-2 border-white/20 bg-[#F4F5EF] text-[#0C1A14] sm:grid-cols-[7rem_minmax(0,1fr)]"
                >
                  <div className="relative aspect-square overflow-hidden border-r-2 border-[#0C1A14] bg-[#EAEBE3]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="mb-1 text-[9px] font-black uppercase tracking-widest text-[#0C1A14]/50">
                          WildRoute Equipment
                        </p>
                        <h3 className="font-serif text-lg font-black uppercase leading-tight">
                          {item.title}
                        </h3>
                        {(item.selectedSize || item.selectedColor) && (
                          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#0C1A14]/60">
                            {item.selectedSize && `Size: ${item.selectedSize}`}
                            {item.selectedSize && item.selectedColor && " / "}
                            {item.selectedColor &&
                              `Color: ${item.selectedColor}`}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove ${item.title}`}
                        className="shrink-0 text-[#0C1A14]/50 transition-colors hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="flex items-center border-2 border-[#0C1A14]">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="flex h-8 w-8 items-center justify-center hover:bg-[#F3CE32]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="flex h-8 min-w-8 items-center justify-center border-x-2 border-[#0C1A14] text-xs font-black">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="flex h-8 w-8 items-center justify-center hover:bg-[#F3CE32]"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="text-sm font-black">
                        LKR {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <footer className="border-t-2 border-[#F3CE32] bg-[#F3CE32] p-6 text-[#0C1A14] sm:p-8">
          <div className="space-y-3 text-xs font-bold uppercase tracking-widest">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>LKR {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shippingFee === 0 ? "Free" : "LKR 600"}</span>
            </div>
            <div className="flex justify-between border-t-2 border-[#0C1A14] pt-4 text-xl font-black">
              <span>Total</span>
              <span>LKR {total.toLocaleString()}</span>
            </div>
          </div>
          {cart.length > 0 ? (
            <Link
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="mt-6 flex items-center justify-between border-2 border-[#0C1A14] bg-[#0C1A14] px-5 py-4 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-transparent hover:text-[#0C1A14]"
            >
              Proceed to Checkout <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="mt-6 flex w-full cursor-not-allowed items-center justify-between border-2 border-[#0C1A14]/40 bg-[#0C1A14]/20 px-5 py-4 text-left text-xs font-black uppercase tracking-widest text-[#0C1A14]/60"
            >
              Add gear to checkout <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </footer>
      </aside>
    </div>
  );
};
