// types/interview.ts

// ============================================
// Core Types
// ============================================

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

// ============================================
// Interview Types
// ============================================

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

// ============================================
// Vapi Event Types
// ============================================

export interface VapiEvent {
  type?: string;
  transcript?: string;
  role?: "assistant" | "user";
  status?: string;
  timestamp?: number;
}

export interface ContentItem {
  text?: string;
  content?: string;
  transcript?: string;
}

export interface ConversationMessage {
  id?: string;
  role: "assistant" | "user" | "system";
  content?: string | ContentItem[];
  text?: string;
  message?: string;
  transcript?: string;
  timestamp?: string;
}

export interface ConversationData {
  messages?: ConversationMessage[];
}

export interface VapiMessage {
  type: string;
  transcript?: string;
  transcriptType?: "partial" | "final";
  role?: "assistant" | "user";
  conversation?: ConversationMessage[] | ConversationData;
  status?: string;
  endedReason?: string;
  // Additional fields that may come from Vapi
  data?: {
    conversation?: ConversationData;
  };
  content?: string | ContentItem[];
  text?: string;
  message?: string;
  speaker?: string;
  from?: string;
  id?: string;
  isFinal?: boolean;
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
  code?: string;
  statusCode?: number;
}

// ============================================
// Vapi Assistant Configuration Types
// ============================================

export type VapiTranscriberProvider = "deepgram" | "gladia" | "assembly";

export interface VapiTranscriberConfig {
  provider: VapiTranscriberProvider;
  model?: string;
  language?: string;
  keywords?: string[];
}

export type VapiVoiceProvider =
  | "11labs"
  | "openai"
  | "deepgram"
  | "playht"
  | "azure"
  | "cartesia"
  | "rime-ai";

export interface VapiVoiceConfig {
  provider: VapiVoiceProvider;
  voiceId: string;
  stability?: number;
  similarityBoost?: number;
  speed?: number;
  style?: number;
  useSpeakerBoost?: boolean;
}

export interface VapiModelMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export type VapiModelProvider = "openai" | "anthropic" | "google" | "groq";

export interface VapiModelConfig {
  provider: VapiModelProvider;
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
  responseDelaySeconds?: number;
  llmRequestDelaySeconds?: number;
  numWordsToInterruptAssistant?: number;
  dialKeypadFunctionEnabled?: boolean;
  hipaaEnabled?: boolean;
}

// ============================================
// Feedback Types
// ============================================

export interface FeedbackRating {
  technicalSkills: number;
  communication: number;
  problemSolving: number;
  experience: number;
  overall: number;
}

export interface DetailedFeedbackItem {
  category: string;
  question?: string;
  answer?: string;
  score: number;
  comments: string;
}

export type RecommendationType = "Strong Hire" | "Hire" | "Maybe" | "No Hire";

export interface FeedbackContent {
  rating: FeedbackRating;
  summary: string;
  strengths: string[];
  improvements: string[];
  recommendation: RecommendationType;
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

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

export interface FeedbackApiResponse {
  content: string;
  error?: string;
}

// ============================================
// PDF Report Types
// ============================================

export interface PdfReportData {
  feedback: FeedbackContent;
  candidateName: string;
  candidateEmail: string;
  jobPosition: string;
  interviewDate: string;
  duration: string;
  interviewType?: string;
}

// ============================================
// Utility Types
// ============================================

export type MessageRole = "assistant" | "user" | "system";

export interface BaseMessage {
  id?: string;
  role: MessageRole;
  content: string;
  timestamp?: number;
}

// Type guards for runtime type checking
export function isConversationData(obj: unknown): obj is ConversationData {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "messages" in obj &&
    Array.isArray((obj as ConversationData).messages)
  );
}

export function isConversationMessageArray(
  obj: unknown
): obj is ConversationMessage[] {
  return (
    Array.isArray(obj) &&
    obj.every(
      (item) => typeof item === "object" && item !== null && "role" in item
    )
  );
}

export function getConversationMessages(
  conversation: ConversationMessage[] | ConversationData | undefined
): ConversationMessage[] {
  if (!conversation) return [];

  if (Array.isArray(conversation)) {
    return conversation;
  }

  if (isConversationData(conversation)) {
    return conversation.messages || [];
  }

  return [];
}

export interface VapiConversationMessage {
  id?: string;
  role: "assistant" | "user" | "system";
  content?: string;
  text?: string;
  timestamp?: string;
}
