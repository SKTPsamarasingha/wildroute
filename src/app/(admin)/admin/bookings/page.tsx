'use client';

import React, { useEffect, useState } from 'react';
import { TourBooking, BookingStatus } from '@/types/tours';
import { getTourBookings, updateBookingStatus } from '@/services/orderService';
import { MapPin, Users, Calendar, Search, Filter } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<TourBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    getTourBookings().then((data) => {
      setBookings(data);
      setLoading(false);
    });
  };

  if (loading) {
    return <LoadingSpinner label="Loading tour guest manifests..." fullPage />;
  }

  const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
    await updateBookingStatus(id, newStatus);
    fetchBookings();
  };

  const filteredBookings = bookings.filter((b) => {
    const matchStatus = statusFilter === 'all' || b.bookingStatus === statusFilter;
    const matchSearch =
      b.tourTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.leadGuest.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C2826]">
          Tour Reservation Manager
        </h1>
        <p className="text-xs text-[#5C6B66] mt-1">
          View guest reservations, departure dates, payment options, and manage tour manifests.
        </p>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-[#E5DFD5] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl capitalize transition shrink-0 ${
                statusFilter === st
                  ? 'bg-[#23382B] text-white'
                  : 'bg-[#FAF8F5] text-[#1C2826] border border-[#E5DFD5] hover:bg-[#F3EFEA]'
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
            placeholder="Search Guest or Tour..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl text-xs focus:outline-none focus:border-[#23382B]"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#E5DFD5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1C2826]">
            <thead className="bg-[#FAF8F5] border-b border-[#E5DFD5] text-[11px] font-bold uppercase tracking-wider text-[#8E9B96]">
              <tr>
                <th className="py-4 px-6">Booking #</th>
                <th className="py-4 px-6">Tour Title</th>
                <th className="py-4 px-6">Lead Guest Contact</th>
                <th className="py-4 px-6">Departure Date</th>
                <th className="py-4 px-6">Total (LKR)</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5DFD5]">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-[#FAF8F5] transition">
                  <td className="py-4 px-6 font-bold text-[#C86D51]">#{b.bookingNumber}</td>
                  <td className="py-4 px-6 font-bold text-[#1C2826]">{b.tourTitle}</td>
                  <td className="py-4 px-6">
                    <span className="font-bold block">{b.leadGuest.fullName}</span>
                    <span className="text-[11px] text-[#8E9B96]">{b.leadGuest.phone} • {b.guestsCount} Guests</span>
                  </td>
                  <td className="py-4 px-6 font-medium">{b.selectedDate}</td>
                  <td className="py-4 px-6 font-bold text-[#23382B]">LKR {b.totalAmount.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <select
                      value={b.bookingStatus}
                      onChange={(e) => handleStatusChange(b.id, e.target.value as BookingStatus)}
                      className="py-1 px-3 bg-[#FAF8F5] border border-[#E5DFD5] rounded-lg font-bold text-[11px] capitalize"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
