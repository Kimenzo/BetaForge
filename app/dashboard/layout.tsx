"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-void-black">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Mesh gradient */}
        <div className="absolute inset-0 mesh-bg opacity-30" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(to right, white 1px, transparent 1px),
              linear-gradient(to bottom, white 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main content */}
      <main
        className={`relative min-h-screen transition-all duration-500 ease-out-expo ${
          sidebarCollapsed ? "ml-20" : "ml-72"
        }`}
      >
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
