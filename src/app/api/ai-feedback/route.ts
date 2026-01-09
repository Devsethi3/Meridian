// app/api/ai-feedback/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { checkRateLimit } from "@/lib/rate-limiter";

interface FeedbackResponse {
  rating: {
    technicalSkills: number;
    communication: number;
    problemSolving: number;
    experience: number;
    overall: number;
  };
  summary: string;
  strengths: string[];
  improvements: string[];
  recommendation: string;
  recommendationMsg: string;
  detailedFeedback: {
    category: string;
    score: number;
    comments: string;
  }[];
}

const RATE_LIMIT_CONFIG = {
  windowMs: 60000,
  maxRequests: 10,
};

interface TranscriptMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
  timestamp?: number;
}

const FEEDBACK_PROMPT = `You are an expert interview evaluator. Analyze the following interview conversation and provide detailed, constructive feedback.

Interview Conversation:
{{conversation}}

Based on this conversation, provide your evaluation in STRICT JSON format. Your response must be ONLY valid JSON with no additional text before or after.

Required JSON structure:
{
  "rating": {
    "technicalSkills": 8,
    "communication": 7,
    "problemSolving": 9,
    "experience": 6,
    "overall": 7
  },
  "summary": "2-3 sentence summary of performance",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2"],
  "recommendation": "Strong Hire",
  "recommendationMsg": "Detailed recommendation explanation",
  "detailedFeedback": [
    {
      "category": "Technical Knowledge",
      "score": 8,
      "comments": "Specific feedback"
    },
    {
      "category": "Communication Skills",
      "score": 7,
      "comments": "Specific feedback"
    },
    {
      "category": "Problem Solving",
      "score": 9,
      "comments": "Specific feedback"
    }
  ]
}

IMPORTANT: 
- All ratings must be numbers between 1-10
- Recommendation must be one of: "Strong Hire", "Hire", "Maybe", "No Hire"
- Return ONLY the JSON object, no markdown, no code blocks, no explanations`;

function formatConversation(conversation: TranscriptMessage[]): string {
  return conversation
    .map((msg) => {
      const speaker = msg.role === "assistant" ? "Interviewer" : "Candidate";
      const time = msg.timestamp
        ? new Date(msg.timestamp).toLocaleTimeString()
        : "";
      return `[${time}] ${speaker}: ${msg.text}`;
    })
    .join("\n\n");
}

function validateConversation(
  conversation: unknown
): conversation is TranscriptMessage[] {
  if (!Array.isArray(conversation)) return false;
  if (conversation.length === 0) return false;

  return conversation.every((msg) => {
    return (
      msg &&
      typeof msg === "object" &&
      typeof msg.text === "string" &&
      msg.text.trim().length > 0 &&
      (msg.role === "assistant" || msg.role === "user")
    );
  });
}

