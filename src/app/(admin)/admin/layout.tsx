'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import {
  Shield,
  LayoutDashboard,
  Package,
  MapPin,
  ShoppingBag,
  Users,
  LogOut,
  Compass,
  Crown,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // RBAC Permission Check: Must be superadmin, admin, or staff
  const isAuthorized =
    user && (user.role === 'superadmin' || user.role === 'admin' || user.role === 'staff');

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-[#E5DFD5] shadow-2xl max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#23382B] text-white flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#1C2826]">Admin & Staff Portal</h2>
          <p className="text-xs text-[#5C6B66]">
            Please sign in with an authorized SuperAdmin, Admin, or Staff account to manage WildRoute Adventures.
          </p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full py-3 bg-[#23382B] text-white rounded-xl text-xs font-semibold hover:bg-[#192B20] transition"
          >
            Sign In to Admin Portal
          </button>
          <Link href="/" className="inline-block text-xs text-[#8E9B96] underline">
            ← Return to Storefront
          </Link>
        </div>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-[#E5DFD5] shadow-2xl max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#C86D51] text-white flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#1C2826]">Access Restricted</h2>
          <p className="text-xs text-[#5C6B66]">
            Your current account role is <span className="font-bold uppercase text-[#23382B]">{user.role}</span>. Administrative privileges required.
          </p>
          <Link href="/" className="inline-block px-6 py-2.5 bg-[#23382B] text-white rounded-xl text-xs font-semibold">
            Back to Customer Store
          </Link>
        </div>
      </div>
    );
  }

  const navLinks = [
    { href: '/admin', label: 'Analytics Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Manage Products', icon: Package },
    { href: '/admin/tours', label: 'Manage Expeditions', icon: MapPin },
    { href: '/admin/orders', label: 'Manage Orders', icon: ShoppingBag },
    { href: '/admin/bookings', label: 'Manage Bookings', icon: MapPin },
    ...(user.role === 'superadmin' || user.role === 'admin'
      ? [{ href: '/admin/users', label: 'User Roles & RBAC', icon: Users }]
      : []),
  ];

  return (
    <div className="min-h-screen flex bg-[#FAF8F5]">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-[#E5DFD5] flex flex-col justify-between p-6 shrink-0 hidden md:flex">
        <div className="space-y-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#23382B] text-white flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif font-bold text-base text-[#1C2826] block">WildRoute</span>
              <span className="text-[10px] text-[#C86D51] font-bold tracking-widest uppercase block -mt-1">
                Admin Control
              </span>
            </div>
          </Link>

          <nav className="space-y-1.5">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-[#23382B] text-white shadow-md'
                      : 'text-[#5C6B66] hover:bg-[#FAF8F5] hover:text-[#1C2826]'
                  }`}
                >
                  <IconComponent className="w-4 h-4 shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Admin Profile Footer */}
        <div className="pt-4 border-t border-[#E5DFD5] space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#23382B] text-white font-bold text-xs flex items-center justify-center">
              {user.displayName?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#1C2826] truncate">{user.displayName}</p>
              <span
                className={`text-[10px] text-white px-2 py-0.5 rounded font-bold uppercase ${
                  user.role === 'superadmin' ? 'bg-amber-600' : 'bg-[#C86D51]'
                }`}
              >
                {user.role}
              </span>
            </div>
          </div>

          <div className="flex gap-2 text-xs font-medium pt-2">
            <Link href="/" className="flex-1 p-2 text-center text-black rounded-lg border border-[#E5DFD5]">
              Storefront
            </Link>
            <button onClick={logout} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content View */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[#E5DFD5] px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="md:hidden text-xs font-bold text-[#23382B]">
              ← Store
            </Link>
            <h2 className="font-serif font-bold text-base text-[#1C2826] flex items-center gap-2">
              {user.role === 'superadmin' && <Crown className="w-4 h-4 text-amber-600" />}
              WildRoute Backend Administration
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#6E8071] bg-[#F3EFEA] px-3 py-1 rounded-full border border-[#E5DFD5]">
            Role: <strong className="text-[#1C2826] uppercase">{user.role}</strong>
          </span>
        </header>

        <main className="p-6 md:p-10 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
