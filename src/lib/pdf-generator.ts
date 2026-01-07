import jsPDF from "jspdf";
import type { FeedbackContent, InterviewInfo } from "@/types/interview";

interface PDFGeneratorOptions {
  feedback: FeedbackContent;
  interviewInfo: InterviewInfo;
  completedAt: Date;
}

// Colors
const COLORS = {
  primary: [59, 130, 246] as [number, number, number],
  secondary: [100, 116, 139] as [number, number, number],
  success: [34, 197, 94] as [number, number, number],
  warning: [251, 191, 36] as [number, number, number],
  danger: [239, 68, 68] as [number, number, number],
  dark: [15, 23, 42] as [number, number, number],
  muted: [148, 163, 184] as [number, number, number],
  light: [241, 245, 249] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
};

const getRecommendationColor = (recommendation: string): [number, number, number] => {
  switch (recommendation) {
    case "Strong Hire":
      return COLORS.success;
    case "Hire":
      return [74, 222, 128];
    case "Maybe":
      return COLORS.warning;
    case "No Hire":
      return COLORS.danger;
    default:
      return COLORS.muted;
  }
};

const getScoreColor = (score: number): [number, number, number] => {
  if (score >= 8) return COLORS.success;
  if (score >= 6) return [74, 222, 128];
  if (score >= 4) return COLORS.warning;
  return COLORS.danger;
};

