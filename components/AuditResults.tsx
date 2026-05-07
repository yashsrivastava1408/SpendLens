"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import type { AuditResult, ToolAuditResult } from "@/lib/audit-engine";
import CredexCTA from "./CredexCTA";
import IndustryComparison from "./IndustryComparison";
import PDFExportButton from "./PDFExportButton";

interface AuditResultsProps {
  result: AuditResult;
  aiSummary?: string | null;
}

function AnimatedNumber({ value, prefix = "$" }: { value: number; prefix?: string }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(value, Math.round(increment * step));
      setDisplayed(current);
      if (step >= steps) {
        clearInterval(timer);
        setDisplayed(value);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span className="tabular-nums">
      {prefix}
      {displayed.toLocaleString()}
    </span>
  );
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

function ToolCard({ tool }: { tool: ToolAuditResult }) {
  const hasSavings = tool.monthlySavings > 0;

  return (
    <Card className="glass-hover glass border-border/30 overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg">{tool.toolName}</h3>
            <p className="text-sm text-muted-foreground">
              Currently on {tool.currentPlan}
            </p>
          </div>
          <ActionBadge action={tool.recommendedAction} />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Current
            </p>
            <p className="text-xl font-bold text-foreground">
              ${tool.currentMonthlyCost}
              <span className="text-xs text-muted-foreground font-normal">/mo</span>
            </p>
          </div>
          {hasSavings && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Recommended
              </p>
              <p className="text-xl font-bold text-savings-green">
                ${tool.recommendedMonthlyCost}
                <span className="text-xs text-muted-foreground font-normal">/mo</span>
              </p>
            </div>
          )}
        </div>

        {hasSavings && (
          <div className="bg-savings-green/10 rounded-lg p-3 mb-3 border border-savings-green/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-savings-green">
                Monthly Savings
              </span>
              <span className="text-lg font-bold text-savings-green">
                ${tool.monthlySavings}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              ${tool.annualSavings.toLocaleString()}/year
            </p>
          </div>
        )}

        <p className="text-sm text-muted-foreground leading-relaxed">
          {tool.reasoning}
        </p>

        {tool.credexSavingsEstimate > 0 && tool.recommendedAction !== "optimal" && (
          <div className="mt-3 pt-3 border-t border-border/20">
            <p className="text-xs text-credex-purple-light">
              💎 Credex credits: save an additional ~$
              {Math.round(tool.credexSavingsEstimate)}/mo
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AuditResults({ result, aiSummary }: AuditResultsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="space-y-6" id="audit-results-container" />;

  const savingsColor =
    result.savingsTier === "high"
      ? "text-gradient-savings"
      : result.savingsTier === "medium"
      ? "text-gradient-emerald"
      : result.savingsTier === "optimal"
      ? "text-muted-foreground"
      : "text-foreground";

  return (
    <div className="space-y-6" id="audit-results-container">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-2">
        <h2 className="text-2xl font-black text-gradient-emerald">Audit Results</h2>
        <PDFExportButton elementId="audit-results-container" filename={`spendlens-audit-${new Date().getTime()}.pdf`} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key="hero"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero Savings */}
          <Card className="glass border-border/50 glow-emerald overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <CardContent className="p-8 text-center relative z-10">
              <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2">
                Your Potential Savings
              </p>
              <div className="mb-2">
                <span className={`text-5xl sm:text-6xl font-black ${savingsColor}`}>
                  <AnimatedNumber value={result.totalMonthlySavings} />
                </span>
                <span className="text-xl text-muted-foreground ml-2">/month</span>
              </div>
              <p className="text-lg text-muted-foreground">
                <span className="font-semibold text-foreground">
                  $
                  {result.totalAnnualSavings.toLocaleString()}
                </span>{" "}
                per year
              </p>

              <Separator className="my-6 bg-border/30" />

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    ${result.totalCurrentMonthlySpend.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Current Spend</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-savings-green">
                    {result.tools.filter((t) => t.monthlySavings > 0).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Optimizations Found</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-credex-purple-light">
                    ~${Math.round(result.credexTotalEstimate).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Credex Credits Savings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Benchmark Mode */}
      {result.benchmarkData && (
        <IndustryComparison data={result.benchmarkData} teamSize={result.teamSize || 1} />
      )}

      {/* AI Summary */}
      {aiSummary && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="glass border-border/50 shimmer">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🤖</span>
                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                  AI-Powered Analysis
                </h3>
              </div>
              <p className="text-foreground leading-relaxed">{aiSummary}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Credex CTA for high savings */}
      {result.savingsTier === "high" && (
        <CredexCTA totalMonthlySavings={result.totalMonthlySavings} />
      )}

      {/* Per-tool cards */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>📋</span> Per-Tool Breakdown
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.tools.map((tool, idx) => (
            <div
              key={`${tool.tool}-${idx}`}
              className="animate-in"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <ToolCard tool={tool} />
            </div>
          ))}
        </div>
      </div>

      {/* Honest message for optimal spend */}
      {result.savingsTier === "optimal" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="glass border-emerald-glow/30">
            <CardContent className="p-6 text-center">
              <span className="text-4xl mb-3 block">✅</span>
              <h3 className="text-xl font-bold mb-2">Your Spend is Optimized!</h3>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Great news — you&apos;re already on the right plans for your team size and
                use case. We couldn&apos;t find any meaningful optimizations. Check back as
                your team grows or pricing changes.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Credex CTA for medium savings */}
      {result.savingsTier === "medium" && (
        <CredexCTA totalMonthlySavings={result.totalMonthlySavings} />
      )}
    </div>
  );
}
