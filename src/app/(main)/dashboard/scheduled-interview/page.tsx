"use client";

import { useUser } from "@/context/UserContext";
import { supabase } from "@/supabase/supabase-client";
import { useEffect, useState } from "react";
import RecentListCard from "../_components/RecentListCard";
import InterviewCard from "./_components/InterviewCard";

interface ScheduledInterviewEntry {
  userEmail: string;
}

export interface Interview {
  duration: string;
  "interview-feedback": ScheduledInterviewEntry[];
  interview_id: string;
  jobPosition: string;
}

const ScheduledInterview = () => {
  const [interviewList, setInterviewList] = useState<Interview[]>([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      getInterviewResult();
    }
  }, [user]);

  const getInterviewResult = async () => {
    const { data, error } = await supabase
      .from("Interviews")
      .select(`*, interview-feedback(userEmail)`)
      .eq("userEmail", user?.email)
      .order("id", { ascending: false });

    if (error) {
      console.error("Error fetching interview results:", error);
      return;
    }

    setInterviewList((data as unknown as Interview[]) ?? []);
  };

  return (
    <div className="my-5">
      <h2 className="font-bold text-xl">
        Interview List with Candidate Feedback
      </h2>

      {interviewList?.length == 0 && (
        <div>You don't have any interview created</div>
      )}

      {interviewList && (
        <div className="grid grid-cols-2 mt-5 xl:grid-cols-3 gap-5">
          {interviewList.map((interview, index) => (
            <InterviewCard interview={interview} key={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduledInterview;
