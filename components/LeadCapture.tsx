"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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

interface LeadCaptureProps {
  auditId: string;
  totalMonthlySavings: number;
}

export default function LeadCapture({ auditId, totalMonthlySavings }: LeadCaptureProps) {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [honeypot, setHoneypot] = useState(""); // Hidden field — bots fill this
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check — if this field has a value, silently reject
    if (honeypot) {
      setStatus("success"); // Fake success for bots
      return;
    }

    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auditId,
          email,
          companyName: companyName || undefined,
          role: role || undefined,
          teamSize: teamSize ? parseInt(teamSize) : undefined,
          totalMonthlySavings,
          website: honeypot, // honeypot field name on server
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save your information. Please try again.");
      }

      setStatus("success");
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <Card className="glass border-emerald-glow/30 glow-emerald" id="lead-capture-success">
        <CardContent className="p-8 text-center">
          <span className="text-5xl mb-4 block">🎉</span>
          <h3 className="text-xl font-bold mb-2">You&apos;re All Set!</h3>
          <p className="text-muted-foreground">
            We&apos;ve sent a copy of your audit to{" "}
            <span className="text-foreground font-medium">{email}</span>. Watch for
            personalized savings tips from our team.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass border-border/50" id="lead-capture">
      <CardContent className="p-6 sm:p-8">
        <div className="text-center mb-6">
          <span className="text-3xl mb-2 block">📧</span>
          <h3 className="text-xl font-bold mb-1">Get Your Full Report</h3>
          <p className="text-sm text-muted-foreground">
            Enter your email to receive a detailed PDF and personalized savings tips.
            No spam — just value.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
          {/* Honeypot — hidden from humans, bots fill it */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label htmlFor="website-hp">Website</label>
            <input
              type="text"
              id="website-hp"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lead-email" className="text-sm font-medium">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="lead-email"
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background/50 border-border/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lead-company" className="text-sm font-medium">
              Company Name{" "}
              <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Input
              id="lead-company"
              type="text"
              placeholder="Acme Corp"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="bg-background/50 border-border/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="lead-role" className="text-sm font-medium">
                Role{" "}
                <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Select value={role} onValueChange={(val) => setRole(val ?? "")}>
                <SelectTrigger
                  id="lead-role"
                  className="bg-background/50 border-border/50"
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="founder">Founder / CEO</SelectItem>
                  <SelectItem value="cto">CTO / VP Eng</SelectItem>
                  <SelectItem value="engineering-manager">
                    Engineering Manager
                  </SelectItem>
                  <SelectItem value="developer">Developer / IC</SelectItem>
                  <SelectItem value="ops">DevOps / Platform</SelectItem>
                  <SelectItem value="finance">Finance / Ops</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lead-team-size" className="text-sm font-medium">
                Team Size{" "}
                <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Input
                id="lead-team-size"
                type="number"
                min={1}
                placeholder="e.g. 12"
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                className="bg-background/50 border-border/50"
              />
            </div>
          </div>

          {status === "error" && (
            <p className="text-sm text-destructive">{errorMessage}</p>
          )}

          <Button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all"
            id="lead-submit-btn"
          >
            {status === "loading" ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span> Sending...
              </span>
            ) : (
              "Get My Report →"
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground/60">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
