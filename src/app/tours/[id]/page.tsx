"use client";

import React, { useEffect, useState, use } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Tour } from "@/types/tours";
import { getTourById } from "@/services/tourService";
import { createTourBooking } from "@/services/orderService";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  CreditCard,
  Building,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { PaymentMethod } from "@/types/ecommerce";

import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function TourDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);

  // Booking Form State
  const [selectedDate, setSelectedDate] = useState("");
  const [guestsCount, setGuestsCount] = useState(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getTourById(resolvedParams.id).then((data) => {
      if (data) {
        setTour(data);
        if (data.availableDates.length > 0)
          setSelectedDate(data.availableDates[0]);
      }
      setLoading(false);
    });
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0C1A14] text-[#F8F9F5]">
        <Navbar />
        <LoadingSpinner label="Loading tour expedition details..." fullPage />
        <Footer />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0C1A14] text-[#F8F9F5]">
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-serif font-black text-white uppercase tracking-widest">
            Tour Expedition Not Found
          </h2>
          <Link
            href="/tours"
            className="text-xs font-black uppercase tracking-widest text-[#F3CE32] underline mt-6 inline-block"
          >
            ← Back to Expeditions
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const totalAmount = tour.pricePerPerson * guestsCount;
  const bnplMonthly = Math.round(totalAmount / 3);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !fullName || !email || !phone) {
      alert("Please fill out all required contact and date fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const booking = await createTourBooking({
        tourId: tour.id,
        tourTitle: tour.title,
        selectedDate,
        guestsCount,
        pricePerPerson: tour.pricePerPerson,
        totalAmount,
        leadGuest: {
          fullName,
          email,
          phone,
          specialRequirements: specialNotes,
        },
        paymentMethod,
        paymentStatus: paymentMethod === "card" ? "paid" : "pending",
        bookingStatus: "confirmed",
      });

      router.push(`/order-success/${booking.id}?type=tour`);
    } catch (err) {
      alert("Booking failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0C1A14] text-[#F8F9F5]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <Link
          href="/tours"
          className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-white/70 hover:text-[#F3CE32] mb-12 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Expeditions
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Itinerary & Media */}
          <div className="lg:col-span-7 space-y-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-[#F3CE32] text-black text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-none">
                  {tour.durationDays} Days Expedition
                </span>
                <span className="bg-transparent text-white border border-white/30 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-none">
                  {tour.difficulty} Level
                </span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-serif font-black text-white uppercase tracking-tight leading-none mb-4">
                <span className="hero-title-line">
                  <span className="hero-serif-slide">{tour.title}</span>
                </span>
              </h1>
              <p className="text-sm text-[#F3CE32] font-black uppercase tracking-widest flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {tour.location}
              </p>
            </div>

            {/* Photo Gallery */}
            <div className="hero-cinematic-mask relative aspect-16/9 w-full bg-[#EAEBE3] rounded-none overflow-hidden border border-white/20">
              <Image
                src={tour.images[0]}
                alt={tour.title}
                fill
                className="hero-cinematic-img object-cover"
                priority
              />
            </div>

            {/* Expedition Overview */}
            <div className="bg-white/5 p-8 rounded-none border border-white/10 space-y-4">
              <h3 className="font-serif font-black uppercase tracking-widest text-xl text-white">
                Expedition Overview
              </h3>
              <p className="text-sm font-medium text-white/70 leading-relaxed">
                {tour.description}
              </p>
            </div>

            {/* Day-by-Day Itinerary */}
            <div className="bg-white/5 p-8 rounded-none border border-white/10 space-y-8">
              <h3 className="font-serif font-black uppercase tracking-widest text-xl text-white">
                Day-by-Day Itinerary
              </h3>
              <div className="space-y-8 border-l-2 border-[#F3CE32] pl-8 ml-2">
                {tour.itinerary.map((day) => (
                  <div key={day.day} className="relative space-y-3">
                    <span className="absolute -left-[41px] top-0 w-4 h-4 rounded-none bg-[#F3CE32] border-2 border-[#0C1A14]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#F3CE32] block">
                      Day {day.day}
                    </span>
                    <h4 className="font-serif font-black text-2xl text-white uppercase tracking-tight leading-none">
                      {day.title}
                    </h4>
                    <p className="text-sm font-medium text-white/70 leading-relaxed">
                      {day.description}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {day.activities.map((act, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-transparent border border-white/20 text-white px-3 py-1.5 rounded-none font-bold uppercase tracking-widest"
                        >
                          ✓ {act}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What's Included */}
            <div className="bg-white/5 p-8 rounded-none border border-white/10 space-y-6">
              <h3 className="font-serif font-black uppercase tracking-widest text-xl text-white">
                What’s Included
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tour.includedGear.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white bg-transparent p-4 rounded-none border border-white/10"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#F3CE32] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Booking Form */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <div className="bg-white text-black p-8 rounded-none border-2 border-[#0C1A14] space-y-8 shadow-2xl">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-black/50 block mb-2">
                  Reserve Seats Now
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-black tracking-tighter">
                    LKR {tour.pricePerPerson.toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-black/50">
                    / guest
                  </span>
                </div>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-6">
                {/* Date Selection */}
                <div>
                  <label className="block text-[10px] font-black text-black uppercase tracking-widest mb-2">
                    Select Departure Date
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                    className="form-field w-full p-4 bg-transparent border-2 border-black/20 rounded-none text-xs font-black uppercase tracking-widest text-black focus:outline-none"
                  >
                    {tour.availableDates.map((d) => (
                      <option key={d} value={d}>
                        Departure: {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Number of Guests */}
                <div>
                  <label className="block text-[10px] font-black text-black uppercase tracking-widest mb-2">
                    Number of Guests
                  </label>
                  <div className="flex items-center border-2 border-black/20 bg-transparent rounded-none">
                    <button
                      type="button"
                      onClick={() =>
                        setGuestsCount(Math.max(1, guestsCount - 1))
                      }
                      className="px-6 py-4 text-sm font-black text-black hover:bg-black/5"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center text-sm font-black text-black uppercase tracking-widest">
                      {guestsCount} {guestsCount === 1 ? "Guest" : "Guests"}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setGuestsCount(
                          Math.min(tour.maxGroupSize, guestsCount + 1),
                        )
                      }
                      className="px-6 py-4 text-sm font-black text-black hover:bg-black/5"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Lead Contact Info */}
                <div className="space-y-4 pt-4 border-t border-black/10">
                  <span className="text-[10px] font-black text-black/50 uppercase tracking-widest block">
                    Lead Guest Contact Details
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="FULL NAME *"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="form-field w-full p-4 bg-transparent border-2 border-black/20 rounded-none text-xs font-black placeholder:text-black/30 focus:outline-none uppercase tracking-widest"
                  />
                  <input
                    type="email"
                    required
                    placeholder="EMAIL ADDRESS *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-field w-full p-4 bg-transparent border-2 border-black/20 rounded-none text-xs font-black placeholder:text-black/30 focus:outline-none uppercase tracking-widest"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="MOBILE PHONE (WHATSAPP) *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-field w-full p-4 bg-transparent border-2 border-black/20 rounded-none text-xs font-black placeholder:text-black/30 focus:outline-none uppercase tracking-widest"
                  />
                  <textarea
                    placeholder="DIETARY REQUIREMENTS OR SPECIAL NOTES..."
                    rows={3}
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    className="form-field w-full p-4 bg-transparent border-2 border-black/20 rounded-none text-xs font-black placeholder:text-black/30 focus:outline-none uppercase tracking-widest"
                  />
                </div>

                {/* Multi-Option Payment Selector UI */}
                <div className="space-y-4 pt-6 border-t border-black/10">
                  <span className="text-[10px] font-black text-black/50 uppercase tracking-widest block">
                    Select Payment Option
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "card", label: "Credit Card", icon: CreditCard },
                      {
                        id: "mintpay",
                        label: "Mint Pay (3x)",
                        icon: DollarSign,
                      },
                      {
                        id: "kokopay",
                        label: "Koko Pay (3x)",
                        icon: DollarSign,
                      },
                      {
                        id: "cod",
                        label: "Cash on Arrival",
                        icon: CheckCircle2,
                      },
                      {
                        id: "bank_transfer",
                        label: "Bank Deposit",
                        icon: Building,
                      },
                    ].map((method) => {
                      const IconComponent = method.icon;
                      const active = paymentMethod === method.id;
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() =>
                            setPaymentMethod(method.id as PaymentMethod)
                          }
                          className={`p-4 border-2 text-left text-[10px] uppercase tracking-widest font-black flex items-center gap-2 transition rounded-none ${
                            active
                              ? "bg-black text-white border-black"
                              : "bg-transparent text-black border-black/20 hover:border-black"
                          }`}
                        >
                          <IconComponent className="w-4 h-4 shrink-0" />
                          <span className="truncate">{method.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Card Form UI preview */}
                  {paymentMethod === "card" && (
                    <div className="p-4 bg-black/5 rounded-none border-2 border-black/10 space-y-3 animate-in fade-in">
                      <input
                        type="text"
                        placeholder="CARD NUMBER"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="form-field w-full p-3 bg-white border-2 border-black/20 rounded-none text-xs font-black placeholder:text-black/30 uppercase tracking-widest"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="MM / YY"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          className="form-field w-full p-3 bg-white border-2 border-black/20 rounded-none text-xs font-black placeholder:text-black/30 uppercase tracking-widest"
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          className="form-field w-full p-3 bg-white border-2 border-black/20 rounded-none text-xs font-black placeholder:text-black/30 uppercase tracking-widest"
                        />
                      </div>
                    </div>
                  )}

                  {/* BNPL breakdown */}
                  {(paymentMethod === "mintpay" ||
                    paymentMethod === "kokopay") && (
                    <div className="p-4 bg-green-100 text-green-900 border-2 border-green-200 rounded-none text-xs font-black uppercase tracking-widest space-y-2">
                      <p>
                        {paymentMethod === "mintpay" ? "MINT PAY" : "KOKO PAY"}{" "}
                        INSTALLMENT:
                      </p>
                      <p className="text-green-700 font-bold">
                        Pay 3 monthly payments of LKR{" "}
                        {bnplMonthly.toLocaleString()} (0% interest).
                      </p>
                    </div>
                  )}
                </div>

                {/* Total & Submit */}
                <div className="pt-6 border-t border-black/10">
                  <div className="flex justify-between items-center text-sm font-black text-black uppercase tracking-widest mb-6">
                    <span>Total Price</span>
                    <span className="text-2xl tracking-tighter">
                      LKR {totalAmount.toLocaleString()}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="motion-magnetic w-full py-5 bg-[#F3CE32] hover:bg-black hover:text-[#F3CE32] text-black font-black uppercase tracking-widest text-sm rounded-none transition"
                  >
                    {isSubmitting ? "Reserving..." : "Confirm Expedition"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
