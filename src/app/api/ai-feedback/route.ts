import OpenAI from "openai";
import { FEEDBACK_PROMPT } from "@/lib/constants";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { conversation } = await req.json();
    const FINAL_PROMPT = FEEDBACK_PROMPT.replace(
      "{{conversation}}",
      JSON.stringify(conversation)
    );

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY!,
    });

    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1-0528:free",
      messages: [{ role: "user", content: FINAL_PROMPT }],
      response_format: { type: "json_object" },
    });
    console.log(completion.choices[0].message);
    return NextResponse.json(completion.choices[0].message);
  } catch (err) {
    console.log(err);
    return NextResponse.json(err);
  }
}
