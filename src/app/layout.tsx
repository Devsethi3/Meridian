import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Provider from "./provider";        
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/theme/theme-provider";

const font = DM_Sans({ weight: "400" });

export const metadata: Metadata = {
  title: "Meridian | AI Interview Prep & Mock Interview App",

  description:
    "Ace your next job interview with Meridian. Practice mock interviews with our AI, get instant feedback, and master your answers for technical and behavioral questions.",

  openGraph: {
    title: "Meridian | Your AI Interview Coach",
    description:
      "Get ready for your job interview with personalized AI feedback. Meridian helps you practice for success.",
    // url: "",
    siteName: "Meridian",
    images: [
      {
        url: "",
        width: 1200,
        height: 630,
        alt: "Meridian AI Interview App Logo",
      },
    ],
    type: "website",
  },

  keywords: [
    "AI interview",
    "mock interview",
    "interview practice",
    "job interview preparation",
    "AI interview coach",
    "technical interview",
    "behavioral interview",
    "interview questions",
    "career readiness",
    "job search",
    "Meridian app",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${font.className} antialiased`}>
        <Provider>
          <Toaster richColors position="top-center" />
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
