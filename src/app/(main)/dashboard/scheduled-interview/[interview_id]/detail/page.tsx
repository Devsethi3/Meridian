"use client";

import { useUser } from "@/context/UserContext";
import { supabase } from "@/supabase/supabase-client";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import DetailsContainer from "./_components/DetailsContainer";

const InterviewDetailsPage = () => {
  const { interview_id } = useParams();
  const { user } = useUser();

  useEffect(() => {
    user && getInterviewDetail();
  }, [user]);

  const getInterviewDetail = async () => {
    const { data, error } = await supabase
      .from("Interviews")
      .select(`*, interview-feedback(userEmail)`)
      .eq("userEmail", user?.email)
      .eq("interview_id", interview_id);

    if (error) {
      console.error("Error fetching interview results:", error);
      return;
    }

    console.log(data);
  };
  return (
    <>
      <div>
        <DetailsContainer />
      </div>
    </>
  );
};

export default InterviewDetailsPage;
