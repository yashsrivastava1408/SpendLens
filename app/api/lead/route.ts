// app/api/lead/route.ts
// POST: Saves lead data to Supabase, sends email via Resend
// Honeypot check for abuse protection

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { auditId, email, companyName, role, teamSize, totalMonthlySavings, website } =
      body;

    // Honeypot check — if the hidden "website" field is filled, reject silently
    if (website) {
      return NextResponse.json({ success: true });
    }

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Save to Supabase leads table (service role key — private data)
    if (supabaseAdmin) {
      const { error: dbError } = await supabaseAdmin.from("leads").insert({
        audit_id: auditId || null,
        email,
        company_name: companyName || null,
        role: role || null,
        team_size: teamSize || null,
        total_monthly_savings: totalMonthlySavings || null,
      });

      if (dbError) {
        console.error("Lead insert error:", dbError);
      }
    }

    // Send transactional email via Resend
    if (resend) {
      try {
        await resend.emails.send({
          from: "SpendLens <onboarding@resend.dev>",
          to: email,
          subject: `Your AI Spend Audit — $${totalMonthlySavings || 0}/mo in Savings Found`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #0a0a0f; color: #f5f5f5; border-radius: 12px;">
              <h1 style="color: #4ade80; margin-bottom: 8px;">🔍 SpendLens Audit Results</h1>
              <p style="color: #a1a1aa; margin-bottom: 24px;">Here's a summary of your AI spend audit.</p>
              
              <div style="background: rgba(74, 222, 128, 0.1); border: 1px solid rgba(74, 222, 128, 0.2); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <p style="font-size: 14px; color: #a1a1aa; margin: 0 0 4px;">Potential Monthly Savings</p>
                <p style="font-size: 36px; font-weight: 800; color: #4ade80; margin: 0;">$${totalMonthlySavings || 0}/mo</p>
                <p style="font-size: 14px; color: #a1a1aa; margin: 4px 0 0;">$${(totalMonthlySavings || 0) * 12}/year</p>
              </div>
              
              ${auditId ? `<p style="color: #a1a1aa;">View your full audit: <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://spendlens.vercel.app'}/audit/${auditId}" style="color: #4ade80;">View Audit</a></p>` : ''}
              
              <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 24px 0;" />
              
              <p style="color: #a1a1aa; font-size: 12px;">
                💎 Want to save even more? <a href="https://credex.money" style="color: #a78bfa;">Explore Credex credits</a> for 20-40% off your AI tools.
              </p>
              
              <p style="color: #71717a; font-size: 11px; margin-top: 24px;">
                Sent by SpendLens · <a href="mailto:support@spendlens.app" style="color: #71717a;">Unsubscribe</a>
              </p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Resend email error:", emailError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Lead API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
