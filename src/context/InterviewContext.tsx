"use client";

import { InterviewInfo } from "@/lib/types";
import { createContext, useState, useCallback, ReactNode } from "react";

interface InterviewContextType {
  interviewInfo: InterviewInfo | null;
  setInterviewInfo: (info: InterviewInfo | null) => void;
  clearInterview: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const InterviewContext = createContext<InterviewContextType | null>(null);

interface InterviewProviderProps {
  children: ReactNode;
}

export const InterviewProvider = ({ children }: InterviewProviderProps) => {
  const [interviewInfo, setInterviewInfoState] = useState<InterviewInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const setInterviewInfo = useCallback((info: InterviewInfo | null) => {
    setInterviewInfoState(info);
  }, []);

  const clearInterview = useCallback(() => {
    setInterviewInfoState(null);
    setIsLoading(false);
  }, []);

  return (
    <InterviewContext.Provider
      value={{
        interviewInfo,
        setInterviewInfo,
        clearInterview,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};