import {
  BriefcaseBusinessIcon,
  Calendar,
  Code2Icon,
  LayoutDashboard,
  List,
  Puzzle,
  Settings,
  User2Icon,
  WalletCards,
} from "lucide-react";

export const SidebarOptions = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    name: "Scheduled Interview",
    icon: Calendar,
    path: "/scheduled-interview",
  },
  {
    name: "All Interview",
    icon: List,
    path: "/all-interview",
  },
  {
    name: "Billing",
    icon: WalletCards,
    path: "/billing",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

export const InterviewType = [
  {
    title: "Technical",
    icon: Code2Icon,
  },
  {
    title: "Behavior",
    icon: User2Icon,
  },
  {
    title: "Experience",
    icon: BriefcaseBusinessIcon,
  },
  {
    title: "Problem Solving",
    icon: Puzzle,
  },
];

export const QUESTIONS_PROMPT = `You are an expert technical interviewer.  
Based on the following inputs, generate a well-structured list of high-quality interview questions:

Job Title: {{jobTitle}}  
Job Description: {{jobDescription}}  
Interview Duration: {{duration}}  
Interview Type: {{type}}

🍊 Your task:
- Analyze the job description to identify key responsibilities, required skills, and expected experience.
- Generate a list of interview questions depending on the interview duration.
- Adjust the number and depth of questions to match the interview duration.
- Ensure the questions match the tone and structure of a real-life {{type}} interview.

🍀 Format your response in JSON format with an array list of questions.

Format:
interviewQuestions = [
  {
    question: "",
    type: "Technical / Behavioral / Experience / Problem Solving / Leadership"
  },
  {
    ...
  }
]

🎯 The goal is to create a structured, relevant, and time-optimized interview plan for a {{jobTitle}} role.`;

export const FEEDBACK_PROMPT = `
{{conversation}}

Based on the interview conversation between the assistant and the user, provide structured feedback on the candidate's performance.  

Requirements:  
1. Rate the following categories out of 10:  
   - technicalSkills  
   - communication  
   - problemSolving  
   - experience  
2. Provide a 3-line summary of the interview, highlighting strengths and weaknesses.  
3. Give a clear hiring recommendation: "Yes" or "No".  
4. Provide a short message explaining the recommendation.  

Return the response strictly in the following JSON format:  

{
    "feedback": {
        "rating": {
            "technicalSkills": <number 0-10>,
            "communication": <number 0-10>,
            "problemSolving": <number 0-10>,
            "experience": <number 0-10>
        },
        "summary": "<3-line summary>",
        "recommendation": "<Yes/No>",
        "recommendationMsg": "<short explanation>"
    }
}


`;
