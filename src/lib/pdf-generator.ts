import jsPDF from "jspdf";
import { FeedbackContent, InterviewInfo } from "./types";

interface PDFGeneratorOptions {
  feedback: FeedbackContent;
  interviewInfo: InterviewInfo;
  completedAt: Date;
}

// Modern Color Palette
const COLORS = {
  // Primary blues
  primary: [37, 99, 235] as [number, number, number],
  primaryLight: [96, 165, 250] as [number, number, number],
  primaryDark: [29, 78, 216] as [number, number, number],

  // Neutrals
  dark: [15, 23, 42] as [number, number, number],
  gray700: [51, 65, 85] as [number, number, number],
  gray600: [71, 85, 105] as [number, number, number],
  gray500: [100, 116, 139] as [number, number, number],
  gray400: [148, 163, 184] as [number, number, number],
  gray300: [203, 213, 225] as [number, number, number],
  gray200: [226, 232, 240] as [number, number, number],
  gray100: [241, 245, 249] as [number, number, number],
  gray50: [248, 250, 252] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],

  // Status colors
  success: [22, 163, 74] as [number, number, number],
  successLight: [34, 197, 94] as [number, number, number],
  successBg: [220, 252, 231] as [number, number, number],

  warning: [217, 119, 6] as [number, number, number],
  warningLight: [251, 191, 36] as [number, number, number],
  warningBg: [254, 249, 195] as [number, number, number],

  danger: [220, 38, 38] as [number, number, number],
  dangerLight: [248, 113, 113] as [number, number, number],
  dangerBg: [254, 226, 226] as [number, number, number],

  // Accent
  purple: [124, 58, 237] as [number, number, number],
  purpleLight: [167, 139, 250] as [number, number, number],
};

const getRecommendationStyle = (
  recommendation: string
): {
  bg: [number, number, number];
  text: [number, number, number];
  accent: [number, number, number];
} => {
  switch (recommendation) {
    case "Strong Hire":
      return {
        bg: COLORS.successBg,
        text: COLORS.success,
        accent: COLORS.successLight,
      };
    case "Hire":
      return {
        bg: [209, 250, 229],
        text: [21, 128, 61],
        accent: COLORS.successLight,
      };
    case "Maybe":
      return {
        bg: COLORS.warningBg,
        text: COLORS.warning,
        accent: COLORS.warningLight,
      };
    case "No Hire":
      return {
        bg: COLORS.dangerBg,
        text: COLORS.danger,
        accent: COLORS.dangerLight,
      };
    default:
      return {
        bg: COLORS.gray100,
        text: COLORS.gray600,
        accent: COLORS.gray400,
      };
  }
};

