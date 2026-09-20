"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/services/orderService";
import { PaymentMethod } from "@/types/ecommerce";
import { trackInitiateCheckout } from "@/lib/pixels";
import {
  CreditCard,
  DollarSign,
  Truck,
  Building,
  ArrowLeft,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, clearCart } = useCart();

  // Contact & Delivery State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("Colombo");
  const notes = "";

  // Payment Selection & Form UI State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shippingFee = subtotal >= 25000 || cart.length === 0 ? 0 : 600;
  const total = subtotal + shippingFee;
  const bnplMonthly = Math.round(total / 3);

  useEffect(() => {
    if (cart.length > 0) {
      trackInitiateCheckout(total, cart.length);
    }
  }, [cart.length, total]);

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-[#0C1A14] px-5 pb-24 pt-32 text-white sm:px-8">
        <div className="mx-auto max-w-3xl border-2 border-white/20 bg-[#13241B] px-6 py-20 text-center">
          <h2 className="font-serif text-3xl font-black uppercase">
            No Items in Cart for Checkout
          </h2>
          <Link
            href="/products"
            className="mt-8 inline-flex border-2 border-[#F3CE32] bg-[#F3CE32] px-6 py-4 text-xs font-black uppercase tracking-widest text-[#0C1A14] transition-colors hover:bg-transparent hover:text-[#F3CE32]"
          >
            Explore Field Gear
          </Link>
        </div>
      </main>
    );
  }

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !address || !city) {
      alert("Please fill out all required delivery fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await createOrder({
        customer: {
          fullName,
          email,
          phone,
          address,
          city,
          district,
          notes,
        },
        items: cart.map((item) => ({
          productId: item.productId,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
          image: item.image,
        })),
        subtotal,
        shippingFee,
        total,
        paymentMethod,
        paymentStatus: paymentMethod === "card" ? "paid" : "pending",
        orderStatus: "pending",
        cardDetailsPreview:
          paymentMethod === "card"
            ? `**** ${cardNumber.slice(-4) || "4242"}`
            : undefined,
      });

      clearCart();
      router.push(`/order-success/${order.id}`);
    } catch {
      alert("Failed to place order. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0C1A14] px-5 pb-24 pt-32 text-white sm:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <Link
          href="/cart"
          className="mb-8 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-[#F3CE32]"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>

        <h1 className="mb-10 font-serif text-5xl font-black uppercase leading-[0.9] tracking-tight sm:text-7xl">
          <span className="hero-title-line">
            <span className="hero-serif-slide">Express Checkout</span>
          </span>
        </h1>

        <form
          onSubmit={handleCheckoutSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Left Column: Customer & Delivery Details + Payment UI */}
          <div className="lg:col-span-7 space-y-8">
            {/* Delivery Recipient Box */}
            <div className="space-y-4 border-2 border-white/20 bg-[#13241B] p-6 sm:p-8">
              <h2 className="flex items-center gap-2 border-b border-white/20 pb-4 font-serif text-2xl font-black uppercase">
                <Truck className="h-5 w-5 text-[#F3CE32]" /> 1. Recipient &
                Delivery Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-white/70">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Thiruna Samarasinghe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="form-field w-full border border-white/20 bg-[#0C1A14] p-3 text-xs text-white placeholder:text-white/35 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-white/70">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-field w-full border border-white/20 bg-[#0C1A14] p-3 text-xs text-white placeholder:text-white/35 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-white/70">
                    Mobile Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+94 77 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-field w-full border border-white/20 bg-[#0C1A14] p-3 text-xs text-white placeholder:text-white/35 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-white/70">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="House No, Street, Landmark"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="form-field w-full border border-white/20 bg-[#0C1A14] p-3 text-xs text-white placeholder:text-white/35 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-white/70">
                    City / Town *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Colombo, Kandy, Galle..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="form-field w-full border border-white/20 bg-[#0C1A14] p-3 text-xs text-white placeholder:text-white/35 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-white/70">
                    District
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="form-field w-full border border-white/20 bg-[#0C1A14] p-3 text-xs font-semibold text-white focus:outline-none"
                  >
                    {[
                      "Colombo",
                      "Kandy",
                      "Galle",
                      "Gampaha",
                      "Kalutara",
                      "Matara",
                      "Nuwara Eliya",
                      "Badulla",
                      "Kurunegala",
                    ].map((d) => (
                      <option key={d} value={d}>
                        {d} District
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method Selector UI */}
            <div className="space-y-4 border-2 border-white/20 bg-[#13241B] p-6 sm:p-8">
              <h2 className="flex items-center gap-2 border-b border-white/20 pb-4 font-serif text-2xl font-black uppercase">
                <CreditCard className="h-5 w-5 text-[#F3CE32]" /> 2. Payment
                Selection
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: "card",
                    label: "Credit / Debit Card",
                    icon: CreditCard,
                    desc: "Visa, MasterCard, Amex",
                  },
                  {
                    id: "mintpay",
                    label: "Mint Pay (3x BNPL)",
                    icon: DollarSign,
                    desc: "3 interest-free monthly payments",
                  },
                  {
                    id: "kokopay",
                    label: "Koko Pay (3x BNPL)",
                    icon: DollarSign,
                    desc: "3 interest-free monthly payments",
                  },
                  {
                    id: "cod",
                    label: "Cash on Delivery (COD)",
                    icon: Truck,
                    desc: "Pay cash upon parcel delivery",
                  },
                  {
                    id: "bank_transfer",
                    label: "Direct Bank Transfer",
                    icon: Building,
                    desc: "Transfer via online banking",
                  },
                ].map((method) => {
                  const IconComp = method.icon;
                  const active = paymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() =>
                        setPaymentMethod(method.id as PaymentMethod)
                      }
                      className={`flex flex-col justify-between border-2 p-4 text-left transition ${
                        active
                          ? "border-[#F3CE32] bg-[#F3CE32] text-[#0C1A14]"
                          : "border-white/20 bg-[#0C1A14] text-white hover:border-white/50"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <IconComp className="w-5 h-5 shrink-0" />
                        {active && (
                          <CheckCircle2 className="h-4 w-4 text-[#0C1A14]" />
                        )}
                      </div>
                      <span className="font-serif font-bold text-xs">
                        {method.label}
                      </span>
                      <span
                        className={`mt-0.5 text-[11px] ${active ? "text-[#0C1A14]/70" : "text-white/50"}`}
                      >
                        {method.desc}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Form Input UI for Credit Card */}
              {paymentMethod === "card" && (
                <div className="space-y-3 border border-white/20 bg-[#0C1A14] p-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-white">
                      Card Details
                    </span>
                    <Lock className="w-3.5 h-3.5 text-[#6E8071]" />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Cardholder Name"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="form-field mb-2 w-full border border-white/20 bg-[#13241B] p-2.5 text-xs text-white placeholder:text-white/35"
                    />
                    <input
                      type="text"
                      placeholder="Card Number (4242 •••• •••• 4242)"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="form-field w-full border border-white/20 bg-[#13241B] p-2.5 text-xs text-white placeholder:text-white/35"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="MM / YY"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="form-field w-full border border-white/20 bg-[#13241B] p-2.5 text-xs text-white placeholder:text-white/35"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      className="form-field w-full border border-white/20 bg-[#13241B] p-2.5 text-xs text-white placeholder:text-white/35"
                    />
                  </div>
                </div>
              )}

              {/* Installment Breakdown for Mint Pay / Koko Pay */}
              {(paymentMethod === "mintpay" || paymentMethod === "kokopay") && (
                <div className="space-y-2 border-2 border-[#F3CE32] bg-[#F3CE32]/10 p-4 text-xs text-[#F3CE32]">
                  <div className="font-bold text-sm">
                    {paymentMethod === "mintpay" ? "Mint Pay" : "Koko Pay"} 3x
                    Installment Breakdown:
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    <div className="bg-white/80 p-2 rounded-lg">
                      <span className="block text-[10px] uppercase font-bold text-[#0D6B42]">
                        Today (1/3)
                      </span>
                      <span className="font-extrabold text-xs">
                        LKR {bnplMonthly.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-white/80 p-2 rounded-lg">
                      <span className="block text-[10px] uppercase font-bold text-[#0D6B42]">
                        Month 2 (2/3)
                      </span>
                      <span className="font-extrabold text-xs">
                        LKR {bnplMonthly.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-white/80 p-2 rounded-lg">
                      <span className="block text-[10px] uppercase font-bold text-[#0D6B42]">
                        Month 3 (3/3)
                      </span>
                      <span className="font-extrabold text-xs">
                        LKR {bnplMonthly.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Bank Transfer Instructions */}
              {paymentMethod === "bank_transfer" && (
                <div className="space-y-1 border border-white/20 bg-[#0C1A14] p-4 text-xs text-white/60">
                  <p className="font-black text-white">
                    Bank Transfer Deposit Account:
                  </p>
                  <p>Bank: Commercial Bank of Ceylon PLC</p>
                  <p>Account Name: WildRoute Adventures (Pvt) Ltd</p>
                  <p>Account No: 8009124401 (Kandy Branch)</p>
                  <p className="pt-1 text-[11px] font-semibold text-[#F3CE32]">
                    * Please WhatsApp deposit slip receipt with your order
                    number after placing order.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="space-y-6 border-2 border-[#F3CE32] bg-[#F3CE32] p-6 text-[#0C1A14] sm:p-8 lg:col-span-5">
            <h3 className="border-b-2 border-[#0C1A14] pb-4 font-serif text-2xl font-black uppercase">
              Items in Order ({cart.reduce((sum, i) => sum + i.quantity, 0)})
            </h3>

            <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden border-2 border-[#0C1A14] bg-[#EAEBE3]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="truncate text-xs font-black uppercase">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-[#0C1A14]/60">
                      Qty: {item.quantity} × LKR {item.price.toLocaleString()}
                    </p>
                  </div>
                  <span className="text-xs font-black">
                    LKR {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t-2 border-[#0C1A14] pt-4 text-xs text-[#0C1A14]/70">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-black text-[#0C1A14]">
                  LKR {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Courier Fee</span>
                <span className="text-[#6E8071] font-semibold">
                  {shippingFee === 0 ? "FREE" : `LKR ${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between border-t-2 border-[#0C1A14] pt-3 text-xl font-black text-[#0C1A14]">
                <span>Order Total</span>
                <span className="text-[#0C1A14]">
                  LKR {total.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="motion-magnetic flex w-full items-center justify-center gap-2 border-2 border-[#0C1A14] bg-[#0C1A14] py-4 text-sm font-black uppercase tracking-widest text-white transition-colors hover:bg-transparent hover:text-[#0C1A14]"
            >
              {isSubmitting
                ? "Placing Order..."
                : `Place Order • LKR ${total.toLocaleString()}`}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
