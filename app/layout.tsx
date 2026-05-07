import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpendLens — AI Spend Audit Tool",
  description:
    "Audit your startup's AI tool spending in 60 seconds. Get a personalized report showing exactly where you're overpaying — with actionable recommendations to cut costs by 20-40%.",
  keywords: [
    "AI spend audit",
    "AI tools cost",
    "startup cost optimization",
    "Cursor pricing",
    "GitHub Copilot alternatives",
    "AI tool comparison",
    "reduce AI spend",
  ],
  authors: [{ name: "SpendLens" }],
  openGraph: {
    title: "SpendLens — Audit Your AI Tool Spend",
    description:
      "Free audit tool that shows startups where they're overpaying for AI tools. Get a personalized report in 60 seconds.",
    type: "website",
    siteName: "SpendLens",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpendLens — Audit Your AI Tool Spend",
    description:
      "Free audit tool that shows startups where they're overpaying for AI tools.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col relative bg-background overflow-x-hidden text-foreground">
        {/* Animated Aurora Background */}
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-glow/20 blur-[120px] animate-blob mix-blend-screen" />
          <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-credex-purple/20 blur-[120px] animate-blob animation-delay-2000 mix-blend-screen" />
          <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] rounded-full bg-emerald-deep/10 blur-[150px] animate-blob animation-delay-4000 mix-blend-screen" />
          
          {/* Subtle noise overlay for texture using inline SVG */}
          <div 
            className="absolute inset-0 opacity-[0.03] mix-blend-overlay" 
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat'
            }}
          />
        </div>
        
        {children}
      </body>
    </html>
  );
}
