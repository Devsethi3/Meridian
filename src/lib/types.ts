export type InterviewFormData = {
  jobPosition?: string;
  jobDescription?: string;
  duration?: string;
  type?: "Technical" | "Behavior" | "Experience" | "Problem Solving";
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

export interface Interview {
  id: number;
  created_at: string;
  duration: string;
  interview_id: string;
  jobDescription: string;
  jobPosition: string;
  questionList: Question[];
  type: string;
  userEmail: string;
}

export interface InterviewFeedback {
  userEmail: string;
  userName: string;
  created_at: string;
  feedback: {
    feedback: {
      rating: {
        experience: number;
        communication: number;
        problemSolving: number;
        technicalSkills: number;
      };
      summary: string;
      recommendation: string;
      recommendationMsg: string;
    };
  };
}

export interface Question {
  question: string;
}

export interface QuestionList {
  length: number;
  [key: number]: Question;
}

export interface InterviewDetail {
  created_at: string;
  duration: string;
  id: number;
  "interview-feedback": InterviewFeedback[];
  interview_id: string;
  jobDescription: string;
  jobPosition: string;
  questionList: QuestionList;
  type: string;
  userEmail: string;
  userName: string;
}
