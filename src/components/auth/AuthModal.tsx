"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  X,
  Mail,
  Lock,
  User,
  ShieldCheck,
  ArrowRight,
  Crown,
  Shield,
  UserCheck,
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    loginWithFacebook,
  } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password, name);
      }
      onClose();
    } catch (err: any) {
      setError(
        err.message || "Authentication failed. Please check credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string, demoPass: string) => {
    setError("");
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoading(true);
    try {
      await loginWithEmail(demoEmail, demoPass);
      onClose();
    } catch (err: any) {
      setError(err.message || "Demo login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      setError("Google sign in failed.");
    }
  };

  const handleFacebook = async () => {
    try {
      await loginWithFacebook();
      onClose();
    } catch (err: any) {
      setError("Facebook sign in failed.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-[#E5DFD5] max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-4">
          <span className="inline-block p-3 bg-[#F3EFEA] text-[#23382B] rounded-full mb-2">
            <ShieldCheck className="w-6 h-6" />
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#1C2826]">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-xs text-[#5C6B66] mt-1">
            Sign in to access your bookings, orders & admin roles
          </p>
        </div>

        {/* 1-Click Demo Accounts Bar */}
        <div className="mb-4 p-3 bg-[#FAF8F5] border border-[#E5DFD5] rounded-2xl space-y-2">
          <span className="text-[10px] font-bold text-[#1C2826] uppercase tracking-wider block text-center">
            ⚡ 1-Click Test Sign In (Auto Firebase Register)
          </span>
          <div className="grid grid-cols-2 gap-1.5 text-[11px] font-bold">
            <button
              onClick={() =>
                handleQuickDemoLogin(
                  "superadmin@wildroute.lk",
                  "SuperAdmin@123456",
                )
              }
              className="p-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl flex items-center justify-center gap-1 transition"
            >
              <Crown className="w-3.5 h-3.5" /> SuperAdmin
            </button>
            <button
              onClick={() =>
                handleQuickDemoLogin("admin@wildroute.lk", "Admin@123456")
              }
              className="p-2 bg-[#C86D51] hover:bg-[#B35B40] text-white rounded-xl flex items-center justify-center gap-1 transition"
            >
              <Shield className="w-3.5 h-3.5" /> Owner Admin
            </button>
            <button
              onClick={() =>
                handleQuickDemoLogin("staff@wildroute.lk", "Staff@123456")
              }
              className="p-2 bg-[#23382B] hover:bg-[#192B20] text-white rounded-xl flex items-center justify-center gap-1 transition"
            >
              <UserCheck className="w-3.5 h-3.5" /> Staff
            </button>
            <button
              onClick={() =>
                handleQuickDemoLogin("customer@gmail.com", "Customer@123456")
              }
              className="p-2 bg-white text-[#1C2826] border border-[#E5DFD5] hover:bg-[#F3EFEA] rounded-xl flex items-center justify-center gap-1 transition"
            >
              <User className="w-3.5 h-3.5" /> Customer
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            {error}
          </div>
        )}

        {/* Quick OAuth options */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={handleGoogle}
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#FAF8F5] hover:bg-[#F3EFEA] border border-[#E5DFD5] rounded-xl text-xs font-semibold text-[#1C2826] transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.35 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.2.0 10.05.0 12s.47 3.8 1.29 5.42l3.99-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            Google
          </button>
          <button
            onClick={handleFacebook}
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#1877F2] hover:bg-[#166FE5] text-white rounded-xl text-xs font-semibold transition"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </button>
        </div>

        <div className="relative flex items-center justify-center mb-4">
          <div className="border-t border-[#E5DFD5] w-full"></div>
          <span className="bg-white px-3 text-[10px] text-[#8E9B96] uppercase tracking-wider font-semibold">
            Or with email
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-[#1C2826] uppercase mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-[#8E9B96]" />
                <input
                  type="text"
                  required
                  placeholder="Thiruna Samarasinghe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-field w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl text-sm focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#1C2826] uppercase mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#8E9B96]" />
              <input
                type="email"
                required
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-field w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl text-sm focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C2826] uppercase mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#8E9B96]" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-field w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl text-sm focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="motion-magnetic w-full flex items-center justify-center gap-2 py-3 bg-[#23382B] hover:bg-[#192B20] text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-[#23382B]/20"
          >
            {loading ? (
              <LoadingSpinner
                size="sm"
                label=""
                className="inline-flex flex-row"
              />
            ) : (
              <>
                {isLogin ? "Sign In / Auto-Register" : "Create Account"}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-[#5C6B66]">
          {isLogin ? "Don't have an account? " : "Already registered? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-bold text-[#23382B] underline hover:text-[#C86D51]"
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </div>
      </div>
    </div>
  );
};
