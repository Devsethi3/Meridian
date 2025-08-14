
"use client";

import { useState } from "react";
import type { InterviewInfo } from "@/lib/types";
import { InterviewContext } from "@/context/InterviewContext";
import InterviewHeader from "./_components/InterviewHeader";

const InterviewIdLayout = ({ children }: { children: React.ReactNode }) => {
  const [interviewInfo, setInterviewInfo] = useState<InterviewInfo | null>(
    null
  );

  return (
    <InterviewContext.Provider value={{ interviewInfo, setInterviewInfo }}>
      {/* <InterviewHeader /> */}
      <div>{children}</div>
    </InterviewContext.Provider>
  );
};

export default InterviewIdLayout;
