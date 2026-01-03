"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Zap,
  LayoutDashboard,
  FolderOpen,
  Bug,
  Users,
  Settings,
  Bell,
  Search,
  Command,
  ChevronRight,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/projects", label: "Projects", icon: FolderOpen },
    { href: "/dashboard/reports", label: "Reports", icon: Bug },
    { href: "/agents", label: "Agents", icon: Users },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "glass py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              {/* Animated logo glow */}
              <div className="absolute inset-0 bg-neural-bright/30 blur-xl rounded-full group-hover:bg-neural-bright/50 transition-all duration-500" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-neural-bright to-electric-cyan flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Zap className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold gradient-text">BetaForge</span>
          </Link>

          {/* Center Nav */}
          <div className="hidden md:flex items-center gap-1 glass-light rounded-full px-2 py-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    active
                      ? "bg-neural/20 text-ghost-white shadow-glow"
                      : "text-phantom-gray hover:text-ghost-white hover:bg-white/5"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${active ? "text-neural-bright" : ""}`}
                  />
                  <span>{item.label}</span>
                  {active && (
                    <div className="w-1.5 h-1.5 rounded-full bg-neural-bright animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl bg-void-surface/50 border border-white/5 text-phantom-gray hover:text-ghost-white hover:border-neural/30 transition-all duration-300 group"
            >
              <Search className="w-4 h-4" />
              <span className="text-sm">Search...</span>
              <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-void-elevated text-xs text-mist-gray">
                <Command className="w-3 h-3" />
                <span>K</span>
              </div>
            </button>

            {/* Notifications */}
            <button className="relative p-2.5 rounded-xl bg-void-surface/50 border border-white/5 text-phantom-gray hover:text-ghost-white hover:border-neural/30 transition-all duration-300">
              <Bell className="w-5 h-5" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-plasma-pink animate-pulse" />
            </button>

            {/* Settings */}
            <Link
              href="/settings"
              className="p-2.5 rounded-xl bg-void-surface/50 border border-white/5 text-phantom-gray hover:text-ghost-white hover:border-neural/30 transition-all duration-300"
            >
              <Settings className="w-5 h-5" />
            </Link>

            {/* Profile */}
            <button className="w-10 h-10 rounded-xl bg-gradient-to-br from-neural to-plasma-pink p-[2px] transition-all duration-300 hover:shadow-glow">
              <div className="w-full h-full rounded-[10px] bg-void-black flex items-center justify-center">
                <span className="text-sm font-bold text-ghost-white">A</span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden mt-4 px-6">
          <div className="flex items-center gap-1 glass-light rounded-2xl p-2 overflow-x-auto hide-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    active
                      ? "bg-neural/20 text-ghost-white"
                      : "text-phantom-gray"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Command Palette Modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
          onClick={() => setSearchOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-void-black/80 backdrop-blur-sm animate-fade-in" />

          {/* Modal */}
          <div
            className="relative w-full max-w-2xl mx-4 glass rounded-2xl overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 p-4 border-b border-white/5">
              <Search className="w-5 h-5 text-neural-bright" />
              <input
                type="text"
                placeholder="Search projects, reports, agents..."
                className="flex-1 bg-transparent text-ghost-white placeholder-phantom-gray outline-none text-lg"
                autoFocus
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="px-2 py-1 rounded-lg bg-void-elevated text-xs text-phantom-gray hover:text-ghost-white transition-colors"
              >
                ESC
              </button>
            </div>

            {/* Quick Actions */}
            <div className="p-4">
              <p className="text-xs text-mist-gray uppercase tracking-wider mb-3">
                Quick Actions
              </p>
              <div className="space-y-1">
                {[
                  { label: "Create New Project", icon: FolderOpen, kbd: "N" },
                  { label: "View All Reports", icon: Bug, kbd: "R" },
                  { label: "Browse Agents", icon: Users, kbd: "A" },
                  { label: "Go to Dashboard", icon: LayoutDashboard, kbd: "D" },
                ].map((action) => (
                  <button
                    key={action.label}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-void-elevated transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <action.icon className="w-4 h-4 text-phantom-gray group-hover:text-neural-bright transition-colors" />
                      <span className="text-ghost-white">{action.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-1.5 py-0.5 rounded bg-void-surface text-xs text-mist-gray">
                        {action.kbd}
                      </div>
                      <ChevronRight className="w-4 h-4 text-mist-gray opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent */}
            <div className="p-4 border-t border-white/5">
              <p className="text-xs text-mist-gray uppercase tracking-wider mb-3">
                Recent
              </p>
              <div className="space-y-1">
                {[
                  { label: "E-commerce Platform", type: "Project" },
                  { label: "Button click unresponsive", type: "Report" },
                  { label: "Diego - Chaos Tester", type: "Agent" },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-void-elevated transition-colors group"
                  >
                    <span className="text-ghost-white">{item.label}</span>
                    <span className="text-xs text-mist-gray">{item.type}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
