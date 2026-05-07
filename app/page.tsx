"use client";

import { useState, useRef } from "react";
import SpendForm from "@/components/SpendForm";
import AuditResults from "@/components/AuditResults";
import LeadCapture from "@/components/LeadCapture";
import { runAudit, generateFallbackSummary } from "@/lib/audit-engine";
import type { ToolInput, AuditContext, AuditResult } from "@/lib/audit-engine";

export default function HomePage() {
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [auditId, setAuditId] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (tools: ToolInput[], context: AuditContext) => {
    setIsLoading(true);

    // Step 1: Run audit (client-side, pure logic)
    const result = runAudit(tools, context);
    setAuditResult(result);

    // Step 2: Get AI summary (server-side API call)
    try {
      const summaryRes = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result, context }),
      });
      if (summaryRes.ok) {
        const data = await summaryRes.json();
        setAiSummary(data.summary);
      } else {
        // Fallback to template
        setAiSummary(generateFallbackSummary(result, context));
      }
    } catch {
      // Fallback to template on any error
      setAiSummary(generateFallbackSummary(result, context));
    }

    // Step 3: Save audit to Supabase (get shareable ID)
    try {
      const auditRes = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tools,
          result,
          aiSummary: aiSummary || generateFallbackSummary(result, context),
          totalMonthlySavings: result.totalMonthlySavings,
        }),
      });
      if (auditRes.ok) {
        const data = await auditRes.json();
        setAuditId(data.id);
        setShareUrl(`${window.location.origin}/audit/${data.id}`);
      }
    } catch {
      // Non-critical — audit still works without storage
    }

    setIsLoading(false);

    // Scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <div className="min-h-screen gradient-hero">
      {/* Nav */}
      <nav className="sticky top-0 z-50 glass border-b border-border/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔍</span>
            <span className="text-xl font-bold text-gradient-emerald">SpendLens</span>
          </div>
          <div className="flex items-center gap-4">
            {shareUrl && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                id="copy-share-url"
              >
                📋 Copy Share Link
              </button>
            )}
            <a
              href="https://credex.money"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-credex-purple-light hover:text-credex-purple transition-colors"
            >
              Powered by Credex
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero Section */}
        <section className="text-center mb-12 animate-slide-up">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 leading-tight">
            Stop Overpaying for{" "}
            <span className="text-gradient-emerald">AI Tools</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Free audit that analyzes your team&apos;s AI tool stack in 60 seconds.
            Get a personalized report with actionable savings — no signup required.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-savings-green" /> Free forever
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-glow" /> No signup needed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-credex-purple-light" /> Takes 60
              seconds
            </span>
          </div>
        </section>

        {/* Spend Form */}
        <section className="mb-8">
          <SpendForm onSubmit={handleSubmit} isLoading={isLoading} />
        </section>

        {/* Results */}
        <div ref={resultsRef}>
          {auditResult && (
            <section className="space-y-8">
              <AuditResults result={auditResult} aiSummary={aiSummary} />

              {/* Share URL */}
              {shareUrl && (
                <div className="flex items-center justify-center gap-3 p-4 glass rounded-xl border border-border/30">
                  <span className="text-sm text-muted-foreground">Share your audit:</span>
                  <code className="text-sm bg-background/50 px-3 py-1.5 rounded-md border border-border/30 font-mono">
                    {shareUrl}
                  </code>
                  <button
                    onClick={() => navigator.clipboard.writeText(shareUrl)}
                    className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                    id="copy-share-url-inline"
                  >
                    Copy
                  </button>
                </div>
              )}

              {/* Lead Capture — always AFTER results */}
              {auditId && (
                <LeadCapture
                  auditId={auditId}
                  totalMonthlySavings={auditResult.totalMonthlySavings}
                />
              )}
            </section>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border/20 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Built for the Credex community. Data never shared. Audit runs in your browser.
          </p>
          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} SpendLens · Prices verified weekly ·{" "}
            <a
              href="https://credex.money"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              credex.money
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
