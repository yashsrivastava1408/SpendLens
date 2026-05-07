// app/audit/[id]/page.tsx
// Public shareable audit result page
// SSR for OG meta tags, no PII displayed

import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import AuditPageClient from "./AuditPageClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getAudit(id: string) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("audits")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const audit = await getAudit(id);

  if (!audit) {
    return {
      title: "Audit Not Found — SpendLens",
    };
  }

  const savings = audit.total_monthly_savings || 0;
  const annualSavings = savings * 12;

  return {
    title: `I'm saving $${savings}/mo on AI tools — SpendLens`,
    description: `SpendLens found $${savings}/mo ($${annualSavings.toLocaleString()}/yr) in AI tool savings. Get your free audit.`,
    openGraph: {
      title: `I'm saving $${savings}/mo on AI tools`,
      description: `SpendLens audit found $${savings}/mo in potential savings across my AI tool stack. That's $${annualSavings.toLocaleString()}/year. Get your free audit.`,
      type: "website",
      siteName: "SpendLens",
    },
    twitter: {
      card: "summary_large_image",
      title: `I'm saving $${savings}/mo on AI tools`,
      description: `SpendLens found $${annualSavings.toLocaleString()}/yr in AI tool savings. Get your free audit.`,
    },
  };
}

export default async function AuditPage({ params }: PageProps) {
  const { id } = await params;
  const audit = await getAudit(id);

  if (!audit) {
    notFound();
  }

  return <AuditPageClient audit={audit} id={id} />;
}
