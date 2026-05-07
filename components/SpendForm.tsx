"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TOOLS, getPlansForTool, getPlanBySlug } from "@/lib/pricing-data";
import type { ToolInput, AuditContext } from "@/lib/audit-engine";

const STORAGE_KEY = "spendlens-form-data";

const USE_CASES = [
  { value: "coding", label: "Coding / Development" },
  { value: "writing", label: "Writing / Content" },
  { value: "data", label: "Data Analysis" },
  { value: "research", label: "Research" },
  { value: "mixed", label: "Mixed / Multiple" },
] as const;

const TOOL_OPTIONS = Object.values(TOOLS).map((t) => ({
  value: t.slug,
  label: t.name,
}));

interface FormToolEntry {
  id: string;
  tool: string;
  plan: string;
  seats: number;
  monthlyCost: number;
}

interface FormData {
  teamSize: number;
  useCase: AuditContext["useCase"];
  tools: FormToolEntry[];
}

function createEmptyTool(): FormToolEntry {
  return {
    id: crypto.randomUUID(),
    tool: "",
    plan: "",
    seats: 1,
    monthlyCost: 0,
  };
}

function getDefaultFormData(): FormData {
  return {
    teamSize: 1,
    useCase: "coding",
    tools: [createEmptyTool()],
  };
}

interface SpendFormProps {
  onSubmit: (tools: ToolInput[], context: AuditContext) => void;
  isLoading?: boolean;
}

