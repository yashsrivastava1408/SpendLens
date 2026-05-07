// app/api/audit/route.ts
// POST: Saves audit result to Supabase, returns nanoid

import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tools, result, aiSummary, totalMonthlySavings } = body;

    if (!tools || !result) {
      return NextResponse.json(
        { error: "Missing required fields: tools and result" },
        { status: 400 }
      );
    }

    // Generate 8-char nanoid
    const id = nanoid(8);

    // If Supabase is not configured, return ID without storage
    if (!supabaseAdmin) {
      return NextResponse.json({ id, stored: false });
    }

    // Save to Supabase — PII is NOT stored here (no email, no company)
    const { error } = await supabaseAdmin
      .from("audits")
      .insert({
        id,
        tools,
        results: result,
        ai_summary: aiSummary || null,
        total_monthly_savings: totalMonthlySavings || 0,
      });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ id, stored: false });
    }

    return NextResponse.json({ id, stored: true });
  } catch (err) {
    console.error("Audit API error:", err);
    const fallbackId = nanoid(8);
    return NextResponse.json({ id: fallbackId, stored: false });
  }
}
