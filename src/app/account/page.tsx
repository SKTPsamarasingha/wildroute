"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getOrders, getTourBookings } from "@/services/orderService";
import { Order } from "@/types/ecommerce";
import { TourBooking } from "@/types/tours";
import Link from "next/link";
import { Package, MapPin, Shield } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function AccountPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<TourBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      Promise.all([
        getOrders(user.uid, user.email),
        getTourBookings(user.uid, user.email),
      ]).then(([orderList, bookingList]) => {
        setOrders(orderList);
        setBookings(bookingList);
        setLoading(false);
      });
    }
  }, [user]);

  const isLoading = authLoading || (Boolean(user) && loading);

  return (
    <div className="min-h-screen flex flex-col bg-[#0C1A14]">
      <main className="mx-auto w-full max-w-7xl flex-1 px-5 pb-24 pt-32 sm:px-8 lg:px-12">
        {/* Profile Card Header */}
        <div className="mb-10 flex flex-col items-start justify-between gap-6 border-2 border-[#F3CE32] bg-[#13241B] p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center border-2 border-[#F3CE32] bg-[#F3CE32] font-serif text-2xl font-black text-[#0C1A14]">
              {user?.displayName?.charAt(0).toUpperCase() || "A"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-black uppercase text-white">
                  <span className="hero-title-line">
                    <span className="hero-serif-slide">
                      {user?.displayName || "Adventurer Account"}
                    </span>
                  </span>
                </h1>
                <span
                  className={`border border-white/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white ${
                    user?.role === "superadmin"
                      ? "bg-amber-600"
                      : "bg-[#0C1A14]"
                  }`}
                >
                  {user?.role || "customer"}
                </span>
              </div>
              <p className="mt-1 text-xs text-white/55">
                {user?.email || "Logged in user"}
              </p>
            </div>
          </div>

          {(user?.role === "superadmin" ||
            user?.role === "admin" ||
            user?.role === "staff") && (
            <Link
              href="/admin"
              className="motion-magnetic flex items-center gap-2 border-2 border-[#F3CE32] bg-[#F3CE32] px-5 py-3 text-xs font-black uppercase tracking-widest text-[#0C1A14] transition-colors hover:bg-transparent hover:text-[#F3CE32]"
            >
              <Shield className="w-4 h-4" /> Go to Admin Control Dashboard
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Section 1: Physical Product Orders */}
          <div className="space-y-4 border-2 border-white/20 bg-[#13241B] p-6 sm:p-8">
            <h2 className="flex items-center gap-2 border-b border-white/20 pb-4 font-serif text-2xl font-black uppercase text-white">
              <Package className="h-5 w-5 text-[#F3CE32]" /> My Product Gear
              Orders ({orders.length})
            </h2>

            {isLoading ? (
              <LoadingSpinner
                label="Fetching your order history..."
                size="sm"
                className="py-8 text-white"
              />
            ) : orders.length === 0 ? (
              <p className="py-6 text-xs uppercase tracking-wider text-white/50">
                No previous orders found for this user.
              </p>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="space-y-2 border border-white/20 bg-[#0C1A14] p-4 text-xs"
                  >
                    <div className="flex justify-between gap-4 font-black uppercase text-white">
                      <span>Order #{ord.orderNumber}</span>
                      <span className="capitalize text-[#F3CE32]">
                        {ord.orderStatus}
                      </span>
                    </div>
                    <p className="text-white/60">
                      {ord.items.length} item(s) • Total: LKR{" "}
                      {ord.total.toLocaleString()}
                    </p>
                    <p className="text-[11px] uppercase tracking-wider text-white/40">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Guided Tour Expeditions */}
          <div className="space-y-4 border-2 border-white/20 bg-[#13241B] p-6 sm:p-8">
            <h2 className="flex items-center gap-2 border-b border-white/20 pb-4 font-serif text-2xl font-black uppercase text-white">
              <MapPin className="h-5 w-5 text-[#F3CE32]" /> My Reserved Tour
              Expeditions ({bookings.length})
            </h2>

            {isLoading ? (
              <LoadingSpinner
                label="Fetching tour reservations..."
                size="sm"
                className="py-8 text-white"
              />
            ) : bookings.length === 0 ? (
              <p className="py-6 text-xs uppercase tracking-wider text-white/50">
                No active tour reservations found for this user.
              </p>
            ) : (
              <div className="space-y-4">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="space-y-2 border border-white/20 bg-[#0C1A14] p-4 text-xs"
                  >
                    <div className="flex justify-between gap-4 font-black uppercase text-white">
                      <span className="truncate">{b.tourTitle}</span>
                      <span className="font-black capitalize text-[#F3CE32]">
                        {b.bookingStatus}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4 text-white/60">
                      <span>Departure: {b.selectedDate}</span>
                      <span>
                        {b.guestsCount} Guests • LKR{" "}
                        {b.totalAmount.toLocaleString()}
                      </span>
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
