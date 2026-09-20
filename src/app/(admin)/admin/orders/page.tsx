'use client';

import React, { useEffect, useState } from 'react';
import { Order, OrderStatus } from '@/types/ecommerce';
import { getOrders, updateOrderStatus } from '@/services/orderService';
import { Search, Filter, Printer, CheckCircle2, Clock, Truck, Package, X } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    getOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  };

  if (loading) {
    return <LoadingSpinner label="Loading fulfillment orders..." fullPage />;
  }

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus, notes);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, orderStatus: newStatus, fulfillmentNotes: notes });
    }
    fetchOrders();
  };

  const filteredOrders = orders.filter((o) => {
    const matchStatus = statusFilter === 'all' || o.orderStatus === statusFilter;
    const matchSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.phone.includes(searchQuery);
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C2826]">
          Order Management System (OMS)
        </h1>
        <p className="text-xs text-[#5C6B66] mt-1">
          Internal order fulfillment workflow: Pending → Processing → Dispatched
          → Completed.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-[#E5DFD5] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {[
            "all",
            "pending",
            "processing",
            "dispatched",
            "completed",
            "cancelled",
          ].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl capitalize transition shrink-0 ${
                statusFilter === st
                  ? "bg-[#23382B] text-white"
                  : "bg-[#FAF8F5] text-[#1C2826] border border-[#E5DFD5] hover:bg-[#F3EFEA]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#8E9B96]" />
          <input
            type="text"
            placeholder="Search Order # or Customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl text-xs focus:outline-none focus:border-[#23382B]"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#E5DFD5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1C2826]">
            <thead className="bg-[#FAF8F5] border-b border-[#E5DFD5] text-[11px] font-bold uppercase tracking-wider text-[#8E9B96]">
              <tr>
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Payment</th>
                <th className="py-4 px-6">Total (LKR)</th>
                <th className="py-4 px-6">Fulfillment Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5DFD5]">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#FAF8F5] transition">
                  <td className="py-4 px-6 font-bold text-[#23382B]">
                    #{ord.orderNumber}
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold block">
                      {ord.customer.fullName}
                    </span>
                    <span className="text-[11px] text-[#8E9B96]">
                      {ord.customer.phone} • {ord.customer.city}
                    </span>
                  </td>
                  <td className="py-4 px-6 capitalize">
                    {ord.paymentMethod.replace("_", " ")}
                  </td>
                  <td className="py-4 px-6 font-bold">
                    LKR {ord.total.toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={ord.orderStatus}
                      onChange={(e) =>
                        handleStatusChange(
                          ord.id,
                          e.target.value as OrderStatus,
                        )
                      }
                      className={`py-1 px-3 rounded-lg font-bold text-[11px] border focus:outline-none capitalize ${
                        ord.orderStatus === "completed"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                          : ord.orderStatus === "dispatched"
                            ? "bg-blue-50 text-blue-800 border-blue-300"
                            : ord.orderStatus === "processing"
                              ? "bg-amber-50 text-amber-800 border-amber-300"
                              : "bg-[#FAF8F5] text-[#1C2826] border-[#E5DFD5]"
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="dispatched">Dispatched</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="px-3 py-1.5 bg-[#23382B] text-white rounded-lg font-semibold hover:bg-[#192B20] transition"
                    >
                      Details & Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-xl bg-white rounded-3xl p-8 shadow-2xl border border-[#E5DFD5] space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-[#E5DFD5] pb-4">
              <span className="text-xs font-bold text-[#C86D51] uppercase tracking-wider block">
                Order Receipt
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#1C2826]">
                Order #{selectedOrder.orderNumber}
              </h2>
              <span className="text-xs text-[#8E9B96]">
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E5DFD5]">
                <span className="font-bold text-[#1C2826] block uppercase tracking-wider mb-1">
                  Customer
                </span>
                <p className="font-semibold text-black">
                  {selectedOrder.customer.fullName}
                </p>
                <p className="text-black">{selectedOrder.customer.phone}</p>
                <p className="font-semibold text-black">
                  {selectedOrder.customer.email}
                </p>
              </div>
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E5DFD5]">
                <span className="font-bold text-[#1C2826] block uppercase tracking-wider mb-1">
                  Delivery Address
                </span>
                <p className="font-semibold text-black">
                  {selectedOrder.customer.address}
                </p>
                <p className="font-semibold text-black">
                  {selectedOrder.customer.city},{" "}
                  {selectedOrder.customer.district}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-[#1C2826] uppercase tracking-wider block">
                Purchased Items
              </span>
              {selectedOrder.items.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E5DFD5]"
                >
                  <span className="font-semibold text-black">
                    {item.title} (x{item.quantity})
                  </span>
                  <span className="font-bold text-black">
                    LKR {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-base font-bold text-[#23382B] pt-4 border-t border-[#E5DFD5]">
              <span>Total Paid</span>
              <span>LKR {selectedOrder.total.toLocaleString()}</span>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full py-3 bg-[#23382B] text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#192B20] transition"
            >
              <Printer className="w-4 h-4" /> Print Customer Invoice
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