const getScoreStyle = (
  score: number
): { color: [number, number, number]; bg: [number, number, number] } => {
  if (score >= 8) return { color: COLORS.success, bg: COLORS.successBg };
  if (score >= 6) return { color: [21, 128, 61], bg: [209, 250, 229] };
  if (score >= 4) return { color: COLORS.warning, bg: COLORS.warningBg };
  return { color: COLORS.danger, bg: COLORS.dangerBg };
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
  let yPos = 0;

  // Helper functions
  const addNewPageIfNeeded = (requiredSpace: number): boolean => {
    if (yPos + requiredSpace > pageHeight - 25) {
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
    color: [number, number, number],
    stroke?: [number, number, number]
  ) => {
    pdf.setFillColor(...color);
    pdf.roundedRect(x, y, w, h, r, r, "F");
    if (stroke) {
      pdf.setDrawColor(...stroke);
      pdf.setLineWidth(0.3);
      pdf.roundedRect(x, y, w, h, r, r, "S");
    }
  };

  const drawGradientHeader = (height: number) => {
    // Simulate gradient with multiple rectangles
    const steps = 20;
    const stepHeight = height / steps;
    for (let i = 0; i < steps; i++) {
      const ratio = i / steps;
      const r = Math.round(
        COLORS.primaryDark[0] +
          (COLORS.primary[0] - COLORS.primaryDark[0]) * ratio
      );
      const g = Math.round(
        COLORS.primaryDark[1] +
          (COLORS.primary[1] - COLORS.primaryDark[1]) * ratio
      );
      const b = Math.round(
        COLORS.primaryDark[2] +
          (COLORS.primary[2] - COLORS.primaryDark[2]) * ratio
      );
      pdf.setFillColor(r, g, b);
      pdf.rect(0, i * stepHeight, pageWidth, stepHeight + 0.5, "F");
    }
  };

  const drawCircularProgress = (
    x: number,
    y: number,
    radius: number,
    score: number,
    maxScore: number = 10
  ) => {
    const style = getScoreStyle(score);

    // Outer circle (background)
    pdf.setFillColor(...COLORS.gray200);
    pdf.circle(x, y, radius, "F");

    // Inner circle (score background)
    pdf.setFillColor(...style.bg);
    pdf.circle(x, y, radius - 2, "F");

    // Score text
    pdf.setTextColor(...style.color);
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text(score.toFixed(1), x, y + 1, { align: "center" });

    // Max score
    pdf.setFontSize(8);
    pdf.setTextColor(...COLORS.gray500);
    pdf.text(`/ ${maxScore}`, x, y + 7, { align: "center" });
  };

  const drawModernProgressBar = (
    x: number,
    y: number,
    width: number,
    height: number,
    progress: number,
    color: [number, number, number]
  ) => {
    // Background
    pdf.setFillColor(...COLORS.gray200);
    pdf.roundedRect(x, y, width, height, height / 2, height / 2, "F");

    // Progress
    const progressWidth = Math.max((progress / 10) * width, height);
    if (progressWidth > 0 && progress > 0) {
      pdf.setFillColor(...color);
      pdf.roundedRect(x, y, progressWidth, height, height / 2, height / 2, "F");
    }
  };

  const drawIcon = (
    type: "check" | "warning" | "star",
    x: number,
    y: number,
    size: number
  ) => {
    pdf.setFontSize(size);
    switch (type) {
      case "check":
        pdf.setTextColor(...COLORS.success);
        pdf.text("●", x, y);
        break;
      case "warning":
        pdf.setTextColor(...COLORS.warning);
        pdf.text("●", x, y);
        break;
      case "star":
        pdf.setTextColor(...COLORS.purple);
        pdf.text("★", x, y);
        break;
    }
  };

  // ========== HEADER SECTION ==========
  drawGradientHeader(55);

  // Decorative elements
  pdf.setFillColor(255, 255, 255);
  pdf.circle(pageWidth - 30, 20, 40, "F");
  pdf.setFillColor(...COLORS.primary);
  pdf.circle(pageWidth - 30, 20, 40, "F");

  // Logo area
  pdf.setFillColor(255, 255, 255);
  pdf.circle(margin + 12, 22, 10, "F");
  pdf.setTextColor(...COLORS.primary);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("M", margin + 12, 26, { align: "center" });

  // Company name
  pdf.setTextColor(...COLORS.white);
  pdf.setFontSize(22);
  pdf.setFont("helvetica", "bold");
  pdf.text("Meridian", margin + 28, 26);

  // Tagline
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.text("AI-Powered Interview Platform", margin + 28, 33);

  // Report title badge
  const titleBadgeWidth = 120;
  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(margin, 42, titleBadgeWidth, 10, 2, 2, "F");
  pdf.setTextColor(...COLORS.primary);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text("Interview Feedback Report", margin + 5, 49);

  yPos = 65;

  // ========== CANDIDATE INFO CARD ==========
  drawRoundedRect(
    margin,
    yPos,
    contentWidth,
    48,
    6,
    COLORS.white,
    COLORS.gray200
  );

  // Avatar placeholder
  const avatarX = margin + 20;
  const avatarY = yPos + 24;
  pdf.setFillColor(...COLORS.primary);
  pdf.circle(avatarX, avatarY, 12, "F");
  pdf.setTextColor(...COLORS.white);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  const initials = (interviewInfo.userName || "C")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
  pdf.text(initials, avatarX, avatarY + 4, { align: "center" });

  // Candidate details
  const detailsX = margin + 40;
  pdf.setTextColor(...COLORS.dark);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text(interviewInfo.userName || "Candidate", detailsX, yPos + 18);

  pdf.setFontSize(10);
  pdf.setTextColor(...COLORS.gray600);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    interviewInfo.jobPosition || "Position not specified",
    detailsX,
    yPos + 26
  );

  // Contact info
  pdf.setFontSize(9);
  pdf.setTextColor(...COLORS.gray500);
  if (interviewInfo.userEmail) {
    pdf.text(`✉ ${interviewInfo.userEmail}`, detailsX, yPos + 35);
  }

  // Date badge
  const dateText = completedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const dateBadgeWidth = 70;
  drawRoundedRect(
    margin + contentWidth - dateBadgeWidth - 10,
    yPos + 10,
    dateBadgeWidth,
    20,
    4,
    COLORS.gray100
  );
  pdf.setTextColor(...COLORS.gray600);
  pdf.setFontSize(8);
  pdf.text(
    "Completed",
    margin + contentWidth - dateBadgeWidth / 2 - 10,
    yPos + 18,
    { align: "center" }
  );
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...COLORS.dark);
  pdf.text(
    dateText,
    margin + contentWidth - dateBadgeWidth / 2 - 10,
    yPos + 26,
    { align: "center" }
  );

  yPos += 58;

  // ========== OVERALL SCORE & RECOMMENDATION ==========
  const scoreCardWidth = contentWidth * 0.45;
  const recCardWidth = contentWidth * 0.5;

  // Score Card
  drawRoundedRect(
    margin,
    yPos,
    scoreCardWidth,
    70,
    6,
    COLORS.white,
    COLORS.gray200
  );

  pdf.setTextColor(...COLORS.gray600);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text("OVERALL SCORE", margin + scoreCardWidth / 2, yPos + 12, {
    align: "center",
  });

  drawCircularProgress(
    margin + scoreCardWidth / 2,
    yPos + 40,
    20,
    feedback.rating.overall
  );

  pdf.setTextColor(...COLORS.gray500);
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    "Based on all evaluation criteria",
    margin + scoreCardWidth / 2,
    yPos + 65,
    { align: "center" }
  );

  // Recommendation Card
  const recStyle = getRecommendationStyle(feedback.recommendation);
  const recCardX = margin + scoreCardWidth + 10;

  drawRoundedRect(recCardX, yPos, recCardWidth, 70, 6, recStyle.bg);

  // Accent bar
  pdf.setFillColor(...recStyle.accent);
  pdf.roundedRect(recCardX, yPos, 4, 70, 2, 2, "F");

  pdf.setTextColor(...recStyle.text);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text("RECOMMENDATION", recCardX + recCardWidth / 2, yPos + 15, {
    align: "center",
  });

  pdf.setFontSize(20);
  pdf.text(feedback.recommendation, recCardX + recCardWidth / 2, yPos + 38, {
    align: "center",
  });

  // Mini descriptor
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  let recDesc = "";
  switch (feedback.recommendation) {
    case "Strong Hire":
      recDesc = "Exceptional candidate";
      break;
    case "Hire":
      recDesc = "Recommended for position";
      break;
    case "Maybe":
      recDesc = "Further evaluation needed";
      break;
    case "No Hire":
      recDesc = "Does not meet requirements";
      break;
  }
  pdf.text(recDesc, recCardX + recCardWidth / 2, yPos + 50, {
    align: "center",
  });

  yPos += 80;

  // ========== RATING BREAKDOWN ==========
  addNewPageIfNeeded(100);

  // Section header
  pdf.setFillColor(...COLORS.primary);
  pdf.roundedRect(margin, yPos, 4, 20, 2, 2, "F");
  pdf.setTextColor(...COLORS.dark);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Performance Breakdown", margin + 10, yPos + 13);
  yPos += 28;

  const ratings = [
    {
      label: "Technical Skills",
      score: feedback.rating.technicalSkills,
      icon: "⚙",
    },
    {
      label: "Communication",
      score: feedback.rating.communication,
      icon: "💬",
    },
    {
      label: "Problem Solving",
      score: feedback.rating.problemSolving,
      icon: "🧩",
    },
    { label: "Experience", score: feedback.rating.experience, icon: "📊" },
  ];

  ratings.forEach((rating, index) => {
    const rowY = yPos + index * 22;
    const style = getScoreStyle(rating.score);

    // Background for row
    if (index % 2 === 0) {
      drawRoundedRect(margin, rowY - 4, contentWidth, 20, 4, COLORS.gray50);
    }

    // Label
    pdf.setTextColor(...COLORS.dark);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.text(rating.label, margin + 8, rowY + 6);

    // Progress bar
    const barX = margin + 60;
    const barWidth = contentWidth - 100;
    drawModernProgressBar(
      barX,
      rowY + 2,
      barWidth,
      6,
      rating.score,
      style.color
    );

    // Score badge
    drawRoundedRect(margin + contentWidth - 28, rowY - 1, 24, 14, 4, style.bg);
    pdf.setTextColor(...style.color);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text(`${rating.score}`, margin + contentWidth - 16, rowY + 8, {
      align: "center",
    });
  });

  yPos += ratings.length * 22 + 10;

  // ========== SUMMARY ==========
  addNewPageIfNeeded(70);

  // Section header
  pdf.setFillColor(...COLORS.purple);
  pdf.roundedRect(margin, yPos, 4, 20, 2, 2, "F");
  pdf.setTextColor(...COLORS.dark);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Executive Summary", margin + 10, yPos + 13);
  yPos += 25;

  // Summary content box
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...COLORS.gray700);

  const summaryLines = pdf.splitTextToSize(feedback.summary, contentWidth - 20);
  const summaryBoxHeight = summaryLines.length * 5 + 16;

  drawRoundedRect(
    margin,
    yPos,
    contentWidth,
    summaryBoxHeight,
    6,
    COLORS.gray50
  );
  pdf.text(summaryLines, margin + 10, yPos + 12);
  yPos += summaryBoxHeight + 10;

  // ========== STRENGTHS & IMPROVEMENTS (Side by Side if space allows) ==========
  const hasStrengths = feedback.strengths && feedback.strengths.length > 0;
  const hasImprovements =
    feedback.improvements && feedback.improvements.length > 0;

  if (hasStrengths || hasImprovements) {
    addNewPageIfNeeded(80);

    if (hasStrengths) {
      // Strengths section
      pdf.setFillColor(...COLORS.success);
      pdf.roundedRect(margin, yPos, 4, 20, 2, 2, "F");
      pdf.setTextColor(...COLORS.success);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Key Strengths", margin + 10, yPos + 13);
      yPos += 25;

      feedback.strengths!.forEach((strength) => {
        const lines = pdf.splitTextToSize(strength, contentWidth - 25);
        addNewPageIfNeeded(lines.length * 5 + 8);

        drawIcon("check", margin + 5, yPos + 4, 8);

        pdf.setTextColor(...COLORS.gray700);
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text(lines, margin + 15, yPos + 4);
        yPos += lines.length * 5 + 6;
      });

      yPos += 8;
    }

    if (hasImprovements) {
      addNewPageIfNeeded(60);

      // Improvements section
      pdf.setFillColor(...COLORS.warning);
      pdf.roundedRect(margin, yPos, 4, 20, 2, 2, "F");
      pdf.setTextColor(...COLORS.warning);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Areas for Development", margin + 10, yPos + 13);
      yPos += 25;

      feedback.improvements!.forEach((improvement) => {
        const lines = pdf.splitTextToSize(improvement, contentWidth - 25);
        addNewPageIfNeeded(lines.length * 5 + 8);

        drawIcon("warning", margin + 5, yPos + 4, 8);

        pdf.setTextColor(...COLORS.gray700);
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text(lines, margin + 15, yPos + 4);
        yPos += lines.length * 5 + 6;
      });

      yPos += 8;
    }
  }

  // ========== DETAILED FEEDBACK ==========
  if (feedback.detailedFeedback && feedback.detailedFeedback.length > 0) {
    addNewPageIfNeeded(40);

    // Section header
    pdf.setFillColor(...COLORS.primaryLight);
    pdf.roundedRect(margin, yPos, 4, 20, 2, 2, "F");
    pdf.setTextColor(...COLORS.dark);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Detailed Assessment", margin + 10, yPos + 13);
    yPos += 28;

    feedback.detailedFeedback.forEach((item) => {
      const commentLines = pdf.splitTextToSize(
        item.comments,
        contentWidth - 30
      );
      const cardHeight = 28 + commentLines.length * 4.5;

      addNewPageIfNeeded(cardHeight + 10);

      const style = getScoreStyle(item.score);

      // Card background
      drawRoundedRect(
        margin,
        yPos,
        contentWidth,
        cardHeight,
        6,
        COLORS.white,
        COLORS.gray200
      );

      // Left accent bar
      pdf.setFillColor(...style.color);
      pdf.roundedRect(margin, yPos, 3, cardHeight, 1.5, 1.5, "F");

      // Category header
      pdf.setTextColor(...COLORS.dark);
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text(item.category, margin + 12, yPos + 12);

      // Score badge
      const badgeX = margin + contentWidth - 35;
      drawRoundedRect(badgeX, yPos + 5, 28, 14, 4, style.bg);
      pdf.setTextColor(...style.color);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text(`${item.score}/10`, badgeX + 14, yPos + 14, { align: "center" });

      // Comments
      pdf.setTextColor(...COLORS.gray600);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.text(commentLines, margin + 12, yPos + 22);

      yPos += cardHeight + 8;
    });
  }

  // ========== FINAL RECOMMENDATION ==========
  if (feedback.recommendationMsg) {
    addNewPageIfNeeded(60);

    const recStyle = getRecommendationStyle(feedback.recommendation);

    // Section header
    pdf.setFillColor(...recStyle.accent);
    pdf.roundedRect(margin, yPos, 4, 20, 2, 2, "F");
    pdf.setTextColor(...COLORS.dark);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Final Recommendation", margin + 10, yPos + 13);
    yPos += 25;

    const recMsgLines = pdf.splitTextToSize(
      feedback.recommendationMsg,
      contentWidth - 24
    );
    const boxHeight = recMsgLines.length * 5 + 20;

    // Recommendation box with accent
    drawRoundedRect(margin, yPos, contentWidth, boxHeight, 6, recStyle.bg);
    pdf.setFillColor(...recStyle.accent);
    pdf.roundedRect(margin, yPos, 4, boxHeight, 2, 2, "F");

    pdf.setTextColor(...COLORS.dark);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(recMsgLines, margin + 14, yPos + 14);

    yPos += boxHeight + 10;
  }

  // ========== FOOTER ==========
  const addFooter = (pageNum: number, totalPages: number) => {
    const footerY = pageHeight - 12;

    // Footer background
    pdf.setFillColor(...COLORS.gray50);
    pdf.rect(0, pageHeight - 18, pageWidth, 18, "F");

    // Footer line
    pdf.setDrawColor(...COLORS.gray300);
    pdf.setLineWidth(0.3);
    pdf.line(margin, pageHeight - 18, pageWidth - margin, pageHeight - 18);

    // Left: Branding
    pdf.setTextColor(...COLORS.gray500);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.text("Generated by Meridian AI Interview Platform", margin, footerY);

    // Center: Date
    pdf.text(
      completedAt.toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
      pageWidth / 2,
      footerY,
      { align: "center" }
    );

    // Right: Page number
    pdf.setFont("helvetica", "bold");
    pdf.text(`${pageNum} / ${totalPages}`, pageWidth - margin, footerY, {
      align: "right",
    });
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

    const fileName = `interview-report-${
      options.interviewInfo.userName?.replace(/\s+/g, "-").toLowerCase() ||
      "candidate"
    }-${new Date().toISOString().split("T")[0]}.pdf`;

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
