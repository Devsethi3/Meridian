import { InterviewInfo } from "@/lib/types";
import { createContext } from "react";

export type InterviewContextType = {
  interviewInfo: InterviewInfo | null;
  setInterviewInfo: (info: InterviewInfo) => void;
};

export const InterviewContext = createContext<InterviewContextType | null>(null);