export default function SpendForm({ onSubmit, isLoading }: SpendFormProps) {
  const [formData, setFormData] = useState<FormData>(getDefaultFormData);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as FormData;
        setFormData(parsed);
      }
    } catch {
      // Ignore parse errors
    }
    setHasLoaded(true);
  }, []);

  // Save to localStorage on every change
  useEffect(() => {
    if (!hasLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch {
      // Ignore storage errors
    }
  }, [formData, hasLoaded]);

  const updateTool = useCallback(
    (id: string, updates: Partial<FormToolEntry>) => {
      setFormData((prev) => ({
        ...prev,
        tools: prev.tools.map((t) =>
          t.id === id ? { ...t, ...updates } : t
        ),
      }));
    },
    []
  );

  const addTool = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      tools: [...prev.tools, createEmptyTool()],
    }));
  }, []);

  const removeTool = useCallback((id: string) => {
    setFormData((prev) => ({
      ...prev,
      tools: prev.tools.length > 1 ? prev.tools.filter((t) => t.id !== id) : prev.tools,
    }));
  }, []);

  // Auto-populate cost when tool + plan + seats are selected
  const handleToolChange = useCallback(
    (id: string, toolSlug: string) => {
      updateTool(id, { tool: toolSlug, plan: "", monthlyCost: 0 });
    },
    [updateTool]
  );

  const handlePlanChange = useCallback(
    (id: string, planSlug: string, toolSlug: string, seats: number) => {
      const plan = getPlanBySlug(toolSlug, planSlug);
      const cost = plan ? plan.pricePerUser * seats : 0;
      updateTool(id, { plan: planSlug, monthlyCost: cost });
    },
    [updateTool]
  );

  const handleSeatsChange = useCallback(
    (id: string, seats: number, toolSlug: string, planSlug: string) => {
      const plan = getPlanBySlug(toolSlug, planSlug);
      const cost = plan ? plan.pricePerUser * seats : 0;
      updateTool(id, { seats, monthlyCost: cost });
    },
    [updateTool]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validTools: ToolInput[] = formData.tools
      .filter((t) => t.tool && t.plan)
      .map((t) => ({
        tool: t.tool,
        plan: t.plan,
        seats: t.seats,
        monthlyCost: t.monthlyCost,
      }));

    if (validTools.length === 0) return;

    onSubmit(validTools, {
      teamSize: formData.teamSize,
      useCase: formData.useCase,
    });
  };

  if (!hasLoaded) {
    return (
      <Card className="glass border-border/50 animate-pulse">
        <CardContent className="p-8">
          <div className="h-64 bg-muted/20 rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} id="spend-form">
      <Card className="glass border-border/50 glow-emerald">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <span className="text-3xl">📊</span>
            <span>Your AI Tool Stack</span>
          </CardTitle>
          <p className="text-muted-foreground text-sm mt-1">
            Add every AI tool your team uses. We&apos;ll analyze each one for savings.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Global Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="team-size" className="text-sm font-medium">
                Team Size
              </Label>
              <Input
                id="team-size"
                type="number"
                min={1}
                max={10000}
                value={formData.teamSize}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    teamSize: Math.max(1, parseInt(e.target.value) || 1),
                  }))
                }
                className="bg-background/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="use-case" className="text-sm font-medium">
                Primary Use Case
              </Label>
              <Select
                value={formData.useCase}
                onValueChange={(val) => {
                  if (!val) return;
                  setFormData((prev) => ({
                    ...prev,
                    useCase: val as AuditContext["useCase"],
                  }));
                }}
              >
                <SelectTrigger id="use-case" className="bg-background/50 border-border/50">
                  <SelectValue placeholder="Select use case" />
                </SelectTrigger>
                <SelectContent>
                  {USE_CASES.map((uc) => (
                    <SelectItem key={uc.value} value={uc.value}>
                      {uc.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tool Entries */}
          <div className="space-y-4">
            {formData.tools.map((entry, idx) => (
              <div
                key={entry.id}
                className="gradient-card rounded-xl p-4 border border-border/30 space-y-4 animate-in"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Tool {idx + 1}
                  </span>
                  {formData.tools.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTool(entry.id)}
                      className="text-muted-foreground hover:text-destructive h-8 px-2"
                      aria-label={`Remove tool ${idx + 1}`}
                    >
                      ✕
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Tool Select */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor={`tool-${entry.id}`}
                      className="text-xs text-muted-foreground"
                    >
                      AI Tool
                    </Label>
                    <Select
                      value={entry.tool}
                      onValueChange={(val) => { if (val) handleToolChange(entry.id, val); }}
                    >
                      <SelectTrigger
                        id={`tool-${entry.id}`}
                        className="bg-background/50 border-border/50"
                      >
                        <SelectValue placeholder="Select tool" />
                      </SelectTrigger>
                      <SelectContent>
                        {TOOL_OPTIONS.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Plan Select */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor={`plan-${entry.id}`}
                      className="text-xs text-muted-foreground"
                    >
                      Plan
                    </Label>
                    <Select
                      value={entry.plan}
                      onValueChange={(val) => {
                        if (val) handlePlanChange(entry.id, val, entry.tool, entry.seats);
                      }}
                      disabled={!entry.tool}
                    >
                      <SelectTrigger
                        id={`plan-${entry.id}`}
                        className="bg-background/50 border-border/50"
                      >
                        <SelectValue placeholder="Select plan" />
                      </SelectTrigger>
                      <SelectContent>
                        {getPlansForTool(entry.tool).map((p) => (
                          <SelectItem key={p.slug} value={p.slug}>
                            {p.name}
                            {p.pricePerUser > 0 && !p.isCustomPricing
                              ? ` ($${p.pricePerUser}/mo)`
                              : p.isCustomPricing
                              ? " (Custom)"
                              : " (Free)"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Seats */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor={`seats-${entry.id}`}
                      className="text-xs text-muted-foreground"
                    >
                      Seats
                    </Label>
                    <Input
                      id={`seats-${entry.id}`}
                      type="number"
                      min={1}
                      max={10000}
                      value={entry.seats}
                      onChange={(e) =>
                        handleSeatsChange(
                          entry.id,
                          Math.max(1, parseInt(e.target.value) || 1),
                          entry.tool,
                          entry.plan
                        )
                      }
                      className="bg-background/50 border-border/50"
                    />
                  </div>

                  {/* Monthly Cost */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor={`cost-${entry.id}`}
                      className="text-xs text-muted-foreground"
                    >
                      Monthly Cost ($)
                    </Label>
                    <Input
                      id={`cost-${entry.id}`}
                      type="number"
                      min={0}
                      step={0.01}
                      value={entry.monthlyCost}
                      onChange={(e) =>
                        updateTool(entry.id, {
                          monthlyCost: Math.max(
                            0,
                            parseFloat(e.target.value) || 0
                          ),
                        })
                      }
                      className="bg-background/50 border-border/50"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Tool + Submit */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={addTool}
              className="border-dashed border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all"
              id="add-tool-btn"
            >
              <span className="mr-2">+</span> Add Another Tool
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading ||
                formData.tools.every((t) => !t.tool || !t.plan)
              }
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 sm:ml-auto transition-all hover:shadow-lg hover:shadow-primary/20"
              id="analyze-btn"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span> Analyzing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  🔍 Analyze My Spend
                </span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
