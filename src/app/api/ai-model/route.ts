// /api/ai-model/route.ts

import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { QUESTIONS_PROMPT } from "@/lib/constants";

// --- Type Definitions ---
// Define the expected structure of the request body
interface RequestBody {
  jobPosition: string;
  jobDescription: string;
  duration: "5 min" | "15 min" | "30 min" | "45 min" | "60 min";
  type: "Technical" | "Behavior" | "Experience" | "Problem Solving";
  suggestedCount?: number; // Optional property
}

// Rate limiting map (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_MAX = 10; // 10 requests per hour
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

function getRateLimitKey(req: NextRequest): string {
  // Get IP from headers (works for most deployments like Vercel, Cloudflare, etc.)
  const forwardedFor = req.headers.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : undefined;

  return ip || "anonymous";
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const userLimit = rateLimitMap.get(key);

  if (!userLimit || now - userLimit.lastReset > RATE_LIMIT_WINDOW) {
    // Reset or initialize
    rateLimitMap.set(key, { count: 1, lastReset: now });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (userLimit.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }

  userLimit.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - userLimit.count };
}

function validateInput(data: RequestBody): { valid: boolean; error?: string } {
  const { jobPosition, jobDescription, duration, type } = data;

  if (
    !jobPosition ||
    typeof jobPosition !== "string" ||
    jobPosition.trim().length < 2
  ) {
    return {
      valid: false,
      error: "Job position is required and must be at least 2 characters",
    };
  }

  if (
    !jobDescription ||
    typeof jobDescription !== "string" ||
    jobDescription.trim().length < 10
  ) {
    return {
      valid: false,
      error: "Job description is required and must be at least 10 characters",
    };
  }

  // Ensure duration is one of the allowed string literals from RequestBody
  const validDurations: RequestBody["duration"][] = [
    "5 min",
    "15 min",
    "30 min",
    "45 min",
    "60 min",
  ];
  if (!duration || !validDurations.includes(duration)) {
    return { valid: false, error: "Invalid duration selected" };
  }

  // Ensure type is one of the allowed string literals from RequestBody
  const validTypes: RequestBody["type"][] = [
    "Technical",
    "Behavior",
    "Experience",
    "Problem Solving",
  ];
  if (!type || !validTypes.includes(type)) {
    console.log(
      "Validation failed: Invalid type received:",
      type,
      "Valid types:",
      validTypes
    );
    return { valid: false, error: "Invalid interview type selected" };
  }

  // Check for reasonable length limits
  if (jobPosition.length > 100) {
    return {
      valid: false,
      error: "Job position is too long (max 100 characters)",
    };
  }

  if (jobDescription.length > 2000) {
    return {
      valid: false,
      error: "Job description is too long (max 2000 characters)",
    };
  }

  return { valid: true };
}

