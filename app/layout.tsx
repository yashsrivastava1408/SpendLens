import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
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
    <html lang="en" className={`${spaceGrotesk.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col relative bg-background overflow-x-hidden text-foreground">
        {/* Animated Aurora Background */}
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none aurora-container">
          <div className="aurora-blob aurora-1" />
          <div className="aurora-blob aurora-2" />
          <div className="aurora-blob aurora-3" />
          
          {/* Subtle noise overlay for texture using inline SVG */}
          <div 
            className="absolute inset-0 opacity-[0.015] mix-blend-overlay" 
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
