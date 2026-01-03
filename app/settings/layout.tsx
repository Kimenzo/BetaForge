"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Settings,
  User,
  Shield,
  CreditCard,
  Users,
  Bot,
  Code2,
  SlidersHorizontal,
  ChevronLeft,
} from "lucide-react";

const settingsNav = [
  {
    id: "general",
    label: "General",
    icon: Settings,
    href: "/settings",
    badge: null,
  },
  {
    id: "account",
    label: "Account",
    icon: User,
    href: "/settings/account",
    badge: null,
  },
  {
    id: "security",
    label: "Security",
    icon: Shield,
    href: "/settings/security",
    badge: "!",
    badgeColor: "bg-yellow-500/20 text-yellow-500",
  },
  {
    id: "billing",
    label: "Billing",
    icon: CreditCard,
    href: "/settings/billing",
    badge: null,
  },
  {
    id: "divider1",
    label: "",
    icon: null,
    href: "",
    badge: null,
  },
  {
    id: "team",
    label: "Team",
    icon: Users,
    href: "/settings/team",
    badge: "3",
    badgeColor: "bg-white/10 text-white",
  },
  {
    id: "agents",
    label: "Agents",
    icon: Bot,
    href: "/settings/agents",
    badge: null,
  },
  {
    id: "api",
    label: "API & Integrations",
    icon: Code2,
    href: "/settings/api",
    badge: null,
  },
  {
    id: "divider2",
    label: "",
    icon: null,
    href: "",
    badge: null,
  },
  {
    id: "advanced",
    label: "Advanced",
    icon: SlidersHorizontal,
    href: "/settings/advanced",
    badge: null,
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-void-black">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neural/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-electric-cyan/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex">
        {/* Sidebar */}
        <aside className="w-[280px] h-screen sticky top-0 border-r border-white/10 bg-void-black/50 backdrop-blur-xl overflow-y-auto">
          <div className="p-6">
            {/* Back to Dashboard */}
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-phantom-gray hover:text-white transition-colors mb-6 group"
            >
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Dashboard
            </Link>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-1">Settings</h2>
              <p className="text-sm text-phantom-gray">
                Manage your account and preferences
              </p>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              {settingsNav.map((item) => {
                if (item.id.startsWith("divider")) {
                  return (
                    <div
                      key={item.id}
                      className="my-4 border-t border-white/10"
                    />
                  );
                }

                const isActive =
                  item.href === "/settings"
                    ? pathname === "/settings"
                    : pathname.startsWith(item.href);
                const Icon = item.icon!;

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? "bg-neural/10 text-neural-bright"
                        : "text-phantom-gray hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-5 h-5 transition-colors ${
                          isActive
                            ? "text-neural-bright"
                            : "text-phantom-gray group-hover:text-white"
                        }`}
                      />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-h-screen">{children}</main>
      </div>
    </div>
  );
}