function sanitizeInput(text: string): string {
  return text
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML/script tags
    .replace(/\s+/g, " "); // Normalize whitespace
}

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    let body: RequestBody; // Declare body with the specific type
    try {
      body = (await req.json()) as RequestBody; // Cast to RequestBody to ensure type safety
    } catch {
      // Removed 'error' parameter as it was unused and ESLint flagged it
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Log the received data for debugging
    console.log("Received request body:", body);

    // Rate limiting
    const rateLimitKey = getRateLimitKey(req);
    const { allowed, remaining } = checkRateLimit(rateLimitKey);

    if (!allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Date.now() + RATE_LIMIT_WINDOW),
          },
        }
      );
    }

    // Input validation
    const validation = validateInput(body);
    if (!validation.valid) {
      console.log("Validation failed:", validation.error);
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const {
      jobPosition,
      jobDescription,
      duration,
      type,
      suggestedCount = 8,
    } = body;

    // Sanitize inputs
    const sanitizedJobPosition = sanitizeInput(jobPosition);
    const sanitizedJobDescription = sanitizeInput(jobDescription);

    // Build the final prompt
    const FINAL_PROMPT = QUESTIONS_PROMPT.replace(
      /\{\{jobTitle\}\}/g,
      sanitizedJobPosition
    )
      .replace(/\{\{jobDescription\}\}/g, sanitizedJobDescription)
      .replace(/\{\{duration\}\}/g, duration)
      .replace(/\{\{type\}\}/g, type)
      .replace(/\{\{suggestedCount\}\}/g, String(suggestedCount));

    // Validate API key
    if (!process.env.OPENROUTER_API_KEY) {
      console.error("OPENROUTER_API_KEY is not configured");
      return NextResponse.json(
        { error: "AI service is not properly configured" },
        { status: 500 }
      );
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    console.log("Generating questions for:", {
      jobPosition: sanitizedJobPosition,
      duration,
      type,
    });

    // Make API call with timeout and retries
    let completion: OpenAI.Chat.Completions.ChatCompletion | undefined; // Explicitly type completion
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        const result = await Promise.race([
          openai.chat.completions.create({
            model: "deepseek/deepseek-r1-0528:free",
            messages: [
              {
                role: "user",
                content: FINAL_PROMPT,
              },
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
            max_tokens: 2000,
          }),
          // Timeout after 45 seconds, typed to match OpenAI's ChatCompletion
          new Promise<OpenAI.Chat.Completions.ChatCompletion>((_, reject) =>
            setTimeout(() => reject(new Error("Request timeout")), 45000)
          ),
        ]);
        completion = result; // Assign the result
        break; // Success, exit retry loop
      } catch (error: unknown) {
        // Changed to 'unknown' and handled safely
        attempts++;
        console.warn(
          `Attempt ${attempts} failed:`,
          error instanceof Error ? error.message : String(error)
        );

        if (attempts >= maxAttempts) {
          throw error;
        }

        // Wait before retry (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
      }
    }

    if (!completion) {
      throw new Error("Failed to get completion after retries");
    }

    const responseMessage = completion.choices[0]?.message;

    if (!responseMessage || !responseMessage.content) {
      console.error("Empty response from AI:", completion);
      return NextResponse.json(
        { error: "AI service returned an empty response" },
        { status: 500 }
      );
    }

    // Validate that the response is valid JSON
    let parsedContent;
    try {
      parsedContent = JSON.parse(responseMessage.content);
    } catch {
      // Removed 'error' parameter as it was unused and ESLint flagged it
      console.error("Invalid JSON from AI:", responseMessage.content);
      return NextResponse.json(
        { error: "AI service returned invalid JSON format" },
        { status: 500 }
      );
    }

    // Log successful generation
    console.log("Successfully generated questions:", {
      questionsCount:
        parsedContent?.interviewQuestions?.length ||
        parsedContent?.questions?.length ||
        "unknown",
      jobPosition: sanitizedJobPosition,
      duration,
      type,
    });

    // Return the response with rate limit headers
    return NextResponse.json(responseMessage, {
      headers: {
        "X-RateLimit-Remaining": String(remaining),
        "X-RateLimit-Reset": String(Date.now() + RATE_LIMIT_WINDOW),
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error: unknown) {
    // Changed to 'unknown' and handled safely
    console.error("AI API Error:", error);

    let clientErrorMessage = "Failed to generate questions. Please try again.";
    let statusCode = 500;

    if (error instanceof Error) {
      // Check for specific error messages or known properties from Error objects
      if (error.message === "Request timeout") {
        clientErrorMessage = "Request timed out. Please try again.";
        statusCode = 408;
      }
      // For OpenAI/OpenRouter errors, they often attach a `status` property to the error object
      const errorWithStatus = error as { status?: number };
      if (errorWithStatus.status) {
        if (errorWithStatus.status === 429) {
          clientErrorMessage =
            "AI service rate limit exceeded. Please try again later.";
          statusCode = 429;
        } else if (errorWithStatus.status >= 500) {
          // General server errors from the AI service
          clientErrorMessage =
            "AI service is temporarily unavailable. Please try again later.";
          statusCode = 503;
        }
      }
    } else {
      // Fallback for non-Error objects (e.g., plain strings or objects thrown)
      clientErrorMessage = `An unexpected error occurred: ${String(error)}`;
      statusCode = 500;
    }

    return NextResponse.json(
      { error: clientErrorMessage },
      { status: statusCode }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
