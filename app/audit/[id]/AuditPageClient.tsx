"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import type { AuditResult, ToolAuditResult } from "@/lib/audit-engine";

interface AuditPageClientProps {
  audit: {
    id: string;
    results: AuditResult;
    ai_summary: string | null;
    total_monthly_savings: number;
    created_at: string;
  };
  id: string;
}

function ActionBadge({ action }: { action: ToolAuditResult["recommendedAction"] }) {
  const styles = {
    downgrade: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    switch: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    optimal: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    credits: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  };

  const labels = {
    downgrade: "↓ Downgrade",
    switch: "⇄ Switch",
    optimal: "✓ Optimal",
    credits: "💳 Credits",
  };

  return (
    <Badge
      variant="outline"
      className={`${styles[action]} text-xs font-medium px-2.5 py-0.5`}
    >
      {labels[action]}
    </Badge>
  );
}

export default function AuditPageClient({ audit, id }: AuditPageClientProps) {
  const result = audit.results;
  const savings = audit.total_monthly_savings || 0;
  const annualSavings = savings * 12;
  const date = new Date(audit.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen gradient-hero">
      {/* Nav */}
      <nav className="sticky top-0 z-50 glass border-b border-border/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="text-2xl">🔍</span>
            <span className="text-xl font-bold text-gradient-emerald">SpendLens</span>
          </a>
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm"
            onClick={() => (window.location.href = "/")}
          >
            Get Your Free Audit →
          </Button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <p className="text-sm text-muted-foreground mb-2">
            Audit #{id} · Generated {date}
          </p>
          <h1 className="text-3xl sm:text-4xl font-black mb-2">
            AI Spend Audit Results
          </h1>
          <p className="text-muted-foreground">
            Shared via SpendLens — the free AI tool spend analyzer
          </p>
        </div>

        {/* Hero Savings */}
        <Card className="glass border-border/50 glow-emerald mb-8 animate-slide-up">
          <CardContent className="p-8 text-center">
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2">
              Potential Savings Found
            </p>
            <div className="mb-2">
              <span className="text-5xl sm:text-6xl font-black text-gradient-savings">
                ${savings.toLocaleString()}
              </span>
              <span className="text-xl text-muted-foreground ml-2">/month</span>
            </div>
            <p className="text-lg text-muted-foreground">
              <span className="font-semibold text-foreground">
                ${annualSavings.toLocaleString()}
              </span>{" "}
              per year
            </p>

            <Separator className="my-6 bg-border/30" />

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-2xl font-bold">
                  ${result.totalCurrentMonthlySpend?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-muted-foreground">Current Monthly</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-savings-green">
                  {result.tools?.filter((t: ToolAuditResult) => t.monthlySavings > 0).length || 0}
                </p>
                <p className="text-xs text-muted-foreground">Optimizations</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {result.tools?.length || 0}
                </p>
                <p className="text-xs text-muted-foreground">Tools Audited</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Summary */}
        {audit.ai_summary && (
          <Card className="glass border-border/50 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🤖</span>
                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                  AI Analysis
                </h3>
              </div>
              <p className="text-foreground leading-relaxed">{audit.ai_summary}</p>
            </CardContent>
          </Card>
        )}

        {/* Per-tool cards */}
        {result.tools && result.tools.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>📋</span> Per-Tool Breakdown
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.tools.map((tool: ToolAuditResult, idx: number) => (
                <Card
                  key={`${tool.tool}-${idx}`}
                  className="glass-hover glass border-border/30 animate-in"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{tool.toolName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {tool.currentPlan}
                        </p>
                      </div>
                      <ActionBadge action={tool.recommendedAction} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase">
                          Current
                        </p>
                        <p className="text-xl font-bold">
                          ${tool.currentMonthlyCost}
                          <span className="text-xs text-muted-foreground font-normal">
                            /mo
                          </span>
                        </p>
                      </div>
                      {tool.monthlySavings > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground uppercase">
                            Recommended
                          </p>
                          <p className="text-xl font-bold text-savings-green">
                            ${tool.recommendedMonthlyCost}
                            <span className="text-xs text-muted-foreground font-normal">
                              /mo
                            </span>
                          </p>
                        </div>
                      )}
                    </div>

                    {tool.monthlySavings > 0 && (
                      <div className="bg-savings-green/10 rounded-lg p-3 mb-3 border border-savings-green/20">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-savings-green">
                            Savings
                          </span>
                          <span className="text-lg font-bold text-savings-green">
                            ${tool.monthlySavings}/mo
                          </span>
                        </div>
                      </div>
                    )}

                    <p className="text-sm text-muted-foreground">{tool.reasoning}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <Card className="glass border-primary/30 glow-emerald">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">
              Want to audit your own AI spend?
            </h2>
            <p className="text-muted-foreground mb-6">
              Get a free, personalized audit in 60 seconds. No signup required.
            </p>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 text-lg shadow-lg shadow-primary/20"
              onClick={() => (window.location.href = "/")}
            >
              Start Your Free Audit →
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-border/20 text-center">
          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} SpendLens · Powered by{" "}
            <a
              href="https://credex.money"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Credex
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
