"use client";

import { useState } from "react";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Download, FileText, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface PDFExportButtonProps {
  elementId: string;
  filename?: string;
}

export default function PDFExportButton({ elementId, filename = "spendlens-audit.pdf" }: PDFExportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    const element = document.getElementById(elementId);
    if (!element) return;

    setIsGenerating(true);
    try {
      // Capture the element
      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true,
        backgroundColor: "#0a0a0f", // Match app background
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width / 2, canvas.height / 2],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(filename);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ShadcnButton
      variant="outline"
      size="sm"
      className="glass border-border/40 hover:bg-white/5 transition-all gap-2"
      onClick={handleDownload}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Generating...</span>
        </>
      ) : (
        <>
          <FileText className="w-4 h-4" />
          <span>Download PDF Report</span>
        </>
      )}
    </ShadcnButton>
  );
}
