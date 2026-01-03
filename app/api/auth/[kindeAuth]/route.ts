import { NextResponse } from "next/server";

// Auth provider placeholder
// Configure your preferred auth provider (Clerk, NextAuth, Auth0, etc.)

export async function GET() {
  return NextResponse.json(
    {
      message: "Auth provider not configured. Please set up your preferred authentication solution.",
      suggestions: [
        "Clerk (clerk.com)",
        "NextAuth.js (next-auth.js.org)", 
        "Auth0 (auth0.com)",
        "Supabase Auth (supabase.com/auth)",
      ],
    },
    { status: 503 }
  );
}

export async function POST() {
  return NextResponse.json(
    { error: "Auth provider not configured" },
    { status: 503 }
  );
}
