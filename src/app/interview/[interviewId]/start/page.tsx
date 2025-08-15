"use client";

import { Button } from "@/components/ui/button";
import { useInterviewContext } from "@/hooks/useInterviewContext";
import { Mic, Phone, Timer } from "lucide-react";
import Image from "next/image";
import Vapi from "@vapi-ai/web";
import { useEffect, useState } from "react";
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { toast } from "sonner";
import axios from "axios";
import { supabase } from "@/supabase/supabase-client";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

const StartInterviewPage = () => {
  const { interviewId } = useParams();
  const router = useRouter();
  const { interviewInfo, setInterviewInfo } = useInterviewContext();
  const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!);
  const [conversation, setConversation] = useState();
  console.log("Interview Id:", interviewId);

  useEffect(() => {
    interviewInfo && startInterview();
  }, []);

  const startInterview = () => {
    const questionList =
      interviewInfo?.questionList?.map((q) => q.question).join(", ") || "";

    const assistantOptions: CreateAssistantDTO = {
      name: "AI Recruiter",
      firstMessage: `Hi ${interviewInfo?.userName}, how are you? Ready for your interview on ${interviewInfo?.jobPosition}?`,
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      voice: {
        provider: "playht",
        voiceId: "Jennifer",
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `
You are an AI voice assistant conducting interviews.
Your job is to ask candidates provided interview questions, assess their responses.
Begin the conversation with a friendly introduction, setting a relaxed yet professional tone. Example:
"Hey there! Welcome to your ${interviewInfo?.jobPosition} interview, Let’s get started with a few questions!"
Ask one question at a time and wait for the candidate's response before proceeding. Keep the questions clear and concise. Below are the questions ask one by one:
Questions: ${questionList}
If the candidate struggles, offer hints or rephrase the question without giving away the answer. Example:
"Need a hint? Think about how React tracks component updates!"
Provide brief, encouraging feedback after each answer. Example:
"Nice! That&apos;s a solid answer."
"Hmm, not quite! Want to try again?"
Keep the conversation natural and engaging—use casual phrases like "Alright, next up..." or "Let&apos;s tackle a tricky one!"
After 5-7 questions, wrap up the interview smoothly by summarizing their performance. Example:
"That was great! You handled some tough questions well. Keep sharpening your skills!"
End on a positive note:
"Thanks for chatting! Hope to see you crushing projects soon!"
Key Guidelines:
✔ Be friendly, engaging, and witty
✔ Keep responses short and natural, like a real conversation
✔ Adapt based on the candidate's confidence level
✔ Ensure the interview remains focused on React
`.trim(),
          },
        ],
      },
    };

    vapi.start(assistantOptions);
  };

  const stopInterview = () => {
    console.log("vapi stop");

    vapi.stop();
  };

  vapi.on("call-start", () => {
    console.log("Call has started");
    toast("Connecting...");
  });
  vapi.on("speech-start", () => {
    console.log("Assistant speech has started");
  });
  vapi.on("speech-end", () => {
    console.log("Assistant speech has ended");
  });
  vapi.on("call-end", () => {
    console.log("Call has ended");
    toast("Interview Ended");
    generateFeedback();
  });

  vapi.on("message", (message) => {
    console.log("message: ", message);
    if (message.type === "conversation-update") {
      console.log("Updated conversation:", message.conversation);
      setConversation(message.conversation);
    }
  });

  const generateFeedback = async () => {
    console.log("generate feedback triggered");

    const result = await axios.post("/api/ai-feedback", { conversation });

    try {
      const content = result?.data?.content || "";
      const parsedFeedback = JSON.parse(content);
      console.log("Formatted Feedback:", parsedFeedback);

      // Save to database
      const { data, error } = await supabase
        .from("interview-feedback")
        .insert([
          {
            userName: interviewInfo?.userName,
            userEmail: interviewInfo?.userEmail,
            interview_id: interviewId,
            feedback: parsedFeedback,
            recommended: false,
          },
        ])
        .select();

      if (error) {
        console.error("Error saving feedback:", error);
      } else {
        console.log("Feedback saved:", data);
        router.replace(`/interview/${interviewId}/completed`);
      }
    } catch (error) {
      console.error("Failed to parse feedback JSON:", result?.data?.content);
      return null;
    }
  };

  return (
    <>
      <div className="p-20 lg:px-48 xl:px-56">
        <h2 className="font-bold text-xl flex justify-between mb-20">
          AI INTERVIEW
          <span className="flex gap-2 items-center">
            <Timer />
            00:00:00
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          <div className="bg-background p-40 rounded-lg border flex items-center justify-center">
            <Image
              src="/ai-robot.png"
              width={120}
              className="rounded-full object-cover"
              height={120}
              alt="AI Recruiter"
            />
          </div>
          <div className="bg-background p-40 rounded-lg border flex items-center justify-center">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl flex items-center justify-center bg-muted rounded-full h-16">
                {interviewInfo?.userName?.[0] ?? ""}{" "}
              </h2>
              <h2>{interviewInfo?.userName}</h2>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-5 mt-10">
          <Button variant={"destructive"}>
            <Mic />
          </Button>
          <Button onClick={stopInterview}>
            <Phone />
          </Button>
        </div>
        <h2>Interview in progress...</h2>
      </div>
    </>
  );
};

export default StartInterviewPage;
