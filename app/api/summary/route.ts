// app/api/summary/route.ts
// POST: Calls Anthropic API for AI-generated summary
// Falls back to template string if API fails

import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { generateFallbackSummary } from "@/lib/audit-engine";
import type { AuditResult, AuditContext } from "@/lib/audit-engine";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { result, context } = body as {
      result: AuditResult;
      context: AuditContext;
    };

    if (!result || !context) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // If no API key, use fallback immediately
    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json({
        summary: generateFallbackSummary(result, context),
        source: "template",
      });
    }

    // Prepare prompt data
    const toolsList = result.tools
      .map((t) => `${t.toolName} (${t.currentPlan})`)
      .join(", ");
    const currentSpend = result.totalCurrentMonthlySpend;
    const monthlySavings = result.totalMonthlySavings;
    const topRecommendation =
      result.tools.reduce(
        (max, t) => (t.monthlySavings > max.monthlySavings ? t : max),
        result.tools[0]
      ).reasoning.split(".")[0] + ".";

    // Call Anthropic API
    const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 200,
      system:
        "You are a concise financial analyst specializing in AI infrastructure spend. Write exactly 100 words. No markdown. Plain text only.",
      messages: [
        {
          role: "user",
          content: `Summarize this AI spend audit in 100 words:
Team size: ${context.teamSize} | Use case: ${context.useCase}
Tools audited: ${toolsList}
Total current monthly spend: $${currentSpend}
Total potential monthly savings: $${monthlySavings}
Top recommendation: ${topRecommendation}

Write a personalized summary that: names the specific tools, states the savings opportunity clearly, gives one concrete action item, and ends with a forward-looking sentence.
Be direct and specific. Avoid generic advice.`,
        },
      ],
    });

    // Extract text from response
    const textBlock = message.content.find((block) => block.type === "text");
    const summary = textBlock
      ? textBlock.text
      : generateFallbackSummary(result, context);

    return NextResponse.json({ summary, source: "ai" });
  } catch (err) {
    console.error("Summary API error:", err);

    // Fallback to template on any error
    try {
      const body = await request.clone().json();
      return NextResponse.json({
        summary: generateFallbackSummary(body.result, body.context),
        source: "template",
      });
    } catch {
      return NextResponse.json({
        summary:
          "Our audit has identified potential savings in your AI tool stack. Review the per-tool recommendations below for specific action items.",
        source: "template",
      });
    }
  }
}
