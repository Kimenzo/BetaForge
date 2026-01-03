"use client";

import Link from "next/link";
import { Sparkles, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md border-b border-gray-100 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-orange-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              BetaForge
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 bg-white/50 backdrop-blur-sm px-2 py-1.5 rounded-full border border-gray-100/50 shadow-sm">
            {[
              { label: "Features", href: "#features" },
              { label: "Agents", href: "/agents" },
              { label: "Pricing", href: "/pricing" },
              { label: "Docs", href: "/docs" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white rounded-full transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-900 text-white font-semibold text-sm transition-all duration-300 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5"
            >
              <span>Start for free</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-6 flex flex-col gap-4 shadow-xl animate-fade-in-up">
           <Link href="#features" className="text-lg font-medium text-gray-900" onClick={() => setMobileMenuOpen(false)}>Features</Link>
           <Link href="/agents" className="text-lg font-medium text-gray-900" onClick={() => setMobileMenuOpen(false)}>Agents</Link>
           <Link href="/pricing" className="text-lg font-medium text-gray-900" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
           <Link href="/docs" className="text-lg font-medium text-gray-900" onClick={() => setMobileMenuOpen(false)}>Docs</Link>
           <hr className="border-gray-100" />
           <Link href="/login" className="text-lg font-medium text-gray-600" onClick={() => setMobileMenuOpen(false)}>Login</Link>
           <Link href="/signup" className="text-lg font-medium text-orange-600" onClick={() => setMobileMenuOpen(false)}>Sign Up Free</Link>
        </div>
      )}
    </header>
  );
}
