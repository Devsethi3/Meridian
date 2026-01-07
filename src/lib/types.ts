// types/interview.ts

export type InterviewType =
  | "Technical"
  | "Behavioral"
  | "Experience"
  | "Problem Solving"
  | "Mixed";

export type CallStatus =
  | "idle"
  | "connecting"
  | "connected"
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
  timestamp: number;
}

// Vapi Event Types
export interface VapiEvent {
  type?: string;
  transcript?: string;
  role?: "assistant" | "user";
  status?: string;
  timestamp?: number;
}

export interface VapiMessage {
  type: string;
  transcript?: string;
  transcriptType?: "partial" | "final";
  role?: "assistant" | "user";
  conversation?: VapiConversationMessage[];
  status?: string;
  endedReason?: string;
}

export interface VapiConversationMessage {
  id?: string;
  role: "assistant" | "user" | "system";
  content?: string;
  text?: string;
  timestamp?: string;
}

export interface VapiSpeechEvent {
  transcript?: string;
  isFinal?: boolean;
}

export interface VapiErrorEvent {
  message?: string;
  error?: {
    message?: string;
    code?: string;
  };
}

// Vapi Assistant Configuration
export interface VapiTranscriberConfig {
  provider: "deepgram" | "gladia" | "assembly";
  model?: string;
  language?: string;
  keywords?: string[];
}

export interface VapiVoiceConfig {
  provider:
    | "11labs"
    | "openai"
    | "deepgram"
    | "playht"
    | "azure"
    | "cartesia"
    | "rime-ai";
  voiceId: string;
  stability?: number;
  similarityBoost?: number;
  speed?: number;
}

export interface VapiModelMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface VapiModelConfig {
  provider: "openai" | "anthropic" | "google" | "groq";
  model: string;
  messages: VapiModelMessage[];
  temperature?: number;
  maxTokens?: number;
}

export interface VapiAssistantConfig {
  name: string;
  firstMessage: string;
  transcriber: VapiTranscriberConfig;
  voice: VapiVoiceConfig;
  model: VapiModelConfig;
  endCallPhrases?: string[];
  silenceTimeoutSeconds?: number;
  maxDurationSeconds?: number;
}

// Feedback Types
export interface FeedbackRating {
  technicalSkills: number;
  communication: number;
  problemSolving: number;
  experience: number;
  overall: number;
}

export interface DetailedFeedbackItem {
  category: string;
  score: number;
  comments: string;
}

export interface FeedbackContent {
  rating: FeedbackRating;
  summary: string;
  strengths: string[];
  improvements: string[];
  recommendation: "Strong Hire" | "Hire" | "Maybe" | "No Hire";
  recommendationMsg: string;
  detailedFeedback: DetailedFeedbackItem[];
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
