'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getOrders, getTourBookings } from '@/services/orderService';
import { getProducts } from '@/services/productService';
import { Order } from '@/types/ecommerce';
import { TourBooking } from '@/types/tours';
import { Product } from '@/types/ecommerce';
import { DollarSign, ShoppingBag, MapPin, AlertTriangle, ArrowRight, Plus } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<TourBooking[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    Promise.all([getOrders(), getTourBookings(), getProducts()]).then(
      ([orderList, bookingList, productList]) => {
        setOrders(orderList);
        setBookings(bookingList);
        setProducts(productList);
        setLoading(false);
      }
    );
  };

  const totalProductRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalTourRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const grandTotal = totalProductRevenue + totalTourRevenue;
  const lowStockProducts = products.filter((p) => p.stock <= 5);

  if (loading) {
    return <LoadingSpinner label="Loading dashboard analytics..." fullPage />;
  }

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C2826]">
          Dashboard Analytics Overview
        </h1>
        <p className="text-xs text-[#5C6B66] mt-1">
          Real-time metrics for e-commerce sales, tour bookings, and stock alerts.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#E5DFD5] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8E9B96]">Total Gross Sales</span>
            <div className="p-2 bg-[#DDF4EA] text-[#0D6B42] rounded-xl">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#23382B]">LKR {grandTotal.toLocaleString()}</p>
          <span className="text-[11px] text-[#6E8071] block">Product & Tour Revenue Combined</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E5DFD5] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8E9B96]">Active Orders</span>
            <div className="p-2 bg-[#FAF8F5] text-[#23382B] rounded-xl border border-[#E5DFD5]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#1C2826]">{orders.length}</p>
          <span className="text-[11px] text-[#6E8071] block">Product Deliveries</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E5DFD5] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8E9B96]">Tour Reservations</span>
            <div className="p-2 bg-[#FFF0E6] text-[#C86D51] rounded-xl">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#1C2826]">{bookings.length}</p>
          <span className="text-[11px] text-[#6E8071] block">Expedition Guests</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E5DFD5] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8E9B96]">Low Stock Alerts</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-700">{lowStockProducts.length}</p>
          <span className="text-[11px] text-[#6E8071] block">Items ≤ 5 Stock Units</span>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Link
          href="/admin/products"
          className="flex items-center gap-2 px-5 py-3 bg-[#23382B] text-white rounded-2xl text-xs font-semibold hover:bg-[#192B20] transition shadow-md"
        >
          <Plus className="w-4 h-4" /> Manage Product Inventory
        </Link>
        <Link
          href="/admin/tours"
          className="flex items-center gap-2 px-5 py-3 bg-[#C86D51] text-white rounded-2xl text-xs font-semibold hover:bg-[#B35B40] transition shadow-md"
        >
          <Plus className="w-4 h-4" /> Manage Expedition Tours
        </Link>
        <Link
          href="/admin/orders"
          className="flex items-center gap-2 px-5 py-3 bg-white text-[#1C2826] border border-[#E5DFD5] rounded-2xl text-xs font-semibold hover:bg-[#FAF8F5] transition"
        >
          View Order OMS →
        </Link>
      </div>

      {/* Recent Activity Streams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Product Orders */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5DFD5] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5DFD5] pb-3">
            <h2 className="font-serif font-bold text-base text-[#1C2826]">Recent Customer Orders</h2>
            <Link href="/admin/orders" className="text-xs font-bold text-[#23382B] hover:text-[#C86D51]">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {orders.slice(0, 4).map((ord) => (
              <div key={ord.id} className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#E5DFD5] flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#1C2826] block">#{ord.orderNumber} • {ord.customer.fullName}</span>
                  <span className="text-[#5C6B66]">{ord.items.length} items • LKR {ord.total.toLocaleString()}</span>
                </div>
                <span className="px-2.5 py-1 bg-[#23382B] text-white rounded-lg font-bold text-[10px] uppercase">
                  {ord.orderStatus}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tour Bookings */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5DFD5] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5DFD5] pb-3">
            <h2 className="font-serif font-bold text-base text-[#1C2826]">Recent Tour Reservations</h2>
            <Link href="/admin/bookings" className="text-xs font-bold text-[#C86D51] hover:text-[#23382B]">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {bookings.slice(0, 4).map((b) => (
              <div key={b.id} className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#E5DFD5] flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#1C2826] block">{b.tourTitle}</span>
                  <span className="text-[#5C6B66]">{b.leadGuest.fullName} ({b.guestsCount} Guests)</span>
                </div>
                <span className="px-2.5 py-1 bg-[#C86D51] text-white rounded-lg font-bold text-[10px] uppercase">
                  {b.bookingStatus}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
