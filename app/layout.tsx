import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
