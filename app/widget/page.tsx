"use client";

import { useState } from "react";
import SpendForm from "@/components/SpendForm";
import AuditResults from "@/components/AuditResults";
import { runAudit } from "@/lib/audit-engine";
import type { ToolInput, AuditContext, AuditResult } from "@/lib/audit-engine";

export default function WidgetPage() {
  const [result, setResult] = useState<AuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (tools: ToolInput[], context: AuditContext) => {
    setIsLoading(true);
    // Logic only, no AI or DB for the widget to keep it fast and lightweight
    const auditResult = runAudit(tools, context);
    setResult(auditResult);
    setIsLoading(false);
  };

  return (
    <div className="p-4 bg-background min-h-screen max-w-xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔍</span>
          <span className="font-bold text-gradient-emerald">SpendLens</span>
        </div>
        <a 
          href="https://spendlens.vercel.app" 
          target="_blank" 
          className="text-[10px] text-muted-foreground hover:text-primary uppercase tracking-widest transition-colors"
        >
          Full Audit →
        </a>
      </div>

      {!result ? (
        <SpendForm onSubmit={handleSubmit} isLoading={isLoading} />
      ) : (
        <div className="space-y-4">
          <AuditResults result={result} />
          <button 
            onClick={() => setResult(null)}
            className="w-full py-2 text-xs text-muted-foreground hover:text-primary transition-colors border border-dashed border-border/30 rounded-lg"
          >
            ← Back to Form
          </button>
        </div>
      )}
      
      <div className="mt-4 text-center">
        <p className="text-[10px] text-muted-foreground/50">
          Powered by Credex · Secure & Private
        </p>
      </div>
    </div>
  );
}
