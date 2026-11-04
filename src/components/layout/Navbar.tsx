"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { NavLinkText } from "@/components/animations/NavLinkText";
import { ShoppingBag, User, Menu, X, LogOut, Shield } from "lucide-react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Gear" },
  { href: "/tours", label: "Experiences" },
  { href: "/about", label: "Community" },
];

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  return (
    <>
      <header className="nav-isolated-wrapper absolute top-0 left-0 w-full z-50 bg-transparent text-white font-sans">
        <div className="w-full flex items-center justify-between px-6 md:px-12 h-20">
          <Link
            href="/"
            data-nav-brand
            className="nav-item-discrete nav-link text-2xl md:text-3xl font-serif font-bold tracking-tight"
          >
            <NavLinkText>WildRoute</NavLinkText>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-widest font-semibold">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-item-discrete nav-link hover:text-[#F3CE32] transition-colors"
              >
                <NavLinkText>{item.label}</NavLinkText>
              </Link>
            ))}

            {(user?.role === "admin" || user?.role === "staff") && (
              <Link
                href="/admin"
                className="nav-item-discrete nav-link flex items-center gap-1 text-[#F3CE32]"
              >
                <Shield className="w-3.5 h-3.5" />
                <NavLinkText>Admin</NavLinkText>
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="motion-magnetic flex items-center gap-2 p-1.5 border border-white/20 hover:bg-white/5 transition"
                  data-magnetic-strength="0.18"
                >
                  <div className="w-6 h-6 bg-[#F3CE32] text-black flex items-center justify-center text-xs font-bold">
                    {user.displayName?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="hidden sm:inline text-xs font-bold uppercase tracking-widest max-w-25 truncate">
                    {user.displayName?.split(" ")[0]}
                  </span>
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#0C1A14] border border-white/20 py-2 z-50">
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="text-xs font-bold uppercase tracking-widest truncate">
                        {user.displayName}
                      </p>
                      <p className="text-[10px] text-white/50 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href="/account"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-white/5"
                    >
                      <User className="w-3.5 h-3.5" />
                      Account
                    </Link>
                    {(user.role === "admin" || user.role === "staff") && (
                      <Link
                        href="/admin"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#F3CE32] hover:bg-white/5"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-white/5 text-left border-t border-white/10 mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/admin"
                onClick={() => setIsAuthModalOpen(true)}
                className="motion-magnetic hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-white/20 hover:bg-white/5 text-xs font-bold uppercase tracking-widest transition"
                data-magnetic-strength="0.2"
              >
                <User className="w-3.5 h-3.5" />
                Sign In
              </Link>
            )}

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="cart-widget motion-magnetic relative p-2.5 bg-white text-black hover:bg-[#F3CE32] transition flex items-center gap-2"
              data-magnetic-strength="0.22"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">
                Bag
              </span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#F3CE32] text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center border border-black">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="motion-magnetic lg:hidden p-2 text-white hover:bg-white/5"
              data-magnetic-strength="0.16"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#0C1A14] border-t border-white/10 px-6 py-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="nav-link block text-xs font-bold uppercase tracking-widest hover:text-[#F3CE32]"
              >
                <NavLinkText>{item.label}</NavLinkText>
              </Link>
            ))}
            {!user && (
              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="block text-xs font-bold uppercase tracking-widest hover:text-[#F3CE32] text-left w-full"
              >
                Sign In
              </button>
            )}
            {(user?.role === "admin" || user?.role === "staff") && (
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-xs font-bold uppercase tracking-widest text-[#F3CE32]"
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        )}
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      <CartDrawer />
    </>
  );
};