function cleanJsonResponse(content: string): string {
  // Remove markdown code blocks if present
  let cleaned = content.trim();

  // Remove ```json and ``` markers
  cleaned = cleaned.replace(/^```json\s*\n?/i, "");
  cleaned = cleaned.replace(/^```\s*\n?/i, "");
  cleaned = cleaned.replace(/\n?```\s*$/i, "");

  // Find the first { and last }
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return cleaned.trim();
}

function validateFeedbackStructure(
  feedback: unknown
): feedback is FeedbackResponse {
  return (
    typeof feedback === "object" &&
    feedback !== null &&
    "rating" in feedback &&
    typeof (feedback as FeedbackResponse).rating.overall === "number" &&
    typeof (feedback as FeedbackResponse).summary === "string" &&
    Array.isArray((feedback as FeedbackResponse).strengths) &&
    Array.isArray((feedback as FeedbackResponse).improvements) &&
    typeof (feedback as FeedbackResponse).recommendation === "string" &&
    typeof (feedback as FeedbackResponse).recommendationMsg === "string" &&
    Array.isArray((feedback as FeedbackResponse).detailedFeedback)
  );
}

export async function POST(req: NextRequest) {
  console.log("[API] Feedback request received");

  try {
    // Rate limiting
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "anonymous";

    const rateLimitKey = `feedback:${ip}`;
    const { allowed, remainingRequests, resetIn } = checkRateLimit(
      rateLimitKey,
      RATE_LIMIT_CONFIG
    );

    if (!allowed) {
      console.log("[API] Rate limit exceeded for:", ip);
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please try again later.",
          retryAfter: Math.ceil(resetIn / 1000),
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(resetIn / 1000)),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch {
      console.error("[API] Invalid JSON in request");
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { conversation } = body;

    console.log(
      "[API] Received conversation with",
      conversation?.length || 0,
      "messages"
    );

    // Validate conversation
    if (!conversation) {
      console.error("[API] No conversation provided");
      return NextResponse.json(
        { error: "No conversation provided in request" },
        { status: 400 }
      );
    }

    if (!validateConversation(conversation)) {
      console.error("[API] Invalid conversation format");
      return NextResponse.json(
        {
          error:
            "Invalid conversation format. Expected array of messages with role and text.",
        },
        { status: 400 }
      );
    }

    if (conversation.length < 2) {
      console.error("[API] Conversation too short:", conversation.length);
      return NextResponse.json(
        {
          error:
            "Conversation is too short. Need at least 2 messages for feedback.",
          messageCount: conversation.length,
        },
        { status: 400 }
      );
    }

    // Format conversation for the prompt
    const formattedConversation = formatConversation(conversation);
    console.log(
      "[API] Formatted conversation length:",
      formattedConversation.length
    );

    const finalPrompt = FEEDBACK_PROMPT.replace(
      "{{conversation}}",
      formattedConversation
    );

    // Check for API key
    if (!process.env.OPENROUTER_API_KEY) {
      console.error("[API] OPENROUTER_API_KEY not set");
      return NextResponse.json(
        { error: "Server configuration error: API key not set" },
        { status: 500 }
      );
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        "HTTP-Referer":
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "AI Interview Assistant",
      },
    });

    console.log("[API] Calling OpenRouter API...");

    // Generate feedback - REMOVE response_format for DeepSeek
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1-0528:free",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that responds in JSON format only.",
        },
        {
          role: "user",
          content: finalPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
      // REMOVED: response_format: { type: "json_object" }, // DeepSeek free model may not support this
    });

    const content = completion.choices[0]?.message?.content;
    console.log("[API] Raw API response length:", content?.length || 0);
    console.log("[API] Raw API response preview:", content?.substring(0, 200));

    if (!content) {
      console.error("[API] No content in API response");
      return NextResponse.json(
        { error: "No response received from AI service" },
        { status: 500 }
      );
    }

    // Clean and parse JSON response
    let parsedContent;
    try {
      const cleanedContent = cleanJsonResponse(content);
      console.log(
        "[API] Cleaned response preview:",
        cleanedContent.substring(0, 200)
      );

      parsedContent = JSON.parse(cleanedContent);
      console.log("[API] Successfully parsed feedback");
    } catch (parseError: unknown) {
      const err =
        parseError instanceof Error
          ? parseError.message
          : "Unknown parse error";

      console.error("[API] Failed to parse AI response:", err);

      return NextResponse.json(
        {
          error: "AI returned invalid JSON response",
          details: err,
          preview: content.substring(0, 200),
        },
        { status: 500 }
      );
    }

    // Validate feedback structure
    if (!validateFeedbackStructure(parsedContent)) {
      console.error("[API] Incomplete feedback structure");
      console.error("[API] Missing fields:", {
        hasRating: !!parsedContent.rating,
        hasSummary: !!parsedContent.summary,
        hasRecommendation: !!parsedContent.recommendation,
        hasStrengths: Array.isArray(parsedContent.strengths),
        hasImprovements: Array.isArray(parsedContent.improvements),
      });

      return NextResponse.json(
        {
          error: "AI returned incomplete feedback",
          received: Object.keys(parsedContent),
        },
        { status: 500 }
      );
    }

    console.log("[API] ✅ Feedback generated successfully");

    return NextResponse.json(
      { content: JSON.stringify(parsedContent) },
      {
        headers: {
          "X-RateLimit-Remaining": String(remainingRequests),
        },
      }
    );
  } catch (error: unknown) {
    const err = error as {
      status?: number;
      code?: string;
      message?: string;
      stack?: string;
      error?: { message?: string };
    };
    console.error("[API] Error:", err);
    console.error("[API] Error stack:", err.stack);

    // Handle specific error types
    if (err?.status === 429) {
      return NextResponse.json(
        { error: "AI service rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    if (err?.code === "ECONNREFUSED" || err?.code === "ENOTFOUND") {
      return NextResponse.json(
        { error: "Unable to connect to AI service. Please try again." },
        { status: 503 }
      );
    }

    // OpenRouter specific errors
    if (err?.error?.message) {
      console.error("[API] OpenRouter error:", err.error.message);
      return NextResponse.json(
        { error: `AI service error: ${err.error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: err?.message || "Failed to generate feedback",
        type: error?.constructor?.name,
      },
      { status: 500 }
    );
  }
}
