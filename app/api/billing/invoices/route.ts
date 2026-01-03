import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = createServerClient();

    // Get current user
    const { data: users } = await supabase
      .from("users")
      .select("id")
      .limit(1)
      .single();

    if (!users) {
      return NextResponse.json({ invoices: [] });
    }

    // Get invoices
    const { data: invoices, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("user_id", users.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ invoices: invoices || [] });
  } catch (error) {
    console.error("Get invoices error:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}
