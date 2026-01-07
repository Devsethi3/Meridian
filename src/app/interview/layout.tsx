"use client";

import { InterviewProvider } from "@/context/InterviewContext";

interface InterviewLayoutProps {
  children: React.ReactNode;
}

const InterviewLayout = ({ children }: InterviewLayoutProps) => {
  return (
    <InterviewProvider>
      <div className="min-h-screen">{children}</div>
    </InterviewProvider>
  );
};

export default InterviewLayout;