import { NextRequest, NextResponse } from "next/server";

// ============================================
// Share Target API Handler
// ============================================
// Handles shared content from other apps when BetaForge
// is installed as a PWA and registered as a share target

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const title = formData.get("title") as string || "";
    const text = formData.get("text") as string || "";
    const url = formData.get("url") as string || "";

    console.log("[Share Target] Received:", { title, text, url });

    // Extract URL from text if not provided directly
    let targetUrl = url;
    if (!targetUrl && text) {
      const urlMatch = text.match(/(https?:\/\/[^\s]+)/);
      if (urlMatch) {
        targetUrl = urlMatch[1];
      }
    }

    // Redirect to project creation with the shared URL
    const redirectUrl = new URL("/dashboard/projects/new", request.url);
    
    if (targetUrl) {
      redirectUrl.searchParams.set("url", targetUrl);
    }
    if (title) {
      redirectUrl.searchParams.set("name", title);
    }
    redirectUrl.searchParams.set("shared", "true");

    return NextResponse.redirect(redirectUrl, 303);
  } catch (error) {
    console.error("[Share Target] Error:", error);
    return NextResponse.redirect(new URL("/dashboard", request.url), 303);
  }
}

export async function GET(request: NextRequest) {
  // Handle GET requests from share target (for text/url shares)
  const searchParams = request.nextUrl.searchParams;
  
  const title = searchParams.get("title") || "";
  const text = searchParams.get("text") || "";
  const url = searchParams.get("url") || "";

  const redirectUrl = new URL("/dashboard/projects/new", request.url);
  
  if (url) {
    redirectUrl.searchParams.set("url", url);
  }
  if (title) {
    redirectUrl.searchParams.set("name", title);
  }
  if (text && !url) {
    // Try to extract URL from text
    const urlMatch = text.match(/(https?:\/\/[^\s]+)/);
    if (urlMatch) {
      redirectUrl.searchParams.set("url", urlMatch[1]);
    }
  }
  redirectUrl.searchParams.set("shared", "true");

  return NextResponse.redirect(redirectUrl, 303);
}
