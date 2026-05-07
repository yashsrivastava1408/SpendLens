"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CredexCTAProps {
  totalMonthlySavings: number;
}

export default function CredexCTA({ totalMonthlySavings }: CredexCTAProps) {
  return (
    <Card
      className="relative overflow-hidden border-credex-purple/30 glow-purple"
      id="credex-cta"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-credex-purple/10 via-transparent to-credex-purple/5" />

      <CardContent className="relative p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">💎</span>
              <h3 className="text-lg font-bold text-gradient-purple">
                Save Even More with Credex
              </h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-1">
              You&apos;re overspending by{" "}
              <span className="font-bold text-foreground">
                ${totalMonthlySavings.toLocaleString()}/mo
              </span>{" "}
              on plan inefficiencies alone. Credex discounted credits can reduce your
              remaining AI tool spend by an additional{" "}
              <span className="font-bold text-credex-purple-light">20-40%</span>.
            </p>
            <p className="text-xs text-muted-foreground/80 mt-2">
              No commitments. Apply credits to any supported AI tool.
            </p>
          </div>
          <Button
            className="bg-credex-purple hover:bg-credex-purple/90 text-white font-semibold px-6 py-2.5 shadow-lg shadow-credex-purple/20 transition-all hover:shadow-xl hover:shadow-credex-purple/30 shrink-0"
            onClick={() =>
              window.open("https://credex.money", "_blank", "noopener,noreferrer")
            }
            id="credex-cta-btn"
          >
            Explore Credex Credits →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
