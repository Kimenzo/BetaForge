import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// ===========================================
// FONT CONFIGURATION - Easy to swap fonts
// ===========================================
// Primary font options to test:
// - Plus_Jakarta_Sans (current - crewai style)
// - Inter
// - Outfit
// - Manrope
// - DM_Sans
// - Poppins
// ===========================================

const primaryFont = Plus_Jakarta_Sans({
  variable: "--font-primary",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const monoFont = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BetaForge - AI-Powered Beta Testing",
  description:
    "Autonomous AI agents that test your apps like real humans and deliver detailed bug reports.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${primaryFont.variable} ${monoFont.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
