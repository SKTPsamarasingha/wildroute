"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { getOrderById } from "@/services/orderService";
import { Order } from "@/types/ecommerce";
import { CheckCircle } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function OrderSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const resolvedParams = use(params);
  const resolvedSearchParams = use(searchParams);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const isTour = resolvedSearchParams.type === "tour";

  useEffect(() => {
    getOrderById(resolvedParams.id).then((data) => {
      setOrder(data);
      setLoading(false);
    });
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0C1A14] pt-28 text-white">
        <LoadingSpinner label="Retrieving order details..." fullPage />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0C1A14] px-5 pb-24 pt-32 text-white sm:px-8">
      <div className="mx-auto w-full max-w-3xl text-center">
        <div className="space-y-8 border-2 border-[#F3CE32] bg-[#13241B] p-8 sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center border-2 border-[#F3CE32] bg-[#F3CE32] text-[#0C1A14]">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#F3CE32]">
              {isTour
                ? "Expedition Reservation Confirmed"
                : "Order Placed Successfully"}
            </span>
            <h1 className="mt-3 font-serif text-4xl font-black uppercase leading-tight sm:text-5xl">
              <span className="hero-title-line">
                <span className="hero-serif-slide">
                  Thank You for Exploring with WildRoute!
                </span>
              </span>
            </h1>
            <p className="mt-3 text-xs text-white/60">
              We have dispatched an email receipt and order confirmation.
            </p>
          </div>

          <div className="space-y-3 border-2 border-white/20 bg-[#0C1A14] p-5 text-left text-xs">
            <div className="flex justify-between gap-4 border-b border-white/20 pb-3">
              <span className="font-bold uppercase tracking-wider text-white/50">
                Reference ID:
              </span>
              <span className="font-black text-[#F3CE32]">
                {order?.orderNumber || resolvedParams.id}
              </span>
            </div>
            <div className="flex justify-between gap-4 border-b border-white/20 pb-3">
              <span className="font-bold uppercase tracking-wider text-white/50">
                Fulfillment Status:
              </span>
              <span className="font-black capitalize text-[#F3CE32]">
                {order?.orderStatus || "Processing & Packing"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold uppercase tracking-wider text-white/50">
                Payment Method:
              </span>
              <span className="font-black capitalize text-white">
                {order?.paymentMethod.replace("_", " ") || "Express Payment"}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
            <Link
              href="/"
              className="w-full border-2 border-[#F3CE32] bg-[#F3CE32] px-6 py-3 text-xs font-black uppercase tracking-widest text-[#0C1A14] transition-colors hover:bg-transparent hover:text-[#F3CE32] sm:w-auto"
            >
              Return to Home Page
            </Link>
            <Link
              href="/account"
              className="w-full border-2 border-white/30 px-6 py-3 text-xs font-black uppercase tracking-widest text-white transition-colors hover:border-white hover:bg-white/10 sm:w-auto"
            >
              View My Account & Orders
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
