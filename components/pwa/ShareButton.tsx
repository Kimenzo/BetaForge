"use client";

import { Share2, Link, Twitter, Linkedin, Mail, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useWebShare } from "@/lib/pwa";

interface ShareButtonProps {
  title: string;
  text?: string;
  url: string;
  variant?: "button" | "icon" | "menu";
}

/**
 * Share Button Component
 * 
 * Uses Web Share API when available, falls back to copy link
 */
export function ShareButton({ title, text, url, variant = "button" }: ShareButtonProps) {
  const { isSupported, share, canShare } = useWebShare();
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareData = { title, text, url };

  const handleShare = async () => {
    if (isSupported && canShare(shareData)) {
      await share(shareData);
    } else {
      setShowMenu(true);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const shareLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      name: "Email",
      icon: Mail,
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text || title + "\n" + url)}`,
    },
  ];

  if (variant === "icon") {
    return (
      <button
        onClick={handleShare}
        className="p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
        title="Share"
      >
        <Share2 className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
      >
        <Share2 className="w-4 h-4" />
        <span>Share</span>
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-[#0D0D14] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in">
            <div className="p-2 border-b border-white/10">
              <button
                onClick={handleCopy}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-sm text-gray-300">
                  {copied ? "Copied!" : "Copy link"}
                </span>
              </button>
            </div>
            <div className="p-2">
              {shareLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                  onClick={() => setShowMenu(false)}
                >
                  <link.icon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">{link.name}</span>
                </a>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Share Report Button - Specialized for bug reports
 */
interface ShareReportButtonProps {
  reportId: string;
  reportTitle: string;
  severity: string;
}

export function ShareReportButton({ reportId, reportTitle, severity }: ShareReportButtonProps) {
  const url = typeof window !== "undefined" 
    ? `${window.location.origin}/reports/${reportId}` 
    : `/reports/${reportId}`;

  return (
    <ShareButton
      title={`Bug Report: ${reportTitle}`}
      text={`[${severity.toUpperCase()}] ${reportTitle} - Found by BetaForge AI Testing`}
      url={url}
    />
  );
}