export const generateInterviewPDF = async ({
  feedback,
  interviewInfo,
  completedAt,
}: PDFGeneratorOptions): Promise<Blob> => {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPos = margin;

  // Helper functions
  const addNewPageIfNeeded = (requiredSpace: number) => {
    if (yPos + requiredSpace > pageHeight - margin) {
      pdf.addPage();
      yPos = margin;
      return true;
    }
    return false;
  };

  const drawRoundedRect = (
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
    color: [number, number, number]
  ) => {
    pdf.setFillColor(...color);
    pdf.roundedRect(x, y, w, h, r, r, "F");
  };

  const drawProgressBar = (
    x: number,
    y: number,
    width: number,
    height: number,
    progress: number,
    color: [number, number, number]
  ) => {
    // Background
    pdf.setFillColor(...COLORS.light);
    pdf.roundedRect(x, y, width, height, height / 2, height / 2, "F");
    
    // Progress
    const progressWidth = (progress / 10) * width;
    if (progressWidth > 0) {
      pdf.setFillColor(...color);
      pdf.roundedRect(x, y, progressWidth, height, height / 2, height / 2, "F");
    }
  };

  // ========== HEADER ==========
  // Header background
  drawRoundedRect(margin, yPos, contentWidth, 45, 4, COLORS.primary);

  // Company name
  pdf.setTextColor(...COLORS.white);
  pdf.setFontSize(24);
  pdf.setFont("helvetica", "bold");
  pdf.text("Meridian", margin + 10, yPos + 18);

  // Subtitle
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text("AI-Powered Interview Platform", margin + 10, yPos + 26);

  // Report title
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Interview Feedback Report", margin + 10, yPos + 38);

  yPos += 55;

  // ========== CANDIDATE INFO ==========
  drawRoundedRect(margin, yPos, contentWidth, 40, 4, COLORS.light);

  pdf.setTextColor(...COLORS.dark);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("Candidate Information", margin + 10, yPos + 12);

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...COLORS.secondary);

  const col1X = margin + 10;
  const col2X = margin + contentWidth / 2;

  pdf.text(`Name: ${interviewInfo.userName || "N/A"}`, col1X, yPos + 24);
  pdf.text(`Position: ${interviewInfo.jobPosition || "N/A"}`, col2X, yPos + 24);
  pdf.text(`Email: ${interviewInfo.userEmail || "N/A"}`, col1X, yPos + 32);
  pdf.text(
    `Date: ${completedAt.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`,
    col2X,
    yPos + 32
  );

  yPos += 50;

  // ========== OVERALL SCORE ==========
  const overallScore = feedback.rating.overall;
  const recommendationColor = getRecommendationColor(feedback.recommendation);

  drawRoundedRect(margin, yPos, contentWidth, 50, 4, COLORS.white);
  pdf.setDrawColor(...COLORS.light);
  pdf.roundedRect(margin, yPos, contentWidth, 50, 4, 4, "S");

  // Score circle
  const circleX = margin + 35;
  const circleY = yPos + 25;
  const circleRadius = 18;

  pdf.setFillColor(...getScoreColor(overallScore));
  pdf.circle(circleX, circleY, circleRadius, "F");

  pdf.setTextColor(...COLORS.white);
  pdf.setFontSize(20);
  pdf.setFont("helvetica", "bold");
  pdf.text(overallScore.toFixed(1), circleX, circleY + 2, { align: "center" });

  pdf.setFontSize(8);
  pdf.text("/10", circleX, circleY + 10, { align: "center" });

  // Recommendation badge
  const badgeX = margin + 70;
  const badgeWidth = 80;
  const badgeHeight = 24;

  drawRoundedRect(badgeX, yPos + 13, badgeWidth, badgeHeight, 4, recommendationColor);

  pdf.setTextColor(...COLORS.white);
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.text(feedback.recommendation, badgeX + badgeWidth / 2, yPos + 28, {
    align: "center",
  });

  // Labels
  pdf.setTextColor(...COLORS.dark);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text("Overall Score", margin + 35, yPos + 48, { align: "center" });
  pdf.text("Recommendation", badgeX + badgeWidth / 2, yPos + 48, {
    align: "center",
  });

  yPos += 60;

  // ========== RATING BREAKDOWN ==========
  addNewPageIfNeeded(80);

  pdf.setTextColor(...COLORS.dark);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Performance Breakdown", margin, yPos);
  yPos += 10;

  const ratings = [
    { label: "Technical Skills", score: feedback.rating.technicalSkills },
    { label: "Communication", score: feedback.rating.communication },
    { label: "Problem Solving", score: feedback.rating.problemSolving },
    { label: "Experience", score: feedback.rating.experience },
  ];

  const barWidth = contentWidth - 60;
  const barHeight = 8;

  ratings.forEach((rating) => {
    pdf.setTextColor(...COLORS.dark);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(rating.label, margin, yPos + 5);

    // Score
    pdf.setFont("helvetica", "bold");
    pdf.text(`${rating.score}/10`, margin + contentWidth - 5, yPos + 5, {
      align: "right",
    });

    // Progress bar
    drawProgressBar(
      margin,
      yPos + 8,
      barWidth,
      barHeight,
      rating.score,
      getScoreColor(rating.score)
    );

    yPos += 22;
  });

  yPos += 5;

  // ========== SUMMARY ==========
  addNewPageIfNeeded(60);

  pdf.setTextColor(...COLORS.dark);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Summary", margin, yPos);
  yPos += 8;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...COLORS.secondary);

  const summaryLines = pdf.splitTextToSize(feedback.summary, contentWidth);
  pdf.text(summaryLines, margin, yPos);
  yPos += summaryLines.length * 5 + 10;

  // ========== STRENGTHS ==========
  if (feedback.strengths && feedback.strengths.length > 0) {
    addNewPageIfNeeded(40);

    pdf.setTextColor(...COLORS.success);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("✓ Strengths", margin, yPos);
    yPos += 8;

    pdf.setTextColor(...COLORS.dark);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");

    feedback.strengths.forEach((strength) => {
      const lines = pdf.splitTextToSize(`• ${strength}`, contentWidth - 10);
      addNewPageIfNeeded(lines.length * 5 + 3);
      pdf.text(lines, margin + 5, yPos);
      yPos += lines.length * 5 + 3;
    });

    yPos += 5;
  }

  // ========== AREAS FOR IMPROVEMENT ==========
  if (feedback.improvements && feedback.improvements.length > 0) {
    addNewPageIfNeeded(40);

    // lib/pdf-generator.ts (continued)

    pdf.setTextColor(...COLORS.warning);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("△ Areas for Improvement", margin, yPos);
    yPos += 8;

    pdf.setTextColor(...COLORS.dark);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");

    feedback.improvements.forEach((improvement) => {
      const lines = pdf.splitTextToSize(`• ${improvement}`, contentWidth - 10);
      addNewPageIfNeeded(lines.length * 5 + 3);
      pdf.text(lines, margin + 5, yPos);
      yPos += lines.length * 5 + 3;
    });

    yPos += 5;
  }

  // ========== DETAILED FEEDBACK ==========
  if (feedback.detailedFeedback && feedback.detailedFeedback.length > 0) {
    addNewPageIfNeeded(30);

    pdf.setTextColor(...COLORS.dark);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Detailed Feedback", margin, yPos);
    yPos += 10;

    feedback.detailedFeedback.forEach((item) => {
      addNewPageIfNeeded(35);

      // Category header with score badge
      drawRoundedRect(margin, yPos, contentWidth, 28, 4, COLORS.light);

      pdf.setTextColor(...COLORS.dark);
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text(item.category, margin + 8, yPos + 10);

      // Score badge
      const badgeColor = getScoreColor(item.score);
      const scoreBadgeX = margin + contentWidth - 35;
      drawRoundedRect(scoreBadgeX, yPos + 4, 27, 12, 3, badgeColor);

      pdf.setTextColor(...COLORS.white);
      pdf.setFontSize(9);
      pdf.text(`${item.score}/10`, scoreBadgeX + 13.5, yPos + 12, {
        align: "center",
      });

      // Comments
      pdf.setTextColor(...COLORS.secondary);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      const commentLines = pdf.splitTextToSize(item.comments, contentWidth - 16);
      
      // Check if we need more space for comments
      const commentHeight = commentLines.length * 4;
      if (commentHeight > 12) {
        // Extend the box height
        pdf.setFillColor(...COLORS.light);
        pdf.roundedRect(margin, yPos, contentWidth, 16 + commentHeight, 4, 4, "F");
        
        // Redraw the header
        pdf.setTextColor(...COLORS.dark);
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.text(item.category, margin + 8, yPos + 10);
        
        // Redraw score badge
        drawRoundedRect(scoreBadgeX, yPos + 4, 27, 12, 3, badgeColor);
        pdf.setTextColor(...COLORS.white);
        pdf.setFontSize(9);
        pdf.text(`${item.score}/10`, scoreBadgeX + 13.5, yPos + 12, {
          align: "center",
        });
      }

      pdf.setTextColor(...COLORS.secondary);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.text(commentLines, margin + 8, yPos + 20);

      yPos += 18 + commentLines.length * 4 + 8;
    });
  }

  // ========== RECOMMENDATION MESSAGE ==========
  if (feedback.recommendationMsg) {
    addNewPageIfNeeded(50);

    pdf.setTextColor(...COLORS.dark);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Final Recommendation", margin, yPos);
    yPos += 8;

    // Recommendation box
    const recMsgLines = pdf.splitTextToSize(feedback.recommendationMsg, contentWidth - 20);
    const boxHeight = recMsgLines.length * 5 + 16;

    drawRoundedRect(margin, yPos, contentWidth, boxHeight, 4, recommendationColor);

    // Add slight transparency overlay for readability
    pdf.setFillColor(255, 255, 255);
    pdf.setGState(new pdf.GState({ opacity: 0.9 }));
    pdf.roundedRect(margin + 2, yPos + 2, contentWidth - 4, boxHeight - 4, 3, 3, "F");
    pdf.setGState(new pdf.GState({ opacity: 1 }));

    pdf.setTextColor(...COLORS.dark);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(recMsgLines, margin + 10, yPos + 12);

    yPos += boxHeight + 10;
  }

  // ========== FOOTER ==========
  const addFooter = (pageNum: number, totalPages: number) => {
    const footerY = pageHeight - 15;

    // Footer line
    pdf.setDrawColor(...COLORS.light);
    pdf.setLineWidth(0.5);
    pdf.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

    // Footer text
    pdf.setTextColor(...COLORS.muted);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");

    pdf.text(
      `Generated by Meridian AI Interview Platform`,
      margin,
      footerY
    );

    pdf.text(
      `Page ${pageNum} of ${totalPages}`,
      pageWidth - margin,
      footerY,
      { align: "right" }
    );

    pdf.text(
      completedAt.toLocaleString(),
      pageWidth / 2,
      footerY,
      { align: "center" }
    );
  };

  // Add footers to all pages
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    addFooter(i, totalPages);
  }

  // Return as blob
  return pdf.output("blob");
};

// Helper function to download the PDF
export const downloadInterviewPDF = async (
  options: PDFGeneratorOptions
): Promise<void> => {
  try {
    const blob = await generateInterviewPDF(options);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    const fileName = `interview-report-${options.interviewInfo.userName?.replace(/\s+/g, "-") || "candidate"}-${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to generate PDF:", error);
    throw new Error("Failed to generate PDF report");
  }
};