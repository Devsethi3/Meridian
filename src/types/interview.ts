export type CallStatus =
  | "idle"
  | "connecting"
  | "in-call"
  | "ending"
  | "ended"
  | "error";

export interface TranscriptMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
  timestamp?: number;
}

export interface InterviewInfo {
  userName: string;
  userEmail?: string;
  jobPosition: string;
  questionList?: { question: string }[];
}
