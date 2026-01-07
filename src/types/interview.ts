export type InterviewType =
  | "Technical"
  | "Behavioral"
  | "Experience"
  | "Problem Solving"
  | "Mixed";

export type CallStatus =
  | "idle"
  | "connecting"
  | "in-call"
  | "ending"
  | "ended"
  | "error";

export type ConnectionStatus = "disconnected" | "connecting" | "connected";

export interface Question {
  id?: string;
  question: string;
  category?: string;
}

export interface InterviewFormData {
  jobPosition?: string;
  jobDescription?: string;
  duration?: string;
  type?: InterviewType;
  questionList?: Question[];
}

export interface InterviewInfo {
  id?: number;
  interview_id: string;
  jobPosition: string;
  jobDescription: string;
  duration: string;
  type: string;
  userName?: string;
  userEmail?: string;
  questionList?: Question[];
  created_at?: string;
}

export interface TranscriptMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
  timestamp?: number;
}

export interface VapiEvent {
  transcript?: string;
  type?: string;
}

export interface VapiMessage {
  type: string;
  transcript?: string;
  role?: "assistant" | "user";
  conversation?: ConversationData;
  data?: {
    conversation?: ConversationData;
  };
  content?: string | ContentItem[];
  text?: string;
  message?: string;
  speaker?: string;
  from?: string;
  id?: string;
}

export interface ContentItem {
  text?: string;
  content?: string;
  transcript?: string;
}

export interface ConversationData {
  messages?: ConversationMessage[];
}

export interface ConversationMessage {
  id?: string;
  role: "assistant" | "user";
  content?: string | ContentItem[];
  text?: string;
  message?: string;
  transcript?: string;
  timestamp?: string;
}

export interface FeedbackRating {
  technicalSkills: number;
  communication: number;
  problemSolving: number;
  experience: number;
  overall: number;
}

export interface FeedbackContent {
  rating: FeedbackRating;
  summary: string;
  strengths: string[];
  improvements: string[];
  recommendation: "Strong Hire" | "Hire" | "Maybe" | "No Hire";
  recommendationMsg: string;
  detailedFeedback: {
    category: string;
    score: number;
    comments: string;
  }[];
}

export interface InterviewFeedback {
  id?: number;
  interview_id: string;
  userEmail: string;
  userName: string;
  created_at: string;
  feedback: FeedbackContent;
  recommended: boolean;
}

export interface InterviewDetail {
  id: number;
  interview_id: string;
  jobPosition: string;
  jobDescription: string;
  duration: string;
  type: string;
  questionList: Question[];
  created_at: string;
  userEmail?: string;
  userName?: string;
  "interview-feedback"?: InterviewFeedback[];
}