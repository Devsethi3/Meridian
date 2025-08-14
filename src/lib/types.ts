// types.ts

export type InterviewFormData = {
  jobPosition?: string;
  jobDescription?: string;
  duration?: string;
  type?: string;
};

export type InterviewInfo = {
  jobPosition: string;
  jobDescription: string;
  duration: string;
  type: string;
  interview_id: string;
  userName?: string;
  userEmail?: string;
  questionList?: Array<{ question: string }>;
};

export interface VapiMessage {
  type: string;
  transcript?: string;
  role?: "assistant" | "user";
  conversation?: string;
}

export interface VapiEvent {
  transcript?: string;
  role?: "assistant" | "user";
}

export type ConnectionStatus = "connecting" | "connected" | "disconnected";
