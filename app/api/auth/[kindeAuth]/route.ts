import { NextResponse } from "next/server";

// Kinde auth is disabled - set KINDE_ISSUER_URL and other env vars to enable
// See: https://kinde.com/docs/developer-tools/nextjs-sdk/

export async function GET() {
  return NextResponse.json(
    { error: "Authentication not configured. Set Kinde environment variables to enable." },
    { status: 503 }
  );
}
