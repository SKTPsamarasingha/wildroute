import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ScrollingTitle from "@/components/ScrollingTitle";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { GsapProvider } from "@/components/animations/GsapProvider";
import { SiteChrome } from "@/components/layout/SiteChrome";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WildRoute Adventures | Outdoor Gear & Guided Expeditions",
  description:
    "Discover top-tier outdoor adventure gear, camping equipment, and guided mountain treks in Sri Lanka.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0C1A14] text-[#F8F9F5] selection:bg-[#F3CE32] selection:text-[#0C1A14]">
        <AuthProvider>
          <CartProvider>
            <GsapProvider>
              <ScrollingTitle />
              <SiteChrome>{children}</SiteChrome>
            </GsapProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
