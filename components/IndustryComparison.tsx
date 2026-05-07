"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface IndustryComparisonProps {
  data: {
    userSpendPerSeat: number;
    industryBenchmark: number;
    percentDifference: number;
    status: "above" | "below" | "average";
  };
  teamSize: number;
}

export default function IndustryComparison({ data, teamSize }: IndustryComparisonProps) {
  const isAbove = data.status === "above";
  const isBelow = data.status === "below";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="glass border-border/30 overflow-hidden relative group">
        {/* Animated Background Glow */}
        <div 
          className={`absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700 blur-3xl -z-10 ${
            isAbove ? 'bg-red-500' : isBelow ? 'bg-emerald-500' : 'bg-blue-500'
          }`} 
        />
        
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span>📊</span> Benchmark Mode
              </h3>
              <p className="text-muted-foreground text-sm max-w-md">
                Comparing your AI spend per seat against industry averages for a team of {teamSize}.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                  Your Spend / Seat
                </p>
                <p className="text-3xl font-black">
                  ${Math.round(data.userSpendPerSeat)}
                  <span className="text-sm text-muted-foreground font-normal ml-1">/mo</span>
                </p>
              </div>
              
              <div className="h-12 w-px bg-border/30" />
              
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                  Benchmark
                </p>
                <p className="text-3xl font-black opacity-60">
                  ${data.industryBenchmark}
                  <span className="text-sm text-muted-foreground font-normal ml-1">/mo</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            {/* Visual Gauge */}
            <div className="relative h-4 w-full bg-secondary/30 rounded-full overflow-hidden border border-border/20">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (data.userSpendPerSeat / (data.industryBenchmark * 2)) * 100)}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  isAbove ? 'bg-red-500' : isBelow ? 'bg-emerald-500' : 'bg-blue-500'
                } glow-sm shadow-[0_0_15px_rgba(0,0,0,0.5)]`}
              />
              {/* Benchmark Indicator */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-foreground/40 z-10" 
                style={{ left: '50%' }}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] uppercase font-bold text-muted-foreground whitespace-nowrap">
                  Industry Avg
                </div>
              </div>
            </div>

            {/* Insight Message */}
            <div className={`p-4 rounded-xl border flex items-start gap-3 ${
              isAbove 
                ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                : isBelow 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                  : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
            }`}>
              <span className="text-xl">
                {isAbove ? '⚠️' : isBelow ? '✨' : 'ℹ️'}
              </span>
              <div>
                <p className="font-bold text-sm mb-0.5">
                  {isAbove 
                    ? `You're spending ${Math.round(data.percentDifference)}% more than peers.` 
                    : isBelow 
                      ? `You're spending ${Math.round(Math.abs(data.percentDifference))}% less than average.` 
                      : `Your spend is right at the industry average.`}
                </p>
                <p className="text-xs opacity-80 leading-relaxed">
                  {isAbove 
                    ? "Startups of your size typically optimize their stack further. Check the recommendations below to reduce burn."
                    : isBelow 
                      ? "Excellent work. Your team is highly efficient with AI tool procurement. Credex credits can still lower this further."
                      : "You're in the healthy range. Review your stack quarterly to maintain this efficiency as you scale."}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
