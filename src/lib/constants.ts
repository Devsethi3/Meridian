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
    path: "/dashboard/scheduled-interview",
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
    value: "Technical",
    icon: Code2Icon,
  },
  {
    title: "Behavior",
    value: "Behavior",
    icon: User2Icon,
  },
  {
    title: "Experience",
    value: "Experience",
    icon: BriefcaseBusinessIcon,
  },
  {
    title: "Problem Solving",
    value: "Problem Solving",
    icon: Puzzle,
  },
] as const;

export const QUESTIONS_PROMPT = `You are an expert technical interviewer.  
Based on the following inputs, generate a well-structured list of high-quality interview questions:

Job Title: {{jobTitle}}  
Job Description: {{jobDescription}}  
Interview Duration: {{duration}}  
Interview Type: {{type}}
Number of Questions Needed: {{suggestedCount}}

🍊 Your task:
- Analyze the job description to identify key responsibilities, required skills, and expected experience.
- Generate exactly {{suggestedCount}} interview questions optimized for the {{duration}} duration.
- Adjust the depth and complexity of questions to match the interview duration.
- Ensure ALL questions are specifically tailored for a {{type}} interview style.
- For Technical interviews: focus on coding, system design, technical concepts, and domain expertise
- For Behavior interviews: focus on past experiences, team dynamics, conflict resolution, and soft skills  
- For Experience interviews: focus on career progression, achievements, lessons learned, and role-specific experience
- For Problem Solving interviews: focus on analytical thinking, logical reasoning, and problem-solving methodologies

🍀 IMPORTANT: You must respond with valid JSON only. No additional text, explanations, or markdown formatting.

Required JSON format:
{
  "interviewQuestions": [
    {
      "question": "Your question text here",
      "type": "Technical"
    },
    {
      "question": "Your question text here", 
      "type": "Behavioral"
    }
  ]
}

🎯 The goal is to create a structured, relevant, and time-optimized interview plan for a {{jobTitle}} role that strictly follows the {{type}} interview format.`;

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
